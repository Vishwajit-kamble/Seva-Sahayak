import { createWorker } from 'tesseract.js';
import { UploadedDocument, ExtractedField } from '@/contexts/FormContext';

// Helper function to extract text from image using Tesseract OCR
async function extractTextFromImage(file: File): Promise<string> {
  let worker: any = null;
  
  try {
    console.log(`Creating new Tesseract worker for file: ${file.name} (${file.size} bytes)`);
    
    // Always create a fresh worker to avoid caching issues
    // Using English for now (most Aadhaar cards have English text)
    worker = await createWorker('eng', 1, {
      logger: (m) => {
        // Optional: log progress
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });
    
    // Set OCR parameters for better accuracy
    await worker.setParameters({
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 /-.,',
      tessedit_pageseg_mode: '6', // Assume uniform block of text
    });

    console.log(`Recognizing text from file: ${file.name}`);
    const { data: { text } } = await worker.recognize(file);
    
    console.log(`Text extraction completed. Length: ${text.length}`);
    
    // Always terminate worker to free resources
    await worker.terminate();
    worker = null;
    
    return text;
  } catch (error) {
    console.error(`Error in extractTextFromImage for ${file.name}:`, error);
    // Make sure to terminate worker even on error
    if (worker) {
      try {
        await worker.terminate();
      } catch (terminateError) {
        console.error('Error terminating worker:', terminateError);
      }
    }
    throw error;
  }
}

// Helper function to extract text from PDF (convert first page to image)
async function extractTextFromPDF(file: File): Promise<string> {
  // For PDF, we'll need to convert it to an image first
  // This is a simplified version - in production, you'd use pdf.js or similar
  // For now, we'll return empty and handle PDFs differently
  return '';
}

// Helper function to check if text looks like valid name (not OCR garbage)
function isValidName(text: string): boolean {
  if (!text || text.trim().length === 0) return false;
  
  const trimmed = text.trim();
  
  // Filter out common OCR errors and invalid patterns
  const invalidPatterns = [
    /^[A-Z]{1,2}\s[A-Z]{1,2}$/, // Too short like "ET Aw"
    /^(GOVERNMENT|INDIA|REPUBLIC|OF|THE|AADHAAR|PAN|CARD|NUMBER|DATE|BIRTH|MALE|FEMALE|YEAR|MONTH|DAY)$/i,
    /^\d+$/, // Only numbers
    /[A-Z]{5,}/, // Too many consecutive capitals (likely OCR error)
    /^[^A-Z]/, // Doesn't start with capital
  ];
  
  // Must have at least 2 words and reasonable length
  const words = trimmed.split(/\s+/).filter(w => w.length > 0);
  if (words.length < 2 || trimmed.length < 4 || trimmed.length > 50) {
    return false;
  }
  
  // Check against invalid patterns
  for (const pattern of invalidPatterns) {
    if (pattern.test(trimmed)) {
      return false;
    }
  }
  
  // Check if it has too many numbers or special characters (more than 20% is suspicious)
  const nonAlphaRatio = (trimmed.match(/[^A-Za-z\s]/g) || []).length / trimmed.length;
  if (nonAlphaRatio > 0.2) {
    return false;
  }
  
  // Most words should start with capital and have reasonable length
  // Allow some flexibility for OCR errors
  const validWords = words.filter(word => 
    word.length >= 2 && 
    word.length <= 20 && 
    /^[A-Z]/.test(word) // At least starts with capital
  );
  
  // At least 70% of words should be valid
  return validWords.length >= Math.ceil(words.length * 0.7);
}

// Helper function to clean OCR text and filter garbage
function cleanOCRText(text: string): string {
  // Remove common OCR artifacts
  return text
    .replace(/[|]/g, 'I') // Replace pipe with I
    .replace(/[0O]/g, 'O') // Normalize O and 0
    .replace(/[Il1]/g, 'I') // Normalize I, l, 1
    .replace(/[^\w\s,.-]/g, ' ') // Remove special chars except common punctuation
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

// Parse extracted text to find specific fields
function parseExtractedText(text: string, documentType: UploadedDocument['type']): ExtractedField[] {
  const fields: ExtractedField[] = [];
  const lines = text.split('\n').map(line => cleanOCRText(line.trim())).filter(line => line.length > 0);
  
  console.log('Parsing text with', lines.length, 'lines');
  console.log('Sample lines:', lines.slice(0, 10));
  
  // Extract Aadhaar number first (most reliable)
  const aadhaarPatterns = [
    /\b(\d{4}\s?\d{4}\s?\d{4})\b/,
    /(?:aadhaar|aadhar|आधार)[\s:]*(\d{4}\s?\d{4}\s?\d{4})/i,
  ];
  
  for (const pattern of aadhaarPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const aadhaar = match[1].replace(/\s/g, '');
      if (aadhaar.length === 12 && /^\d+$/.test(aadhaar)) {
        fields.push({
          key: 'aadhaarNumber',
          value: `${aadhaar.substring(0, 4)} ${aadhaar.substring(4, 8)} ${aadhaar.substring(8, 12)}`,
          confidence: 'high',
          source: 'Aadhaar',
        });
        break;
      }
    }
  }

  // Extract date of birth (look for DD/MM/YYYY or DD-MM-YYYY format)
  const dobPatterns = [
    /\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})\b/,
    /(?:dob|date of birth|जन्म तिथि|DOB|Year of Birth)[\s:]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
  ];
  
  for (const pattern of dobPatterns) {
    const matches = text.matchAll(new RegExp(pattern.source, 'gi'));
    for (const match of matches) {
      if (match[1]) {
        const dateStr = match[1];
        // Validate date format
        const dateParts = dateStr.split(/[\/\-\.]/);
        if (dateParts.length === 3) {
          const day = parseInt(dateParts[0]);
          const month = parseInt(dateParts[1]);
          const year = parseInt(dateParts[2]);
          if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900 && year <= 2100) {
            fields.push({
              key: 'dateOfBirth',
              value: dateStr,
              confidence: 'high',
              source: documentType === 'aadhaar' ? 'Aadhaar' : 'Document',
            });
            break;
          }
        }
      }
    }
    if (fields.find(f => f.key === 'dateOfBirth')) break;
  }

  // Extract full name - improved logic for Aadhaar cards
  let fullName = '';
  
  // For Aadhaar cards, name is usually in the first few lines, before DOB
  if (documentType === 'aadhaar') {
    // Look for lines that appear before DOB and Aadhaar number
    const dobIndex = lines.findIndex(line => /\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/.test(line));
    const aadhaarIndex = lines.findIndex(line => /\d{4}\s?\d{4}\s?\d{4}/.test(line));
    
    // Check ALL lines before DOB/Aadhaar (not just first 6)
    const maxSearchLines = Math.min(
      dobIndex > 0 ? dobIndex : lines.length,
      aadhaarIndex > 0 ? aadhaarIndex : lines.length,
      lines.length
    );
    const searchLines = lines.slice(0, maxSearchLines);
    
    console.log('Searching for name in', searchLines.length, 'lines:', searchLines);
    
    // First, try to find explicit "Name:" label
    for (const line of searchLines) {
      const nameLabelPattern = /(?:name|नाम|NAME)[\s:]+([A-Z][a-zA-Z\s]{2,50})/i;
      const match = line.match(nameLabelPattern);
      if (match && match[1]) {
        const candidate = match[1].trim();
        // Clean up the name - remove extra spaces, numbers at end, etc.
        const cleaned = candidate.replace(/\s+/g, ' ').replace(/\d+$/, '').trim();
        if (cleaned.length >= 4 && cleaned.split(/\s+/).length >= 2) {
          fullName = cleaned;
          console.log('Found name via label:', fullName);
          break;
        }
      }
    }
    
    // If not found, look for lines with 2-5 words that start with capital letters
    if (!fullName) {
      for (const line of searchLines) {
        // Skip lines that are clearly not names (dates, numbers, too short/long)
        if (/\d{4}\s?\d{4}\s?\d{4}/.test(line)) continue; // Aadhaar number
        if (/\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/.test(line)) continue; // Date
        if (line.length < 4 || line.length > 80) continue; // Too short or long
        
        // Clean the line - remove common prefixes/suffixes like "El", "HE", etc.
        let cleanedLine = line.trim();
        console.log(`Original line: "${line}"`);
        
        // Remove common prefixes (El, La, Le, The, A, An, H, E)
        cleanedLine = cleanedLine.replace(/^(El|La|Le|The|A|An|H|E)\s+/i, '');
        // Remove common suffixes (HE, HI, H, E)
        cleanedLine = cleanedLine.replace(/\s+(HE|HI|H|E)$/i, '');
        // Remove single letter words at start/end
        cleanedLine = cleanedLine.replace(/^[A-Z]\s+/, '').replace(/\s+[A-Z]$/, '');
        
        console.log(`Cleaned line: "${cleanedLine}"`);
        
        // Extract words that look like name parts (start with capital, reasonable length)
        const words = cleanedLine.split(/\s+/).filter(w => {
          const trimmed = w.trim();
          return trimmed.length >= 2 && 
                 trimmed.length <= 25 && 
                 /^[A-Z]/.test(trimmed) && // Starts with capital
                 !/^\d+$/.test(trimmed) && // Not just numbers
                 !/^(GOVERNMENT|INDIA|REPUBLIC|OF|THE|AADHAAR|PAN|CARD|NUMBER|DATE|BIRTH|MALE|FEMALE|YEAR|MONTH|DAY|HE|HI|H|E)$/i.test(trimmed);
        });
        
        if (words.length >= 2 && words.length <= 5) {
          const candidate = words.join(' ');
          // More lenient validation - just check it's not obviously wrong
          if (candidate.length >= 4 && candidate.length <= 50) {
            // Check if it has reasonable letter-to-special-char ratio
            const letterCount = (candidate.match(/[A-Za-z]/g) || []).length;
            if (letterCount / candidate.length > 0.7) { // At least 70% letters
              fullName = candidate;
              console.log('Found name via word extraction:', fullName);
              break;
            }
          }
        }
      }
    }
    
    // Last resort: find the longest line with capital letters before DOB
    if (!fullName) {
      for (const line of searchLines) {
        // Skip obvious non-name lines
        if (/\d{4}\s?\d{4}\s?\d{4}/.test(line)) continue;
        if (/\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/.test(line)) continue;
        if (line.length < 5) continue;
        
        // Check if line has mostly letters and spaces
        const letterRatio = (line.match(/[A-Za-z\s]/g) || []).length / line.length;
        if (letterRatio > 0.8 && line.split(/\s+/).length >= 2) {
          const cleaned = line.trim().replace(/\s+/g, ' ');
          if (cleaned.length >= 5 && cleaned.length <= 50) {
            fullName = cleaned;
            console.log('Found name via fallback (longest line):', fullName);
            break;
          }
        }
      }
    }
  } else {
    // For other documents, use general patterns
    const namePatterns = [
      /(?:name|नाम|NAME)[\s:]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/i,
    ];
    
    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match && match[1] && isValidName(match[1])) {
        fullName = match[1];
        break;
      }
    }
  }

  if (fullName) {
    fields.push({
      key: 'fullName',
      value: fullName,
      confidence: 'high',
      source: documentType === 'aadhaar' ? 'Aadhaar' : documentType === 'pan' ? 'PAN Card' : 'Document',
    });
  }

  // Extract gender - improved logic to avoid false matches
  let gender = '';
  
  if (documentType === 'aadhaar') {
    // For Aadhaar cards, gender can be on DOB line, before, or after
    const dobIndex = lines.findIndex(line => /\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/.test(line));
    
    // Search more broadly - check DOB line and 5 lines around it
    const searchStart = Math.max(0, dobIndex - 2);
    const searchEnd = Math.min(lines.length, dobIndex + 5);
    
    console.log(`Searching for gender around DOB line ${dobIndex}, checking lines ${searchStart}-${searchEnd}`);
    
    for (let i = searchStart; i < searchEnd; i++) {
      const line = lines[i];
      console.log(`Checking line ${i} for gender: "${line}"`);
      
      // Look for explicit gender labels (most reliable)
      // First try to find MALE or FEMALE (even with OCR errors like "wwMALE")
      // Match MALE/FEMALE even if there are characters before/after (up to 3 chars)
      const maleMatch = line.match(/[A-Za-z]{0,3}MALE[A-Za-z]{0,3}/i);
      const femaleMatch = line.match(/[A-Za-z]{0,3}FEMALE[A-Za-z]{0,3}/i);
      
      if (maleMatch) {
        gender = 'Male';
        console.log(`Found gender MALE in line: "${line}" (match: "${maleMatch[0]}")`);
        break;
      } else if (femaleMatch) {
        gender = 'Female';
        console.log(`Found gender FEMALE in line: "${line}" (match: "${femaleMatch[0]}")`);
        break;
      }
      
      // Also check for explicit labels
      const explicitPatterns = [
        /(?:gender|लिंग|GENDER|Sex)[\s:]*([MF]|MALE|FEMALE|Male|Female)/i,
        /\b(MALE|FEMALE)\b/i,
        /(Male|Female)/i,
      ];
      
      for (const pattern of explicitPatterns) {
        const match = line.match(pattern);
        if (match) {
          const genderText = (match[1] || match[0]).toUpperCase();
          console.log(`Found gender match: "${genderText}"`);
          if (genderText.includes('MALE') || genderText === 'M' || genderText === 'MALE') {
            gender = 'Male';
            break;
          } else if (genderText.includes('FEMALE') || genderText === 'F' || genderText === 'FEMALE') {
            gender = 'Female';
            break;
          }
        }
      }
      
      if (gender) {
        console.log(`Gender found: ${gender}`);
        break;
      }
      
      // Look for standalone M or F (but be more careful)
      // Accept if line is short (1-3 words) and contains just M or F
      const words = line.trim().split(/\s+/);
      if (words.length <= 3) {
        const standalonePattern = /^([MF])\s*$/i;
        const standaloneMatch = line.match(standalonePattern);
        if (standaloneMatch) {
          gender = standaloneMatch[1].toUpperCase() === 'M' ? 'Male' : 'Female';
          console.log(`Gender found via standalone: ${gender}`);
          break;
        }
      }
    }
    
    // If still not found, search the entire text for gender patterns
    if (!gender) {
      console.log('Gender not found near DOB, searching entire text...');
      const genderPatterns = [
        /\b(MALE|FEMALE)\b/i,
        /(?:gender|GENDER|Sex)[\s:]*([MF]|MALE|FEMALE)/i,
      ];
      
      for (const pattern of genderPatterns) {
        const match = text.match(pattern);
        if (match) {
          const genderText = (match[1] || match[0]).toUpperCase();
          if (genderText.includes('MALE') || genderText === 'M') {
            gender = 'Male';
            break;
          } else if (genderText.includes('FEMALE') || genderText === 'F') {
            gender = 'Female';
            break;
          }
        }
      }
    }
  } else {
    // For other documents, use pattern matching
    const genderPatterns = [
      /(?:gender|लिंग|GENDER|Sex)[\s:]*([MF]|MALE|FEMALE)/i,
      /\b(MALE|FEMALE)\b/i,
    ];
    
    for (const pattern of genderPatterns) {
      const match = text.match(pattern);
      if (match) {
        const genderText = (match[1] || match[0]).toUpperCase();
        if (genderText.includes('MALE') || genderText === 'M') {
          gender = 'Male';
          break;
        } else if (genderText.includes('FEMALE') || genderText === 'F') {
          gender = 'Female';
          break;
        }
      }
    }
  }
  
  if (gender) {
    fields.push({
      key: 'gender',
      value: gender,
      confidence: 'high',
      source: documentType === 'aadhaar' ? 'Aadhaar' : 'Document',
    });
  }

  // Extract PAN number
  const panPatterns = [
    /\b([A-Z]{5}\d{4}[A-Z]{1})\b/,
    /(?:pan|पैन)[\s:]*([A-Z]{5}\d{4}[A-Z]{1})/i,
  ];
  
  for (const pattern of panPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      fields.push({
        key: 'panNumber',
        value: match[1],
        confidence: 'high',
        source: 'PAN Card',
      });
      break;
    }
  }

  // Extract pincode (6 digits, often at end of address)
  const pincodePatterns = [
    /\b(\d{6})\b/,
    /(?:pincode|pin code|पिन कोड|PIN)[\s:]*(\d{6})/i,
  ];
  
  // Find all 6-digit numbers and validate
  for (const pattern of pincodePatterns) {
    const matches = text.matchAll(/\b(\d{6})\b/g);
    for (const match of matches) {
      const pin = match[1];
      // Pincode should be between 100000 and 999999
      const pinNum = parseInt(pin);
      if (pinNum >= 100000 && pinNum <= 999999) {
        fields.push({
          key: 'pincode',
          value: pin,
          confidence: 'medium',
          source: documentType === 'aadhaar' ? 'Aadhaar' : 'Document',
        });
        break;
      }
    }
    if (fields.find(f => f.key === 'pincode')) break;
  }

  // Extract address - improved logic for Aadhaar cards
  let address = '';
  
  if (documentType === 'aadhaar') {
    // For Aadhaar, address is usually between DOB and the end (before pincode)
    const dobIndex = lines.findIndex(line => /\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/.test(line));
    const pincodeIndex = lines.findIndex(line => /\b\d{6}\b/.test(line));
    
    // Address lines are usually after DOB and before pincode
    const startIdx = dobIndex >= 0 ? dobIndex + 1 : 0;
    const endIdx = pincodeIndex >= 0 ? pincodeIndex : lines.length;
    
    const addressLines: string[] = [];
    for (let i = startIdx; i < endIdx && i < lines.length; i++) {
      const line = lines[i];
      // Skip lines that are clearly not address (too short, numbers only, etc.)
      if (line.length >= 10 && 
          line.length <= 80 && 
          !/^\d+$/.test(line) && // Not just numbers
          !/^[A-Z]{1,2}\s[A-Z]{1,2}$/.test(line) && // Not like "ET Aw"
          !/\b\d{4}\s?\d{4}\s?\d{4}\b/.test(line) && // Not Aadhaar number
          !/\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b/.test(line) && // Not date
          !/^(MALE|FEMALE|M|F)$/i.test(line)) { // Not gender
        // Check if line has reasonable text (not too many special chars)
        const specialCharRatio = (line.match(/[^A-Za-z0-9\s,.-]/g) || []).length / line.length;
        if (specialCharRatio < 0.3) { // Less than 30% special characters
          addressLines.push(line);
        }
      }
    }
    
    // Combine address lines (usually 2-4 lines)
    if (addressLines.length >= 1 && addressLines.length <= 5) {
      address = addressLines.join(', ').trim();
      // Clean up common OCR errors in address
      address = address
        .replace(/\s+/g, ' ')
        .replace(/,\s*,/g, ',')
        .replace(/^,\s*/, '')
        .replace(/\s*,$/, '');
    }
  } else {
    // For other documents, use pattern matching
    const addressPatterns = [
      /(?:address|पता|ADDRESS)[\s:]*([A-Za-z0-9\s,.-]{10,100})/i,
    ];
    
    for (const pattern of addressPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        address = match[1].trim();
        break;
      }
    }
  }
  
  if (address && address.length >= 10) {
    fields.push({
      key: 'address',
      value: address,
      confidence: address.length > 20 ? 'medium' : 'low',
      source: documentType === 'aadhaar' ? 'Aadhaar' : 'Document',
    });
  }
  
  // Extract state from address if found
  if (address) {
    const statePatterns = [
      /(?:State|STATE)[\s:]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
      /\b(Andhra Pradesh|Arunachal Pradesh|Assam|Bihar|Chhattisgarh|Goa|Gujarat|Haryana|Himachal Pradesh|Jharkhand|Karnataka|Kerala|Madhya Pradesh|Maharashtra|Manipur|Meghalaya|Mizoram|Nagaland|Odisha|Punjab|Rajasthan|Sikkim|Tamil Nadu|Telangana|Tripura|Uttar Pradesh|Uttarakhand|West Bengal)\b/i,
    ];
    
    for (const pattern of statePatterns) {
      const match = address.match(pattern) || text.match(pattern);
      if (match && match[1]) {
        fields.push({
          key: 'state',
          value: match[1],
          confidence: 'medium',
          source: documentType === 'aadhaar' ? 'Aadhaar' : 'Document',
        });
        break;
      }
    }
  }

  return fields;
}

// Main extraction function
export async function extractDocumentData(documents: UploadedDocument[]): Promise<ExtractedField[]> {
  const allFields: ExtractedField[] = [];
  const fieldMap = new Map<string, ExtractedField>();

  console.log(`Processing ${documents.length} document(s)...`);

  for (const doc of documents) {
    try {
      console.log(`Processing document: ${doc.file.name} (type: ${doc.file.type})`);
      let extractedText = '';

      if (doc.file.type === 'application/pdf') {
        // For PDFs, we'd need pdf.js to convert to image first
        // For now, skip PDF OCR (you can implement this later)
        console.warn('PDF OCR not fully implemented. Please use image files for better results.');
        continue;
      } else {
        // Extract text from image
        console.log(`Extracting text from image: ${doc.file.name}`);
        extractedText = await extractTextFromImage(doc.file);
        console.log(`Extracted text length: ${extractedText.length} characters`);
        console.log(`Extracted text preview: ${extractedText.substring(0, 200)}...`);
      }

      if (!extractedText || extractedText.trim().length === 0) {
        console.warn(`No text extracted from ${doc.file.name} - OCR may have failed or image has no text`);
        continue;
      }

      // Parse the extracted text
      console.log(`Parsing extracted text for ${doc.file.name}...`);
      console.log('Full extracted text:', extractedText);
      console.log('Text lines:', extractedText.split('\n').map((l, i) => `${i}: ${l}`));
      const parsedFields = parseExtractedText(extractedText, doc.type);
      console.log(`Found ${parsedFields.length} fields:`, parsedFields.map(f => `${f.key}: ${f.value} (${f.confidence})`));

      // Merge fields, keeping the highest confidence value
      for (const field of parsedFields) {
        const existing = fieldMap.get(field.key);
        if (!existing || 
            (field.confidence === 'high' && existing.confidence !== 'high') ||
            (field.confidence === 'medium' && existing.confidence === 'low')) {
          fieldMap.set(field.key, field);
        }
      }
    } catch (error) {
      console.error(`Error processing ${doc.file.name}:`, error);
      // Continue processing other documents even if one fails
    }
  }

  // Convert map to array
  const result = Array.from(fieldMap.values());
  console.log(`Total extracted fields: ${result.length}`);

  // Ensure common fields exist (even if empty)
  const commonFields = ['fullName', 'dateOfBirth', 'gender', 'fatherName', 'address', 'pincode', 'state', 'aadhaarNumber', 'panNumber', 'mobileNumber'];
  for (const key of commonFields) {
    if (!result.find(f => f.key === key)) {
      result.push({
        key,
        value: '',
        confidence: 'low',
        source: 'Not found',
      });
    }
  }

  console.log(`Final result with all fields: ${result.length} fields`);
  return result;
}


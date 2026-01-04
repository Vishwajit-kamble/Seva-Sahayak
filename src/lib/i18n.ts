export type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'gu' | 'kn' | 'ml' | 'pa';

export interface Translations {
  [key: string]: string;
}

export const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
];

export const translations: Record<Language, Translations> = {
  en: {
    // Landing Page
    'app.title': 'Seva Sahayak',
    'app.subtitle': 'AI-Powered Form Filling Assistant',
    'app.description': 'Fill government forms easily using your ID documents. Simply upload your Aadhaar, PAN, or other documents and we\'ll automatically fill the form for you.',
    'app.start': 'Start Form Filling',
    'app.howItWorks': 'How It Works',
    'app.features': 'Features',
    'app.secure': 'Your documents are processed securely and deleted after use',
    
    // Steps
    'step.upload': 'Upload Documents',
    'step.extract': 'Extract Information',
    'step.selectForm': 'Select Form',
    'step.review': 'Review & Edit',
    'step.download': 'Download',
    
    'step.upload.desc': 'Upload your ID documents (Aadhaar, PAN, Voter ID, etc.)',
    'step.extract.desc': 'AI extracts your information automatically',
    'step.selectForm.desc': 'Choose the government form you need',
    'step.review.desc': 'Review and edit the filled form',
    'step.download.desc': 'Download your completed form',
    
    // Upload Page
    'upload.title': 'Upload Your Documents',
    'upload.subtitle': 'Upload clear images or PDFs of your identity documents',
    'upload.dragDrop': 'Drag & drop files here or click to browse',
    'upload.supported': 'Supported: PDF, JPG, PNG (Max 10MB per file)',
    'upload.continue': 'Continue to Extract',
    'upload.remove': 'Remove',
    'upload.uploading': 'Uploading...',
    
    // Extraction Page
    'extract.title': 'Extracted Information',
    'extract.subtitle': 'Review the information extracted from your documents',
    'extract.processing': 'Processing your documents...',
    'extract.confidence': 'Confidence',
    'extract.high': 'High',
    'extract.medium': 'Medium',
    'extract.low': 'Low - Please verify',
    
    // Form Fields
    'field.fullName': 'Full Name',
    'field.dateOfBirth': 'Date of Birth',
    'field.gender': 'Gender',
    'field.fatherName': 'Father\'s Name',
    'field.motherName': 'Mother\'s Name',
    'field.spouseName': 'Spouse\'s Name',
    'field.address': 'Address',
    'field.pincode': 'PIN Code',
    'field.state': 'State',
    'field.district': 'District',
    'field.aadhaarNumber': 'Aadhaar Number',
    'field.panNumber': 'PAN Number',
    'field.voterIdNumber': 'Voter ID Number',
    'field.dlNumber': 'Driving License Number',
    'field.passportNumber': 'Passport Number',
    'field.mobileNumber': 'Mobile Number',
    'field.email': 'Email Address',
    
    // Form Selection
    'forms.title': 'Select Form Type',
    'forms.subtitle': 'Choose the government form you want to fill',
    'forms.birthCertificate': 'Birth Certificate Application',
    'forms.drivingLicense': 'Driving License Application',
    'forms.panApplication': 'PAN Card Application',
    'forms.casteCertificate': 'Caste Certificate',
    'forms.incomeCertificate': 'Income Certificate',
    'forms.rationCard': 'Ration Card Application',
    'forms.passport': 'Passport Application',
    'forms.voterIdCard': 'Voter ID Card',
    
    // Review Page
    'review.title': 'Review Your Form',
    'review.subtitle': 'Please verify all information before downloading',
    'review.edit': 'Edit',
    'review.voiceInput': 'Voice Input',
    'review.listening': 'Listening...',
    'review.generate': 'Generate PDF',
    'review.required': 'Required field',
    
    // Download Page
    'download.title': 'Your Form is Ready!',
    'download.subtitle': 'Download your filled form',
    'download.button': 'Download PDF',
    'download.startNew': 'Fill Another Form',
    'download.preview': 'Preview',
    
    // Common
    'common.back': 'Back',
    'common.next': 'Next',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success!',
    'common.language': 'Language',
    'common.help': 'Need Help?',
    
    // Consent
    'consent.title': 'Privacy & Consent',
    'consent.message': 'I understand that my documents will be processed to extract information for form filling. The documents will be deleted after processing.',
    'consent.agree': 'I Agree & Continue',
    
    // Accessibility
    'a11y.increaseFont': 'Increase Font Size',
    'a11y.decreaseFont': 'Decrease Font Size',
    'a11y.highContrast': 'High Contrast Mode',
  },
  hi: {
    // Landing Page
    'app.title': 'सेवा सहायक',
    'app.subtitle': 'AI-संचालित फॉर्म भरने का सहायक',
    'app.description': 'अपने पहचान दस्तावेज़ों का उपयोग करके आसानी से सरकारी फॉर्म भरें। बस अपना आधार, पैन, या अन्य दस्तावेज़ अपलोड करें और हम आपके लिए फॉर्म अपने आप भर देंगे।',
    'app.start': 'फॉर्म भरना शुरू करें',
    'app.howItWorks': 'यह कैसे काम करता है',
    'app.features': 'विशेषताएं',
    'app.secure': 'आपके दस्तावेज़ सुरक्षित रूप से संसाधित होते हैं और उपयोग के बाद हटा दिए जाते हैं',
    
    // Steps
    'step.upload': 'दस्तावेज़ अपलोड करें',
    'step.extract': 'जानकारी निकालें',
    'step.selectForm': 'फॉर्म चुनें',
    'step.review': 'समीक्षा और संपादन',
    'step.download': 'डाउनलोड करें',
    
    'step.upload.desc': 'अपने पहचान दस्तावेज़ अपलोड करें (आधार, पैन, मतदाता पहचान पत्र, आदि)',
    'step.extract.desc': 'AI स्वचालित रूप से आपकी जानकारी निकालता है',
    'step.selectForm.desc': 'आवश्यक सरकारी फॉर्म चुनें',
    'step.review.desc': 'भरे हुए फॉर्म की समीक्षा और संपादन करें',
    'step.download.desc': 'अपना पूरा फॉर्म डाउनलोड करें',
    
    // Form Fields
    'field.fullName': 'पूरा नाम',
    'field.dateOfBirth': 'जन्म तिथि',
    'field.gender': 'लिंग',
    'field.fatherName': 'पिता का नाम',
    'field.motherName': 'माता का नाम',
    'field.address': 'पता',
    
    // Common
    'common.back': 'वापस',
    'common.next': 'आगे',
    'common.language': 'भाषा',
  },
  // Add basic translations for other languages
  ta: { 'app.title': 'சேவா சகாயக்', 'common.language': 'மொழி' },
  te: { 'app.title': 'సేవా సహాయక్', 'common.language': 'భాష' },
  bn: { 'app.title': 'সেবা সহায়ক', 'common.language': 'ভাষা' },
  mr: { 'app.title': 'सेवा सहाय्यक', 'common.language': 'भाषा' },
  gu: { 'app.title': 'સેવા સહાયક', 'common.language': 'ભાષા' },
  kn: { 'app.title': 'ಸೇವಾ ಸಹಾಯಕ', 'common.language': 'ಭಾಷೆ' },
  ml: { 'app.title': 'സേവാ സഹായക്', 'common.language': 'ഭാഷ' },
  pa: { 'app.title': 'ਸੇਵਾ ਸਹਾਇਕ', 'common.language': 'ਭਾਸ਼ਾ' },
};

export function t(key: string, lang: Language = 'en'): string {
  return translations[lang][key] || translations['en'][key] || key;
}

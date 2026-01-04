import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFormContext, ExtractedField } from '@/contexts/FormContext';
import { cn } from '@/lib/utils';
import { extractDocumentData } from '@/lib/documentExtractor';

export function ExtractionResults() {
  const { t } = useLanguage();
  const { documents, extractedFields, setExtractedFields, setCurrentStep } = useFormContext();
  const [isProcessing, setIsProcessing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [extractionKey, setExtractionKey] = useState(0);

  // Create a unique key based on document IDs and count to force re-extraction
  // This ensures the effect runs every time documents change, even if it's the same file
  const documentsKey = documents.map(d => `${d.id}-${d.file.name}-${d.file.size}`).join('|') + `-${documents.length}`;

  useEffect(() => {
    const processDocuments = async () => {
      if (documents.length === 0) {
        setIsProcessing(false);
        setExtractedFields([]);
        return;
      }

      console.log('Documents changed, starting new extraction. Key:', documentsKey);
      
      // Clear previous extracted fields when starting new extraction
      setExtractedFields([]);
      
      // Reset processing state
      setIsProcessing(true);
      setProgress(0);
      
      // Force new extraction by incrementing key
      setExtractionKey(prev => prev + 1);

      // Progress simulation (OCR is async, so we'll update progress as we go)
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          // Slow down progress updates to make it more realistic
          if (prev < 80) {
            return prev + 5;
          }
          return prev;
        });
      }, 500);

      try {
        console.log('Starting document extraction for', documents.length, 'documents');
        // Extract data from uploaded documents using OCR
        const results = await extractDocumentData(documents);
        
        console.log('Extraction completed. Results:', results);
        
        clearInterval(progressInterval);
        setProgress(100);
        
        // Always set results, even if empty (they'll show as "Not found")
        if (results && results.length > 0) {
          setExtractedFields(results);
        } else {
          // If no results, still create empty fields so user can see what's missing
          const emptyFields: ExtractedField[] = [
            { key: 'fullName', value: '', confidence: 'low', source: 'Not found' },
            { key: 'dateOfBirth', value: '', confidence: 'low', source: 'Not found' },
            { key: 'gender', value: '', confidence: 'low', source: 'Not found' },
            { key: 'address', value: '', confidence: 'low', source: 'Not found' },
            { key: 'aadhaarNumber', value: '', confidence: 'low', source: 'Not found' },
            { key: 'panNumber', value: '', confidence: 'low', source: 'Not found' },
          ];
          setExtractedFields(emptyFields);
        }
        
        setIsProcessing(false);
      } catch (error) {
        clearInterval(progressInterval);
        console.error('Error extracting document data:', error);
        // Set empty fields on error so user can still proceed
        const errorFields: ExtractedField[] = [
          { key: 'fullName', value: '', confidence: 'low', source: 'Error - Please check console' },
          { key: 'dateOfBirth', value: '', confidence: 'low', source: 'Error - Please check console' },
          { key: 'gender', value: '', confidence: 'low', source: 'Error - Please check console' },
          { key: 'address', value: '', confidence: 'low', source: 'Error - Please check console' },
        ];
        setExtractedFields(errorFields);
        setIsProcessing(false);
      }
    };

    processDocuments();
  }, [documentsKey, setExtractedFields]); // Use documentsKey to detect document changes

  const getConfidenceBadge = (confidence: 'high' | 'medium' | 'low') => {
    const styles = {
      high: 'confidence-high',
      medium: 'confidence-medium',
      low: 'confidence-low',
    };

    const labels = {
      high: t('extract.high'),
      medium: t('extract.medium'),
      low: t('extract.low'),
    };

    return (
      <span className={cn('confidence-badge', styles[confidence])}>
        {confidence === 'high' && <CheckCircle className="w-3 h-3 mr-1" />}
        {confidence === 'low' && <AlertCircle className="w-3 h-3 mr-1" />}
        {labels[confidence]}
      </span>
    );
  };

  const fieldLabels: Record<string, string> = {
    fullName: t('field.fullName'),
    dateOfBirth: t('field.dateOfBirth'),
    gender: t('field.gender'),
    fatherName: t('field.fatherName'),
    motherName: t('field.motherName'),
    address: t('field.address'),
    pincode: t('field.pincode'),
    state: t('field.state'),
    aadhaarNumber: t('field.aadhaarNumber'),
    panNumber: t('field.panNumber'),
    mobileNumber: t('field.mobileNumber'),
  };

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full border-4 border-muted flex items-center justify-center">
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
          </div>
          <div 
            className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
            style={{ animationDuration: '1.5s' }}
          />
        </div>
        
        <h2 className="text-2xl font-bold mb-4">{t('extract.processing')}</h2>
        
        {/* Progress bar */}
        <div className="w-full max-w-md bg-muted rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-muted-foreground mt-2">{progress}% complete</p>

        {/* Document processing status */}
        <div className="mt-8 space-y-2">
          {documents.map((doc, index) => (
            <div key={doc.id} className="flex items-center gap-3 text-sm">
              {index < documents.length - 1 || progress === 100 ? (
                <CheckCircle className="w-5 h-5 text-accent" />
              ) : (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              )}
              <span>{doc.file.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Check if any fields have values
  const hasExtractedData = extractedFields.some(field => field.value && field.value.trim().length > 0);

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
          <CheckCircle className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-2xl font-bold">{t('extract.title')}</h2>
        <p className="text-muted-foreground">{t('extract.subtitle')}</p>
      </div>

      {/* Warning if no data extracted */}
      {!hasExtractedData && extractedFields.length > 0 && (
        <Card className="bg-warning/10 border-warning/30">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">No data extracted from documents</p>
              <p className="text-sm text-muted-foreground">
                The OCR process did not find any extractable information. Please ensure:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Images are clear and well-lit</li>
                  <li>Text is readable and not blurry</li>
                  <li>Documents are in supported formats (JPG, PNG)</li>
                  <li>Check the browser console for detailed error messages</li>
                </ul>
                You can still manually enter the information in the next step.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Extracted Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {extractedFields.map((field) => (
          <Card 
            key={field.key} 
            className={cn(
              "transition-all",
              field.confidence === 'low' && "border-warning/50 bg-warning/5"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <label className="text-sm font-medium text-muted-foreground">
                  {fieldLabels[field.key] || field.key}
                </label>
                {getConfidenceBadge(field.confidence)}
              </div>
              <p className={cn(
                "text-lg font-semibold",
                !field.value && "text-muted-foreground italic"
              )}>
                {field.value || 'Not found'}
              </p>
              {field.source && (
                <p className="text-xs text-muted-foreground mt-1">
                  Source: {field.source}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Low confidence warning */}
      {extractedFields.some(f => f.confidence === 'low') && (
        <Card className="bg-warning/10 border-warning/30">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Some fields need verification</p>
              <p className="text-sm text-muted-foreground">
                Fields marked with low confidence may be incorrect. You'll be able to edit them in the next step.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Continue Button */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" size="lg" onClick={() => setCurrentStep(1)}>
          {t('common.back')}
        </Button>
        <Button variant="hero" size="lg" onClick={() => setCurrentStep(3)}>
          {t('common.next')}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}

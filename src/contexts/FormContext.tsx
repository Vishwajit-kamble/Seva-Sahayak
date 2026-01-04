import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ExtractedField {
  key: string;
  value: string;
  confidence: 'high' | 'medium' | 'low';
  source?: string;
}

export interface UploadedDocument {
  id: string;
  file: File;
  preview: string;
  type: 'aadhaar' | 'pan' | 'voter_id' | 'driving_license' | 'passport' | 'other';
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export interface FormTemplate {
  id: string;
  name: string;
  nameHi?: string;
  description: string;
  fields: string[];
  icon: string;
}

interface FormContextType {
  // Documents
  documents: UploadedDocument[];
  addDocument: (doc: UploadedDocument) => void;
  removeDocument: (id: string) => void;
  updateDocumentStatus: (id: string, status: UploadedDocument['status']) => void;
  
  // Extracted Data
  extractedFields: ExtractedField[];
  setExtractedFields: (fields: ExtractedField[]) => void;
  updateField: (key: string, value: string) => void;
  
  // Form Selection
  selectedForm: FormTemplate | null;
  setSelectedForm: (form: FormTemplate | null) => void;
  
  // Step Management
  currentStep: number;
  setCurrentStep: (step: number) => void;
  
  // Consent
  hasConsented: boolean;
  setHasConsented: (value: boolean) => void;
  
  // Reset
  resetForm: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

const initialExtractedFields: ExtractedField[] = [];

export function FormProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [extractedFields, setExtractedFields] = useState<ExtractedField[]>(initialExtractedFields);
  const [selectedForm, setSelectedForm] = useState<FormTemplate | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasConsented, setHasConsented] = useState(false);

  const addDocument = (doc: UploadedDocument) => {
    setDocuments(prev => [...prev, doc]);
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const updateDocumentStatus = (id: string, status: UploadedDocument['status']) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  const updateField = (key: string, value: string) => {
    setExtractedFields(prev => 
      prev.map(f => f.key === key ? { ...f, value } : f)
    );
  };

  const resetForm = () => {
    setDocuments([]);
    setExtractedFields(initialExtractedFields);
    setSelectedForm(null);
    setCurrentStep(0);
    setHasConsented(false);
  };

  return (
    <FormContext.Provider
      value={{
        documents,
        addDocument,
        removeDocument,
        updateDocumentStatus,
        extractedFields,
        setExtractedFields,
        updateField,
        selectedForm,
        setSelectedForm,
        currentStep,
        setCurrentStep,
        hasConsented,
        setHasConsented,
        resetForm,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}

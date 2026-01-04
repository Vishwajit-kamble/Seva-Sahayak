import React, { useCallback, useState } from 'react';
import { Upload, X, FileText, Image as ImageIcon, Loader2, RotateCw, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFormContext, UploadedDocument } from '@/contexts/FormContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

export function DocumentUpload() {
  const { t } = useLanguage();
  const { documents, addDocument, removeDocument, setCurrentStep } = useFormContext();
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const detectDocumentType = (fileName: string): UploadedDocument['type'] => {
    const name = fileName.toLowerCase();
    if (name.includes('aadhaar') || name.includes('aadhar')) return 'aadhaar';
    if (name.includes('pan')) return 'pan';
    if (name.includes('voter') || name.includes('epic')) return 'voter_id';
    if (name.includes('driving') || name.includes('license') || name.includes('dl')) return 'driving_license';
    if (name.includes('passport')) return 'passport';
    return 'other';
  };

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    for (const file of fileArray) {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast({
          title: 'Invalid file type',
          description: `${file.name} is not a supported format. Please use PDF, JPG, or PNG.`,
          variant: 'destructive',
        });
        continue;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: 'File too large',
          description: `${file.name} exceeds 10MB limit.`,
          variant: 'destructive',
        });
        continue;
      }

      setIsUploading(true);

      // Create preview
      const preview = await new Promise<string>((resolve) => {
        if (file.type === 'application/pdf') {
          resolve('/placeholder.svg'); // PDF placeholder
        } else {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        }
      });

      const doc: UploadedDocument = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        preview,
        type: detectDocumentType(file.name),
        status: 'pending',
      };

      addDocument(doc);
      setIsUploading(false);

      toast({
        title: 'Document uploaded',
        description: `${file.name} added successfully.`,
      });
    }
  }, [addDocument, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const handleContinue = () => {
    if (documents.length === 0) {
      toast({
        title: 'No documents uploaded',
        description: 'Please upload at least one document to continue.',
        variant: 'destructive',
      });
      return;
    }
    setCurrentStep(2);
  };

  return (
    <div className="space-y-8">
      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer",
          isDragging 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : "border-border hover:border-primary/50 bg-card",
          isUploading && "pointer-events-none opacity-70"
        )}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          {isUploading ? (
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-10 h-10 text-primary" />
            </div>
          )}

          <div>
            <h3 className="text-xl font-semibold mb-2">
              {isUploading ? t('upload.uploading') : t('upload.dragDrop')}
            </h3>
            <p className="text-muted-foreground">{t('upload.supported')}</p>
          </div>

          <Button variant="outline" size="lg" className="mt-4">
            Browse Files
          </Button>
        </div>
      </div>

      {/* Uploaded Documents Grid */}
      {documents.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Uploaded Documents ({documents.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <Card key={doc.id} className="document-preview group">
                <CardContent className="p-4">
                  <div className="aspect-[4/3] relative mb-4 rounded-lg overflow-hidden bg-muted">
                    {doc.file.type === 'application/pdf' ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileText className="w-16 h-16 text-muted-foreground" />
                      </div>
                    ) : (
                      <img
                        src={doc.preview}
                        alt={doc.file.name}
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* Overlay actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="icon" variant="secondary" className="h-10 w-10">
                        <ZoomIn className="w-5 h-5" />
                      </Button>
                      <Button size="icon" variant="secondary" className="h-10 w-10">
                        <RotateCw className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{doc.file.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {doc.type.replace('_', ' ')} • {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeDocument(doc.id)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-end pt-4">
        <Button 
          variant="hero" 
          size="lg" 
          onClick={handleContinue}
          disabled={documents.length === 0}
        >
          {t('upload.continue')}
        </Button>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Mic, MicOff, Edit2, Check, AlertCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFormContext } from '@/contexts/FormContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function FormReview() {
  const { t } = useLanguage();
  const { extractedFields, updateField, selectedForm, setCurrentStep } = useFormContext();
  const { toast } = useToast();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [listeningField, setListeningField] = useState<string | null>(null);

  const fieldLabels: Record<string, string> = {
    fullName: t('field.fullName'),
    dateOfBirth: t('field.dateOfBirth'),
    gender: t('field.gender'),
    fatherName: t('field.fatherName'),
    motherName: t('field.motherName'),
    spouseName: t('field.spouseName'),
    address: t('field.address'),
    pincode: t('field.pincode'),
    state: t('field.state'),
    district: t('field.district'),
    aadhaarNumber: t('field.aadhaarNumber'),
    panNumber: t('field.panNumber'),
    mobileNumber: t('field.mobileNumber'),
    email: t('field.email'),
  };

  const startVoiceInput = (fieldKey: string) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: 'Voice input not supported',
        description: 'Your browser does not support voice input. Please type manually.',
        variant: 'destructive',
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setListeningField(fieldKey);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      updateField(fieldKey, transcript);
      toast({
        title: 'Voice input captured',
        description: `"${transcript}"`,
      });
    };

    recognition.onerror = () => {
      setIsListening(false);
      setListeningField(null);
      toast({
        title: 'Voice input error',
        description: 'Could not capture voice. Please try again or type manually.',
        variant: 'destructive',
      });
    };

    recognition.onend = () => {
      setIsListening(false);
      setListeningField(null);
    };

    recognition.start();
  };

  const handleGeneratePDF = () => {
    // Check for required fields
    const missingFields = extractedFields.filter(
      f => selectedForm?.fields.includes(f.key) && !f.value
    );

    if (missingFields.length > 0) {
      toast({
        title: 'Missing required fields',
        description: `Please fill in: ${missingFields.map(f => fieldLabels[f.key]).join(', ')}`,
        variant: 'destructive',
      });
      return;
    }

    setCurrentStep(5);
  };

  // Filter fields based on selected form
  const formFields = extractedFields.filter(
    f => !selectedForm || selectedForm.fields.includes(f.key)
  );

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">{t('review.title')}</h2>
        <p className="text-muted-foreground">{t('review.subtitle')}</p>
        {selectedForm && (
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-primary/10 text-primary">
            <FileText className="w-4 h-4" />
            <span className="font-medium">{selectedForm.name}</span>
          </div>
        )}
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formFields.map((field) => {
          const isEditing = editingField === field.key;
          const isLongField = field.key === 'address';

          return (
            <Card 
              key={field.key}
              className={cn(
                "transition-all",
                isLongField && "md:col-span-2",
                field.confidence === 'low' && "border-warning/50"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    {fieldLabels[field.key] || field.key}
                    {selectedForm?.fields.includes(field.key) && (
                      <span className="text-destructive ml-1">*</span>
                    )}
                  </Label>
                  
                  <div className="flex items-center gap-1">
                    {/* Voice input button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-8 w-8 p-0",
                        listeningField === field.key && "bg-primary/10 text-primary"
                      )}
                      onClick={() => startVoiceInput(field.key)}
                      disabled={isListening && listeningField !== field.key}
                    >
                      {listeningField === field.key ? (
                        <MicOff className="w-4 h-4 animate-pulse" />
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </Button>

                    {/* Edit toggle */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setEditingField(isEditing ? null : field.key)}
                    >
                      {isEditing ? (
                        <Check className="w-4 h-4 text-accent" />
                      ) : (
                        <Edit2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {listeningField === field.key && (
                  <div className="mb-2 p-2 rounded-lg bg-primary/10 text-primary text-sm flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                    {t('review.listening')}
                  </div>
                )}

                {isEditing || !field.value ? (
                  isLongField ? (
                    <Textarea
                      value={field.value}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      placeholder={`Enter ${fieldLabels[field.key]}`}
                      className="text-lg"
                      rows={3}
                    />
                  ) : (
                    <Input
                      value={field.value}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      placeholder={`Enter ${fieldLabels[field.key]}`}
                      className="text-lg h-12"
                    />
                  )
                ) : (
                  <p className={cn(
                    "text-lg font-medium py-2",
                    !field.value && "text-muted-foreground italic"
                  )}>
                    {field.value || 'Not provided'}
                  </p>
                )}

                {field.confidence === 'low' && !isEditing && (
                  <p className="text-xs text-warning mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {t('extract.low')}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Voice input tip */}
      <Card className="bg-info/5 border-info/20">
        <CardContent className="p-4 flex items-start gap-3">
          <Mic className="w-5 h-5 text-info shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Voice Input Available</p>
            <p className="text-sm text-muted-foreground">
              Click the microphone icon next to any field to fill it using voice. Speak clearly in English or Hindi.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" size="lg" onClick={() => setCurrentStep(3)}>
          {t('common.back')}
        </Button>
        <Button variant="hero" size="lg" onClick={handleGeneratePDF}>
          {t('review.generate')}
        </Button>
      </div>
    </div>
  );
}

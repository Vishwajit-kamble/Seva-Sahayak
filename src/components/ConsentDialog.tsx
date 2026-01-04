import React from 'react';
import { Shield, Lock, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFormContext } from '@/contexts/FormContext';

interface ConsentDialogProps {
  onAgree: () => void;
}

export function ConsentDialog({ onAgree }: ConsentDialogProps) {
  const { t } = useLanguage();
  const { hasConsented, setHasConsented } = useFormContext();
  const [accepted, setAccepted] = React.useState(false);

  const handleAgree = () => {
    if (accepted) {
      setHasConsented(true);
      onAgree();
    }
  };

  const privacyPoints = [
    {
      icon: Eye,
      title: 'Document Processing',
      desc: 'Your documents will be processed by AI to extract information',
    },
    {
      icon: Lock,
      title: 'Data Encryption',
      desc: 'All data is encrypted during processing',
    },
    {
      icon: Trash2,
      title: 'Automatic Deletion',
      desc: 'Documents are permanently deleted after your session ends',
    },
    {
      icon: Shield,
      title: 'No Storage',
      desc: 'We do not store your personal information on our servers',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card className="border-2">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">{t('consent.title')}</h2>
            <p className="text-muted-foreground mt-2">
              Before we process your documents, please review our privacy practices
            </p>
          </div>

          {/* Privacy Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {privacyPoints.map((point) => (
              <div key={point.title} className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <point.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-medium">{point.title}</h3>
                  <p className="text-sm text-muted-foreground">{point.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20 mb-6">
            <Checkbox
              id="consent"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked as boolean)}
              className="mt-1"
            />
            <label htmlFor="consent" className="text-sm cursor-pointer">
              <span className="font-medium">{t('consent.message')}</span>
              <span className="block mt-1 text-muted-foreground">
                I confirm that I have the right to upload these documents and agree to the processing terms.
              </span>
            </label>
          </div>

          {/* Action Button */}
          <Button
            variant="hero"
            size="xl"
            className="w-full"
            onClick={handleAgree}
            disabled={!accepted}
          >
            {t('consent.agree')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

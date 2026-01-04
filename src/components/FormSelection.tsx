import React from 'react';
import { 
  FileText, 
  CreditCard, 
  Car, 
  Users, 
  Wallet, 
  ShoppingCart, 
  Plane, 
  Vote,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFormContext, FormTemplate } from '@/contexts/FormContext';
import { cn } from '@/lib/utils';

const formTemplates: FormTemplate[] = [
  {
    id: 'birth_certificate',
    name: 'Birth Certificate Application',
    nameHi: 'जन्म प्रमाण पत्र आवेदन',
    description: 'Apply for birth certificate from local municipality',
    fields: ['fullName', 'dateOfBirth', 'gender', 'fatherName', 'motherName', 'address', 'pincode'],
    icon: 'FileText',
  },
  {
    id: 'driving_license',
    name: 'Driving License Application',
    nameHi: 'ड्राइविंग लाइसेंस आवेदन',
    description: 'Apply for new driving license or renewal',
    fields: ['fullName', 'dateOfBirth', 'gender', 'fatherName', 'address', 'pincode', 'aadhaarNumber'],
    icon: 'Car',
  },
  {
    id: 'pan_application',
    name: 'PAN Card Application',
    nameHi: 'पैन कार्ड आवेदन',
    description: 'Apply for new PAN card (Form 49A)',
    fields: ['fullName', 'dateOfBirth', 'gender', 'fatherName', 'address', 'pincode', 'aadhaarNumber'],
    icon: 'CreditCard',
  },
  {
    id: 'caste_certificate',
    name: 'Caste Certificate',
    nameHi: 'जाति प्रमाण पत्र',
    description: 'Apply for caste/community certificate',
    fields: ['fullName', 'dateOfBirth', 'gender', 'fatherName', 'address', 'pincode', 'state'],
    icon: 'Users',
  },
  {
    id: 'income_certificate',
    name: 'Income Certificate',
    nameHi: 'आय प्रमाण पत्र',
    description: 'Apply for income certificate',
    fields: ['fullName', 'dateOfBirth', 'gender', 'fatherName', 'address', 'pincode', 'state'],
    icon: 'Wallet',
  },
  {
    id: 'ration_card',
    name: 'Ration Card Application',
    nameHi: 'राशन कार्ड आवेदन',
    description: 'Apply for new ration card',
    fields: ['fullName', 'dateOfBirth', 'gender', 'fatherName', 'address', 'pincode', 'aadhaarNumber'],
    icon: 'ShoppingCart',
  },
  {
    id: 'passport',
    name: 'Passport Application',
    nameHi: 'पासपोर्ट आवेदन',
    description: 'Apply for new passport or renewal',
    fields: ['fullName', 'dateOfBirth', 'gender', 'fatherName', 'motherName', 'address', 'pincode', 'aadhaarNumber'],
    icon: 'Plane',
  },
  {
    id: 'voter_id',
    name: 'Voter ID Card',
    nameHi: 'मतदाता पहचान पत्र',
    description: 'Apply for new voter ID (EPIC)',
    fields: ['fullName', 'dateOfBirth', 'gender', 'fatherName', 'address', 'pincode', 'aadhaarNumber'],
    icon: 'Vote',
  },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  CreditCard,
  Car,
  Users,
  Wallet,
  ShoppingCart,
  Plane,
  Vote,
};

export function FormSelection() {
  const { t, language } = useLanguage();
  const { selectedForm, setSelectedForm, setCurrentStep } = useFormContext();

  const handleContinue = () => {
    if (selectedForm) {
      setCurrentStep(4);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">{t('forms.title')}</h2>
        <p className="text-muted-foreground">{t('forms.subtitle')}</p>
      </div>

      {/* Form Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {formTemplates.map((template) => {
          const Icon = iconMap[template.icon] || FileText;
          const isSelected = selectedForm?.id === template.id;

          return (
            <Card
              key={template.id}
              className={cn(
                "cursor-pointer transition-all duration-300 hover:shadow-lg",
                isSelected 
                  ? "border-2 border-primary ring-4 ring-primary/20 shadow-glow" 
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => setSelectedForm(template)}
            >
              <CardContent className="p-6">
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                )}>
                  <Icon className="w-7 h-7" />
                </div>

                <h3 className="font-semibold text-lg mb-1">
                  {language === 'hi' && template.nameHi ? template.nameHi : template.name}
                </h3>
                <p className="text-sm text-muted-foreground">{template.description}</p>

                {/* Fields preview */}
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    {template.fields.length} fields required
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Continue Button */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" size="lg" onClick={() => setCurrentStep(2)}>
          {t('common.back')}
        </Button>
        <Button 
          variant="hero" 
          size="lg" 
          onClick={handleContinue}
          disabled={!selectedForm}
        >
          {t('common.next')}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}

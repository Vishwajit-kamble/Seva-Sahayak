import React from 'react';
import { 
  Shield, 
  Zap, 
  FileText, 
  Mic, 
  Languages, 
  Lock,
  ArrowRight,
  Upload,
  Brain,
  ClipboardCheck,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFormContext } from '@/contexts/FormContext';

const features = [
  {
    icon: Zap,
    titleKey: 'Fast Processing',
    descKey: 'Extract information in under 5 seconds',
  },
  {
    icon: Brain,
    titleKey: 'AI-Powered',
    descKey: '90%+ accuracy with smart extraction',
  },
  {
    icon: Mic,
    titleKey: 'Voice Input',
    descKey: 'Speak to fill form fields easily',
  },
  {
    icon: Languages,
    titleKey: 'Multilingual',
    descKey: 'Support for 10+ Indian languages',
  },
  {
    icon: Lock,
    titleKey: 'Secure',
    descKey: 'Your data is encrypted and deleted after use',
  },
  {
    icon: FileText,
    titleKey: 'Multiple Forms',
    descKey: 'Support for various government forms',
  },
];

const steps = [
  {
    icon: Upload,
    number: 1,
    title: 'Upload Documents',
    desc: 'Upload your Aadhaar, PAN, or other ID documents',
  },
  {
    icon: Brain,
    number: 2,
    title: 'AI Extracts Data',
    desc: 'Our AI reads and extracts your information',
  },
  {
    icon: ClipboardCheck,
    number: 3,
    title: 'Review & Edit',
    desc: 'Verify the extracted data and make changes',
  },
  {
    icon: Download,
    number: 4,
    title: 'Download Form',
    desc: 'Get your filled form as a PDF',
  },
];

export function LandingPage() {
  const { t } = useLanguage();
  const { setCurrentStep } = useFormContext();

  const handleStart = () => {
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background pattern-ashoka">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center stagger-children">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                <span>Trusted by Seva Kendras across India</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Fill Government Forms
                <span className="text-gradient block mt-2">Instantly with AI</span>
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-accessible">
                {t('app.description')}
              </p>

              {/* CTA Button */}
              <Button 
                variant="hero" 
                size="xl" 
                onClick={handleStart}
                className="group"
              >
                {t('app.start')}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>

              {/* Trust indicators */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Lock className="w-4 h-4 text-accent" />
                  100% Secure
                </span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                <span>No Registration Required</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                <span>Free to Use</span>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">{t('app.howItWorks')}</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Simple 4-step process to fill any government form
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.number} className="relative">
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-border">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
                    </div>
                  )}

                  <Card className="relative bg-background border-border hover:border-primary/50 transition-colors">
                    <CardContent className="pt-6 text-center">
                      {/* Step number */}
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <step.icon className="w-7 h-7 text-primary" />
                      </div>
                      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        {step.number}
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                      <p className="text-muted-foreground text-sm">{step.desc}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">{t('app.features')}</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Designed for simplicity and accessibility
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {features.map((feature) => (
                <Card key={feature.titleKey} className="bg-card border-border hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.titleKey}</h3>
                    <p className="text-muted-foreground">{feature.descKey}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-r from-primary/10 via-primary/5 to-orange-400/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Upload your documents and fill your forms in minutes, not hours.
            </p>
            <Button variant="hero" size="lg" onClick={handleStart} className="group">
              {t('app.start')}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

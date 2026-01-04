import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StepIndicator } from '@/components/StepIndicator';
import { DocumentUpload } from '@/components/DocumentUpload';
import { ExtractionResults } from '@/components/ExtractionResults';
import { FormSelection } from '@/components/FormSelection';
import { FormReview } from '@/components/FormReview';
import { DownloadPage } from '@/components/DownloadPage';
import { ConsentDialog } from '@/components/ConsentDialog';
import { LandingPage } from '@/components/LandingPage';
import { useFormContext } from '@/contexts/FormContext';

export function FormWizard() {
  const { currentStep, hasConsented, setCurrentStep } = useFormContext();

  // Landing page (step 0)
  if (currentStep === 0) {
    return <LandingPage />;
  }

  // Show consent dialog before upload (step 1)
  if (currentStep === 1 && !hasConsented) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <ConsentDialog onAgree={() => {}} />
        </main>
        <Footer />
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <DocumentUpload />;
      case 2:
        return <ExtractionResults />;
      case 3:
        return <FormSelection />;
      case 4:
        return <FormReview />;
      case 5:
        return <DownloadPage />;
      default:
        return <DocumentUpload />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Step Indicator */}
        {currentStep < 5 && (
          <div className="mb-8">
            <StepIndicator currentStep={currentStep} />
          </div>
        )}

        {/* Step Content */}
        <div className="animate-fade-in-up">
          {renderStep()}
        </div>
      </main>

      <Footer />
    </div>
  );
}

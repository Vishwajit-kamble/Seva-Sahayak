import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface Step {
  id: number;
  labelKey: string;
  descKey: string;
}

const steps: Step[] = [
  { id: 1, labelKey: 'step.upload', descKey: 'step.upload.desc' },
  { id: 2, labelKey: 'step.extract', descKey: 'step.extract.desc' },
  { id: 3, labelKey: 'step.selectForm', descKey: 'step.selectForm.desc' },
  { id: 4, labelKey: 'step.review', descKey: 'step.review.desc' },
  { id: 5, labelKey: 'step.download', descKey: 'step.download.desc' },
];

interface StepIndicatorProps {
  currentStep: number;
  className?: string;
}

export function StepIndicator({ currentStep, className }: StepIndicatorProps) {
  const { t } = useLanguage();

  return (
    <div className={cn("w-full py-6", className)}>
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-muted mx-8">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isUpcoming = step.id > currentStep;

          return (
            <div 
              key={step.id} 
              className="flex flex-col items-center relative z-10"
            >
              {/* Step circle */}
              <div
                className={cn(
                  "step-indicator",
                  isCompleted && "step-indicator-complete",
                  isCurrent && "step-indicator-active",
                  isUpcoming && "step-indicator-inactive"
                )}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>

              {/* Step label */}
              <span
                className={cn(
                  "mt-3 text-sm font-medium text-center max-w-[100px] hidden sm:block",
                  isCurrent && "text-primary",
                  isCompleted && "text-accent",
                  isUpcoming && "text-muted-foreground"
                )}
              >
                {t(step.labelKey)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Lock, Trash2 } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-6">
        {/* Security badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-accent" />
            <span>Secure Processing</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4 text-accent" />
            <span>Encrypted Data</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Trash2 className="w-4 h-4 text-accent" />
            <span>Auto-Deleted After Use</span>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {t('app.secure')}
        </p>

        <div className="mt-4 pt-4 border-t border-border text-center text-xs text-muted-foreground">
          <p>© 2024 Seva Sahayak. Made for Indian Citizens.</p>
        </div>
      </div>
    </footer>
  );
}

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Cookie } from 'lucide-react';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  const rejectCookies = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:max-w-md">
      <Card className="p-4 bg-background/95 backdrop-blur-sm border shadow-lg">
        <div className="flex items-start gap-3">
          <Cookie className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-2">Cookies & Privacidade</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Usamos cookies para melhorar sua experiência, analisar o tráfego e personalizar conteúdo. 
              Ao continuar navegando, você concorda com nossa política de cookies.
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={acceptCookies} className="flex-1">
                Aceitar
              </Button>
              <Button size="sm" variant="outline" onClick={rejectCookies}>
                Rejeitar
              </Button>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={rejectCookies}
            className="h-6 w-6 p-0 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CookieBanner;
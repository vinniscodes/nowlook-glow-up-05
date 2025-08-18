import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useSecurity = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Detectar múltiplas tentativas de login falhadas
    const detectBruteForce = () => {
      const failedAttempts = localStorage.getItem('mavinda_failed_attempts');
      const attempts = failedAttempts ? parseInt(failedAttempts) : 0;
      
      if (attempts >= 5) {
        toast.error('Muitas tentativas de login. Tente novamente em 15 minutos.');
        // Bloquear por 15 minutos
        localStorage.setItem('mavinda_blocked_until', (Date.now() + 15 * 60 * 1000).toString());
        return false;
      }
      return true;
    };

    // Verificar se está bloqueado
    const isBlocked = () => {
      const blockedUntil = localStorage.getItem('mavinda_blocked_until');
      if (blockedUntil && Date.now() < parseInt(blockedUntil)) {
        return true;
      }
      // Limpar bloqueio expirado
      localStorage.removeItem('mavinda_blocked_until');
      return false;
    };

    // Limpar tentativas em caso de login bem-sucedido
    if (user) {
      localStorage.removeItem('mavinda_failed_attempts');
      localStorage.removeItem('mavinda_blocked_until');
    }

    // Detectar tentativas de SQL injection em formulários
    const detectSQLInjection = (value: string) => {
      const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
        /('|('')|;|\/\*|\*\/|xp_|sp_)/i,
        /(script|javascript|vbscript|onload|onerror|onclick)/i
      ];
      
      return sqlPatterns.some(pattern => pattern.test(value));
    };

    // Log de segurança para tentativas suspeitas
    const logSecurityEvent = async (eventType: string, description: string) => {
      if (user) {
        try {
          await supabase.rpc('log_security_event', {
            event_type: eventType,
            user_id_param: user.id,
            description: description,
            ip_address: null // Não disponível no browser
          });
        } catch (error) {
          console.warn('Erro ao registrar evento de segurança:', error);
        }
      }
    };

    // Detectar copiar/colar suspeito
    const handlePaste = (e: ClipboardEvent) => {
      const pastedText = e.clipboardData?.getData('text') || '';
      if (detectSQLInjection(pastedText)) {
        e.preventDefault();
        toast.error('Conteúdo não permitido detectado');
        logSecurityEvent('suspicious_paste', `SQL injection attempt: ${pastedText.substring(0, 100)}`);
      }
    };

    // Detectar tentativas de XSS
    const detectXSS = (value: string) => {
      const xssPatterns = [
        /<script[^>]*>.*?<\/script>/gi,
        /<iframe[^>]*>.*?<\/iframe>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi
      ];
      
      return xssPatterns.some(pattern => pattern.test(value));
    };

    // Monitorar inputs para tentativas de XSS
    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      if (target && detectXSS(target.value)) {
        target.value = target.value.replace(/<[^>]*>/g, ''); // Sanitizar
        toast.warning('Caracteres potencialmente perigosos foram removidos');
        logSecurityEvent('xss_attempt', `XSS attempt in ${target.name || 'input'}`);
      }
    };

    // Adicionar listeners
    document.addEventListener('paste', handlePaste);
    document.addEventListener('input', handleInput);

    // Cleanup
    return () => {
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('input', handleInput);
    };
  }, [user]);

  // Rate limiting para requisições
  const checkRateLimit = (action: string, maxAttempts = 10, windowMs = 60000) => {
    const key = `mavinda_rate_limit_${action}`;
    const now = Date.now();
    const attempts = JSON.parse(localStorage.getItem(key) || '[]') as number[];
    
    // Filtrar tentativas dentro da janela de tempo
    const recentAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      toast.error('Muitas tentativas. Aguarde um momento.');
      return false;
    }
    
    // Adicionar nova tentativa
    recentAttempts.push(now);
    localStorage.setItem(key, JSON.stringify(recentAttempts));
    
    return true;
  };

  // Validar entrada segura
  const sanitizeInput = (input: string) => {
    return input
      .replace(/[<>]/g, '') // Remove < e >
      .replace(/javascript:/gi, '') // Remove javascript:
      .replace(/on\w+=/gi, '') // Remove on*= 
      .trim();
  };

  return {
    checkRateLimit,
    sanitizeInput
  };
};
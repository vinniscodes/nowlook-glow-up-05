-- Adicionar validações de segurança e índices para performance

-- Criar índices para melhorar performance das consultas
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_establishments_owner_id ON establishments(owner_id);
CREATE INDEX IF NOT EXISTS idx_establishments_active ON establishments(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_establishment_id ON bookings(establishment_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_services_establishment_id ON services(establishment_id);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active) WHERE is_active = true;

-- Função para validar dados de entrada
CREATE OR REPLACE FUNCTION validate_email(email_input text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN email_input ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$;

-- Função para sanitizar texto
CREATE OR REPLACE FUNCTION sanitize_text(input_text text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  -- Remove caracteres perigosos e limita o tamanho
  RETURN TRIM(SUBSTRING(REGEXP_REPLACE(input_text, '[<>"\''%;()&+]', '', 'g'), 1, 1000));
END;
$$;

-- Função para log de segurança
CREATE OR REPLACE FUNCTION log_security_event(
  event_type text,
  user_id_param uuid,
  description text,
  ip_address text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO security_logs (event_type, user_id, description, ip_address, created_at)
  VALUES (event_type, user_id_param, description, ip_address, NOW());
EXCEPTION WHEN OTHERS THEN
  -- Em caso de erro, não impedir a operação principal
  NULL;
END;
$$;

-- Criar tabela de logs de segurança
CREATE TABLE IF NOT EXISTS security_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  user_id uuid,
  description text,
  ip_address text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Políticas RLS para logs de segurança (apenas admins podem ver)
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view security logs"
ON security_logs
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id FROM profiles WHERE role = 'admin'
  )
);

-- Função para rate limiting (controle de tentativas)
CREATE OR REPLACE FUNCTION check_rate_limit(
  identifier text,
  max_attempts integer DEFAULT 5,
  window_minutes integer DEFAULT 15
)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  attempt_count integer;
BEGIN
  SELECT COUNT(*)
  INTO attempt_count
  FROM security_logs
  WHERE description LIKE '%' || identifier || '%'
    AND event_type = 'login_attempt'
    AND created_at > NOW() - INTERVAL '1 minute' * window_minutes;
  
  RETURN attempt_count < max_attempts;
END;
$$;

-- Adicionar trigger para auditoria de mudanças em profiles
CREATE OR REPLACE FUNCTION audit_profile_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    -- Log mudanças de role
    IF OLD.role != NEW.role THEN
      PERFORM log_security_event(
        'role_change',
        NEW.user_id,
        'Role changed from ' || OLD.role || ' to ' || NEW.role
      );
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER audit_profile_changes_trigger
  AFTER UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION audit_profile_changes();
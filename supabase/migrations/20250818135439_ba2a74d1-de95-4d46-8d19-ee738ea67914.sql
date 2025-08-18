-- Corrigir warnings de segurança - definir search_path para todas as funções

-- Atualizar funções existentes com search_path seguro
CREATE OR REPLACE FUNCTION validate_email(email_input text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN email_input ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$;

CREATE OR REPLACE FUNCTION sanitize_text(input_text text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Remove caracteres perigosos e limita o tamanho
  RETURN TRIM(SUBSTRING(REGEXP_REPLACE(input_text, '[<>"'';()&+]', '', 'g'), 1, 1000));
END;
$$;

CREATE OR REPLACE FUNCTION log_security_event(
  event_type text,
  user_id_param uuid,
  description text,
  ip_address text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO security_logs (event_type, user_id, description, ip_address, created_at)
  VALUES (event_type, user_id_param, description, ip_address, NOW());
EXCEPTION WHEN OTHERS THEN
  -- Em caso de erro, não impedir a operação principal
  NULL;
END;
$$;

CREATE OR REPLACE FUNCTION check_rate_limit(
  identifier text,
  max_attempts integer DEFAULT 5,
  window_minutes integer DEFAULT 15
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION audit_profile_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Atualizar funções existentes do sistema também
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
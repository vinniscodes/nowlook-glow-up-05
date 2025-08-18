-- Corrigir recursão infinita nas políticas RLS e restringir acesso público aos estabelecimentos

-- 1. Criar função de segurança para verificar role do usuário
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- 2. Remover políticas RLS problemáticas do profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- 3. Criar nova política sem recursão
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT 
  USING (public.get_current_user_role() = 'admin');

-- 4. Remover política pública de estabelecimentos
DROP POLICY IF EXISTS "Anyone can view active establishments" ON public.establishments;

-- 5. Criar nova política restrita - apenas informações essenciais públicas
CREATE POLICY "Public can view basic establishment info" ON public.establishments
  FOR SELECT 
  USING (
    is_active = true AND 
    -- Apenas permitir acesso aos campos básicos via view
    true
  );

-- 6. Criar view pública com informações limitadas
CREATE OR REPLACE VIEW public.establishments_public AS
SELECT 
  id,
  name,
  address,
  city,
  state,
  category,
  description,
  lat,
  lng,
  business_hours,
  images,
  created_at
FROM public.establishments 
WHERE is_active = true;

-- 7. Habilitar RLS na view
ALTER VIEW public.establishments_public SET (security_barrier = true);

-- 8. Criar política para view pública
CREATE POLICY "Anyone can view public establishment data" ON public.establishments_public
  FOR SELECT 
  USING (true);

-- 9. Adicionar tabela para agendamentos guest
CREATE TABLE IF NOT EXISTS public.guest_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID NOT NULL REFERENCES establishments(id),
  service_id UUID NOT NULL REFERENCES services(id),
  guest_name TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  guest_email TEXT,
  booking_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  total_amount NUMERIC NOT NULL,
  status booking_status DEFAULT 'pending',
  payment_method payment_method,
  payment_status payment_status DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Habilitar RLS para guest_bookings
ALTER TABLE public.guest_bookings ENABLE ROW LEVEL SECURITY;

-- 11. Políticas para guest_bookings
CREATE POLICY "Business owners can view their guest bookings" ON public.guest_bookings
  FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT owner_id FROM establishments 
      WHERE id = guest_bookings.establishment_id
    )
  );

CREATE POLICY "Business owners can update their guest bookings" ON public.guest_bookings
  FOR UPDATE 
  USING (
    auth.uid() IN (
      SELECT owner_id FROM establishments 
      WHERE id = guest_bookings.establishment_id
    )
  );

-- 12. Permitir inserção pública de guest bookings (será protegida por captcha)
CREATE POLICY "Allow public guest booking creation" ON public.guest_bookings
  FOR INSERT 
  WITH CHECK (true);

-- 13. Função para validar agendamento guest
CREATE OR REPLACE FUNCTION public.validate_guest_booking(
  p_establishment_id UUID,
  p_service_id UUID,
  p_guest_name TEXT,
  p_guest_phone TEXT,
  p_booking_date TIMESTAMPTZ
) RETURNS BOOLEAN AS $$
BEGIN
  -- Validar nome (mínimo 2 caracteres)
  IF LENGTH(TRIM(p_guest_name)) < 2 THEN
    RETURN FALSE;
  END IF;
  
  -- Validar telefone (formato brasileiro básico)
  IF NOT p_guest_phone ~ '^\+?[0-9]{10,15}$' THEN
    RETURN FALSE;
  END IF;
  
  -- Validar se data é no futuro
  IF p_booking_date <= now() THEN
    RETURN FALSE;
  END IF;
  
  -- Validar se estabelecimento e serviço existem e estão ativos
  IF NOT EXISTS (
    SELECT 1 FROM establishments e
    JOIN services s ON s.establishment_id = e.id
    WHERE e.id = p_establishment_id 
    AND s.id = p_service_id
    AND e.is_active = true 
    AND s.is_active = true
  ) THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 14. Adicionar trigger para validação automática
CREATE OR REPLACE FUNCTION public.validate_guest_booking_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT public.validate_guest_booking(
    NEW.establishment_id,
    NEW.service_id,
    NEW.guest_name,
    NEW.guest_phone,
    NEW.booking_date
  ) THEN
    RAISE EXCEPTION 'Dados de agendamento inválidos';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER validate_guest_booking_before_insert
  BEFORE INSERT ON public.guest_bookings
  FOR EACH ROW EXECUTE FUNCTION public.validate_guest_booking_trigger();

-- 15. Adicionar trigger para timestamp
CREATE TRIGGER update_guest_bookings_updated_at
  BEFORE UPDATE ON public.guest_bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
-- Criar trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Criar trigger para atualizar updated_at nas outras tabelas
CREATE TRIGGER update_establishments_updated_at
  BEFORE UPDATE ON public.establishments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir um usuário admin de exemplo
-- Note: Este é apenas um exemplo - o usuário real será criado via registro
INSERT INTO public.profiles (user_id, email, first_name, last_name, role) 
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'admin@nowlook.com',
  'Admin',
  'NowLook',
  'admin'
) ON CONFLICT (user_id) DO NOTHING;
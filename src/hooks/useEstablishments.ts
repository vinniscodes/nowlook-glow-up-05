
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface EstablishmentWithServices {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  description?: string;
  lat?: number;
  lng?: number;
  services: ServiceData[];
}

export interface ServiceData {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration_minutes: number;
  category: string;
}

export const useEstablishments = () => {
  const [establishments, setEstablishments] = useState<EstablishmentWithServices[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEstablishments = async () => {
    setIsLoading(true);
    try {
      // Usando apenas campos públicos para proteger dados sensíveis
      const { data, error } = await supabase
        .from('establishments')
        .select(`
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
          created_at,
          services!inner (*)
        `)
        .eq('is_active', true)

      if (error) {
        console.error('Erro ao buscar estabelecimentos:', error);
        return;
      }

      const formattedData: EstablishmentWithServices[] = data?.map(establishment => ({
        id: establishment.id,
        name: establishment.name,
        address: establishment.address,
        description: establishment.description,
        lat: establishment.lat ? Number(establishment.lat) : undefined,
        lng: establishment.lng ? Number(establishment.lng) : undefined,
        services: establishment.services?.filter(service => service.is_active) || []
      })) || [];

      setEstablishments(formattedData);
    } catch (error) {
      console.error('Erro inesperado:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEstablishments();
  }, []);

  return {
    establishments,
    isLoading,
    refetch: fetchEstablishments
  };
};

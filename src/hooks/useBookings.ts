
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export interface BookingData {
  establishmentId: string;
  serviceId: string;
  bookingDate: string; // ISO string
  durationMinutes: number;
  totalAmount: number;
  notes?: string;
}

export interface BookingWithDetails {
  id: string;
  client_id: string;
  establishment_id: string;
  service_id: string;
  booking_date: string;
  duration_minutes: number;
  total_amount: number;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Relacionamentos que podem ser incluídos
  establishments?: {
    name: string;
    address: string;
    phone?: string;
  };
  services?: {
    name: string;
    description?: string;
    price: number;
  };
  profiles?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  };
}

export const useBookings = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const createBooking = async (bookingData: BookingData): Promise<boolean> => {
    if (!user) {
      toast.error('Você precisa estar logado para fazer uma reserva');
      return false;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          client_id: user.id,
          establishment_id: bookingData.establishmentId,
          service_id: bookingData.serviceId,
          booking_date: bookingData.bookingDate,
          duration_minutes: bookingData.durationMinutes,
          total_amount: bookingData.totalAmount,
          notes: bookingData.notes,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar reserva:', error);
        toast.error('Erro ao criar reserva. Tente novamente.');
        return false;
      }

      toast.success('Reserva criada com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado. Tente novamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getClientBookings = async (): Promise<BookingWithDetails[]> => {
    if (!user) return [];

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          establishments (name, address, phone),
          services (name, description, price)
        `)
        .eq('client_id', user.id)
        .order('booking_date', { ascending: true });

      if (error) {
        console.error('Erro ao buscar reservas:', error);
        return [];
      }

      return (data || []) as BookingWithDetails[];
    } catch (error) {
      console.error('Erro inesperado:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getEstablishmentBookings = async (establishmentId: string): Promise<BookingWithDetails[]> => {
    if (!user) return [];

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          services (name, description, price),
          profiles (first_name, last_name, email, phone)
        `)
        .eq('establishment_id', establishmentId)
        .order('booking_date', { ascending: true });

      if (error) {
        console.error('Erro ao buscar reservas do estabelecimento:', error);
        return [];
      }

      return (data || []) as BookingWithDetails[];
    } catch (error) {
      console.error('Erro inesperado:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled'): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) {
        console.error('Erro ao atualizar status da reserva:', error);
        toast.error('Erro ao atualizar reserva');
        return false;
      }

      toast.success('Status da reserva atualizado!');
      return true;
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createBooking,
    getClientBookings,
    getEstablishmentBookings,
    updateBookingStatus,
    isLoading
  };
};

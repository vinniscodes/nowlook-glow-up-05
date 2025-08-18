import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GuestBookingData {
  establishment_id: string;
  service_id: string;
  guest_name: string;
  guest_phone: string;
  guest_email?: string;
  booking_date: string;
  duration_minutes: number;
  total_amount: number;
  payment_method?: 'credit_card' | 'pix' | 'cash';
  notes?: string;
}

export interface GuestBooking extends GuestBookingData {
  id: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
}

export const useGuestBooking = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createGuestBooking = async (bookingData: GuestBookingData): Promise<{ success: boolean; booking?: GuestBooking; error?: string }> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('guest_bookings')
        .insert({
          establishment_id: bookingData.establishment_id,
          service_id: bookingData.service_id,
          guest_name: bookingData.guest_name,
          guest_phone: bookingData.guest_phone,
          guest_email: bookingData.guest_email,
          booking_date: bookingData.booking_date,
          duration_minutes: bookingData.duration_minutes,
          total_amount: bookingData.total_amount,
          payment_method: bookingData.payment_method,
          notes: bookingData.notes
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar agendamento:', error);
        return { success: false, error: error.message };
      }

      return { success: true, booking: data };
    } catch (error: any) {
      console.error('Erro inesperado:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const getEstablishmentDetails = async (establishmentId: string) => {
    try {
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
          business_hours,
          images,
          services!inner (
            id,
            name,
            description,
            price,
            duration_minutes,
            category
          )
        `)
        .eq('id', establishmentId)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Erro ao buscar estabelecimento:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro inesperado:', error);
      return null;
    }
  };

  return {
    createGuestBooking,
    getEstablishmentDetails,
    isLoading
  };
};
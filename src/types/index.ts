// Tipos para o sistema
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: 'client' | 'business' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface ExtendedUser extends SupabaseUser {
  profile?: UserProfile;
}

export interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  services: Service[];
  ownerId: string;
  verified: boolean;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // em minutos
  description: string;
}

export interface Review {
  id: string;
  clientId: string;
  clientName: string;
  companyId: string;
  serviceId: string;
  serviceName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Professional {
  id: string;
  name: string;
  companyId: string;
  specialty: string;
  rating: number;
  photoUrl?: string;
}

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  companyId: string;
  companyName: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  price: number;
  paymentMethod: 'pix' | 'card' | 'cash';
  paymentStatus: 'pending' | 'paid' | 'cancelled';
  status: 'confirmed' | 'completed' | 'cancelled';
}

export interface PaymentData {
  id: string;
  bookingId: string;
  amount: number;
  method: 'pix' | 'card' | 'cash';
  status: 'pending' | 'paid' | 'failed';
  date: string;
}
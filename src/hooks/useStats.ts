import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SiteStats {
  totalEstablishments: number;
  totalBookings: number;
  totalServices: number;
  totalUsers: number;
  monthlyRevenue: number;
  activeUsers: number;
}

export interface UserStats {
  totalBookings: number;
  completedBookings: number;
  totalSpent: number;
  favoriteCategory: string;
}

export interface BusinessStats {
  totalBookings: number;
  monthlyRevenue: number;
  completedBookings: number;
  pendingBookings: number;
  totalServices: number;
  averageRating: number;
}

export const useSiteStats = () => {
  const [stats, setStats] = useState<SiteStats>({
    totalEstablishments: 0,
    totalBookings: 0,
    totalServices: 0,
    totalUsers: 0,
    monthlyRevenue: 0,
    activeUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [establishments, bookings, services, users] = await Promise.all([
          supabase.from('establishments').select('id', { count: 'exact' }),
          supabase.from('bookings').select('id, total_amount', { count: 'exact' }),
          supabase.from('services').select('id', { count: 'exact' }),
          supabase.from('profiles').select('id', { count: 'exact' }),
        ]);

        const thisMonth = new Date();
        thisMonth.setDate(1);
        const monthlyBookings = await supabase
          .from('bookings')
          .select('total_amount')
          .gte('created_at', thisMonth.toISOString());

        const monthlyRevenue = monthlyBookings.data?.reduce(
          (sum, booking) => sum + Number(booking.total_amount),
          0
        ) || 0;

        setStats({
          totalEstablishments: establishments.count || 0,
          totalBookings: bookings.count || 0,
          totalServices: services.count || 0,
          totalUsers: users.count || 0,
          monthlyRevenue,
          activeUsers: users.count || 0,
        });
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading };
};

export const useUserStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    totalBookings: 0,
    completedBookings: 0,
    totalSpent: 0,
    favoriteCategory: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchUserStats = async () => {
      try {
        const { data: bookings } = await supabase
          .from('bookings')
          .select('total_amount, status, services(category)')
          .eq('client_id', user.id);

        const totalBookings = bookings?.length || 0;
        const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0;
        const totalSpent = bookings?.reduce((sum, b) => sum + Number(b.total_amount), 0) || 0;

        // Categoria favorita baseada no maior número de reservas
        const categories = bookings?.reduce((acc, booking) => {
          const category = booking.services?.category || 'Outros';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};

        const favoriteCategory = Object.entries(categories).sort(([,a], [,b]) => b - a)[0]?.[0] || 'Nenhuma';

        setStats({
          totalBookings,
          completedBookings,
          totalSpent,
          favoriteCategory,
        });
      } catch (error) {
        console.error('Erro ao buscar estatísticas do usuário:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStats();
  }, [user]);

  return { stats, isLoading };
};

export const useBusinessStats = (establishmentId?: string) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<BusinessStats>({
    totalBookings: 0,
    monthlyRevenue: 0,
    completedBookings: 0,
    pendingBookings: 0,
    totalServices: 0,
    averageRating: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !establishmentId) {
      setIsLoading(false);
      return;
    }

    const fetchBusinessStats = async () => {
      try {
        const [bookings, services] = await Promise.all([
          supabase
            .from('bookings')
            .select('total_amount, status, created_at')
            .eq('establishment_id', establishmentId),
          supabase
            .from('services')
            .select('id')
            .eq('establishment_id', establishmentId)
        ]);

        const totalBookings = bookings.data?.length || 0;
        const completedBookings = bookings.data?.filter(b => b.status === 'completed').length || 0;
        const pendingBookings = bookings.data?.filter(b => b.status === 'pending').length || 0;
        const totalServices = services.data?.length || 0;

        // Receita mensal
        const thisMonth = new Date();
        thisMonth.setDate(1);
        const monthlyRevenue = bookings.data?.filter(b => 
          new Date(b.created_at) >= thisMonth && b.status === 'completed'
        ).reduce((sum, b) => sum + Number(b.total_amount), 0) || 0;

        setStats({
          totalBookings,
          monthlyRevenue,
          completedBookings,
          pendingBookings,
          totalServices,
          averageRating: 4.8, // Placeholder - pode implementar sistema de avaliações
        });
      } catch (error) {
        console.error('Erro ao buscar estatísticas do negócio:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessStats();
  }, [user, establishmentId]);

  return { stats, isLoading };
};
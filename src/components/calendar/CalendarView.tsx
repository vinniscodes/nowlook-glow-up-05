
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Plus, Clock, User, Edit, Trash2, Ban, Check } from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useBookings, BookingWithDetails } from '@/hooks/useBookings';
import { useAuth } from '@/contexts/AuthContext';
import { getUserRole } from '@/hooks/useUserHelpers';

const CalendarView = () => {
  const { user } = useAuth();
  const { getEstablishmentBookings, updateBookingStatus, isLoading } = useBookings();
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [userEstablishmentId, setUserEstablishmentId] = useState<string | null>(null);

  // Buscar estabelecimento do usuário
  useEffect(() => {
    const fetchUserEstablishment = async () => {
      if (!user || getUserRole(user) !== 'business') return;

      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const { data, error } = await supabase
          .from('establishments')
          .select('id')
          .eq('owner_id', user.id)
          .single();

        if (error) {
          console.error('Erro ao buscar estabelecimento:', error);
          return;
        }

        setUserEstablishmentId(data.id);
      } catch (error) {
        console.error('Erro inesperado:', error);
      }
    };

    fetchUserEstablishment();
  }, [user]);

  // Buscar reservas do estabelecimento
  useEffect(() => {
    const fetchBookings = async () => {
      if (!userEstablishmentId) return;

      const bookingsData = await getEstablishmentBookings(userEstablishmentId);
      setBookings(bookingsData);
    };

    fetchBookings();
  }, [userEstablishmentId, getEstablishmentBookings]);

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'confirmed': return 'default';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'no-show': return 'outline';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'confirmed': return 'Confirmado';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      case 'no-show': return 'Não Compareceu';
      default: return status;
    }
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    const success = await updateBookingStatus(bookingId, newStatus);
    if (success && userEstablishmentId) {
      // Recarregar bookings
      const bookingsData = await getEstablishmentBookings(userEstablishmentId);
      setBookings(bookingsData);
    }
  };

  // Filtrar bookings do dia atual
  const todayBookings = bookings.filter(booking => 
    isToday(parseISO(booking.booking_date))
  );

  // Função para obter booking por horário
  const getBookingByTime = (time: string) => {
    return todayBookings.find(booking => {
      const bookingTime = format(parseISO(booking.booking_date), 'HH:mm');
      return bookingTime === time;
    });
  };

  const getClientName = (booking: BookingWithDetails) => {
    if (booking.profiles?.first_name || booking.profiles?.last_name) {
      return `${booking.profiles.first_name || ''} ${booking.profiles.last_name || ''}`.trim();
    }
    return booking.profiles?.email || 'Cliente';
  };

  if (!user || getUserRole(user) !== 'business') {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
        <p className="text-muted-foreground">Apenas estabelecimentos podem acessar a agenda.</p>
      </div>
    );
  }

  if (!userEstablishmentId) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold mb-2">Estabelecimento não encontrado</h3>
        <p className="text-muted-foreground">Você precisa ter um estabelecimento cadastrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles do Calendário */}
      <Card className="shadow-professional">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Agenda - {selectedDate.toLocaleDateString('pt-BR')}
            </CardTitle>
            <div className="flex gap-2">
              <div className="flex gap-1">
                <Button 
                  variant={view === 'day' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setView('day')}
                >
                  Dia
                </Button>
                <Button 
                  variant={view === 'week' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setView('week')}
                >
                  Semana
                </Button>
                <Button 
                  variant={view === 'month' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setView('month')}
                >
                  Mês
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Vista do Dia */}
      {view === 'day' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline do Dia */}
          <div className="lg:col-span-2">
            <Card className="shadow-professional">
              <CardHeader>
                <CardTitle>Agenda do Dia - {format(new Date(), "dd 'de' MMMM", { locale: ptBR })}</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Carregando agenda...</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {timeSlots.map((time) => {
                      const booking = getBookingByTime(time);
                      return (
                        <div key={time} className="flex items-center gap-4 p-2 border-b border-muted">
                          <div className="w-16 text-sm text-muted-foreground font-mono">{time}</div>
                          {booking ? (
                            <div className="flex-1 flex items-center justify-between bg-muted/30 p-3 rounded-lg">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  <span className="font-medium">{getClientName(booking)}</span>
                                  <Badge variant={getStatusColor(booking.status)}>
                                    {getStatusLabel(booking.status)}
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {booking.services?.name} - {booking.duration_minutes}min
                                </div>
                                <div className="text-sm font-semibold text-primary">
                                  R$ {Number(booking.total_amount).toFixed(2)}
                                </div>
                                {booking.profiles?.phone && (
                                  <div className="text-xs text-muted-foreground">
                                    {booking.profiles.phone}
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-1">
                                {booking.status === 'pending' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                )}
                                {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleUpdateStatus(booking.id, 'completed')}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                                    >
                                      <Ban className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="flex-1 text-muted-foreground text-sm">Livre</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Resumo do Dia */}
          <div className="space-y-4">
            <Card className="shadow-professional">
              <CardHeader>
                <CardTitle>Resumo do Dia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total de Agendamentos:</span>
                  <span className="font-semibold">{todayBookings.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Confirmados:</span>
                  <span className="font-semibold">{todayBookings.filter(b => b.status === 'confirmed').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Concluídos:</span>
                  <span className="font-semibold">{todayBookings.filter(b => b.status === 'completed').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Faturamento do Dia:</span>
                  <span className="font-semibold">
                    R$ {todayBookings.reduce((sum, booking) => sum + Number(booking.total_amount), 0).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-professional">
              <CardHeader>
                <CardTitle>Próximos Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayBookings
                    .filter(booking => booking.status === 'confirmed' || booking.status === 'pending')
                    .slice(0, 3)
                    .map((booking) => (
                      <div key={booking.id} className="p-3 bg-muted/30 rounded-lg">
                        <div className="font-medium">{getClientName(booking)}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(parseISO(booking.booking_date), 'HH:mm')} - {booking.services?.name}
                        </div>
                        {booking.profiles?.phone && (
                          <div className="text-xs text-muted-foreground">{booking.profiles.phone}</div>
                        )}
                      </div>
                    ))}
                  {todayBookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length === 0 && (
                    <p className="text-muted-foreground text-center py-4">
                      Nenhum cliente agendado
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Vista da Semana e Mês (simplificadas para demo) */}
      {view === 'week' && (
        <Card className="shadow-professional">
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Vista Semanal</h3>
            <p className="text-muted-foreground">Vista semanal em desenvolvimento</p>
          </CardContent>
        </Card>
      )}

      {view === 'month' && (
        <Card className="shadow-professional">
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Vista Mensal</h3>
            <p className="text-muted-foreground">Vista mensal em desenvolvimento</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalendarView;

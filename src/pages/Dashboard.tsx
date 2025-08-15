
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Phone, Star, Plus } from 'lucide-react';
import { format, parseISO, isFuture, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import SiteHeader from '@/components/layout/SiteHeader';
import { useBookings, BookingWithDetails } from '@/hooks/useBookings';

const Dashboard = () => {
  const { user } = useAuth();
  const { getClientBookings } = useBookings();
  // Removed real stats temporarily
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      
      setIsLoading(true);
      const userBookings = await getClientBookings();
      setBookings(userBookings);
      setIsLoading(false);
    };

    fetchBookings();
  }, [user, getClientBookings]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container py-16 text-center">
          <h1 className="text-2xl font-bold">Faça login para ver suas reservas</h1>
          <p className="text-muted-foreground mt-2">Você precisa estar logado para acessar o dashboard.</p>
          <Button asChild variant="hero" className="mt-4">
            <a href="/login">Fazer Login</a>
          </Button>
        </main>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'confirmed': return 'default';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'confirmed': return 'Confirmado';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  // Separar reservas futuras e passadas
  const futureBookings = bookings.filter(booking => isFuture(parseISO(booking.booking_date)));
  const pastBookings = bookings.filter(booking => isPast(parseISO(booking.booking_date)));

  // Estatísticas rápidas
  const totalBookings = bookings.length;
  const totalSpent = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, booking) => sum + Number(booking.total_amount), 0);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">Meu Dashboard</h1>
          <p className="text-muted-foreground mt-2">Gerencie suas reservas e agendamentos</p>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Carregando suas reservas...</p>
          </div>
        ) : (
          <>
            {/* Estatísticas Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="shadow-professional">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Reservas</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalBookings}</div>
                  <p className="text-xs text-muted-foreground">
                    {futureBookings.length} próximas
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-professional">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Valor Total Gasto</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ {totalSpent.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    Em serviços concluídos
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-professional">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Próxima Reserva</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-bold">
                    {futureBookings.length > 0 
                      ? format(parseISO(futureBookings[0].booking_date), 'dd/MM HH:mm')
                      : 'Nenhuma reserva'
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {futureBookings.length > 0 
                      ? futureBookings[0].establishments?.name
                      : 'Faça uma nova reserva'
                    }
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Botão para Nova Reserva */}
            <div className="mb-6">
              <Button asChild variant="hero" size="lg">
                <a href="/agendar">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Reserva
                </a>
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Próximas Reservas */}
              <Card className="shadow-professional">
                <CardHeader>
                  <CardTitle>Próximas Reservas</CardTitle>
                </CardHeader>
                <CardContent>
                  {futureBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">Nenhuma reserva agendada</h3>
                      <p className="text-muted-foreground mb-4">Que tal agendar um novo serviço?</p>
                      <Button asChild variant="outline">
                        <a href="/agendar">Agendar Agora</a>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {futureBookings.map((booking) => (
                        <div key={booking.id} className="p-4 border rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{booking.establishments?.name}</h4>
                            <Badge variant={getStatusColor(booking.status)}>
                              {getStatusLabel(booking.status)}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {format(parseISO(booking.booking_date), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {booking.services?.name} - {booking.duration_minutes} min
                            </div>
                            
                            {booking.establishments?.address && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {booking.establishments.address}
                              </div>
                            )}
                            
                            {booking.establishments?.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                {booking.establishments.phone}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between pt-2 border-t">
                            <span className="font-semibold text-primary">R$ {Number(booking.total_amount).toFixed(2)}</span>
                            {booking.status === 'pending' && (
                              <span className="text-xs text-muted-foreground">Aguardando confirmação</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Histórico de Reservas */}
              <Card className="shadow-professional">
                <CardHeader>
                  <CardTitle>Histórico de Reservas</CardTitle>
                </CardHeader>
                <CardContent>
                  {pastBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">Nenhum histórico ainda</h3>
                      <p className="text-muted-foreground">Suas reservas passadas aparecerão aqui</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {pastBookings
                        .sort((a, b) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime())
                        .map((booking) => (
                          <div key={booking.id} className="p-4 border rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">{booking.establishments?.name}</h4>
                              <Badge variant={getStatusColor(booking.status)}>
                                {getStatusLabel(booking.status)}
                              </Badge>
                            </div>
                            
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {format(parseISO(booking.booking_date), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {booking.services?.name} - {booking.duration_minutes} min
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-2 border-t">
                              <span className="font-semibold text-primary">R$ {Number(booking.total_amount).toFixed(2)}</span>
                              {booking.status === 'completed' && (
                                <span className="text-xs text-green-600">✓ Concluído</span>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

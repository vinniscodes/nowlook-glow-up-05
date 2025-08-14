
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserRole } from '@/hooks/useUserHelpers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, Users, TrendingUp, Clock, User, Star, AlertCircle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import SiteHeader from '@/components/layout/SiteHeader';
import CalendarView from '@/components/calendar/CalendarView';
import ProfessionalsManager from '@/components/business/ProfessionalsManager';
import ServicesManager from '@/components/business/ServicesManager';
import ClientsManager from '@/components/business/ClientsManager';
import ReportsView from '@/components/business/ReportsView';
import StoreSettings from '@/components/business/StoreSettings';
import { useBookings, BookingWithDetails } from '@/hooks/useBookings';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO, isToday, isThisWeek, startOfHour } from 'date-fns';

const CompanyDashboard = () => {
  const { user } = useAuth();
  const { getEstablishmentBookings } = useBookings();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [userEstablishmentId, setUserEstablishmentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Buscar estabelecimento do usuário
  useEffect(() => {
    const fetchUserEstablishment = async () => {
      if (!user || getUserRole(user) !== 'business') return;

      try {
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

      setIsLoading(true);
      const bookingsData = await getEstablishmentBookings(userEstablishmentId);
      setBookings(bookingsData);
      setIsLoading(false);
    };

    fetchBookings();
  }, [userEstablishmentId, getEstablishmentBookings]);

  if (!user || getUserRole(user) !== 'business') {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive">Acesso Negado</h1>
            <p className="text-muted-foreground mt-2">Você precisa ter uma conta de empresa para acessar esta página.</p>
          </div>
        </main>
      </div>
    );
  }

  // Calcular estatísticas
  const todayBookings = bookings.filter(booking => isToday(parseISO(booking.booking_date)));
  const thisWeekBookings = bookings.filter(booking => isThisWeek(parseISO(booking.booking_date)));
  
  const todayRevenue = todayBookings
    .filter(b => b.status === 'completed')
    .reduce((sum, booking) => sum + Number(booking.total_amount), 0);
  
  const thisWeekRevenue = thisWeekBookings
    .filter(b => b.status === 'completed')
    .reduce((sum, booking) => sum + Number(booking.total_amount), 0);

  const completionRate = todayBookings.length > 0 
    ? Math.round((todayBookings.filter(b => b.status === 'completed').length / todayBookings.length) * 100)
    : 0;

  const noShows = thisWeekBookings.filter(b => b.status === 'no-show').length;

  // Próximo cliente
  const nextBooking = todayBookings
    .filter(b => b.status === 'confirmed' || b.status === 'pending')
    .sort((a, b) => new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime())[0];

  const getClientName = (booking: BookingWithDetails) => {
    if (booking.profiles?.first_name || booking.profiles?.last_name) {
      return `${booking.profiles.first_name || ''} ${booking.profiles.last_name || ''}`.trim();
    }
    return booking.profiles?.email || 'Cliente';
  };

  // Dados para gráficos
  const peakHoursData = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 8; // 8h às 19h
    const hourStr = `${hour}h`;
    const bookingsInHour = bookings.filter(booking => {
      const bookingHour = parseISO(booking.booking_date).getHours();
      return bookingHour === hour;
    }).length;
    
    return { hour: hourStr, bookings: bookingsInHour };
  });

  // Serviços mais populares
  const serviceStats = bookings.reduce((acc, booking) => {
    const serviceName = booking.services?.name || 'Serviço';
    if (!acc[serviceName]) {
      acc[serviceName] = { count: 0, revenue: 0 };
    }
    acc[serviceName].count++;
    acc[serviceName].revenue += Number(booking.total_amount);
    return acc;
  }, {} as Record<string, { count: number; revenue: number }>);

  const servicesPopularity = Object.entries(serviceStats)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">Dashboard Empresa</h1>
          <p className="text-muted-foreground mt-2">Gerencie seu negócio de forma inteligente</p>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        ) : (
          <>
            {/* Resumo do Dia */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="shadow-professional">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{todayBookings.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {todayBookings.filter(b => b.status === 'completed').length} concluídos
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-professional">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Faturamento Hoje</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ {todayRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    Semana: R$ {thisWeekRevenue.toFixed(2)}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-professional">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Próximo Cliente</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-bold">
                    {nextBooking 
                      ? `${getClientName(nextBooking)} - ${format(parseISO(nextBooking.booking_date), 'HH:mm')}`
                      : 'Nenhum agendamento'
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {nextBooking ? nextBooking.services?.name : 'Hoje'}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-professional">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completionRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    {completionRate >= 90 ? 'Excelente!' : completionRate >= 70 ? 'Bom' : 'Pode melhorar'}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="overview">Resumo</TabsTrigger>
                <TabsTrigger value="calendar">Agenda</TabsTrigger>
                <TabsTrigger value="professionals">Equipe</TabsTrigger>
                <TabsTrigger value="services">Serviços</TabsTrigger>
                <TabsTrigger value="clients">Clientes</TabsTrigger>
                <TabsTrigger value="reports">Relatórios</TabsTrigger>
                <TabsTrigger value="settings">Configurações</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Estatísticas Rápidas */}
                  <Card className="shadow-professional">
                    <CardHeader>
                      <CardTitle>Estatísticas da Semana</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Agendamentos</span>
                        <span className="font-semibold">{thisWeekBookings.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Faturamento</span>
                        <span className="font-semibold">R$ {thisWeekRevenue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">No-Shows</span>
                        <span className="font-semibold text-destructive">{noShows}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Serviço Top</span>
                        <span className="font-semibold">
                          {servicesPopularity[0]?.name || 'N/A'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Horários de Pico */}
                  <Card className="shadow-professional">
                    <CardHeader>
                      <CardTitle>Horários de Pico</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={peakHoursData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="hour" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="bookings" fill="hsl(var(--primary))" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Serviços Mais Populares */}
                  <Card className="shadow-professional">
                    <CardHeader>
                      <CardTitle>Ranking de Serviços</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {servicesPopularity.length > 0 ? (
                          servicesPopularity.map((service, index) => (
                            <div key={service.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                                  {index + 1}
                                </div>
                                <span className="font-medium">{service.name}</span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-semibold">R$ {service.revenue.toFixed(2)}</div>
                                <div className="text-xs text-muted-foreground">{service.count} vendas</div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-center py-4">
                            Nenhum serviço encontrado
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Resumo de Bookings Recentes */}
                  <Card className="shadow-professional">
                    <CardHeader>
                      <CardTitle>Últimas Reservas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {bookings.slice(0, 5).map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                              <div className="font-medium">{getClientName(booking)}</div>
                              <div className="text-sm text-muted-foreground">
                                {booking.services?.name} - {format(parseISO(booking.booking_date), 'dd/MM HH:mm')}
                              </div>
                            </div>
                            <Badge variant={booking.status === 'completed' ? 'secondary' : 'default'}>
                              {booking.status === 'pending' ? 'Pendente' :
                               booking.status === 'confirmed' ? 'Confirmado' :
                               booking.status === 'completed' ? 'Concluído' :
                               booking.status === 'cancelled' ? 'Cancelado' : 'N/A'}
                            </Badge>
                          </div>
                        ))}
                        {bookings.length === 0 && (
                          <p className="text-muted-foreground text-center py-4">
                            Nenhuma reserva encontrada
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Alertas e Notificações */}
                <Card className="shadow-professional">
                  <CardHeader>
                    <CardTitle>Alertas e Notificações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {noShows > 0 && (
                        <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <AlertCircle className="h-5 w-5 text-yellow-600" />
                          <div>
                            <p className="text-sm font-medium">{noShows} clientes não compareceram esta semana</p>
                            <p className="text-xs text-muted-foreground">Considere solicitar confirmação ou pré-pagamento</p>
                          </div>
                        </div>
                      )}
                      
                      {thisWeekRevenue > 1000 && (
                        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium">Ótimo faturamento esta semana!</p>
                            <p className="text-xs text-muted-foreground">R$ {thisWeekRevenue.toFixed(2)} em vendas</p>
                          </div>
                        </div>
                      )}
                      
                      {todayBookings.length > 5 && (
                        <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <Star className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">Dia movimentado!</p>
                            <p className="text-xs text-muted-foreground">{todayBookings.length} agendamentos hoje</p>
                          </div>
                        </div>
                      )}
                      
                      {bookings.length === 0 && (
                        <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <Star className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">Comece a receber reservas!</p>
                            <p className="text-xs text-muted-foreground">Configure seus serviços e divulgue seu estabelecimento</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="calendar">
                <CalendarView />
              </TabsContent>

              <TabsContent value="professionals">
                <ProfessionalsManager />
              </TabsContent>

              <TabsContent value="services">
                <ServicesManager />
              </TabsContent>

              <TabsContent value="clients">
                <ClientsManager />
              </TabsContent>

              <TabsContent value="reports">
                <ReportsView />
              </TabsContent>

              <TabsContent value="settings">
                <StoreSettings />
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
};

export default CompanyDashboard;

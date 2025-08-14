import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const CompanyDashboard = () => {
  const { user } = useAuth();
  const [todayStats, setTodayStats] = useState({
    todayBookings: 12,
    todayRevenue: 850,
    nextClient: 'Maria Silva - 14:30',
    completionRate: 94
  });

  const [quickStats, setQuickStats] = useState({
    thisWeekBookings: 67,
    thisWeekRevenue: 3250,
    noShows: 3,
    topService: 'Corte + Barba'
  });

  if (!user || user.type !== 'professional') {
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

  const peakHoursData = [
    { hour: '9h', bookings: 2 },
    { hour: '10h', bookings: 5 },
    { hour: '11h', bookings: 8 },
    { hour: '12h', bookings: 3 },
    { hour: '13h', bookings: 1 },
    { hour: '14h', bookings: 7 },
    { hour: '15h', bookings: 9 },
    { hour: '16h', bookings: 12 },
    { hour: '17h', bookings: 8 },
    { hour: '18h', bookings: 4 }
  ];

  const servicesPopularity = [
    { name: 'Corte', count: 45, revenue: 2250 },
    { name: 'Barba', count: 32, revenue: 960 },
    { name: 'Corte + Barba', count: 28, revenue: 1680 },
    { name: 'Sobrancelha', count: 15, revenue: 300 },
    { name: 'Tratamento', count: 8, revenue: 320 }
  ];

  const professionalsPerformance = [
    { name: 'João', bookings: 35, revenue: 1750 },
    { name: 'Pedro', bookings: 28, revenue: 1400 },
    { name: 'Carlos', bookings: 24, revenue: 1200 },
    { name: 'Lucas', bookings: 18, revenue: 900 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">Dashboard Empresa</h1>
          <p className="text-muted-foreground mt-2">Gerencie seu negócio de forma inteligente</p>
        </div>

        {/* Resumo do Dia */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-professional">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayStats.todayBookings}</div>
              <p className="text-xs text-muted-foreground">+3 desde ontem</p>
            </CardContent>
          </Card>

          <Card className="shadow-professional">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faturamento Hoje</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {todayStats.todayRevenue}</div>
              <p className="text-xs text-muted-foreground">Meta: R$ 1.000</p>
            </CardContent>
          </Card>

          <Card className="shadow-professional">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximo Cliente</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">{todayStats.nextClient}</div>
              <p className="text-xs text-muted-foreground">Em 25 minutos</p>
            </CardContent>
          </Card>

          <Card className="shadow-professional">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayStats.completionRate}%</div>
              <p className="text-xs text-muted-foreground">Excelente!</p>
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
                    <span className="font-semibold">{quickStats.thisWeekBookings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Faturamento</span>
                    <span className="font-semibold">R$ {quickStats.thisWeekRevenue}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">No-Shows</span>
                    <span className="font-semibold text-destructive">{quickStats.noShows}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Serviço Top</span>
                    <span className="font-semibold">{quickStats.topService}</span>
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
                    {servicesPopularity.map((service, index) => (
                      <div key={service.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                            {index + 1}
                          </div>
                          <span className="font-medium">{service.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">R$ {service.revenue}</div>
                          <div className="text-xs text-muted-foreground">{service.count} vendas</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Desempenho da Equipe */}
              <Card className="shadow-professional">
                <CardHeader>
                  <CardTitle>Desempenho da Equipe</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={professionalsPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
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
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium">3 clientes com histórico de No-Show</p>
                      <p className="text-xs text-muted-foreground">Considere solicitar confirmação ou pré-pagamento</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Meta mensal atingida!</p>
                      <p className="text-xs text-muted-foreground">Parabéns! Você superou a meta de R$ 10.000 este mês</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Star className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Nova avaliação 5 estrelas</p>
                      <p className="text-xs text-muted-foreground">Cliente: Ana Costa - "Excelente atendimento!"</p>
                    </div>
                  </div>
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
      </main>
    </div>
  );
};

export default CompanyDashboard;
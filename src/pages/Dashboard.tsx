import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserRole } from '@/hooks/useUserHelpers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockBookings, mockPayments, mockCompanies } from '@/data/mockData';
import { Booking, PaymentData } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, DollarSign, Users, TrendingUp, MapPin, Clock } from 'lucide-react';
import SiteHeader from '@/components/layout/SiteHeader';
import AdminPanel from '@/components/admin/AdminPanel';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<PaymentData[]>([]);

  useEffect(() => {
    // Simular carregamento de dados
    setBookings(mockBookings);
    setPayments(mockPayments);
  }, []);

  if (!user || getUserRole(user) !== 'admin') {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive">Acesso Negado</h1>
            <p className="text-muted-foreground mt-2">Você precisa ser um administrador para acessar esta página.</p>
          </div>
        </main>
      </div>
    );
  }

  // Usar o novo painel administrativo
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <AdminPanel />
    </div>
  );

  // Estatísticas
  const totalBookings = bookings.length;
  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalCompanies = mockCompanies.length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;

  // Dados para gráficos
  const monthlyData = [
    { month: 'Jan', bookings: 45, revenue: 1200 },
    { month: 'Fev', bookings: 52, revenue: 1450 },
    { month: 'Mar', bookings: 48, revenue: 1300 },
    { month: 'Abr', bookings: 61, revenue: 1650 },
    { month: 'Mai', bookings: 55, revenue: 1500 },
    { month: 'Jun', bookings: 67, revenue: 1800 },
  ];

  const paymentMethodData = [
    { name: 'Cartão', value: 45, color: '#8884d8' },
    { name: 'PIX', value: 35, color: '#82ca9d' },
    { name: 'Dinheiro', value: 20, color: '#ffc658' },
  ];

  const serviceData = [
    { service: 'Corte', count: 25 },
    { service: 'Manicure', count: 18 },
    { service: 'Barba', count: 15 },
    { service: 'Escova', count: 12 },
    { service: 'Coloração', count: 8 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">Dashboard Administrativo</h1>
          <p className="text-muted-foreground mt-2">Visão geral da plataforma NowLook</p>
        </div>

        {/* Estatísticas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-professional">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Reservas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <p className="text-xs text-muted-foreground">+12% desde último mês</p>
            </CardContent>
          </Card>

          <Card className="shadow-professional">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+8% desde último mês</p>
            </CardContent>
          </Card>

          <Card className="shadow-professional">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empresas Cadastradas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCompanies}</div>
              <p className="text-xs text-muted-foreground">+3 novas este mês</p>
            </CardContent>
          </Card>

          <Card className="shadow-professional">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{((completedBookings / totalBookings) * 100).toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">+2% desde último mês</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="bookings">Reservas</TabsTrigger>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
            <TabsTrigger value="companies">Empresas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Reservas Mensais */}
              <Card className="shadow-professional">
                <CardHeader>
                  <CardTitle>Reservas por Mês</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="bookings" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Gráfico de Receita */}
              <Card className="shadow-professional">
                <CardHeader>
                  <CardTitle>Receita Mensal</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Métodos de Pagamento */}
              <Card className="shadow-professional">
                <CardHeader>
                  <CardTitle>Métodos de Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={paymentMethodData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {paymentMethodData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Serviços Mais Populares */}
              <Card className="shadow-professional">
                <CardHeader>
                  <CardTitle>Serviços Mais Populares</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={serviceData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="service" type="category" />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <Card className="shadow-professional">
              <CardHeader>
                <CardTitle>Todas as Reservas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                      <div className="space-y-1">
                        <p className="font-medium">{booking.clientName}</p>
                        <p className="text-sm text-muted-foreground">{booking.serviceName} - {booking.companyName}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {booking.date} às {booking.time}
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="font-semibold">R$ {booking.price.toFixed(2)}</p>
                        <div className="flex gap-2">
                          <Badge variant={booking.status === 'completed' ? 'default' : 'secondary'}>
                            {booking.status}
                          </Badge>
                          <Badge variant={booking.paymentStatus === 'paid' ? 'default' : 'destructive'}>
                            {booking.paymentStatus}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card className="shadow-professional">
              <CardHeader>
                <CardTitle>Histórico de Pagamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">Pagamento #{payment.id}</p>
                        <p className="text-sm text-muted-foreground">Reserva #{payment.bookingId}</p>
                        <p className="text-sm text-muted-foreground">{new Date(payment.date).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="font-semibold">R$ {payment.amount.toFixed(2)}</p>
                        <div className="flex gap-2">
                          <Badge variant="outline">{payment.method.toUpperCase()}</Badge>
                          <Badge variant={payment.status === 'paid' ? 'default' : 'destructive'}>
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="space-y-4">
            <Card className="shadow-professional">
              <CardHeader>
                <CardTitle>Empresas Cadastradas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCompanies.map((company) => (
                    <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                      <div className="space-y-1">
                        <p className="font-medium">{company.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {company.address}
                        </div>
                        <p className="text-sm text-muted-foreground">{company.phone}</p>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge variant={company.verified ? 'default' : 'secondary'}>
                          {company.verified ? 'Verificada' : 'Pendente'}
                        </Badge>
                        <p className="text-sm text-muted-foreground">{company.services.length} serviços</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
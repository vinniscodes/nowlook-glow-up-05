import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { CalendarDays, DollarSign, TrendingUp, TrendingDown, Download, Calendar, Users, Clock } from 'lucide-react';
import ReportsFilter from './ReportsFilter';

const ReportsView = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [filteredData, setFilteredData] = useState({
    revenue: 21200,
    bookings: 265,
    clients: 45
  });

  const handleFilterChange = (filters: any) => {
    // Aqui você aplicaria os filtros aos dados
    console.log('Filtros aplicados:', filters);
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    // Aqui você implementaria a exportação
    console.log('Exportando relatório em:', format);
  };

  // Dados financeiros mensais
  const monthlyFinancialData = [
    { month: 'Jan', revenue: 12500, bookings: 145, expenses: 3200 },
    { month: 'Fev', revenue: 14200, bookings: 168, expenses: 3500 },
    { month: 'Mar', revenue: 13800, bookings: 162, expenses: 3300 },
    { month: 'Abr', revenue: 15600, bookings: 185, expenses: 3700 },
    { month: 'Mai', revenue: 16200, bookings: 195, expenses: 3800 },
    { month: 'Jun', revenue: 17800, bookings: 210, expenses: 4000 },
    { month: 'Jul', revenue: 18500, bookings: 225, expenses: 4200 },
    { month: 'Ago', revenue: 17200, bookings: 205, expenses: 4000 },
    { month: 'Set', revenue: 16800, bookings: 198, expenses: 3900 },
    { month: 'Out', revenue: 18900, bookings: 230, expenses: 4300 },
    { month: 'Nov', revenue: 19500, bookings: 240, expenses: 4400 },
    { month: 'Dez', revenue: 21200, bookings: 265, expenses: 4800 }
  ];

  // Dados de métodos de pagamento
  const paymentMethodData = [
    { name: 'PIX', value: 45, amount: 54000, color: '#00C896' },
    { name: 'Cartão Débito', value: 30, amount: 36000, color: '#007BFF' },
    { name: 'Cartão Crédito', value: 15, amount: 18000, color: '#FF6B6B' },
    { name: 'Dinheiro', value: 10, amount: 12000, color: '#FFD93D' }
  ];

  // Dados de horários de pico
  const peakHoursData = [
    { hour: '8h', bookings: 8 },
    { hour: '9h', bookings: 15 },
    { hour: '10h', bookings: 25 },
    { hour: '11h', bookings: 22 },
    { hour: '12h', bookings: 12 },
    { hour: '13h', bookings: 8 },
    { hour: '14h', bookings: 28 },
    { hour: '15h', bookings: 35 },
    { hour: '16h', bookings: 42 },
    { hour: '17h', bookings: 38 },
    { hour: '18h', bookings: 25 },
    { hour: '19h', bookings: 15 }
  ];

  // Desempenho por profissional
  const professionalsPerformance = [
    { name: 'João Silva', bookings: 145, revenue: 8700, rating: 4.8, efficiency: 95 },
    { name: 'Ana Costa', bookings: 132, revenue: 10560, rating: 4.9, efficiency: 92 },
    { name: 'Pedro Santos', bookings: 118, revenue: 7080, rating: 4.6, efficiency: 88 },
    { name: 'Maria Oliveira', bookings: 98, revenue: 7840, rating: 4.7, efficiency: 90 }
  ];

  // Serviços mais populares
  const servicesRanking = [
    { service: 'Corte Masculino', bookings: 245, revenue: 9800, avgPrice: 40 },
    { service: 'Corte + Barba', bookings: 187, revenue: 11220, avgPrice: 60 },
    { service: 'Barba', bookings: 156, revenue: 4680, avgPrice: 30 },
    { service: 'Corte Feminino', bookings: 134, revenue: 10720, avgPrice: 80 },
    { service: 'Sobrancelha', bookings: 198, revenue: 3960, avgPrice: 20 }
  ];

  // Estatísticas principais
  const currentMonthStats = {
    totalRevenue: 21200,
    totalBookings: 265,
    averageTicket: 80,
    growthRate: 8.7,
    noShowRate: 4.2,
    completionRate: 94.8
  };

  const exportReport = (type: string) => {
    // Simulação de exportação
    alert(`Exportando relatório ${type}...`);
  };

  return (
    <div className="space-y-6">
      <ReportsFilter 
        onFilterChange={handleFilterChange}
        onExport={handleExport}
      />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Relatórios e Análises</h2>
          <p className="text-muted-foreground">Insights detalhados sobre seu negócio</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mês</SelectItem>
              <SelectItem value="quarter">Este Trimestre</SelectItem>
              <SelectItem value="year">Este Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="shadow-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {currentMonthStats.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{currentMonthStats.growthRate}%
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonthStats.totalBookings}</div>
            <div className="text-xs text-muted-foreground">Este mês</div>
          </CardContent>
        </Card>

        <Card className="shadow-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {currentMonthStats.averageTicket}</div>
            <div className="text-xs text-muted-foreground">Por cliente</div>
          </CardContent>
        </Card>

        <Card className="shadow-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de No-Show</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonthStats.noShowRate}%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              Melhorando
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonthStats.completionRate}%</div>
            <div className="text-xs text-green-600">Excelente</div>
          </CardContent>
        </Card>

        <Card className="shadow-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crescimento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{currentMonthStats.growthRate}%</div>
            <div className="text-xs text-muted-foreground">vs mês anterior</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faturamento Mensal */}
        <Card className="shadow-professional">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Faturamento x Agendamentos</CardTitle>
              <Badge variant="outline">2024</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyFinancialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="revenue" fill="hsl(var(--primary))" />
                <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="hsl(var(--destructive))" strokeWidth={2} />
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
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any, name: any, props: any) => [
                  `${value}% (R$ ${props.payload.amount.toLocaleString()})`,
                  name
                ]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Horários de Pico */}
      <Card className="shadow-professional">
        <CardHeader>
          <CardTitle>Horários de Maior Movimento</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
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

      {/* Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Desempenho dos Profissionais */}
        <Card className="shadow-professional">
          <CardHeader>
            <CardTitle>Ranking de Profissionais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {professionalsPerformance.map((prof, index) => (
                <div key={prof.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{prof.name}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{prof.bookings} agendamentos</span>
                        <span>{prof.rating} ⭐</span>
                        <span>{prof.efficiency}% eficiência</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">R$ {prof.revenue.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Faturamento</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ranking de Serviços */}
        <Card className="shadow-professional">
          <CardHeader>
            <CardTitle>Serviços Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {servicesRanking.map((service, index) => (
                <div key={service.service} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{service.service}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{service.bookings} vendas</span>
                        <span>R$ {service.avgPrice} (médio)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">R$ {service.revenue.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Faturamento</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card className="shadow-professional">
        <CardHeader>
          <CardTitle>Exportar Relatórios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" onClick={() => exportReport('financeiro')}>
              <Download className="h-4 w-4 mr-2" />
              Relatório Financeiro
            </Button>
            <Button variant="outline" onClick={() => exportReport('agendamentos')}>
              <Download className="h-4 w-4 mr-2" />
              Relatório de Agendamentos
            </Button>
            <Button variant="outline" onClick={() => exportReport('clientes')}>
              <Download className="h-4 w-4 mr-2" />
              Relatório de Clientes
            </Button>
            <Button variant="outline" onClick={() => exportReport('profissionais')}>
              <Download className="h-4 w-4 mr-2" />
              Desempenho da Equipe
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsView;
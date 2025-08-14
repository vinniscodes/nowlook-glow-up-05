import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  Building2, 
  AlertTriangle, 
  TrendingUp, 
  Activity,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { mockPlatformMetrics, mockAdminAlerts } from '@/data/adminMockData';
import { PlatformMetrics, AdminAlert } from '@/types/admin';

interface AdminDashboardProps {
  onNavigate: (section: string) => void;
}

const AdminDashboard = ({ onNavigate }: AdminDashboardProps) => {
  const [metrics, setMetrics] = useState<PlatformMetrics>(mockPlatformMetrics);
  const [alerts, setAlerts] = useState<AdminAlert[]>(mockAdminAlerts);

  useEffect(() => {
    // Simular carregamento de dados em tempo real
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        usersToday: prev.usersToday + Math.floor(Math.random() * 2),
        bookingsToday: prev.bookingsToday + Math.floor(Math.random() * 3),
        transactionVolumeToday: prev.transactionVolumeToday + (Math.random() * 100)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getSeverityColor = (severity: AdminAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'error': return 'destructive';
      case 'warning': return 'default';
      case 'info': return 'secondary';
      default: return 'secondary';
    }
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Painel Administrativo</h1>
          <p className="text-muted-foreground mt-1">
            Centro de controle da plataforma NowLook
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-500 font-medium">Sistema Online</span>
        </div>
      </div>

      {/* Alertas Críticos */}
      {alerts.filter(alert => !alert.resolved && alert.severity === 'critical').length > 0 && (
        <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertTitle className="text-red-700 dark:text-red-300">Atenção Imediata Necessária</AlertTitle>
          <AlertDescription className="text-red-600 dark:text-red-400">
            Existem {alerts.filter(alert => !alert.resolved && alert.severity === 'critical').length} alertas críticos pendentes.
          </AlertDescription>
        </Alert>
      )}

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Usuários (Hoje)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.usersToday}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.usersThisWeek} esta semana
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume Transacionado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(metrics.transactionVolumeToday)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(metrics.transactionVolumeMonth)} este mês
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos (Hoje)</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{metrics.bookingsToday}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.bookingsMonth} este mês
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas Ativas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.companiesTotal}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.activeSubscriptions} com assinatura ativa
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status das Assinaturas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              Receita recorrente: {formatCurrency(metrics.activeSubscriptions * 99)}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinaturas Vencidas</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.expiredSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              Precisam de renovação
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canceladas</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.cancelledSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              Churn rate: {((metrics.cancelledSubscriptions / metrics.companiesTotal) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Ações Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-professional">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.filter(alert => !alert.resolved).slice(0, 5).map((alert) => (
              <div key={alert.id} className="flex items-start justify-between p-3 border rounded-lg">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                    <span className="text-sm font-medium">{alert.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(alert.timestamp).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="flex gap-1 ml-2">
                  {alert.actionUrl && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onNavigate(alert.actionUrl!)}
                    >
                      Ver
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => resolveAlert(alert.id)}
                  >
                    Resolver
                  </Button>
                </div>
              </div>
            ))}
            {alerts.filter(alert => !alert.resolved).length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                Nenhum alerta pendente 🎉
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-professional">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => onNavigate('users')}
            >
              <Users className="h-4 w-4 mr-2" />
              Gerenciar Usuários
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => onNavigate('companies')}
            >
              <Building2 className="h-4 w-4 mr-2" />
              Gerenciar Empresas
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => onNavigate('support')}
            >
              <Clock className="h-4 w-4 mr-2" />
              Tickets de Suporte ({metrics.pendingTickets})
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => onNavigate('transactions')}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Relatório Financeiro
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => onNavigate('moderation')}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Moderação de Conteúdo
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Receita da Plataforma */}
      <Card className="shadow-professional">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Receita da Plataforma (NowLook)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Receita Total</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(metrics.totalRevenue)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Comissões</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(metrics.platformCommission)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Assinaturas</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(metrics.activeSubscriptions * 99)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
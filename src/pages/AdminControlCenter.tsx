import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUserRole } from '@/hooks/useUserHelpers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Users, 
  Building2, 
  MessageSquare, 
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Settings
} from 'lucide-react';
import SiteHeader from '@/components/layout/SiteHeader';
import AdminPanel from '@/components/admin/AdminPanel';

const AdminControlCenter = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userRole = getUserRole(user);

  useEffect(() => {
    document.title = "Central de Controle | NowLook";
    
    if (!user || userRole !== 'admin') {
      navigate('/');
    }
  }, [user, userRole, navigate]);

  if (!user || userRole !== 'admin') {
    return null;
  }

  const supportMetrics = [
    {
      title: "Tickets Abertos",
      value: "12",
      change: "+3",
      trend: "up",
      icon: <MessageSquare className="h-5 w-5" />,
      color: "text-orange-500"
    },
    {
      title: "Tickets Resolvidos",
      value: "89",
      change: "+15",
      trend: "up", 
      icon: <CheckCircle className="h-5 w-5" />,
      color: "text-green-500"
    },
    {
      title: "Tempo Médio",
      value: "2.3h",
      change: "-0.5h",
      trend: "down",
      icon: <Clock className="h-5 w-5" />,
      color: "text-blue-500"
    },
    {
      title: "Satisfação",
      value: "98%",
      change: "+2%",
      trend: "up",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-purple-500"
    }
  ];

  const managementTools = [
    {
      title: "Gestão de Usuários",
      description: "Gerenciar perfis, permissões e atividades dos usuários",
      icon: <Users className="h-6 w-6" />,
      action: "Gerenciar Usuários",
      count: "1,234 usuários ativos"
    },
    {
      title: "Gestão de Empresas", 
      description: "Monitorar estabelecimentos, aprovações e conformidade",
      icon: <Building2 className="h-6 w-6" />,
      action: "Gerenciar Empresas",
      count: "89 empresas ativas"
    },
    {
      title: "Relatórios Financeiros",
      description: "Acompanhar receitas, comissões e pagamentos",
      icon: <DollarSign className="h-6 w-6" />,
      action: "Ver Relatórios",
      count: "R$ 45.230 este mês"
    },
    {
      title: "Configurações do Sistema",
      description: "Ajustar parâmetros, integrações e políticas",
      icon: <Settings className="h-6 w-6" />,
      action: "Configurar",
      count: "Última atualização: hoje"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      
      <main className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg gradient-primary text-white">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Central de Controle NowLook</h1>
              <p className="text-muted-foreground">Painel administrativo completo</p>
            </div>
          </div>
          <Badge variant="secondary" className="glass">
            <Activity className="h-4 w-4 mr-2" />
            Sistema Operacional
          </Badge>
        </div>

        {/* Suporte Ativo */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <h2 className="text-2xl font-semibold">Suporte Ativo</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {supportMetrics.map((metric, index) => (
              <Card key={index} className="glass border-0 shadow-professional">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className={metric.color}>
                      {metric.icon}
                    </div>
                    <Badge 
                      variant={metric.trend === 'up' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {metric.change}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold mb-1">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.title}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="glass border-0 shadow-professional">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Tickets Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <div className="font-medium">Problema com agendamento</div>
                    <div className="text-sm text-muted-foreground">Cliente: Maria Silva • Há 15 min</div>
                  </div>
                  <Badge variant="destructive">Urgente</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <div className="font-medium">Dúvida sobre pagamento</div>
                    <div className="text-sm text-muted-foreground">Empresa: Salão Elegance • Há 1h</div>
                  </div>
                  <Badge variant="default">Normal</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <div className="font-medium">Solicitação de cadastro</div>
                    <div className="text-sm text-muted-foreground">Empresa: Barbearia Premium • Há 2h</div>
                  </div>
                  <Badge variant="secondary">Baixa</Badge>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">
                Ver Todos os Tickets
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Ferramentas de Gestão */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Settings className="h-5 w-5 text-blue-500" />
            <h2 className="text-2xl font-semibold">Ferramentas de Gestão</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {managementTools.map((tool, index) => (
              <Card key={index} className="glass border-0 shadow-professional hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg gradient-primary text-white">
                      {tool.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{tool.count}</span>
                    <Button variant="outline" size="sm">
                      {tool.action}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Painel Administrativo Completo */}
          <Card className="glass border-0 shadow-professional">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Painel Administrativo Completo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <AdminPanel />
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default AdminControlCenter;
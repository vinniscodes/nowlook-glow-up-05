import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Building2, 
  Eye, 
  Calendar,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MapPin,
  Phone,
  Mail,
  Gift
} from 'lucide-react';
import { mockCompanies } from '@/data/mockData';
import { mockAdminUsers } from '@/data/adminMockData';
import { Company } from '@/types';
import { AdminUser } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState(mockCompanies);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [extendDays, setExtendDays] = useState<number>(7);
  const [extendReason, setExtendReason] = useState<string>('');
  const { toast } = useToast();

  // Simular dados de assinatura para cada empresa
  const getSubscriptionData = (companyId: string) => {
    const subscriptionData = {
      '1': { status: 'active', plan: 'Premium', nextPayment: '2024-02-15', amount: 99.0 },
      '2': { status: 'expired', plan: 'Basic', nextPayment: '2024-01-10', amount: 49.0 },
      '3': { status: 'active', plan: 'Enterprise', nextPayment: '2024-02-20', amount: 199.0 }
    };
    return subscriptionData[companyId as keyof typeof subscriptionData] || 
           { status: 'none', plan: 'Sem plano', nextPayment: null, amount: 0 };
  };

  const filteredCompanies = companies.filter(company => {
    const subscription = getSubscriptionData(company.id);
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || subscription.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />Ativa
        </Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
          <XCircle className="h-3 w-3" />Expirada
        </Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800 flex items-center gap-1">
          <XCircle className="h-3 w-3" />Cancelada
        </Badge>;
      default:
        return <Badge variant="secondary">Sem assinatura</Badge>;
    }
  };

  const handleExtendSubscription = (company: Company) => {
    if (!extendReason.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe o motivo da extensão",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Assinatura estendida",
      description: `Assinatura de ${company.name} estendida por ${extendDays} dias. Motivo: ${extendReason}`,
    });

    setExtendReason('');
    setExtendDays(7);
  };

  const handleActivateManually = (company: Company) => {
    toast({
      title: "Conta ativada manualmente",
      description: `${company.name} teve sua conta ativada manualmente. Stripe Connect verificado.`,
    });
  };

  const handleViewStripeData = (company: Company) => {
    toast({
      title: "Redirecionando para Stripe",
      description: `Abrindo dashboard do Stripe para ${company.name}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Gerenciamento de Estabelecimentos</h2>
          <p className="text-muted-foreground">Gerencie parceiros comerciais e suas assinaturas</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-sm">
            {filteredCompanies.length} estabelecimentos encontrados
          </Badge>
        </div>
      </div>

      {/* Filtros e Busca */}
      <Card className="shadow-professional">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar e Filtrar Estabelecimentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Buscar por nome, email ou endereço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status da assinatura" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Assinatura Ativa</SelectItem>
                <SelectItem value="expired">Expirada</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
                <SelectItem value="none">Sem assinatura</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Estabelecimentos */}
      <Card className="shadow-professional">
        <CardHeader>
          <CardTitle>Lista de Estabelecimentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estabelecimento</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Assinatura</TableHead>
                <TableHead>Verificação</TableHead>
                <TableHead>Serviços</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company) => {
                const subscription = getSubscriptionData(company.id);
                return (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{company.name}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {company.address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {company.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {company.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        {getStatusBadge(subscription.status)}
                        {subscription.status === 'active' && (
                          <div className="text-xs text-muted-foreground">
                            <div>Plano: {subscription.plan}</div>
                            <div>Próximo: {subscription.nextPayment}</div>
                            <div>R$ {subscription.amount}/mês</div>
                          </div>
                        )}
                        {subscription.status === 'expired' && (
                          <div className="text-xs text-red-600">
                            Venceu em: {subscription.nextPayment}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={company.verified ? 'default' : 'secondary'}>
                        {company.verified ? 'Verificado' : 'Pendente'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {company.services.length} serviços
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedCompany(company)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>{company.name} - Gestão Completa</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Informações da Empresa */}
                              <div>
                                <h4 className="font-semibold mb-3">Informações do Estabelecimento</h4>
                                <div className="space-y-2 text-sm">
                                  <p><strong>Nome:</strong> {company.name}</p>
                                  <p><strong>Email:</strong> {company.email}</p>
                                  <p><strong>Telefone:</strong> {company.phone}</p>
                                  <p><strong>Endereço:</strong> {company.address}</p>
                                  <p><strong>Verificado:</strong> {company.verified ? 'Sim' : 'Não'}</p>
                                  <p><strong>Serviços:</strong> {company.services.length}</p>
                                </div>

                                <h4 className="font-semibold mb-3 mt-4">Status da Assinatura</h4>
                                <div className="space-y-2 text-sm">
                                  <p><strong>Status:</strong> {getStatusBadge(subscription.status)}</p>
                                  <p><strong>Plano:</strong> {subscription.plan}</p>
                                  {subscription.nextPayment && (
                                    <p><strong>Próximo pagamento:</strong> {subscription.nextPayment}</p>
                                  )}
                                  <p><strong>Valor:</strong> R$ {subscription.amount}/mês</p>
                                </div>
                              </div>

                              {/* Ações de Suporte */}
                              <div>
                                <h4 className="font-semibold mb-3">Ações de Suporte</h4>
                                <div className="space-y-3">
                                  <Button 
                                    onClick={() => handleViewStripeData(company)}
                                    variant="outline" 
                                    className="w-full justify-start"
                                  >
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Ver dados no Stripe
                                  </Button>

                                  <Button 
                                    onClick={() => handleActivateManually(company)}
                                    variant="outline" 
                                    className="w-full justify-start"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Ativar manualmente
                                  </Button>

                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Estender assinatura:</label>
                                    <div className="flex gap-2">
                                      <Input
                                        type="number"
                                        value={extendDays}
                                        onChange={(e) => setExtendDays(Number(e.target.value))}
                                        className="w-20"
                                        min="1"
                                        max="365"
                                      />
                                      <span className="text-sm self-center">dias</span>
                                    </div>
                                    <Textarea
                                      placeholder="Motivo da extensão (obrigatório)"
                                      value={extendReason}
                                      onChange={(e) => setExtendReason(e.target.value)}
                                      className="min-h-20"
                                    />
                                    <Button 
                                      onClick={() => handleExtendSubscription(company)}
                                      className="w-full"
                                      disabled={!extendReason.trim()}
                                    >
                                      <Gift className="h-4 w-4 mr-2" />
                                      Estender assinatura
                                    </Button>
                                  </div>
                                </div>

                                <h4 className="font-semibold mb-3 mt-4">Status do Onboarding</h4>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    Conta criada
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    Stripe Connect configurado
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    {company.verified ? (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <Clock className="h-4 w-4 text-orange-500" />
                                    )}
                                    Verificação completada
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    {company.services.length > 0 ? (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <AlertTriangle className="h-4 w-4 text-red-500" />
                                    )}
                                    Serviços cadastrados
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Resumo das Assinaturas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-professional">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Assinaturas Ativas</p>
                <p className="text-2xl font-bold text-green-600">
                  {companies.filter(c => getSubscriptionData(c.id).status === 'active').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-professional">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiradas</p>
                <p className="text-2xl font-bold text-red-600">
                  {companies.filter(c => getSubscriptionData(c.id).status === 'expired').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-professional">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Receita Recorrente</p>
                <p className="text-2xl font-bold text-blue-600">
                  R$ {companies
                    .filter(c => getSubscriptionData(c.id).status === 'active')
                    .reduce((sum, c) => sum + getSubscriptionData(c.id).amount, 0)
                    .toFixed(2)}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-professional">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verificados</p>
                <p className="text-2xl font-bold text-purple-600">
                  {companies.filter(c => c.verified).length}
                </p>
              </div>
              <Building2 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyManagement;
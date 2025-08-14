import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserRole } from '@/hooks/useUserHelpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { MapPin, CreditCard, AlertCircle, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import SiteHeader from '@/components/layout/SiteHeader';
import { Service } from '@/types';

const CompanyRegistration = () => {
  const { user } = useAuth();
  const [companyData, setCompanyData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    description: ''
  });
  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState({
    name: '',
    price: '',
    duration: '',
    description: ''
  });

  const isSubscribed = getUserRole(user) === 'business';

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubscribed) {
      toast.error('Você precisa ter uma assinatura ativa para cadastrar sua empresa');
      return;
    }
    
    // Simular salvamento
    toast.success('Empresa cadastrada com sucesso!');
    console.log('Company data:', companyData, 'Services:', services);
  };

  const handleAddService = () => {
    if (!newService.name || !newService.price || !newService.duration) {
      toast.error('Preencha todos os campos do serviço');
      return;
    }

    const service: Service = {
      id: Date.now().toString(),
      name: newService.name,
      price: parseFloat(newService.price),
      duration: parseInt(newService.duration),
      description: newService.description
    };

    setServices([...services, service]);
    setNewService({ name: '', price: '', duration: '', description: '' });
    toast.success('Serviço adicionado!');
  };

  const handleRemoveService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
    toast.success('Serviço removido!');
  };

  const handleSubscription = () => {
    // Simular redirecionamento para pagamento da assinatura
    toast.info('Redirecionando para pagamento da assinatura...');
    window.open('https://checkout.stripe.com/pay/fake-subscription-link', '_blank');
  };

  if (!user || getUserRole(user) !== 'business') {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive">Acesso Negado</h1>
            <p className="text-muted-foreground mt-2">Você precisa ter uma conta profissional para acessar esta página.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Cadastro Profissional</h1>
            <p className="text-muted-foreground mt-2">Configure seu negócio na plataforma NowLook</p>
          </div>

          {/* Status do Plano */}
          <Card className="shadow-professional">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Plano Profissional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                       <span>Plano Profissional - R$ 29,99/mês</span>
                       <Badge variant="secondary">Requer Pagamento</Badge>
                     </div>
                     <div className="bg-background/50 p-4 rounded-lg">
                       <h4 className="font-semibold mb-2">Benefícios do plano profissional:</h4>
                       <ul className="text-sm space-y-1 text-muted-foreground">
                         <li>✓ Cadastro completo do negócio</li>
                         <li>✓ Gerenciamento de serviços</li>
                         <li>✓ Recebimento de reservas</li>
                         <li>✓ Dashboard com relatórios avançados</li>
                         <li>✓ Galeria de fotos (até 5 imagens)</li>
                         <li>✓ Gestão de múltiplos profissionais</li>
                         <li>✓ Sistema completo de gestão</li>
                         <li>✓ Gestão de clientes</li>
                         <li>✓ API personalizada</li>
                         <li>✓ Suporte dedicado da plataforma</li>
                       </ul>
                     </div>
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Formulário do Negócio */}
          <Card className="shadow-professional">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Informações do Negócio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCompanySubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome do Estabelecimento</Label>
                      <Input
                        id="name"
                        value={companyData.name}
                        onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                        placeholder="Ex: Salão Beleza & Estilo"
                        required
                      />
                    </div>
                  
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={companyData.phone}
                      onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Endereço Completo</Label>
                  <Input
                    id="address"
                    value={companyData.address}
                    onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                    placeholder="Rua, número, bairro, cidade - CEP"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email de Contato</Label>
                  <Input
                    id="email"
                    type="email"
                    value={companyData.email}
                    onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                    placeholder="contato@empresa.com"
                    required
                  />
                </div>

                  <div>
                    <Label htmlFor="description">Descrição do Negócio</Label>
                    <Textarea
                      id="description"
                      value={companyData.description}
                      onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
                      placeholder="Descreva seu negócio, especialidades, diferenciais..."
                      rows={3}
                    />
                  </div>
              </form>
            </CardContent>
          </Card>

          {/* Gerenciamento de Serviços */}
          <Card className="shadow-professional">
            <CardHeader>
              <CardTitle>Serviços Oferecidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Adicionar Novo Serviço */}
              <div className="bg-muted/30 p-4 rounded-lg space-y-4">
                <h4 className="font-semibold">Adicionar Novo Serviço</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Input
                    placeholder="Nome do serviço"
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Preço (R$)"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Duração (min)"
                    value={newService.duration}
                    onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                  />
                  <Button onClick={handleAddService} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
                <Input
                  placeholder="Descrição do serviço (opcional)"
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                />
              </div>

              <Separator />

              {/* Lista de Serviços */}
              <div className="space-y-3">
                <h4 className="font-semibold">Serviços Cadastrados ({services.length})</h4>
                {services.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhum serviço cadastrado ainda. Adicione seu primeiro serviço acima.
                  </p>
                ) : (
                  services.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                        <div className="flex gap-4 text-sm">
                          <span className="font-semibold text-primary">R$ {service.price.toFixed(2)}</span>
                          <span className="text-muted-foreground">{service.duration} min</span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRemoveService(service.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>

              <Button type="submit" onClick={handleCompanySubmit} className="w-full" variant="hero">
                Salvar Configurações do Negócio
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CompanyRegistration;
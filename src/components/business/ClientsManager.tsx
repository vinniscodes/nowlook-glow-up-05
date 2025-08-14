import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Search, Plus, Star, AlertTriangle, DollarSign, Calendar, Phone, Mail, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  lastVisit: string;
  noShows: number;
  averageRating: number;
  notes: string;
  preferences: string;
  status: 'regular' | 'vip' | 'problematic';
  registrationDate: string;
}

interface ClientHistory {
  id: string;
  clientId: string;
  service: string;
  professional: string;
  date: string;
  price: number;
  status: 'completed' | 'cancelled' | 'no-show';
  rating?: number;
  feedback?: string;
}

const ClientsManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientDetails, setShowClientDetails] = useState(false);

  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '(11) 99999-9999',
      totalBookings: 24,
      totalSpent: 1440,
      lastVisit: '2024-01-10',
      noShows: 1,
      averageRating: 4.8,
      notes: 'Cliente muito pontual, gosta de conversar sobre futebol',
      preferences: 'Corte baixo nas laterais, máquina 2. Não gosta de produtos com perfume.',
      status: 'vip',
      registrationDate: '2023-03-15'
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@email.com',
      phone: '(11) 88888-8888',
      totalBookings: 18,
      totalSpent: 1440,
      lastVisit: '2024-01-08',
      noShows: 0,
      averageRating: 4.9,
      notes: 'Sempre agenda com antecedência, muito educada',
      preferences: 'Prefere atendimento pela manhã, gosta de escova lisa',
      status: 'regular',
      registrationDate: '2023-06-20'
    },
    {
      id: '3',
      name: 'Carlos Oliveira',
      email: 'carlos@email.com',
      phone: '(11) 77777-7777',
      totalBookings: 12,
      totalSpent: 360,
      lastVisit: '2024-01-05',
      noShows: 4,
      averageRating: 3.2,
      notes: 'Histórico de faltas, confirmar agendamento sempre',
      preferences: 'Barba sempre bem aparada',
      status: 'problematic',
      registrationDate: '2023-09-10'
    },
    {
      id: '4',
      name: 'Ana Costa',
      email: 'ana@email.com',
      phone: '(11) 66666-6666',
      totalBookings: 31,
      totalSpent: 2480,
      lastVisit: '2024-01-12',
      noShows: 0,
      averageRating: 5.0,
      notes: 'Cliente VIP, sempre indica outros clientes',
      preferences: 'Adora experimentar novos tratamentos, tem cabelo ressecado',
      status: 'vip',
      registrationDate: '2022-11-05'
    }
  ]);

  const [clientHistory] = useState<ClientHistory[]>([
    {
      id: '1',
      clientId: '1',
      service: 'Corte + Barba',
      professional: 'João',
      date: '2024-01-10',
      price: 60,
      status: 'completed',
      rating: 5,
      feedback: 'Excelente como sempre!'
    },
    {
      id: '2',
      clientId: '1',
      service: 'Corte Masculino',
      professional: 'Pedro',
      date: '2023-12-20',
      price: 40,
      status: 'completed',
      rating: 4
    },
    {
      id: '3',
      clientId: '3',
      service: 'Barba',
      professional: 'João',
      date: '2024-01-05',
      price: 30,
      status: 'completed',
      rating: 3,
      feedback: 'Serviço ok, mas chegou atrasado'
    }
  ]);

  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    preferences: ''
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vip': return 'default';
      case 'regular': return 'secondary';
      case 'problematic': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'vip': return 'VIP';
      case 'regular': return 'Regular';
      case 'problematic': return 'Problemático';
      default: return status;
    }
  };

  const handleAddClient = () => {
    if (!newClient.name || !newClient.phone) {
      toast.error('Preencha pelo menos nome e telefone');
      return;
    }

    const client: Client = {
      id: Date.now().toString(),
      ...newClient,
      totalBookings: 0,
      totalSpent: 0,
      lastVisit: '',
      noShows: 0,
      averageRating: 0,
      status: 'regular',
      registrationDate: new Date().toISOString().split('T')[0]
    };

    setClients([...clients, client]);
    setNewClient({
      name: '',
      email: '',
      phone: '',
      notes: '',
      preferences: ''
    });
    setShowAddDialog(false);
    toast.success('Cliente adicionado com sucesso!');
  };

  const totalClients = clients.length;
  const vipClients = clients.filter(c => c.status === 'vip').length;
  const problematicClients = clients.filter(c => c.status === 'problematic').length;
  const totalRevenue = clients.reduce((sum, client) => sum + client.totalSpent, 0);

  const getClientHistory = (clientId: string) => {
    return clientHistory.filter(h => h.clientId === clientId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Base de Clientes</h2>
          <p className="text-muted-foreground">Gerencie seu relacionamento com os clientes</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Cliente</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={newClient.name}
                    onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                    placeholder="Nome do cliente"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="preferences">Preferências</Label>
                <Textarea
                  id="preferences"
                  value={newClient.preferences}
                  onChange={(e) => setNewClient({...newClient, preferences: e.target.value})}
                  placeholder="Preferências do cliente (cortes, produtos, horários...)"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={newClient.notes}
                  onChange={(e) => setNewClient({...newClient, notes: e.target.value})}
                  placeholder="Anotações sobre o cliente..."
                  rows={2}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddClient}>
                Adicionar Cliente
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">Base de clientes</p>
          </CardContent>
        </Card>

        <Card className="shadow-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes VIP</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vipClients}</div>
            <p className="text-xs text-muted-foreground">{((vipClients / totalClients) * 100).toFixed(1)}% do total</p>
          </CardContent>
        </Card>

        <Card className="shadow-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Problemáticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{problematicClients}</div>
            <p className="text-xs text-muted-foreground">{((problematicClients / totalClients) * 100).toFixed(1)}% do total</p>
          </CardContent>
        </Card>

        <Card className="shadow-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue}</div>
            <p className="text-xs text-muted-foreground">Receita dos clientes</p>
          </CardContent>
        </Card>
      </div>

      {/* Busca */}
      <Card className="shadow-professional">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar cliente por nome, email ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="shadow-professional cursor-pointer hover:shadow-xl transition-shadow" onClick={() => {
            setSelectedClient(client);
            setShowClientDetails(true);
          }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{client.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">Cliente desde {new Date(client.registrationDate).toLocaleDateString('pt-BR')}</p>
                </div>
                <Badge variant={getStatusColor(client.status)}>
                  {getStatusLabel(client.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contato */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{client.phone}</span>
                </div>
                {client.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{client.email}</span>
                  </div>
                )}
              </div>

              {/* Estatísticas */}
              <div className="bg-muted/30 p-3 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Agendamentos:</span>
                  <span className="font-semibold">{client.totalBookings}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Gasto Total:</span>
                  <span className="font-semibold">R$ {client.totalSpent}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">No-Shows:</span>
                  <span className={`font-semibold ${client.noShows > 2 ? 'text-destructive' : ''}`}>
                    {client.noShows}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Última Visita:</span>
                  <span className="font-semibold">
                    {client.lastVisit ? new Date(client.lastVisit).toLocaleDateString('pt-BR') : 'Nunca'}
                  </span>
                </div>
              </div>

              {/* Avaliação */}
              {client.averageRating > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avaliação Média:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{client.averageRating.toFixed(1)}</span>
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog de Detalhes do Cliente */}
      <Dialog open={showClientDetails} onOpenChange={setShowClientDetails}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedClient && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl">{selectedClient.name}</DialogTitle>
                  <Badge variant={getStatusColor(selectedClient.status)}>
                    {getStatusLabel(selectedClient.status)}
                  </Badge>
                </div>
              </DialogHeader>
              
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">Informações</TabsTrigger>
                  <TabsTrigger value="history">Histórico</TabsTrigger>
                  <TabsTrigger value="notes">Anotações</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Telefone</Label>
                      <p>{selectedClient.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p>{selectedClient.email || 'Não informado'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Total de Agendamentos</Label>
                      <p>{selectedClient.totalBookings}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Gasto Total</Label>
                      <p>R$ {selectedClient.totalSpent}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">No-Shows</Label>
                      <p className={selectedClient.noShows > 2 ? 'text-destructive font-semibold' : ''}>
                        {selectedClient.noShows}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Última Visita</Label>
                      <p>{selectedClient.lastVisit ? new Date(selectedClient.lastVisit).toLocaleDateString('pt-BR') : 'Nunca'}</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="history" className="space-y-4">
                  <div className="space-y-3">
                    {getClientHistory(selectedClient.id).map((history) => (
                      <div key={history.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{history.service}</p>
                            <p className="text-sm text-muted-foreground">
                              Profissional: {history.professional}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(history.date).toLocaleDateString('pt-BR')}
                            </p>
                            {history.feedback && (
                              <p className="text-sm mt-2 italic">"{history.feedback}"</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">R$ {history.price}</p>
                            {history.rating && (
                              <div className="flex items-center gap-1">
                                <span className="text-sm">{history.rating}</span>
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              </div>
                            )}
                            <Badge variant={
                              history.status === 'completed' ? 'default' :
                              history.status === 'cancelled' ? 'secondary' : 'destructive'
                            }>
                              {history.status === 'completed' ? 'Concluído' :
                               history.status === 'cancelled' ? 'Cancelado' : 'Não Compareceu'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="notes" className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Preferências</Label>
                    <p className="mt-1 p-3 bg-muted/30 rounded-lg text-sm">
                      {selectedClient.preferences || 'Nenhuma preferência cadastrada'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Observações</Label>
                    <p className="mt-1 p-3 bg-muted/30 rounded-lg text-sm">
                      {selectedClient.notes || 'Nenhuma observação cadastrada'}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientsManager;
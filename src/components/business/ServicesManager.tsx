import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Scissors, Plus, Edit, Trash2, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // em minutos
  category: string;
  isActive: boolean;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
}

const ServicesManager = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Corte Masculino',
      description: 'Corte moderno masculino com acabamento à máquina',
      price: 40,
      duration: 30,
      category: 'Cabelo',
      isActive: true,
      totalBookings: 145,
      totalRevenue: 5800,
      averageRating: 4.8
    },
    {
      id: '2',
      name: 'Barba',
      description: 'Aparar e modelar barba com navalha',
      price: 30,
      duration: 30,
      category: 'Barba',
      isActive: true,
      totalBookings: 98,
      totalRevenue: 2940,
      averageRating: 4.9
    },
    {
      id: '3',
      name: 'Corte + Barba',
      description: 'Combo completo de corte e barba',
      price: 60,
      duration: 45,
      category: 'Combo',
      isActive: true,
      totalBookings: 87,
      totalRevenue: 5220,
      averageRating: 4.7
    },
    {
      id: '4',
      name: 'Corte Feminino',
      description: 'Corte feminino com lavagem e finalização',
      price: 80,
      duration: 60,
      category: 'Cabelo',
      isActive: true,
      totalBookings: 67,
      totalRevenue: 5360,
      averageRating: 4.6
    },
    {
      id: '5',
      name: 'Sobrancelha',
      description: 'Design e modelagem de sobrancelha',
      price: 20,
      duration: 20,
      category: 'Estética',
      isActive: true,
      totalBookings: 124,
      totalRevenue: 2480,
      averageRating: 4.5
    },
    {
      id: '6',
      name: 'Tratamento Capilar',
      description: 'Hidratação e tratamento para cabelos danificados',
      price: 120,
      duration: 90,
      category: 'Tratamento',
      isActive: false,
      totalBookings: 23,
      totalRevenue: 2760,
      averageRating: 4.9
    }
  ]);

  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: 0,
    duration: 30,
    category: ''
  });

  const categories = ['Cabelo', 'Barba', 'Combo', 'Estética', 'Tratamento', 'Outros'];

  const handleAddService = () => {
    if (!newService.name || !newService.category || newService.price <= 0) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const service: Service = {
      id: Date.now().toString(),
      ...newService,
      isActive: true,
      totalBookings: 0,
      totalRevenue: 0,
      averageRating: 0
    };

    setServices([...services, service]);
    setNewService({
      name: '',
      description: '',
      price: 0,
      duration: 30,
      category: ''
    });
    setShowAddDialog(false);
    toast.success('Serviço adicionado com sucesso!');
  };

  const toggleServiceStatus = (id: string) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, isActive: !service.isActive } : service
    ));
    toast.success('Status do serviço atualizado!');
  };

  const deleteService = (id: string) => {
    setServices(services.filter(service => service.id !== id));
    toast.success('Serviço removido!');
  };

  const getCategoryColor = (category: string): "default" | "secondary" | "destructive" | "outline" => {
    const colors: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      'Cabelo': 'default',
      'Barba': 'secondary',
      'Combo': 'outline',
      'Estética': 'destructive',
      'Tratamento': 'default',
      'Outros': 'secondary'
    };
    return colors[category] || 'default';
  };

  const totalRevenue = services.reduce((sum, service) => sum + service.totalRevenue, 0);
  const totalBookings = services.reduce((sum, service) => sum + service.totalBookings, 0);
  const activeServices = services.filter(s => s.isActive).length;
  const averagePrice = services.length > 0 ? services.reduce((sum, s) => sum + s.price, 0) / services.length : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Serviços</h2>
          <p className="text-muted-foreground">Gerencie os serviços oferecidos pelo seu estabelecimento</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Serviço
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Serviço</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="name">Nome do Serviço *</Label>
                <Input
                  id="name"
                  value={newService.name}
                  onChange={(e) => setNewService({...newService, name: e.target.value})}
                  placeholder="Ex: Corte Masculino Moderno"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newService.description}
                  onChange={(e) => setNewService({...newService, description: e.target.value})}
                  placeholder="Descreva o serviço detalhadamente..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Preço (R$) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newService.price || ''}
                    onChange={(e) => setNewService({...newService, price: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duração (min) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newService.duration}
                    onChange={(e) => setNewService({...newService, duration: parseInt(e.target.value) || 30})}
                    min="5"
                    step="5"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria *</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newService.category}
                    onChange={(e) => setNewService({...newService, category: e.target.value})}
                  >
                    <option value="">Selecione...</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddService}>
                Adicionar Serviço
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Serviços Ativos</CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeServices}</div>
            <p className="text-xs text-muted-foreground">de {services.length} total</p>
          </CardContent>
        </Card>

        <Card className="shadow-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos Totais</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card className="shadow-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue}</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card className="shadow-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preço Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {averagePrice.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Por serviço</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Serviços */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="shadow-professional">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={getCategoryColor(service.category)}>
                      {service.category}
                    </Badge>
                    <Badge variant={service.isActive ? 'default' : 'secondary'}>
                      {service.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Descrição */}
              {service.description && (
                <p className="text-sm text-muted-foreground">{service.description}</p>
              )}

              {/* Preço e Duração */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-lg font-bold text-primary">R$ {service.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{service.duration} min</span>
                </div>
              </div>

              {/* Estatísticas */}
              <div className="bg-muted/30 p-3 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Agendamentos:</span>
                  <span className="font-semibold">{service.totalBookings}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Faturamento:</span>
                  <span className="font-semibold">R$ {service.totalRevenue}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avaliação:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{service.averageRating.toFixed(1)}</span>
                    <span className="text-yellow-500">★</span>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEditingService(service)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleServiceStatus(service.id)}
                >
                  {service.isActive ? 'Desativar' : 'Ativar'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => deleteService(service.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ranking de Serviços */}
      <Card className="shadow-professional">
        <CardHeader>
          <CardTitle>Ranking de Serviços</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {services
              .sort((a, b) => b.totalRevenue - a.totalRevenue)
              .slice(0, 5)
              .map((service, index) => (
                <div key={service.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div>
                      <span className="font-medium">{service.name}</span>
                      <div className="text-sm text-muted-foreground">
                        {service.totalBookings} agendamentos
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">R$ {service.totalRevenue}</div>
                    <div className="text-sm text-muted-foreground">
                      {service.averageRating.toFixed(1)} ★
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesManager;
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus, Edit, Trash2, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  services: string[];
  workDays: string[];
  startTime: string;
  endTime: string;
  commission: number;
  isActive: boolean;
  totalBookings: number;
  totalRevenue: number;
}

const ProfessionalsManager = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);

  const [professionals, setProfessionals] = useState<Professional[]>([
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '(11) 99999-9999',
      role: 'Barbeiro Sênior',
      services: ['Corte Masculino', 'Barba', 'Corte + Barba'],
      workDays: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
      startTime: '08:00',
      endTime: '18:00',
      commission: 60,
      isActive: true,
      totalBookings: 145,
      totalRevenue: 8700
    },
    {
      id: '2',
      name: 'Ana Costa',
      email: 'ana@email.com',
      phone: '(11) 88888-8888',
      role: 'Cabeleireira',
      services: ['Corte Feminino', 'Escova', 'Coloração'],
      workDays: ['Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      startTime: '09:00',
      endTime: '19:00',
      commission: 55,
      isActive: true,
      totalBookings: 98,
      totalRevenue: 7840
    },
    {
      id: '3',
      name: 'Pedro Santos',
      email: 'pedro@email.com',
      phone: '(11) 77777-7777',
      role: 'Barbeiro Júnior',
      services: ['Corte Masculino', 'Barba'],
      workDays: ['Segunda', 'Quarta', 'Sexta', 'Sábado'],
      startTime: '10:00',
      endTime: '20:00',
      commission: 50,
      isActive: true,
      totalBookings: 87,
      totalRevenue: 4350
    }
  ]);

  const [newProfessional, setNewProfessional] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    services: [] as string[],
    workDays: [] as string[],
    startTime: '08:00',
    endTime: '18:00',
    commission: 50
  });

  const availableServices = [
    'Corte Masculino',
    'Corte Feminino',
    'Barba',
    'Corte + Barba',
    'Escova',
    'Coloração',
    'Sobrancelha',
    'Tratamento Capilar'
  ];

  const weekDays = [
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
    'Domingo'
  ];

  const handleAddProfessional = () => {
    if (!newProfessional.name || !newProfessional.email || !newProfessional.role) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const professional: Professional = {
      id: Date.now().toString(),
      ...newProfessional,
      isActive: true,
      totalBookings: 0,
      totalRevenue: 0
    };

    setProfessionals([...professionals, professional]);
    setNewProfessional({
      name: '',
      email: '',
      phone: '',
      role: '',
      services: [],
      workDays: [],
      startTime: '08:00',
      endTime: '18:00',
      commission: 50
    });
    setShowAddDialog(false);
    toast.success('Profissional adicionado com sucesso!');
  };

  const handleServiceToggle = (service: string) => {
    setNewProfessional(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleWorkDayToggle = (day: string) => {
    setNewProfessional(prev => ({
      ...prev,
      workDays: prev.workDays.includes(day)
        ? prev.workDays.filter(d => d !== day)
        : [...prev.workDays, day]
    }));
  };

  const toggleProfessionalStatus = (id: string) => {
    setProfessionals(professionals.map(prof => 
      prof.id === id ? { ...prof, isActive: !prof.isActive } : prof
    ));
    toast.success('Status atualizado!');
  };

  const deleteProfessional = (id: string) => {
    setProfessionals(professionals.filter(prof => prof.id !== id));
    toast.success('Profissional removido!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestão da Equipe</h2>
          <p className="text-muted-foreground">Gerencie sua equipe de profissionais</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Profissional
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Profissional</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <h4 className="font-semibold">Informações Básicas</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      value={newProfessional.name}
                      onChange={(e) => setNewProfessional({...newProfessional, name: e.target.value})}
                      placeholder="Nome do profissional"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Cargo/Função *</Label>
                    <Input
                      id="role"
                      value={newProfessional.role}
                      onChange={(e) => setNewProfessional({...newProfessional, role: e.target.value})}
                      placeholder="Ex: Barbeiro Sênior"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newProfessional.email}
                      onChange={(e) => setNewProfessional({...newProfessional, email: e.target.value})}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={newProfessional.phone}
                      onChange={(e) => setNewProfessional({...newProfessional, phone: e.target.value})}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
              </div>

              {/* Serviços que Realiza */}
              <div className="space-y-4">
                <h4 className="font-semibold">Serviços que Realiza</h4>
                <div className="grid grid-cols-2 gap-2">
                  {availableServices.map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                      <Checkbox
                        id={service}
                        checked={newProfessional.services.includes(service)}
                        onCheckedChange={() => handleServiceToggle(service)}
                      />
                      <Label htmlFor={service} className="text-sm">
                        {service}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Horário de Trabalho */}
              <div className="space-y-4">
                <h4 className="font-semibold">Horário de Trabalho</h4>
                <div className="space-y-3">
                  <div>
                    <Label>Dias da Semana</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {weekDays.map((day) => (
                        <div key={day} className="flex items-center space-x-2">
                          <Checkbox
                            id={day}
                            checked={newProfessional.workDays.includes(day)}
                            onCheckedChange={() => handleWorkDayToggle(day)}
                          />
                          <Label htmlFor={day} className="text-sm">
                            {day}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="startTime">Início</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={newProfessional.startTime}
                        onChange={(e) => setNewProfessional({...newProfessional, startTime: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">Fim</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={newProfessional.endTime}
                        onChange={(e) => setNewProfessional({...newProfessional, endTime: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="commission">Comissão (%)</Label>
                      <Input
                        id="commission"
                        type="number"
                        value={newProfessional.commission}
                        onChange={(e) => setNewProfessional({...newProfessional, commission: parseInt(e.target.value)})}
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddProfessional}>
                Adicionar Profissional
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Profissionais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {professionals.map((professional) => (
          <Card key={professional.id} className="shadow-professional">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{professional.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{professional.role}</p>
                </div>
                <Badge variant={professional.isActive ? 'default' : 'secondary'}>
                  {professional.isActive ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Informações de Contato */}
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Email:</span> {professional.email}
                </div>
                {professional.phone && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Telefone:</span> {professional.phone}
                  </div>
                )}
              </div>

              {/* Serviços */}
              <div>
                <Label className="text-sm text-muted-foreground">Serviços:</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {professional.services.map((service) => (
                    <Badge key={service} variant="outline" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Horário */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{professional.startTime} - {professional.endTime}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {professional.workDays.join(', ')}
                </div>
              </div>

              {/* Estatísticas */}
              <div className="bg-muted/30 p-3 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Agendamentos:</span>
                  <span className="font-semibold">{professional.totalBookings}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Faturamento:</span>
                  <span className="font-semibold">R$ {professional.totalRevenue}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Comissão:</span>
                  <span className="font-semibold">{professional.commission}%</span>
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEditingProfessional(professional)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleProfessionalStatus(professional.id)}
                >
                  {professional.isActive ? 'Desativar' : 'Ativar'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => deleteProfessional(professional.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estatísticas da Equipe */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-professional">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Total de Profissionais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{professionals.length}</div>
            <p className="text-sm text-muted-foreground">
              {professionals.filter(p => p.isActive).length} ativos
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-professional">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Agendamentos Totais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {professionals.reduce((sum, prof) => sum + prof.totalBookings, 0)}
            </div>
            <p className="text-sm text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card className="shadow-professional">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Faturamento Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {professionals.reduce((sum, prof) => sum + prof.totalRevenue, 0)}
            </div>
            <p className="text-sm text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfessionalsManager;
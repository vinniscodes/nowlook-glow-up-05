import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Plus, Clock, User, Edit, Trash2, Ban, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  service: string;
  professional: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
}

const CalendarView = () => {
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Mock data para demonstração
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      clientName: 'João Silva',
      clientPhone: '(11) 99999-9999',
      service: 'Corte + Barba',
      professional: 'Pedro',
      date: '2024-01-15',
      time: '09:00',
      duration: 45,
      price: 60,
      status: 'confirmed',
      notes: 'Cliente novo, gosta de corte baixo'
    },
    {
      id: '2',
      clientName: 'Maria Santos',
      clientPhone: '(11) 88888-8888',
      service: 'Corte Feminino',
      professional: 'Ana',
      date: '2024-01-15',
      time: '10:30',
      duration: 60,
      price: 80,
      status: 'confirmed'
    },
    {
      id: '3',
      clientName: 'Carlos Oliveira',
      clientPhone: '(11) 77777-7777',
      service: 'Barba',
      professional: 'João',
      date: '2024-01-15',
      time: '14:00',
      duration: 30,
      price: 30,
      status: 'completed'
    }
  ]);

  const [newAppointment, setNewAppointment] = useState({
    clientName: '',
    clientPhone: '',
    service: '',
    professional: '',
    date: '',
    time: '',
    notes: ''
  });

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ];

  const services = [
    { name: 'Corte Masculino', duration: 30, price: 40 },
    { name: 'Barba', duration: 30, price: 30 },
    { name: 'Corte + Barba', duration: 45, price: 60 },
    { name: 'Corte Feminino', duration: 60, price: 80 },
    { name: 'Sobrancelha', duration: 20, price: 20 }
  ];

  const professionals = ['João', 'Pedro', 'Ana', 'Carlos'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'no-show': return 'outline';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      case 'no-show': return 'Não Compareceu';
      default: return status;
    }
  };

  const handleAddAppointment = () => {
    if (!newAppointment.clientName || !newAppointment.service || !newAppointment.professional || !newAppointment.date || !newAppointment.time) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const selectedService = services.find(s => s.name === newAppointment.service);
    const appointment: Appointment = {
      id: Date.now().toString(),
      ...newAppointment,
      duration: selectedService?.duration || 30,
      price: selectedService?.price || 0,
      status: 'confirmed'
    };

    setAppointments([...appointments, appointment]);
    setNewAppointment({
      clientName: '',
      clientPhone: '',
      service: '',
      professional: '',
      date: '',
      time: '',
      notes: ''
    });
    setShowAddDialog(false);
    toast.success('Agendamento criado com sucesso!');
  };

  const updateAppointmentStatus = (id: string, newStatus: Appointment['status']) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: newStatus } : apt
    ));
    toast.success('Status atualizado!');
  };

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter(apt => apt.id !== id));
    toast.success('Agendamento removido!');
  };

  const todayAppointments = appointments.filter(apt => apt.date === '2024-01-15');

  return (
    <div className="space-y-6">
      {/* Controles do Calendário */}
      <Card className="shadow-professional">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Agenda - {selectedDate.toLocaleDateString('pt-BR')}
            </CardTitle>
            <div className="flex gap-2">
              <div className="flex gap-1">
                <Button 
                  variant={view === 'day' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setView('day')}
                >
                  Dia
                </Button>
                <Button 
                  variant={view === 'week' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setView('week')}
                >
                  Semana
                </Button>
                <Button 
                  variant={view === 'month' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setView('month')}
                >
                  Mês
                </Button>
              </div>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button variant="hero">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Agendamento
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Adicionar Agendamento</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="clientName">Nome do Cliente *</Label>
                        <Input
                          id="clientName"
                          value={newAppointment.clientName}
                          onChange={(e) => setNewAppointment({...newAppointment, clientName: e.target.value})}
                          placeholder="Nome completo"
                        />
                      </div>
                      <div>
                        <Label htmlFor="clientPhone">Telefone</Label>
                        <Input
                          id="clientPhone"
                          value={newAppointment.clientPhone}
                          onChange={(e) => setNewAppointment({...newAppointment, clientPhone: e.target.value})}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="service">Serviço *</Label>
                        <Select onValueChange={(value) => setNewAppointment({...newAppointment, service: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o serviço" />
                          </SelectTrigger>
                          <SelectContent>
                            {services.map((service) => (
                              <SelectItem key={service.name} value={service.name}>
                                {service.name} - {service.duration}min - R$ {service.price}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="professional">Profissional *</Label>
                        <Select onValueChange={(value) => setNewAppointment({...newAppointment, professional: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o profissional" />
                          </SelectTrigger>
                          <SelectContent>
                            {professionals.map((prof) => (
                              <SelectItem key={prof} value={prof}>
                                {prof}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">Data *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newAppointment.date}
                          onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="time">Horário *</Label>
                        <Select onValueChange={(value) => setNewAppointment({...newAppointment, time: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o horário" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="notes">Observações</Label>
                      <Textarea
                        id="notes"
                        value={newAppointment.notes}
                        onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                        placeholder="Anotações sobre o cliente ou serviço..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddAppointment}>
                      Adicionar Agendamento
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Vista do Dia */}
      {view === 'day' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline do Dia */}
          <div className="lg:col-span-2">
            <Card className="shadow-professional">
              <CardHeader>
                <CardTitle>Agenda do Dia - 15 de Janeiro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {timeSlots.map((time) => {
                    const appointment = todayAppointments.find(apt => apt.time === time);
                    return (
                      <div key={time} className="flex items-center gap-4 p-2 border-b border-muted">
                        <div className="w-16 text-sm text-muted-foreground font-mono">{time}</div>
                        {appointment ? (
                          <div className="flex-1 flex items-center justify-between bg-muted/30 p-3 rounded-lg">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span className="font-medium">{appointment.clientName}</span>
                                <Badge variant={getStatusColor(appointment.status)}>
                                  {getStatusLabel(appointment.status)}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {appointment.service} - {appointment.professional} - {appointment.duration}min
                              </div>
                              <div className="text-sm font-semibold text-primary">
                                R$ {appointment.price}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              {appointment.status === 'confirmed' && (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => updateAppointmentStatus(appointment.id, 'no-show')}
                                  >
                                    <Ban className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedAppointment(appointment)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => deleteAppointment(appointment.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 text-muted-foreground text-sm">Livre</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumo do Dia */}
          <div className="space-y-4">
            <Card className="shadow-professional">
              <CardHeader>
                <CardTitle>Resumo do Dia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total de Agendamentos:</span>
                  <span className="font-semibold">{todayAppointments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Confirmados:</span>
                  <span className="font-semibold">{todayAppointments.filter(a => a.status === 'confirmed').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Concluídos:</span>
                  <span className="font-semibold">{todayAppointments.filter(a => a.status === 'completed').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Faturamento Previsto:</span>
                  <span className="font-semibold">R$ {todayAppointments.reduce((sum, apt) => sum + apt.price, 0)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-professional">
              <CardHeader>
                <CardTitle>Próximos Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayAppointments
                    .filter(apt => apt.status === 'confirmed')
                    .slice(0, 3)
                    .map((apt) => (
                      <div key={apt.id} className="p-3 bg-muted/30 rounded-lg">
                        <div className="font-medium">{apt.clientName}</div>
                        <div className="text-sm text-muted-foreground">{apt.time} - {apt.service}</div>
                        {apt.clientPhone && (
                          <div className="text-xs text-muted-foreground">{apt.clientPhone}</div>
                        )}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Vista da Semana e Mês (simplificadas para demo) */}
      {view === 'week' && (
        <Card className="shadow-professional">
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Vista Semanal</h3>
            <p className="text-muted-foreground">Vista semanal em desenvolvimento</p>
          </CardContent>
        </Card>
      )}

      {view === 'month' && (
        <Card className="shadow-professional">
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Vista Mensal</h3>
            <p className="text-muted-foreground">Vista mensal em desenvolvimento</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalendarView;
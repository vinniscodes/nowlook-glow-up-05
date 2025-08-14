import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getUserName } from '@/hooks/useUserHelpers';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CalendarIcon, MapPin, Clock, CreditCard, Banknote, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import SiteHeader from '@/components/layout/SiteHeader';
import MapboxMap from '@/components/map/MapboxMap';
import { mockCompanies, mockServices } from '@/data/mockData';
import { Company, Service, Booking } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const Agendar = () => {
  const { user } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'cash'>('card');
  const [showMap, setShowMap] = useState(false);

  // Horários disponíveis (mockado)
  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const handleBooking = () => {
    if (!user) {
      toast.error('Você precisa estar logado para fazer uma reserva');
      return;
    }

    if (!selectedCompany || !selectedService || !selectedDate || !selectedTime) {
      toast.error('Preencha todos os campos para continuar');
      return;
    }

    // Simular processo de agendamento
    const booking: Booking = {
      id: Date.now().toString(),
      clientId: user.id,
      clientName: getUserName(user),
      companyId: selectedCompany.id,
      companyName: selectedCompany.name,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      price: selectedService.price,
      paymentMethod,
      paymentStatus: 'pending',
      status: 'confirmed'
    };

    if (paymentMethod === 'card') {
      // Simular redirecionamento para Stripe
      toast.info('Redirecionando para pagamento...');
      window.open('https://checkout.stripe.com/pay/fake-payment-link', '_blank');
    } else if (paymentMethod === 'pix') {
      // Simular geração de QR Code PIX
      toast.success('QR Code PIX gerado! Você tem 15 minutos para pagar.');
    } else {
      // Pagamento em dinheiro
      toast.success('Agendamento confirmado! Pagamento será feito no local.');
    }

    console.log('Booking created:', booking);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container py-16 text-center">
          <h1 className="text-2xl font-bold">Faça login para agendar</h1>
          <p className="text-muted-foreground mt-2">Você precisa estar logado para fazer reservas.</p>
          <Button asChild variant="hero" className="mt-4">
            <a href="/login">Fazer Login</a>
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">Agendar Serviço</h1>
          <p className="text-muted-foreground mt-2">Escolha uma empresa, serviço e horário</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário de Agendamento */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selecionar Empresa */}
            <Card className="shadow-professional">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>1. Escolha a Empresa</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowMap(!showMap)}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    {showMap ? 'Esconder' : 'Ver no'} Mapa
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {mockCompanies.map((company) => (
                    <div
                      key={company.id}
                      className={cn(
                        "p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md",
                        selectedCompany?.id === company.id ? "border-primary bg-primary/5" : "border-border"
                      )}
                      onClick={() => setSelectedCompany(company)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{company.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {company.address}
                          </p>
                          <p className="text-sm text-muted-foreground">{company.phone}</p>
                        </div>
                        {selectedCompany?.id === company.id && (
                          <Badge variant="default">Selecionado</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mapa */}
            {showMap && (
              <Card className="shadow-professional">
                <CardContent className="p-0">
                  <div className="h-96 rounded-lg overflow-hidden">
                    <MapboxMap />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Selecionar Serviço */}
            {selectedCompany && (
              <Card className="shadow-professional">
                <CardHeader>
                  <CardTitle>2. Escolha o Serviço</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {selectedCompany.services.map((service) => (
                      <div
                        key={service.id}
                        className={cn(
                          "p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md",
                          selectedService?.id === service.id ? "border-primary bg-primary/5" : "border-border"
                        )}
                        onClick={() => setSelectedService(service)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <h4 className="font-medium">{service.name}</h4>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="font-semibold text-primary">R$ {service.price.toFixed(2)}</span>
                              <span className="text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {service.duration} min
                              </span>
                            </div>
                          </div>
                          {selectedService?.id === service.id && (
                            <Badge variant="default">Selecionado</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Selecionar Data e Hora */}
            {selectedService && (
              <Card className="shadow-professional">
                <CardHeader>
                  <CardTitle>3. Escolha Data e Horário</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Data</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !selectedDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => date < new Date() || date.getDay() === 0}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <Label>Horário</Label>
                      <Select value={selectedTime} onValueChange={setSelectedTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um horário" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTimes.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Resumo e Pagamento */}
          <div className="space-y-6">
            <Card className="shadow-professional sticky top-24">
              <CardHeader>
                <CardTitle>Resumo da Reserva</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedCompany && (
                  <div>
                    <Label className="text-xs text-muted-foreground">EMPRESA</Label>
                    <p className="font-medium">{selectedCompany.name}</p>
                  </div>
                )}
                
                {selectedService && (
                  <div>
                    <Label className="text-xs text-muted-foreground">SERVIÇO</Label>
                    <p className="font-medium">{selectedService.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedService.duration} minutos</p>
                  </div>
                )}
                
                {selectedDate && selectedTime && (
                  <div>
                    <Label className="text-xs text-muted-foreground">DATA E HORA</Label>
                    <p className="font-medium">
                      {format(selectedDate, "dd/MM/yyyy", { locale: ptBR })} às {selectedTime}
                    </p>
                  </div>
                )}
                
                {selectedService && (
                  <>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total:</span>
                      <span className="text-xl font-bold text-primary">R$ {selectedService.price.toFixed(2)}</span>
                    </div>
                  </>
                )}
                
                {selectedService && (
                  <>
                    <Separator />
                    <div>
                      <Label className="text-sm font-medium">Forma de Pagamento</Label>
                      <div className="grid gap-2 mt-2">
                        <Button
                          variant={paymentMethod === 'card' ? 'default' : 'outline'}
                          onClick={() => setPaymentMethod('card')}
                          className="justify-start"
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Cartão de Crédito
                        </Button>
                        <Button
                          variant={paymentMethod === 'pix' ? 'default' : 'outline'}
                          onClick={() => setPaymentMethod('pix')}
                          className="justify-start"
                        >
                          <QrCode className="h-4 w-4 mr-2" />
                          PIX
                        </Button>
                        <Button
                          variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                          onClick={() => setPaymentMethod('cash')}
                          className="justify-start"
                        >
                          <Banknote className="h-4 w-4 mr-2" />
                          Dinheiro (no local)
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleBooking} 
                      className="w-full" 
                      variant="hero" 
                      size="lg"
                      disabled={!selectedCompany || !selectedService || !selectedDate || !selectedTime}
                    >
                      Confirmar Agendamento
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Agendar;
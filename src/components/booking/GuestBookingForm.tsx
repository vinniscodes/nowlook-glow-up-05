import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, CreditCard, Smartphone, Banknote } from 'lucide-react';
import { toast } from 'sonner';
import { useGuestBooking, GuestBookingData } from '@/hooks/useGuestBooking';
import PaymentSystem from '@/components/payments/PaymentSystem';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration_minutes: number;
  category: string;
}

interface Establishment {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  category: string;
  description?: string;
  business_hours?: any;
  images?: string[];
  services: Service[];
}

interface GuestBookingFormProps {
  establishment: Establishment;
  selectedServiceId?: string;
  onBookingSuccess: (booking: any) => void;
}

export const GuestBookingForm: React.FC<GuestBookingFormProps> = ({
  establishment,
  selectedServiceId,
  onBookingSuccess
}) => {
  const { createGuestBooking, isLoading } = useGuestBooking();
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_phone: '',
    guest_email: '',
    service_id: selectedServiceId || '',
    booking_date: '',
    booking_time: '',
    notes: '',
    payment_method: 'cash' as 'credit_card' | 'pix' | 'cash'
  });
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const selectedService = establishment.services.find(s => s.id === formData.service_id);

  // Verificação simples de captcha (substituir por reCAPTCHA real em produção)
  const [captchaQuestion, setCaptchaQuestion] = useState({ a: 0, b: 0, answer: 0 });
  const [captchaInput, setCaptchaInput] = useState('');

  useEffect(() => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion({ a, b, answer: a + b });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const verifyCaptcha = () => {
    const userAnswer = parseInt(captchaInput);
    if (userAnswer === captchaQuestion.answer) {
      setCaptchaVerified(true);
      toast.success('Verificação concluída!');
    } else {
      toast.error('Resposta incorreta. Tente novamente.');
      // Gerar nova pergunta
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      setCaptchaQuestion({ a, b, answer: a + b });
      setCaptchaInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captchaVerified) {
      toast.error('Por favor, complete a verificação de segurança.');
      return;
    }

    if (!selectedService) {
      toast.error('Por favor, selecione um serviço.');
      return;
    }

    const bookingDateTime = new Date(`${formData.booking_date}T${formData.booking_time}`);
    
    const bookingData: GuestBookingData = {
      establishment_id: establishment.id,
      service_id: formData.service_id,
      guest_name: formData.guest_name,
      guest_phone: formData.guest_phone,
      guest_email: formData.guest_email || undefined,
      booking_date: bookingDateTime.toISOString(),
      duration_minutes: selectedService.duration_minutes,
      total_amount: selectedService.price,
      payment_method: formData.payment_method,
      notes: formData.notes || undefined
    };

    const result = await createGuestBooking(bookingData);
    
    if (result.success && result.booking) {
      setBookingId(result.booking.id);
      
      if (formData.payment_method === 'cash') {
        // Para pagamento no local, finalizar agendamento
        toast.success('Agendamento realizado com sucesso!');
        onBookingSuccess(result.booking);
      } else {
        // Para cartão/PIX, mostrar tela de pagamento
        setShowPayment(true);
      }
    } else {
      toast.error(result.error || 'Erro ao criar agendamento');
    }
  };

  const handlePaymentSuccess = () => {
    toast.success('Pagamento realizado com sucesso!');
    if (bookingId) {
      onBookingSuccess({ id: bookingId });
    }
  };

  if (showPayment && selectedService && bookingId) {
    return (
        <PaymentSystem
          amount={selectedService.price}
          bookingId={bookingId}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentCancel={() => setShowPayment(false)}
        />
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Agendar Serviço
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Informações do estabelecimento */}
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{establishment.name}</h3>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <MapPin className="h-4 w-4" />
              <span>{establishment.address}, {establishment.city} - {establishment.state}</span>
            </div>
            <Badge variant="secondary">{establishment.category}</Badge>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Seleção de serviço */}
            <div>
              <Label htmlFor="service_id">Serviço *</Label>
              <select
                id="service_id"
                name="service_id"
                value={formData.service_id}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Selecione um serviço</option>
                {establishment.services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name} - R$ {service.price.toFixed(2)} ({service.duration_minutes}min)
                  </option>
                ))}
              </select>
            </div>

            {/* Informações pessoais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guest_name">Nome completo *</Label>
                <Input
                  id="guest_name"
                  name="guest_name"
                  value={formData.guest_name}
                  onChange={handleInputChange}
                  required
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <Label htmlFor="guest_phone">Telefone *</Label>
                <Input
                  id="guest_phone"
                  name="guest_phone"
                  type="tel"
                  value={formData.guest_phone}
                  onChange={handleInputChange}
                  required
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="guest_email">Email (opcional)</Label>
              <Input
                id="guest_email"
                name="guest_email"
                type="email"
                value={formData.guest_email}
                onChange={handleInputChange}
                placeholder="seu@email.com"
              />
            </div>

            {/* Data e hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="booking_date">Data *</Label>
                <Input
                  id="booking_date"
                  name="booking_date"
                  type="date"
                  value={formData.booking_date}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="booking_time">Horário *</Label>
                <Input
                  id="booking_time"
                  name="booking_time"
                  type="time"
                  value={formData.booking_time}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Forma de pagamento */}
            <div>
              <Label htmlFor="payment_method">Forma de pagamento *</Label>
              <select
                id="payment_method"
                name="payment_method"
                value={formData.payment_method}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="cash">💰 Pagar no local</option>
                <option value="credit_card">💳 Cartão de crédito</option>
                <option value="pix">📱 PIX</option>
              </select>
            </div>

            {/* Observações */}
            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Alguma observação especial..."
                rows={3}
              />
            </div>

            {/* Captcha simples */}
            {!captchaVerified && (
              <div className="p-4 border rounded-lg bg-accent/50">
                <Label>Verificação de segurança *</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Quanto é {captchaQuestion.a} + {captchaQuestion.b}?
                </p>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    placeholder="Sua resposta"
                    className="w-32"
                  />
                  <Button type="button" onClick={verifyCaptcha} variant="outline">
                    Verificar
                  </Button>
                </div>
              </div>
            )}

            {/* Resumo do agendamento */}
            {selectedService && (
              <div className="p-4 border rounded-lg bg-primary/5">
                <h4 className="font-semibold mb-2">Resumo do agendamento:</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Serviço:</strong> {selectedService.name}</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{selectedService.duration_minutes} minutos</span>
                  </div>
                  <p><strong>Valor:</strong> R$ {selectedService.price.toFixed(2)}</p>
                  {formData.booking_date && formData.booking_time && (
                    <p><strong>Data/Hora:</strong> {format(new Date(`${formData.booking_date}T${formData.booking_time}`), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
                  )}
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !captchaVerified}
            >
              {isLoading ? 'Processando...' : 'Confirmar Agendamento'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
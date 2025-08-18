import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MapPin, Clock, Phone, Calendar, Plus, ExternalLink, Share2 } from 'lucide-react';
import SiteHeader from '@/components/layout/SiteHeader';
import { GuestBookingForm } from '@/components/booking/GuestBookingForm';
import { useGuestBooking } from '@/hooks/useGuestBooking';
import { toast } from 'sonner';

export default function EstabelecimentoPublico() {
  const { id } = useParams<{ id: string }>();
  const { getEstablishmentDetails } = useGuestBooking();
  const [establishment, setEstablishment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  useEffect(() => {
    if (id) {
      loadEstablishment();
    }
  }, [id]);

  const loadEstablishment = async () => {
    if (!id) return;
    
    setLoading(true);
    const data = await getEstablishmentDetails(id);
    
    if (data) {
      setEstablishment(data);
    } else {
      toast.error('Estabelecimento não encontrado');
    }
    setLoading(false);
  };

  const handleServiceBooking = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setShowBookingForm(true);
  };

  const handleBookingSuccess = (booking: any) => {
    setBookingSuccess(booking);
    setShowBookingForm(false);
  };

  const generateWhatsAppMessage = () => {
    if (!bookingSuccess || !establishment) return '';
    
    const message = `🎯 *AGENDAMENTO CONFIRMADO - MAVINDA*

Olá! Temos um novo agendamento:

👤 *Cliente:* ${bookingSuccess.guest_name || 'Não informado'}
📱 *Telefone:* ${bookingSuccess.guest_phone || 'Não informado'}
🏪 *Estabelecimento:* ${establishment.name}
💼 *Serviço:* ${establishment.services.find(s => s.id === bookingSuccess.service_id)?.name || 'Não informado'}
📅 *Data:* ${new Date(bookingSuccess.booking_date).toLocaleDateString('pt-BR')}
⏰ *Horário:* ${new Date(bookingSuccess.booking_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}

✅ Agendamento #${bookingSuccess.id}

---
🌟 *Agendamento feito através da plataforma MAVINDA*`;

    return encodeURIComponent(message);
  };

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Link copiado para a área de transferência!');
  };

  const addToCalendar = () => {
    if (!bookingSuccess || !establishment) return;

    const service = establishment.services.find(s => s.id === bookingSuccess.service_id);
    const startDate = new Date(bookingSuccess.booking_date);
    const endDate = new Date(startDate.getTime() + (service?.duration_minutes || 60) * 60000);

    const event = {
      title: `${service?.name} - ${establishment.name}`,
      start: startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      end: endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      description: `Agendamento no ${establishment.name}\\nServiço: ${service?.name}\\nCliente: ${bookingSuccess.guest_name}`,
      location: establishment.address
    };

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    window.open(googleUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando estabelecimento...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!establishment) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Estabelecimento não encontrado</h2>
              <p className="text-muted-foreground mb-6">
                O estabelecimento que você está procurando não existe ou não está disponível.
              </p>
              <Link to="/buscar">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar à busca
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Agendamento Confirmado!</h2>
                <p className="text-muted-foreground">
                  Seu agendamento foi realizado com sucesso.
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-3">Detalhes do agendamento:</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Estabelecimento:</strong> {establishment.name}</p>
                  <p><strong>Serviço:</strong> {establishment.services.find(s => s.id === bookingSuccess.service_id)?.name}</p>
                  <p><strong>Data:</strong> {new Date(bookingSuccess.booking_date).toLocaleDateString('pt-BR')}</p>
                  <p><strong>Horário:</strong> {new Date(bookingSuccess.booking_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                  <p><strong>Cliente:</strong> {bookingSuccess.guest_name}</p>
                  <p><strong>Telefone:</strong> {bookingSuccess.guest_phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={addToCalendar} variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar à Agenda
                </Button>
                <Button 
                  onClick={() => {
                    const whatsappUrl = `https://wa.me/?text=${generateWhatsAppMessage()}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Avisar Agendamento
                </Button>
              </div>

              <Separator className="my-6" />

              <div className="text-center">
                <Button onClick={copyLink} variant="ghost">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar este estabelecimento
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showBookingForm) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="container mx-auto px-4 py-8">
          <Button 
            onClick={() => setShowBookingForm(false)} 
            variant="ghost" 
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <GuestBookingForm
            establishment={establishment}
            selectedServiceId={selectedServiceId}
            onBookingSuccess={handleBookingSuccess}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container mx-auto px-4 py-8">
        <Button onClick={() => window.history.back()} variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        {/* Header do estabelecimento */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-3xl font-bold">{establishment.name}</h1>
                  <Badge variant="secondary">{establishment.category}</Badge>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4" />
                  <span>{establishment.address}, {establishment.city} - {establishment.state}</span>
                </div>

                {establishment.description && (
                  <p className="text-muted-foreground mb-4">{establishment.description}</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={copyLink} variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Serviços disponíveis */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-6">Serviços Disponíveis</h2>
            <div className="grid gap-4">
              {establishment.services.map((service: any) => (
                <div key={service.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                      {service.description && (
                        <p className="text-muted-foreground mb-3">{service.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{service.duration_minutes} min</span>
                        </div>
                        <div className="font-semibold text-foreground">
                          R$ {service.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleServiceBooking(service.id)}
                      className="ml-4"
                    >
                      Agendar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
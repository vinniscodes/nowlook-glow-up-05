import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/layout/SiteHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CreditCard, 
  Heart, 
  Star,
  User,
  Settings,
  History,
  PhoneCall,
  MessageSquare
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { mockBookings, mockCompanies } from "@/data/mockData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Perfil() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("agendamentos");
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => { 
    document.title = "Meu Perfil | NowLook"; 
    // Carregar favoritos do localStorage
    const savedFavorites = localStorage.getItem('nowlook_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <main className="container py-10">
          <Card className="max-w-2xl mx-auto animate-enter">
            <CardHeader>
              <CardTitle>Meu Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Faça login para visualizar e gerenciar seu perfil, agendamentos e formas de pagamento.</p>
              <div className="mt-4">
                <Button variant="soft" asChild>
                  <a href="/auth">Entrar / Cadastrar</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Filtrar agendamentos do usuário
  const userBookings = mockBookings.filter(booking => booking.clientId === user.id);
  const upcomingBookings = userBookings.filter(booking => booking.status === 'confirmed');
  const pastBookings = userBookings.filter(booking => booking.status === 'completed');

  // Favoritos
  const favoriteCompanies = mockCompanies.filter(company => favorites.includes(company.id));

  const removeFavorite = (companyId: string) => {
    const newFavorites = favorites.filter(id => id !== companyId);
    setFavorites(newFavorites);
    localStorage.setItem('nowlook_favorites', JSON.stringify(newFavorites));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-800">Confirmado</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">Pendente</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Pago</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-6">
        {/* Header do Perfil */}
        <Card className="shadow-professional mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
                <p className="text-muted-foreground mb-3">{user.email}</p>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">
                    <User className="h-3 w-3 mr-1" />
                    {user.type === 'professional' ? 'Profissional' : 'Cliente'}
                  </Badge>
                  {user.type === 'professional' && (
                    <Link to="/empresa/dashboard">
                      <Button variant="outline" size="sm">
                        Dashboard
                      </Button>
                    </Link>
                  )}
                  <span className="text-sm text-muted-foreground">
                    Membro desde Jan 2024
                  </span>
                </div>
              </div>

              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-professional">
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{upcomingBookings.length}</p>
              <p className="text-sm text-muted-foreground">Próximos Agendamentos</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-professional">
            <CardContent className="p-4 text-center">
              <History className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{pastBookings.length}</p>
              <p className="text-sm text-muted-foreground">Serviços Realizados</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-professional">
            <CardContent className="p-4 text-center">
              <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <p className="text-2xl font-bold">{favoriteCompanies.length}</p>
              <p className="text-sm text-muted-foreground">Favoritos</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-professional">
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold">4.8</p>
              <p className="text-sm text-muted-foreground">Avaliação Média</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs do Perfil */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
            <TabsTrigger value="favoritos">Favoritos</TabsTrigger>
            <TabsTrigger value="conta">Minha Conta</TabsTrigger>
          </TabsList>

          {/* Agendamentos Futuros */}
          <TabsContent value="agendamentos" className="space-y-4">
            <Card className="shadow-professional">
              <CardHeader>
                <CardTitle>Próximos Agendamentos</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Nenhum agendamento futuro</h3>
                    <p className="text-muted-foreground mb-4">Você não tem agendamentos marcados.</p>
                    <Link to="/buscar">
                      <Button>Agendar Serviço</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold">{booking.serviceName}</h3>
                            <p className="text-muted-foreground">{booking.companyName}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(booking.date), "dd 'de' MMMM", { locale: ptBR })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {booking.time}
                              </span>
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            {getStatusBadge(booking.status)}
                            <p className="text-lg font-bold text-primary">R$ {booking.price.toFixed(2)}</p>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Pagamento:</span>
                            {getPaymentStatusBadge(booking.paymentStatus)}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <MapPin className="h-3 w-3 mr-1" />
                              Ver Local
                            </Button>
                            <Button variant="outline" size="sm">
                              <PhoneCall className="h-3 w-3 mr-1" />
                              Ligar
                            </Button>
                            <Button variant="outline" size="sm">
                              Reagendar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Histórico */}
          <TabsContent value="historico" className="space-y-4">
            <Card className="shadow-professional">
              <CardHeader>
                <CardTitle>Histórico de Serviços</CardTitle>
              </CardHeader>
              <CardContent>
                {pastBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Nenhum serviço realizado</h3>
                    <p className="text-muted-foreground">Seus serviços concluídos aparecerão aqui.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pastBookings.map((booking) => (
                      <div key={booking.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold">{booking.serviceName}</h3>
                            <p className="text-muted-foreground">{booking.companyName}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(booking.date), "dd 'de' MMMM", { locale: ptBR })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {booking.time}
                              </span>
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            {getStatusBadge(booking.status)}
                            <p className="text-lg font-bold text-primary">R$ {booking.price.toFixed(2)}</p>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Pagamento:</span>
                            {getPaymentStatusBadge(booking.paymentStatus)}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Star className="h-3 w-3 mr-1" />
                              Avaliar
                            </Button>
                            <Button variant="outline" size="sm">
                              Agendar Novamente
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favoritos */}
          <TabsContent value="favoritos" className="space-y-4">
            <Card className="shadow-professional">
              <CardHeader>
                <CardTitle>Estabelecimentos Favoritos</CardTitle>
              </CardHeader>
              <CardContent>
                {favoriteCompanies.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Nenhum favorito</h3>
                    <p className="text-muted-foreground mb-4">Adicione estabelecimentos aos seus favoritos para acesso rápido.</p>
                    <Link to="/buscar">
                      <Button>Descobrir Estabelecimentos</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {favoriteCompanies.map((company) => (
                      <div key={company.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <h3 className="font-semibold">{company.name}</h3>
                            <p className="text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {company.address}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {company.services.slice(0, 3).map((service) => (
                                <Badge key={service.id} variant="secondary" className="text-xs">
                                  {service.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Link to={`/estabelecimento/${company.id}`}>
                              <Button variant="outline" size="sm">
                                Ver Detalhes
                              </Button>
                            </Link>
                            <Link to={`/agendar?empresa=${company.id}`}>
                              <Button size="sm">
                                Agendar
                              </Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeFavorite(company.id)}
                            >
                              <Heart className="h-4 w-4 text-red-500 fill-current" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Minha Conta */}
          <TabsContent value="conta" className="space-y-4">
            <Card className="shadow-professional">
              <CardHeader>
                <CardTitle>Informações da Conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nome Completo</label>
                    <p className="text-muted-foreground">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Telefone</label>
                    <p className="text-muted-foreground">(11) 99999-9999</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tipo de Conta</label>
                    <p className="text-muted-foreground">Cliente</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="font-medium">Configurações</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Editar Informações Pessoais
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Métodos de Pagamento
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Preferências de Notificação
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MapPin, 
  Phone, 
  Star, 
  Clock, 
  Calendar, 
  Heart, 
  Share2,
  Camera,
  User,
  ChevronLeft
} from 'lucide-react';
import SiteHeader from '@/components/layout/SiteHeader';
import MapboxMap from '@/components/map/MapboxMap';
import { mockCompanies } from '@/data/mockData';
import { cn } from '@/lib/utils';

const Estabelecimento = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);

  // Encontrar a empresa pelos dados mockados
  const company = mockCompanies.find(c => c.id === id);

  if (!company) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container py-16 text-center">
          <h1 className="text-2xl font-bold">Estabelecimento não encontrado</h1>
          <p className="text-muted-foreground mt-2">O estabelecimento que você procura não existe.</p>
          <Link to="/buscar">
            <Button className="mt-4">Voltar à Busca</Button>
          </Link>
        </main>
      </div>
    );
  }

  // Mock data para avaliações e profissionais
  const rating = (4.0 + Math.random() * 1).toFixed(1);
  const reviewCount = Math.floor(Math.random() * 200) + 50;
  
  const mockProfessionals = [
    { id: '1', name: 'Ana Silva', specialty: 'Cortes Femininos', rating: '4.9', avatar: '' },
    { id: '2', name: 'Carlos Santos', specialty: 'Barbearia', rating: '4.8', avatar: '' },
    { id: '3', name: 'Marina Costa', specialty: 'Coloração', rating: '4.7', avatar: '' },
  ];

  const mockReviews = [
    {
      id: '1',
      clientName: 'Maria Oliveira',
      rating: 5,
      comment: 'Excelente atendimento! Muito profissional e o resultado ficou perfeito.',
      date: '2024-01-10',
      service: 'Corte + Escova'
    },
    {
      id: '2', 
      clientName: 'João Pedro',
      rating: 5,
      comment: 'Sempre venho aqui, nunca me decepciona. Recomendo!',
      date: '2024-01-08',
      service: 'Corte Masculino'
    },
    {
      id: '3',
      clientName: 'Ana Carolina',
      rating: 4,
      comment: 'Bom atendimento, ambiente agradável. Voltarei em breve.',
      date: '2024-01-05',
      service: 'Manicure'
    }
  ];

  const mockGallery = [
    'Fachada do estabelecimento',
    'Interior - Área de atendimento',
    'Trabalho realizado 1',
    'Trabalho realizado 2',
    'Equipe profissional',
    'Ambiente relaxante'
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      
      <main className="container py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link to="/buscar">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Voltar à busca
            </Button>
          </Link>
        </div>

        {/* Header do Estabelecimento */}
        <Card className="shadow-professional mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Imagem Principal */}
              <div className="lg:col-span-1">
                <div className="aspect-square bg-gradient-subtle rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Camera className="h-12 w-12 mx-auto mb-2" />
                    <p>Foto Principal</p>
                  </div>
                </div>
              </div>

              {/* Informações Principais */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                        <span className="font-semibold text-lg">{rating}</span>
                        <span className="text-muted-foreground">({reviewCount} avaliações)</span>
                      </div>
                      {company.verified && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Verificado
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={cn(
                        "text-muted-foreground hover:text-red-500",
                        isFavorite && "text-red-500 border-red-200"
                      )}
                    >
                      <Heart className={cn("h-4 w-4 mr-2", isFavorite && "fill-current")} />
                      {isFavorite ? 'Favoritado' : 'Favoritar'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartilhar
                    </Button>
                  </div>
                </div>

                {/* Informações de Contato */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{company.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{company.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Seg - Sex: 9h às 18h | Sáb: 9h às 17h</span>
                    <Badge variant="outline" className="text-green-600 border-green-200 ml-2">
                      Aberto agora
                    </Badge>
                  </div>
                </div>

                {/* Ação Principal */}
                <div className="flex gap-3 pt-4">
                  <Link to={`/agendar?empresa=${company.id}`}>
                    <Button variant="hero" size="lg" className="flex-1">
                      <Calendar className="h-5 w-5 mr-2" />
                      Agendar Agora
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg">
                    <Phone className="h-5 w-5 mr-2" />
                    Ligar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs de Conteúdo */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="professionals">Profissionais</TabsTrigger>
            <TabsTrigger value="reviews">Avaliações</TabsTrigger>
            <TabsTrigger value="gallery">Galeria</TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sobre */}
              <Card className="shadow-professional">
                <CardHeader>
                  <CardTitle>Sobre o Estabelecimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Um estabelecimento moderno e acolhedor, dedicado a oferecer os melhores serviços 
                    de beleza e bem-estar. Nossa equipe é formada por profissionais experientes e 
                    apaixonados pelo que fazem.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-medium">Especialidades:</h4>
                    <div className="flex flex-wrap gap-2">
                      {company.services.map(service => (
                        <Badge key={service.id} variant="secondary">
                          {service.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mapa */}
              <Card className="shadow-professional">
                <CardHeader>
                  <CardTitle>Localização</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-64 rounded-b-lg overflow-hidden">
                    <MapboxMap />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Avaliações Recentes */}
            <Card className="shadow-professional">
              <CardHeader>
                <CardTitle>Avaliações Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockReviews.slice(0, 2).map(review => (
                    <div key={review.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{review.clientName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{review.clientName}</p>
                            <p className="text-xs text-muted-foreground">{review.service}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 text-yellow-500 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                      <Separator />
                    </div>
                  ))}
                  <Link to="#" onClick={() => setActiveTab('reviews')}>
                    <Button variant="outline" className="w-full">
                      Ver Todas as Avaliações
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Serviços */}
          <TabsContent value="services">
            <Card className="shadow-professional">
              <CardHeader>
                <CardTitle>Todos os Serviços</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {company.services.map(service => (
                    <div key={service.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{service.name}</h3>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">R$ {service.price.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {service.duration} min
                          </p>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">{service.description}</p>
                      <Link to={`/agendar?empresa=${company.id}&servico=${service.id}`}>
                        <Button variant="outline" size="sm">
                          Agendar Este Serviço
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profissionais */}
          <TabsContent value="professionals">
            <Card className="shadow-professional">
              <CardHeader>
                <CardTitle>Nossa Equipe</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockProfessionals.map(professional => (
                    <div key={professional.id} className="p-4 border rounded-lg text-center">
                      <Avatar className="h-16 w-16 mx-auto mb-3">
                        <AvatarFallback className="text-lg">
                          {professional.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold">{professional.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{professional.specialty}</p>
                      <div className="flex items-center justify-center gap-1 mb-3">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{professional.rating}</span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        Agendar com {professional.name.split(' ')[0]}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Avaliações */}
          <TabsContent value="reviews">
            <Card className="shadow-professional">
              <CardHeader>
                <CardTitle>Todas as Avaliações ({reviewCount})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockReviews.map(review => (
                    <div key={review.id} className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{review.clientName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{review.clientName}</p>
                            <p className="text-sm text-muted-foreground">{review.service} • {review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                      <Separator />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Galeria */}
          <TabsContent value="gallery">
            <Card className="shadow-professional">
              <CardHeader>
                <CardTitle>Galeria de Fotos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {mockGallery.map((item, index) => (
                    <div key={index} className="aspect-square bg-gradient-subtle rounded-lg flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Camera className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-xs">{item}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Estabelecimento;
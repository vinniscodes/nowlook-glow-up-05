import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MapPin, Star, Clock, Filter, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import SiteHeader from '@/components/layout/SiteHeader';
import { mockCompanies } from '@/data/mockData';
import { Company } from '@/types';
import { cn } from '@/lib/utils';

const Buscar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Categorias baseadas nos serviços disponíveis
  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'corte', label: 'Cortes' },
    { value: 'barba', label: 'Barba' },
    { value: 'manicure', label: 'Manicure/Pedicure' },
    { value: 'cabelo', label: 'Tratamentos Capilares' },
  ];

  const priceRanges = [
    { value: 'all', label: 'Todos os Preços' },
    { value: '0-30', label: 'R$ 0 - R$ 30' },
    { value: '30-60', label: 'R$ 30 - R$ 60' },
    { value: '60-100', label: 'R$ 60 - R$ 100' },
    { value: '100+', label: 'R$ 100+' },
  ];

  const sortOptions = [
    { value: 'rating', label: 'Mais Bem Avaliados' },
    { value: 'distance', label: 'Mais Próximos' },
    { value: 'price', label: 'Menor Preço' },
    { value: 'popular', label: 'Mais Populares' },
  ];

  // Função para calcular avaliação mockada
  const getCompanyRating = (company: Company) => {
    return (4.0 + Math.random() * 1).toFixed(1);
  };

  // Função para calcular preço médio
  const getAveragePrice = (company: Company) => {
    const prices = company.services.map(s => s.price);
    return Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  };

  // Filtrar e ordenar empresas
  const filteredCompanies = useMemo(() => {
    let filtered = mockCompanies.filter(company => {
      // Filtro de busca
      const matchesSearch = searchTerm === '' || 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.services.some(service => 
          service.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Filtro de categoria
      const matchesCategory = selectedCategory === 'all' || 
        company.services.some(service => {
          const serviceName = service.name.toLowerCase();
          switch (selectedCategory) {
            case 'corte':
              return serviceName.includes('corte');
            case 'barba':
              return serviceName.includes('barba');
            case 'manicure':
              return serviceName.includes('manicure') || serviceName.includes('pedicure');
            case 'cabelo':
              return serviceName.includes('escova') || serviceName.includes('coloração');
            default:
              return true;
          }
        });

      // Filtro de preço
      const averagePrice = getAveragePrice(company);
      const matchesPrice = priceRange === 'all' || 
        (priceRange === '0-30' && averagePrice <= 30) ||
        (priceRange === '30-60' && averagePrice > 30 && averagePrice <= 60) ||
        (priceRange === '60-100' && averagePrice > 60 && averagePrice <= 100) ||
        (priceRange === '100+' && averagePrice > 100);

      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Ordenação
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => parseFloat(getCompanyRating(b)) - parseFloat(getCompanyRating(a)));
        break;
      case 'price':
        filtered.sort((a, b) => getAveragePrice(a) - getAveragePrice(b));
        break;
      case 'distance':
        // Ordenação mockada por distância
        filtered.sort(() => Math.random() - 0.5);
        break;
      case 'popular':
        // Ordenação mockada por popularidade
        filtered.sort(() => Math.random() - 0.5);
        break;
    }

    return filtered;
  }, [searchTerm, selectedCategory, priceRange, sortBy]);

  const toggleFavorite = (companyId: string) => {
    setFavorites(prev => 
      prev.includes(companyId) 
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-6">
        {/* Header de Busca */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-4">Encontre o Serviço Perfeito</h1>
          
          {/* Barra de Busca Principal */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Busque por serviço, estabelecimento ou localização..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Faixa de Preço" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map(range => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Mais Filtros
            </Button>
          </div>

          {/* Resultados Count */}
          <p className="text-muted-foreground">
            {filteredCompanies.length} estabelecimento(s) encontrado(s)
          </p>
        </div>

        {/* Lista de Resultados */}
        <div className="grid gap-6">
          {filteredCompanies.map((company) => {
            const rating = getCompanyRating(company);
            const averagePrice = getAveragePrice(company);
            const isFavorite = favorites.includes(company.id);

            return (
              <Card key={company.id} className="shadow-professional hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Imagem do Estabelecimento */}
                    <div className="lg:col-span-1">
                      <div className="aspect-square bg-gradient-subtle rounded-lg flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <MapPin className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm">Foto do Local</p>
                        </div>
                      </div>
                    </div>

                    {/* Informações Principais */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{company.name}</h3>
                          <p className="text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {company.address}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(company.id)}
                          className={cn(
                            "text-muted-foreground hover:text-red-500",
                            isFavorite && "text-red-500"
                          )}
                        >
                          <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
                        </Button>
                      </div>

                      {/* Avaliação e Informações */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{rating}</span>
                          <span className="text-muted-foreground text-sm">(127 avaliações)</span>
                        </div>
                        <Badge variant="secondary">
                          Preço médio: R$ {averagePrice}
                        </Badge>
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          Aberto agora
                        </Badge>
                      </div>

                      {/* Serviços */}
                      <div>
                        <h4 className="font-medium mb-2">Serviços em Destaque:</h4>
                        <div className="flex flex-wrap gap-2">
                          {company.services.slice(0, 3).map((service) => (
                            <Badge key={service.id} variant="outline">
                              {service.name} - R$ {service.price}
                            </Badge>
                          ))}
                          {company.services.length > 3 && (
                            <Badge variant="secondary">
                              +{company.services.length - 3} serviços
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="lg:col-span-1 flex flex-col gap-3">
                      <Link to={`/estabelecimento/${company.id}`}>
                        <Button variant="outline" className="w-full">
                          Ver Detalhes
                        </Button>
                      </Link>
                      <Link to={`/agendar?empresa=${company.id}`}>
                        <Button variant="hero" className="w-full">
                          Agendar Agora
                        </Button>
                      </Link>
                      <p className="text-xs text-muted-foreground text-center">
                        <Clock className="h-3 w-3 inline mr-1" />
                        Próximo horário: Hoje 15:30
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Caso não haja resultados */}
        {filteredCompanies.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum resultado encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Tente ajustar seus filtros ou buscar por outros termos.
              </p>
              <Button onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setPriceRange('all');
              }}>
                Limpar Filtros
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Buscar;
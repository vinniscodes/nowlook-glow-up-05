import heroImage from "@/assets/hero-nowlook.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import SiteHeader from "@/components/layout/SiteHeader";
import { useSiteStats } from "@/hooks/useStats";

const Index = () => {
  const { stats, isLoading } = useSiteStats();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Mavinda',
    url: '/',
    potentialAction: {
      '@type': 'SearchAction',
      target: '/?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground animate-enter">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden min-h-[90vh] flex items-center">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Ambiente moderno de beleza e bem-estar com iluminação suave"
              className="h-full w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/20" />
          </div>
          <div className="relative container py-12 sm:py-24 md:py-32 px-4 sm:px-6">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
                <span className="gradient-text">Agende serviços</span>
                <br />
                <span className="text-foreground">profissionais</span>
              </h1>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Conectamos você a profissionais verificados para serviços de beleza e bem-estar. 
                <span className="text-foreground font-medium">Rápido, seguro e no seu horário.</span>
              </p>
              <div className="mt-6 sm:mt-10 glass rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-4xl">
                <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-[1fr_1fr_auto]">
                  <Input 
                    placeholder="Serviço (ex.: corte, manicure)" 
                    aria-label="Buscar serviço"
                    className="h-10 sm:h-12 text-sm sm:text-base shadow-professional"
                  />
                  <Input 
                    placeholder="Cidade ou bairro" 
                    aria-label="Localização"
                    className="h-10 sm:h-12 text-sm sm:text-base shadow-professional"
                  />
                  <Button className="lg:w-auto w-full" size="lg" variant="hero">
                    <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">Buscar Agora</span>
                    <span className="sm:hidden">Buscar</span>
                  </Button>
                </div>
              </div>
              <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-2 glass rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                  <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-primary animate-pulse" />
                  <span className="hidden sm:inline">Plataforma verificada</span>
                  <span className="sm:hidden">Verificada</span>
                </div>
                <div className="flex items-center gap-2 glass rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                  <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-primary animate-pulse" />
                  <span className="hidden sm:inline">{stats.totalEstablishments} profissionais</span>
                  <span className="sm:hidden">{stats.totalEstablishments}</span>
                </div>
                <div className="flex items-center gap-2 glass rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                  <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-primary animate-pulse" />
                  <span className="hidden sm:inline">Pagamento seguro</span>
                  <span className="sm:hidden">Seguro</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container py-12 sm:py-20 md:py-32 px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Por que escolher a <span className="mavinda-brand">Mavinda</span>?
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Uma plataforma completa que conecta você aos melhores profissionais de beleza e bem-estar
            </p>
          </div>
          
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-professional hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 glass">
              <CardHeader className="pb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg gradient-primary flex items-center justify-center mb-3 sm:mb-4">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <CardTitle className="text-lg sm:text-xl font-semibold">Profissionais Verificados</CardTitle>
              </CardHeader>
              <CardContent className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Todos os profissionais passam por verificação rigorosa. Avaliações reais, certificações válidas e perfis completos para sua segurança.
              </CardContent>
            </Card>
            
            <Card className="shadow-professional hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 glass">
              <CardHeader className="pb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg gradient-primary flex items-center justify-center mb-3 sm:mb-4">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <CardTitle className="text-lg sm:text-xl font-semibold">Agendamento Inteligente</CardTitle>
              </CardHeader>
              <CardContent className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Sistema em tempo real com disponibilidade instantânea. Confirmação automática e lembretes inteligentes para você nunca esquecer.
              </CardContent>
            </Card>
            
            <Card className="shadow-professional hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 glass md:col-span-2 lg:col-span-1">
              <CardHeader className="pb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg gradient-primary flex items-center justify-center mb-3 sm:mb-4">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <CardTitle className="text-lg sm:text-xl font-semibold">Pagamentos Seguros</CardTitle>
              </CardHeader>
              <CardContent className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Transações protegidas com criptografia bancária. Múltiplas formas de pagamento e proteção total para suas informações.
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12 sm:mt-16 text-center px-4">
            <Button size="lg" variant="premium" className="font-semibold w-full sm:w-auto">
              <span className="hidden sm:inline">Começar Agora - É Grátis</span>
              <span className="sm:hidden">Começar Grátis</span>
            </Button>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground">
              Cadastre-se em menos de 2 minutos • Sem taxas ocultas
            </p>
          </div>
        </section>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
};

export default Index;

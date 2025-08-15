import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Users, Shield, Clock, CreditCard, ArrowRight, Sparkles, Zap, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-nowlook.jpg";

const Landing = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Profissionais Verificados",
      description: "Rede de profissionais certificados e avaliados",
      highlight: "100% Verificados"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Agendamento Instantâneo",
      description: "Reserve em tempo real com confirmação automática",
      highlight: "Em segundos"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Pagamento Seguro",
      description: "Transações protegidas com garantia total",
      highlight: "100% Seguro"
    }
  ];

  const plans = [
    {
      name: "Cliente",
      price: "Grátis",
      period: undefined,
      description: "Para quem busca serviços",
      features: [
        "Busca ilimitada",
        "Agendamentos gratuitos",
        "Avaliações de profissionais",
        "Suporte básico"
      ],
      highlight: false
    },
    {
      name: "Profissional",
      price: "R$ 29,99",
      period: "/mês",
      description: "Para prestadores de serviço e salões",
      features: [
        "Perfil profissional completo",
        "Agendamentos ilimitados",
        "Múltiplos profissionais",
        "Sistema completo de gestão",
        "Dashboard com relatórios avançados",
        "Gestão de clientes",
        "Galeria de fotos (até 5 imagens)",
        "Gestão de profissionais",
        "API personalizada",
        "Suporte dedicado"
      ],
      highlight: true
    }
  ];

  // Use real stats - these will be replaced with live data
  const stats = [
    { number: "0", label: "Profissionais" },
    { number: "0", label: "Agendamentos" },
    { number: "5.0", label: "Avaliação" },
    { number: "1", label: "Cidade" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Ambiente profissional de beleza"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-background/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative container py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Hero Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-6">
                <Badge variant="secondary" className="glass font-medium text-sm px-4 py-2">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Plataforma #1 em Agendamentos
                </Badge>
                
                <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
                  <span className="gradient-text">NowLook</span>
                  <br />
                  <span className="text-foreground">Conecta você</span>
                  <br />
                  <span className="text-muted-foreground text-3xl md:text-4xl xl:text-5xl">aos melhores profissionais</span>
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                  A plataforma que revoluciona como você agenda serviços de <span className="text-foreground font-semibold">beleza e bem-estar</span>. 
                  Rápido, seguro e no seu horário.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="glass rounded-xl p-4 text-center animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="text-2xl font-bold gradient-text">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Interactive Features */}
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`glass rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      activeFeature === index ? 'bg-primary/10 border-primary/30' : ''
                    }`}
                    onMouseEnter={() => setActiveFeature(index)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg gradient-primary text-white">
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{feature.title}</h3>
                          <Badge variant="secondary" className="text-xs">{feature.highlight}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Auth Card */}
            <div className="lg:ml-auto max-w-md w-full animate-slide-in-right">
              <Card className="glass shadow-2xl border-0">
                <CardHeader className="text-center pb-3 sm:pb-4">
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <div className="p-2 sm:p-3 rounded-full gradient-primary">
                      <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-bold">
                    {isLoginMode ? 'Bem-vindo de volta!' : 'Comece agora'}
                  </CardTitle>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {isLoginMode ? 'Acesse sua conta' : 'Crie sua conta grátis'}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    {!isLoginMode && (
                      <Input 
                        placeholder="Nome completo" 
                        className="h-10 sm:h-12 glass border-0 shadow-professional text-sm sm:text-base"
                      />
                    )}
                    <Input 
                      type="email" 
                      placeholder="E-mail" 
                      className="h-10 sm:h-12 glass border-0 shadow-professional text-sm sm:text-base"
                    />
                    <Input 
                      type="password" 
                      placeholder="Senha" 
                      className="h-10 sm:h-12 glass border-0 shadow-professional text-sm sm:text-base"
                    />
                  </div>

                  <Button className="w-full h-10 sm:h-12" size="lg" variant="hero">
                    <span className="text-sm sm:text-base">
                      {isLoginMode ? 'Entrar' : 'Criar conta grátis'}
                    </span>
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-muted" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">ou</span>
                    </div>
                  </div>

                  <Link to="/home">
                    <Button variant="glass" className="w-full h-10 sm:h-12">
                      <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-sm sm:text-base">Explorar como visitante</span>
                    </Button>
                  </Link>

                  <div className="text-center">
                    <button
                      onClick={() => setIsLoginMode(!isLoginMode)}
                      className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors story-link"
                    >
                      {isLoginMode ? 'Não tem conta? Criar agora' : 'Já tem conta? Fazer login'}
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 sm:py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <Badge variant="secondary" className="mb-3 sm:mb-4 text-xs sm:text-sm">
              <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Planos e Preços
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              Escolha o plano <span className="gradient-text">ideal</span> para você
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Transparência total. Sem taxas ocultas. Cancele quando quiser.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                  plan.highlight 
                    ? 'border-primary shadow-2xl scale-105 gradient-primary text-white' 
                    : 'glass border-0 shadow-professional'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                    <Badge variant="secondary" className="bg-yellow-400 text-yellow-900 font-semibold px-3 sm:px-4 py-1 text-xs sm:text-sm">
                      <Star className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">Mais Popular</span>
                      <span className="sm:hidden">Popular</span>
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6 sm:pb-8 p-4 sm:p-6">
                  <CardTitle className={`text-lg sm:text-xl lg:text-2xl font-bold ${plan.highlight ? 'text-white' : ''}`}>
                    {plan.name}
                  </CardTitle>
                  <div className={`text-sm sm:text-base ${plan.highlight ? 'text-white/90' : 'text-muted-foreground'}`}>
                    {plan.description}
                  </div>
                  <div className="mt-3 sm:mt-4">
                    <span className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${plan.highlight ? 'text-white' : ''}`}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className={`text-sm sm:text-base lg:text-lg ${plan.highlight ? 'text-white/80' : 'text-muted-foreground'}`}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle className={`h-4 w-4 sm:h-5 sm:w-5 mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-white' : 'text-primary'}`} />
                      <span className={`text-sm sm:text-base ${plan.highlight ? 'text-white/90' : 'text-foreground'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                  
                  <div className="pt-4 sm:pt-6">
                    <Button 
                      className={`w-full h-10 sm:h-12 text-sm sm:text-base ${
                        plan.highlight 
                          ? 'bg-white text-primary hover:bg-white/90' 
                          : ''
                      }`}
                      variant={plan.highlight ? 'secondary' : 'hero'}
                      size="lg"
                    >
                      <span className="hidden sm:inline">
                        {plan.price === 'Grátis' ? 'Começar grátis' : 'Assinar agora'}
                      </span>
                      <span className="sm:hidden">
                        {plan.price === 'Grátis' ? 'Grátis' : 'Assinar'}
                      </span>
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12 px-4">
            <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
              Dúvidas sobre os planos? <button className="text-primary story-link">Fale conosco</button>
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <span className="hidden sm:inline">Suporte 24/7</span>
                <span className="sm:hidden">24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <span className="hidden sm:inline">Sem compromisso</span>
                <span className="sm:hidden">Livre</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <span className="hidden sm:inline">Cancele quando quiser</span>
                <span className="sm:hidden">Cancele</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
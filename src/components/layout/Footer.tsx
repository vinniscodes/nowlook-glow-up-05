import { Heart, Instagram, Twitter, Mail, Phone, MapPin, Clock, Shield, Zap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">NL</span>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                NowLook
              </h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              A plataforma completa para agendamentos de beleza e bem-estar. 
              Conectando clientes e profissionais de forma simples e eficiente.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="p-2" asChild>
                <a href="https://instagram.com/nowlook.app" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="sm" className="p-2" asChild>
                <a href="https://twitter.com/nowlook_app" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="sm" className="p-2" asChild>
                <a href="mailto:contato@nowlook.app">
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Links Rápidos</h4>
            <nav className="space-y-2">
              <a href="/buscar" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Encontrar Profissionais
              </a>
              <a href="/agendar" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Agendar Serviço
              </a>
              <a href="/empresa" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Para Empresas
              </a>
              <a href="/promocoes" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Promoções
              </a>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Suporte</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>(11) 99999-8888</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>suporte@nowlook.app</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mt-0.5" />
                <div>
                  <div>Seg-Sex: 8h às 18h</div>
                  <div>Sáb: 9h às 15h</div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Por que NowLook?</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4 text-primary" />
                <span>Agendamento Instantâneo</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span>Pagamento Seguro</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 text-primary" />
                <span>+1000 Profissionais</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="h-4 w-4 text-primary" />
                <span>Avaliações Reais</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Bottom Footer */}
        <div className="py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © 2024 NowLook. Todos os direitos reservados.
          </div>
          
          <div className="flex gap-6 text-sm">
            <a href="/termos" className="text-muted-foreground hover:text-primary transition-colors">
              Termos de Uso
            </a>
            <a href="/privacidade" className="text-muted-foreground hover:text-primary transition-colors">
              Privacidade
            </a>
            <a href="/cookies" className="text-muted-foreground hover:text-primary transition-colors">
              Cookies
            </a>
          </div>
        </div>

        {/* Made with Love */}
        <div className="pb-4 text-center">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            Feito com <Heart className="h-3 w-3 text-red-500 fill-current" /> no Brasil
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
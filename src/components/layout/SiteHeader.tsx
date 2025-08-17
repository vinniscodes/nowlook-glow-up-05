import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar, User, LogOut, Menu, X, Settings, Building, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserName, getUserRole } from "@/hooks/useUserHelpers";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/ThemeToggle";
import NotificationSystem from "@/components/notifications/NotificationSystem";
import NotificationCenter from "@/components/business/NotificationCenter";

const navLink = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActive ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"} story-link`;

const SiteHeader = () => {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userRole = getUserRole(user);

  // Mobile Navigation Component
  const MobileNav = () => (
    <div className="flex flex-col space-y-3 pt-4">
      <NavLink 
        to="/" 
        end 
        className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted/60 transition-colors"
        onClick={() => setIsMenuOpen(false)}
      >
        Início
      </NavLink>
      <NavLink 
        to="/buscar" 
        className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted/60 transition-colors"
        onClick={() => setIsMenuOpen(false)}
      >
        Buscar
      </NavLink>
      <NavLink 
        to="/agendar" 
        className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted/60 transition-colors"
        onClick={() => setIsMenuOpen(false)}
      >
        Agendar
      </NavLink>
      <NavLink 
        to="/promocoes" 
        className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted/60 transition-colors"
        onClick={() => setIsMenuOpen(false)}
      >
        Promoções
      </NavLink>
      {user && (
        <NavLink 
          to="/perfil" 
          className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted/60 transition-colors"
          onClick={() => setIsMenuOpen(false)}
        >
          Meu Perfil
        </NavLink>
      )}
      {userRole === 'business' && (
        <NavLink 
          to="/empresa/dashboard" 
          className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted/60 transition-colors"
          onClick={() => setIsMenuOpen(false)}
        >
          Dashboard
        </NavLink>
      )}
      {userRole === 'admin' && (
        <NavLink 
          to="/admin" 
          className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted/60 transition-colors"
          onClick={() => setIsMenuOpen(false)}
        >
          Central de Controle
        </NavLink>
      )}
    </div>
  );

  return (
    <header className="w-full border-b bg-background/80 backdrop-blur-xl sticky top-0 z-50 shadow-professional">
      <nav className="container flex h-16 items-center justify-between px-4 sm:px-6">
        <NavLink to="/" className="inline-flex items-center gap-2">
          <span className="mavinda-brand text-lg sm:text-xl">Mavinda</span>
        </NavLink>
        
        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              <NavLink to="/" end className={navLink}>Início</NavLink>
              <NavLink to="/buscar" className={navLink}>Buscar</NavLink>
              <NavLink to="/agendar" className={navLink}>Agendar</NavLink>
              <NavLink to="/promocoes" className={navLink}>Promoções</NavLink>
              {user && <NavLink to="/perfil" className={navLink}>Meu Perfil</NavLink>}
              {userRole === 'business' && <NavLink to="/empresa/dashboard" className={navLink}>Dashboard</NavLink>}
              {userRole === 'admin' && <NavLink to="/admin" className={navLink}>Admin</NavLink>}
            </div>
            
            <div className="flex items-center gap-2">
              {user && <NotificationSystem />}
              {userRole === 'business' && <NotificationCenter />}
              <ThemeToggle />
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-sm">
                          {getUserName(user).split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5 text-sm font-medium">
                      {getUserName(user)}
                    </div>
                    <div className="px-2 pb-2">
                      <Badge variant="outline" className="text-xs">
                        {userRole === 'business' ? 'Profissional' : 
                         userRole === 'admin' ? 'Administrador' : 'Cliente'}
                      </Badge>
                    </div>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem asChild>
                      <Link to="/perfil" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Meu Perfil
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        <Calendar className="mr-2 h-4 w-4" />
                        Meus Agendamentos
                      </Link>
                    </DropdownMenuItem>
                    
                    {userRole === 'business' && (
                      <DropdownMenuItem asChild>
                        <Link to="/empresa/dashboard" className="cursor-pointer">
                          <Building className="mr-2 h-4 w-4" />
                          Dashboard Empresa
                        </Link>
                      </DropdownMenuItem>
                    )}
                    
                    {userRole === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Central de Controle
                        </Link>
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild variant="hero" size="sm">
                  <NavLink to="/login">Entrar</NavLink>
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMobile && (
          <div className="flex items-center gap-2">
            {user && <NotificationSystem />}
            {userRole === 'business' && <NotificationCenter />}
            <ThemeToggle />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <NavLink to="/perfil" className="flex items-center gap-2 w-full">
                      <User className="h-4 w-4" />
                      Meu Perfil
                    </NavLink>
                  </DropdownMenuItem>
                  
                  {userRole === 'business' && (
                    <>
                      <DropdownMenuItem asChild>
                        <NavLink to="/empresa/dashboard" className="flex items-center gap-2 w-full">
                          <BarChart3 className="h-4 w-4" />
                          Dashboard
                        </NavLink>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <NavLink to="/empresa/cadastro" className="flex items-center gap-2 w-full">
                          <Settings className="h-4 w-4" />
                          Gerenciar
                        </NavLink>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  {userRole === 'admin' && (
                    <DropdownMenuItem asChild>
                      <NavLink to="/admin" className="flex items-center gap-2 w-full">
                        <Settings className="h-4 w-4" />
                        Admin
                      </NavLink>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-destructive">
                    <LogOut className="h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="hero" size="sm" className="text-xs px-3">
                <NavLink to="/login">Entrar</NavLink>
              </Button>
            )}
            
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex items-center justify-between border-b pb-4 mb-4">
                  <span className="mavinda-brand text-lg">Menu</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <MobileNav />
              </SheetContent>
            </Sheet>
          </div>
        )}
      </nav>
    </header>
  );
};

export default SiteHeader;
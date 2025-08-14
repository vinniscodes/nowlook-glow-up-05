import { NavLink } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { getUserRole, getUserName } from '@/hooks/useUserHelpers';
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings, BarChart3, Menu, X } from "lucide-react";
import NotificationCenter from "@/components/business/NotificationCenter";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const navLink = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActive ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"} story-link`;

const SiteHeader = () => {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      {getUserRole(user) === 'business' && (
        <NavLink 
          to="/empresa/dashboard" 
          className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted/60 transition-colors"
          onClick={() => setIsMenuOpen(false)}
        >
          Dashboard
        </NavLink>
      )}
      {getUserRole(user) === 'admin' && (
        <NavLink 
          to="/dashboard" 
          className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted/60 transition-colors"
          onClick={() => setIsMenuOpen(false)}
        >
          Dashboard Admin
        </NavLink>
      )}
    </div>
  );

  return (
    <header className="w-full border-b bg-background/80 backdrop-blur-xl sticky top-0 z-50 shadow-professional">
      <nav className="container flex h-16 items-center justify-between px-4 sm:px-6">
        <NavLink to="/" className="inline-flex items-center gap-2 font-bold text-lg sm:text-xl gradient-text">
          NowLook
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
              {getUserRole(user) === 'business' && <NavLink to="/empresa/dashboard" className={navLink}>Dashboard</NavLink>}
            </div>
            
            <div className="flex items-center gap-2">
              {getUserRole(user) === 'business' && <NotificationCenter />}
              <ThemeToggle />
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">{getUserName(user)}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <NavLink to="/perfil" className="flex items-center gap-2 w-full">
                        <User className="h-4 w-4" />
                        Meu Perfil
                      </NavLink>
                    </DropdownMenuItem>
                    
                    {getUserRole(user) === 'business' && (
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
                            Gerenciar Empresa
                          </NavLink>
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    {getUserRole(user) === 'admin' && (
                      <DropdownMenuItem asChild>
                        <NavLink to="/dashboard" className="flex items-center gap-2 w-full">
                          <BarChart3 className="h-4 w-4" />
                          Dashboard
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
            {getUserRole(user) === 'business' && <NotificationCenter />}
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
                  
                  {getUserRole(user) === 'business' && (
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
                  
                  {getUserRole(user) === 'admin' && (
                    <DropdownMenuItem asChild>
                      <NavLink to="/dashboard" className="flex items-center gap-2 w-full">
                        <BarChart3 className="h-4 w-4" />
                        Dashboard
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
                  <span className="font-semibold text-lg gradient-text">Menu</span>
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

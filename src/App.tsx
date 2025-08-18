import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import Footer from "@/components/layout/Footer";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Agendar from "./pages/Agendar";
import Promocoes from "./pages/Promocoes";
import Perfil from "./pages/Perfil";
import Buscar from "./pages/Buscar";
import Estabelecimento from "./pages/Estabelecimento";
import EstabelecimentoPublico from "./pages/EstabelecimentoPublico";
import AuthInfo from "./pages/Auth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CompanyRegistration from "./pages/CompanyRegistration";
import CompanyDashboard from "./pages/CompanyDashboard";
import AdminControlCenter from "./pages/AdminControlCenter";
import CookieBanner from "./components/CookieBanner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/home" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/buscar" element={<Buscar />} />
                  <Route path="/estabelecimento/:id" element={<Estabelecimento />} />
                  <Route path="/loja/:id" element={<EstabelecimentoPublico />} />
                  <Route path="/agendar" element={<Agendar />} />
                  <Route path="/promocoes" element={<Promocoes />} />
                  <Route path="/perfil" element={<Perfil />} />
                  <Route path="/auth" element={<AuthInfo />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/empresa/cadastro" element={<CompanyRegistration />} />
                  <Route path="/empresa/dashboard" element={<CompanyDashboard />} />
                  <Route path="/admin" element={<AdminControlCenter />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <CookieBanner />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

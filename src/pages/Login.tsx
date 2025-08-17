import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import SiteHeader from '@/components/layout/SiteHeader';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [userType, setUserType] = useState<'client' | 'professional' | 'admin'>('client');
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegister) {
        const nameParts = name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        await register(email, password, firstName, lastName, userType as 'client' | 'business');
        toast.success('Cadastro realizado com sucesso!');
      } else {
        await login(email, password);
        toast.success('Login realizado com sucesso!');
      }
      navigate('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro na autenticação');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-16">
        <div className="max-w-md mx-auto">
          <Card className="shadow-professional">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl gradient-text">
                {isRegister ? 'Criar Conta' : 'Fazer Login'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={userType} onValueChange={(value) => setUserType(value as any)}>
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="client">Cliente</TabsTrigger>
                  <TabsTrigger value="business">Profissional</TabsTrigger>
                  <TabsTrigger value="admin">Admin</TabsTrigger>
                </TabsList>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {isRegister && (
                    <div>
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" variant="hero" disabled={loading}>
                    {loading ? 'Processando...' : (isRegister ? 'Cadastrar' : 'Entrar')}
                  </Button>
                </form>
                
                <div className="mt-4 text-center">
                  <Button
                    variant="link"
                    onClick={() => setIsRegister(!isRegister)}
                  >
                    {isRegister ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
                  </Button>
                </div>
                
                {/* Credenciais para teste */}
                <div className="mt-6 p-4 bg-muted rounded-lg text-sm">
                  <p className="font-semibold mb-2">Credenciais para teste:</p>
                  <p><strong>Admin:</strong> admin@mavinda.com</p>
                  <p><strong>Profissional:</strong> profissional@example.com</p>
                  <p><strong>Cliente:</strong> cliente@example.com</p>
                  <p className="text-muted-foreground mt-2">Senha: qualquer senha</p>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Login;
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  User, 
  Building2, 
  Eye, 
  Ban, 
  RotateCcw, 
  Key, 
  UserX,
  Calendar,
  DollarSign,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { mockAdminUsers } from '@/data/adminMockData';
import { AdminUser } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';

const UserManagement = () => {
  const [users, setUsers] = useState<AdminUser[]>(mockAdminUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [impersonationTarget, setImpersonationTarget] = useState<AdminUser | null>(null);
  const { toast } = useToast();

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
    const matchesType = filterType === 'all' || user.type === filterType;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: AdminUser['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'suspended':
        return <Badge className="bg-yellow-100 text-yellow-800">Suspenso</Badge>;
      case 'banned':
        return <Badge className="bg-red-100 text-red-800">Banido</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: AdminUser['type']) => {
    switch (type) {
      case 'client':
        return <Badge variant="outline" className="flex items-center gap-1"><User className="h-3 w-3" />Cliente</Badge>;
      case 'company':
        return <Badge variant="outline" className="flex items-center gap-1"><Building2 className="h-3 w-3" />Empresa</Badge>;
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const handleResetPassword = (user: AdminUser) => {
    toast({
      title: "Email de redefinição enviado",
      description: `Email de redefinição de senha enviado para ${user.email}`,
    });
  };

  const handleSuspendUser = (user: AdminUser) => {
    setUsers(prev => prev.map(u => 
      u.id === user.id ? { ...u, status: 'suspended' as const } : u
    ));
    toast({
      title: "Usuário suspenso",
      description: `${user.name} foi suspenso temporariamente`,
      variant: "destructive"
    });
  };

  const handleBanUser = (user: AdminUser) => {
    setUsers(prev => prev.map(u => 
      u.id === user.id ? { ...u, status: 'banned' as const } : u
    ));
    toast({
      title: "Usuário banido",
      description: `${user.name} foi banido permanentemente`,
      variant: "destructive"
    });
  };

  const handleReactivateUser = (user: AdminUser) => {
    setUsers(prev => prev.map(u => 
      u.id === user.id ? { ...u, status: 'active' as const } : u
    ));
    toast({
      title: "Usuário reativado",
      description: `${user.name} foi reativado com sucesso`,
    });
  };

  const handleImpersonateUser = (user: AdminUser) => {
    setImpersonationTarget(user);
    toast({
      title: "Personificação iniciada",
      description: `Navegando como ${user.name}. Ação registrada nos logs de auditoria.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Gerenciamento de Usuários</h2>
          <p className="text-muted-foreground">Visualizar e gerenciar todos os usuários da plataforma</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-sm">
            {filteredUsers.length} usuários encontrados
          </Badge>
        </div>
      </div>

      {/* Alertas de Personificação */}
      {impersonationTarget && (
        <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-950">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-orange-700 dark:text-orange-300">
            <strong>MODO PERSONIFICAÇÃO ATIVO:</strong> Você está navegando como {impersonationTarget.name} ({impersonationTarget.email}).
            <Button 
              variant="link" 
              className="p-0 ml-2 text-orange-700 dark:text-orange-300"
              onClick={() => setImpersonationTarget(null)}
            >
              Encerrar sessão
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Filtros e Busca */}
      <Card className="shadow-professional">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar e Filtrar Usuários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de usuário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="client">Clientes</SelectItem>
                <SelectItem value="company">Empresas</SelectItem>
                <SelectItem value="admin">Administradores</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="suspended">Suspenso</SelectItem>
                <SelectItem value="banned">Banido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Usuários */}
      <Card className="shadow-professional">
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último Acesso</TableHead>
                <TableHead>Atividade</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">{user.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(user.type)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(user.lastActive).toLocaleDateString('pt-BR')}
                      <br />
                      <span className="text-xs text-muted-foreground">
                        {new Date(user.lastActive).toLocaleTimeString('pt-BR')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.type === 'client' && (
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {user.totalBookings || 0} agendamentos
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          R$ {user.totalSpent?.toFixed(2) || '0,00'}
                        </div>
                      </div>
                    )}
                    {user.type === 'company' && (
                      <div className="text-sm">
                        <Badge 
                          variant={user.subscriptionStatus === 'active' ? 'default' : 'secondary'}
                        >
                          {user.subscriptionStatus === 'active' ? 'Assinatura Ativa' : 
                           user.subscriptionStatus === 'expired' ? 'Expirada' :
                           user.subscriptionStatus === 'cancelled' ? 'Cancelada' : 'Sem assinatura'}
                        </Badge>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Perfil Completo - {user.name}</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">Informações Básicas</h4>
                              <div className="space-y-1 text-sm">
                                <p><strong>Nome:</strong> {user.name}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Telefone:</strong> {user.phone}</p>
                                <p><strong>Tipo:</strong> {user.type}</p>
                                <p><strong>Status:</strong> {user.status}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Atividade</h4>
                              <div className="space-y-1 text-sm">
                                <p><strong>Cadastro:</strong> {new Date(user.createdAt).toLocaleDateString('pt-BR')}</p>
                                <p><strong>Último acesso:</strong> {new Date(user.lastActive).toLocaleDateString('pt-BR')}</p>
                                {user.totalBookings !== undefined && (
                                  <p><strong>Total de agendamentos:</strong> {user.totalBookings}</p>
                                )}
                                {user.totalSpent !== undefined && (
                                  <p><strong>Total gasto:</strong> R$ {user.totalSpent.toFixed(2)}</p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button 
                              onClick={() => handleResetPassword(user)}
                              variant="outline"
                              className="flex items-center gap-2"
                            >
                              <Key className="h-4 w-4" />
                              Resetar Senha
                            </Button>
                            <Button 
                              onClick={() => handleImpersonateUser(user)}
                              variant="outline"
                              className="flex items-center gap-2 text-orange-600"
                            >
                              <Activity className="h-4 w-4" />
                              Personificar Usuário
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {user.status === 'active' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleSuspendUser(user)}
                            className="text-yellow-600"
                          >
                            <Ban className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleBanUser(user)}
                            className="text-red-600"
                          >
                            <UserX className="h-3 w-3" />
                          </Button>
                        </>
                      )}

                      {(user.status === 'suspended' || user.status === 'banned') && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleReactivateUser(user)}
                          className="text-green-600"
                        >
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
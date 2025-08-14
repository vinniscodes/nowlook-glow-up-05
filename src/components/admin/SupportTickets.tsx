import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, 
  MessageSquare, 
  Eye, 
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageCircle,
  User,
  Calendar,
  FileText
} from 'lucide-react';
import { mockSupportTickets } from '@/data/adminMockData';
import { SupportTicket } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';

const SupportTickets = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockSupportTickets);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const { toast } = useToast();

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />Aberto
        </Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
          <Clock className="h-3 w-3" />Em Andamento
        </Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />Resolvido
        </Badge>;
      case 'closed':
        return <Badge className="bg-gray-100 text-gray-800 flex items-center gap-1">
          <XCircle className="h-3 w-3" />Fechado
        </Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">URGENTE</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">Alta</Badge>;
      case 'medium':
        return <Badge className="bg-blue-100 text-blue-800">Média</Badge>;
      case 'low':
        return <Badge className="bg-gray-100 text-gray-800">Baixa</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const handleAssignTicket = (ticket: SupportTicket) => {
    setTickets(prev => prev.map(t => 
      t.id === ticket.id 
        ? { ...t, status: 'in_progress', assignedTo: 'admin@nowlook.com', updatedAt: new Date().toISOString() }
        : t
    ));
    toast({
      title: "Ticket atribuído",
      description: `Ticket #${ticket.id} foi atribuído a você`,
    });
  };

  const handleResolveTicket = (ticket: SupportTicket) => {
    if (!responseMessage.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, escreva uma resposta antes de resolver o ticket",
        variant: "destructive"
      });
      return;
    }

    setTickets(prev => prev.map(t => 
      t.id === ticket.id 
        ? { ...t, status: 'resolved', updatedAt: new Date().toISOString() }
        : t
    ));

    toast({
      title: "Ticket resolvido",
      description: `Ticket #${ticket.id} foi marcado como resolvido e resposta enviada`,
    });

    setResponseMessage('');
  };

  const handleCloseTicket = (ticket: SupportTicket) => {
    setTickets(prev => prev.map(t => 
      t.id === ticket.id 
        ? { ...t, status: 'closed', updatedAt: new Date().toISOString() }
        : t
    ));
    toast({
      title: "Ticket fechado",
      description: `Ticket #${ticket.id} foi fechado`,
    });
  };

  const getTimeSince = (date: string) => {
    const now = new Date();
    const ticketDate = new Date(date);
    const diffMs = now.getTime() - ticketDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} dia(s) atrás`;
    } else if (diffHours > 0) {
      return `${diffHours} hora(s) atrás`;
    } else {
      return 'Recente';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Sistema de Suporte</h2>
          <p className="text-muted-foreground">Gerencie tickets e resolva problemas dos usuários</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-sm">
            {filteredTickets.length} tickets encontrados
          </Badge>
          <Badge variant="destructive" className="text-sm">
            {tickets.filter(t => t.status === 'open').length} em aberto
          </Badge>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-professional">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tickets Abertos</p>
                <p className="text-2xl font-bold text-red-600">
                  {tickets.filter(t => t.status === 'open').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-professional">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Em Andamento</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {tickets.filter(t => t.status === 'in_progress').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-professional">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolvidos</p>
                <p className="text-2xl font-bold text-green-600">
                  {tickets.filter(t => t.status === 'resolved').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-professional">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alta Prioridade</p>
                <p className="text-2xl font-bold text-orange-600">
                  {tickets.filter(t => t.priority === 'high' || t.priority === 'urgent').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <Card className="shadow-professional">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar e Filtrar Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Buscar por assunto, email ou mensagem..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="open">Aberto</SelectItem>
                <SelectItem value="in_progress">Em andamento</SelectItem>
                <SelectItem value="resolved">Resolvido</SelectItem>
                <SelectItem value="closed">Fechado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as prioridades</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Tickets */}
      <Card className="shadow-professional">
        <CardHeader>
          <CardTitle>Lista de Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Tempo</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">#{ticket.id}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {ticket.subject}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">{ticket.userEmail}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                  <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {getTimeSince(ticket.createdAt)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {ticket.assignedTo ? (
                      <Badge variant="outline">
                        {ticket.assignedTo}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Não atribuído</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedTicket(ticket)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Ticket #{ticket.id} - {ticket.subject}</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                              <h4 className="font-semibold mb-2">Mensagem do Usuário</h4>
                              <div className="bg-muted p-4 rounded-lg mb-4">
                                <p className="text-sm">{ticket.message}</p>
                              </div>

                              <h4 className="font-semibold mb-2">Responder ao Ticket</h4>
                              <Textarea
                                placeholder="Digite sua resposta..."
                                value={responseMessage}
                                onChange={(e) => setResponseMessage(e.target.value)}
                                className="min-h-32 mb-4"
                              />

                              <div className="flex gap-2">
                                {ticket.status === 'open' && (
                                  <Button onClick={() => handleAssignTicket(ticket)}>
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Atribuir a mim
                                  </Button>
                                )}
                                {(ticket.status === 'open' || ticket.status === 'in_progress') && (
                                  <Button 
                                    onClick={() => handleResolveTicket(ticket)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Resolver
                                  </Button>
                                )}
                                <Button 
                                  onClick={() => handleCloseTicket(ticket)}
                                  variant="outline"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Fechar
                                </Button>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-3">Detalhes do Ticket</h4>
                              <div className="space-y-3 text-sm">
                                <div>
                                  <strong>ID:</strong> #{ticket.id}
                                </div>
                                <div>
                                  <strong>Status:</strong> {getStatusBadge(ticket.status)}
                                </div>
                                <div>
                                  <strong>Prioridade:</strong> {getPriorityBadge(ticket.priority)}
                                </div>
                                <div>
                                  <strong>Usuário:</strong> {ticket.userEmail}
                                </div>
                                <div>
                                  <strong>Criado em:</strong><br />
                                  {new Date(ticket.createdAt).toLocaleString('pt-BR')}
                                </div>
                                <div>
                                  <strong>Atualizado em:</strong><br />
                                  {new Date(ticket.updatedAt).toLocaleString('pt-BR')}
                                </div>
                                {ticket.assignedTo && (
                                  <div>
                                    <strong>Responsável:</strong><br />
                                    {ticket.assignedTo}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {ticket.status === 'open' && !ticket.assignedTo && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAssignTicket(ticket)}
                        >
                          <MessageCircle className="h-3 w-3" />
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

export default SupportTickets;
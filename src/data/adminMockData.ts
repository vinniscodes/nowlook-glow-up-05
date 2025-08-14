import { AdminUser, SupportTicket, AdminAlert, PlatformMetrics, Transaction, Review, ModeratedContent, AdminLog } from '@/types/admin';

export const mockAdminUsers: AdminUser[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '(11) 99999-1111',
    type: 'client',
    status: 'active',
    createdAt: '2024-01-10T10:00:00Z',
    lastActive: '2024-01-20T15:30:00Z',
    totalBookings: 5,
    totalSpent: 150.0
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@barbeariamoderna.com',
    phone: '(11) 99999-2222',
    type: 'company',
    status: 'active',
    createdAt: '2024-01-05T09:00:00Z',
    lastActive: '2024-01-20T14:20:00Z',
    subscriptionStatus: 'active'
  },
  {
    id: '3',
    name: 'Pedro Costa',
    email: 'pedro@email.com',
    phone: '(11) 99999-3333',
    type: 'client',
    status: 'suspended',
    createdAt: '2024-01-15T11:00:00Z',
    lastActive: '2024-01-18T16:45:00Z',
    totalBookings: 2,
    totalSpent: 60.0
  },
  {
    id: '4',
    name: 'Ana Oliveira',
    email: 'ana@belezatotal.com',
    phone: '(11) 99999-4444',
    type: 'company',
    status: 'active',
    createdAt: '2024-01-08T14:30:00Z',
    lastActive: '2024-01-20T12:10:00Z',
    subscriptionStatus: 'expired'
  }
];

export const mockSupportTickets: SupportTicket[] = [
  {
    id: '1',
    userId: '1',
    userEmail: 'joao@email.com',
    subject: 'Problema com pagamento',
    message: 'Meu cartão foi cobrado mas o agendamento não foi confirmado.',
    status: 'open',
    priority: 'high',
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T10:30:00Z'
  },
  {
    id: '2',
    userId: '2',
    userEmail: 'maria@barbeariamoderna.com',
    subject: 'Dúvida sobre comissões',
    message: 'Como funciona o cálculo das comissões da plataforma?',
    status: 'in_progress',
    priority: 'medium',
    createdAt: '2024-01-19T14:20:00Z',
    updatedAt: '2024-01-20T09:15:00Z',
    assignedTo: 'admin@nowlook.com'
  },
  {
    id: '3',
    userId: '3',
    userEmail: 'pedro@email.com',
    subject: 'Conta suspensa injustamente',
    message: 'Minha conta foi suspensa sem motivo aparente. Gostaria de uma revisão.',
    status: 'resolved',
    priority: 'high',
    createdAt: '2024-01-18T16:50:00Z',
    updatedAt: '2024-01-19T11:30:00Z',
    assignedTo: 'admin@nowlook.com'
  }
];

export const mockAdminAlerts: AdminAlert[] = [
  {
    id: '1',
    type: 'payment_failed',
    title: 'Falha em pagamento de assinatura',
    description: 'Barbearia Moderna - Pagamento mensal rejeitado',
    severity: 'warning',
    timestamp: '2024-01-20T14:30:00Z',
    resolved: false,
    actionUrl: '/admin/companies/2'
  },
  {
    id: '2',
    type: 'new_ticket',
    title: 'Novo ticket de alta prioridade',
    description: 'Cliente reportou problema com pagamento',
    severity: 'error',
    timestamp: '2024-01-20T10:30:00Z',
    resolved: false,
    actionUrl: '/admin/support/1'
  },
  {
    id: '3',
    type: 'high_volume',
    title: 'Alto volume de transações',
    description: 'Pico de agendamentos detectado (150% acima da média)',
    severity: 'info',
    timestamp: '2024-01-20T12:00:00Z',
    resolved: true
  }
];

export const mockPlatformMetrics: PlatformMetrics = {
  usersToday: 12,
  usersThisWeek: 47,
  companiesTotal: 156,
  transactionVolumeToday: 2850.50,
  transactionVolumeMonth: 45200.75,
  bookingsToday: 38,
  bookingsMonth: 892,
  activeSubscriptions: 142,
  expiredSubscriptions: 8,
  cancelledSubscriptions: 6,
  pendingTickets: 3,
  totalRevenue: 123456.78,
  platformCommission: 15432.09
};

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'booking_payment',
    userId: '1',
    userEmail: 'joao@email.com',
    companyId: '1',
    companyName: 'Barbearia Moderna',
    amount: 25.0,
    platformFee: 2.5,
    currency: 'BRL',
    status: 'completed',
    paymentMethod: 'card',
    stripeTransactionId: 'pi_1234567890',
    createdAt: '2024-01-20T10:00:00Z',
    description: 'Corte Masculino - João Silva'
  },
  {
    id: '2',
    type: 'subscription_payment',
    userId: '2',
    userEmail: 'maria@barbeariamoderna.com',
    amount: 99.0,
    platformFee: 0,
    currency: 'BRL',
    status: 'completed',
    paymentMethod: 'card',
    stripeTransactionId: 'sub_1234567890',
    createdAt: '2024-01-20T09:30:00Z',
    description: 'Assinatura Mensal - Plano Premium'
  },
  {
    id: '3',
    type: 'refund',
    userId: '1',
    userEmail: 'joao@email.com',
    companyId: '1',
    companyName: 'Barbearia Moderna',
    amount: -25.0,
    platformFee: -2.5,
    currency: 'BRL',
    status: 'completed',
    paymentMethod: 'card',
    stripeTransactionId: 'refund_1234567890',
    createdAt: '2024-01-19T16:20:00Z',
    description: 'Reembolso - Serviço cancelado'
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    bookingId: '1',
    clientId: '1',
    clientName: 'João Silva',
    companyId: '1',
    companyName: 'Barbearia Moderna',
    rating: 5,
    comment: 'Excelente atendimento! Muito profissional.',
    createdAt: '2024-01-15T11:00:00Z',
    status: 'published'
  },
  {
    id: '2',
    bookingId: '2',
    clientId: '3',
    clientName: 'Pedro Costa',
    companyId: '1',
    companyName: 'Barbearia Moderna',
    rating: 1,
    comment: 'Péssimo serviço, não recomendo. O barbeiro estava claramente despreparado.',
    createdAt: '2024-01-18T17:30:00Z',
    status: 'flagged',
    flagReason: 'Possível avaliação falsa',
    flaggedBy: 'maria@barbeariamoderna.com'
  }
];

export const mockModeratedContent: ModeratedContent[] = [
  {
    id: '1',
    type: 'review',
    contentId: '2',
    reason: 'Estabelecimento alega que cliente nunca esteve no local',
    status: 'pending',
    reportedBy: 'maria@barbeariamoderna.com',
    content: 'Péssimo serviço, não recomendo. O barbeiro estava claramente despreparado.'
  }
];

export const mockAdminLogs: AdminLog[] = [
  {
    id: '1',
    adminId: 'admin1',
    adminEmail: 'admin@nowlook.com',
    action: 'user_impersonation',
    target: 'user',
    targetId: '1',
    details: 'Logou como João Silva para investigar problema de pagamento',
    timestamp: '2024-01-20T15:30:00Z',
    ipAddress: '192.168.1.100'
  },
  {
    id: '2',
    adminId: 'admin1',
    adminEmail: 'admin@nowlook.com',
    action: 'subscription_extend',
    target: 'company',
    targetId: '2',
    details: 'Estendeu assinatura por 7 dias como cortesia',
    timestamp: '2024-01-20T14:20:00Z',
    ipAddress: '192.168.1.100'
  },
  {
    id: '3',
    adminId: 'admin1',
    adminEmail: 'admin@nowlook.com',
    action: 'refund_processed',
    target: 'transaction',
    targetId: '3',
    details: 'Processou reembolso de R$ 25,00 para João Silva',
    timestamp: '2024-01-19T16:25:00Z',
    ipAddress: '192.168.1.100'
  }
];
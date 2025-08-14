// Tipos específicos para o painel administrativo

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'client' | 'company' | 'admin';
  status: 'active' | 'suspended' | 'banned';
  createdAt: string;
  lastActive: string;
  totalBookings?: number;
  totalSpent?: number;
  subscriptionStatus?: 'active' | 'expired' | 'cancelled' | 'none';
}

export interface SupportTicket {
  id: string;
  userId: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

export interface AdminAlert {
  id: string;
  type: 'payment_failed' | 'new_ticket' | 'dispute' | 'system_error' | 'high_volume';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  timestamp: string;
  resolved: boolean;
  actionUrl?: string;
}

export interface PlatformMetrics {
  usersToday: number;
  usersThisWeek: number;
  companiesTotal: number;
  transactionVolumeToday: number;
  transactionVolumeMonth: number;
  bookingsToday: number;
  bookingsMonth: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  cancelledSubscriptions: number;
  pendingTickets: number;
  totalRevenue: number;
  platformCommission: number;
}

export interface Transaction {
  id: string;
  type: 'booking_payment' | 'subscription_payment' | 'refund';
  userId: string;
  userEmail: string;
  companyId?: string;
  companyName?: string;
  amount: number;
  platformFee: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'pix' | 'cash';
  stripeTransactionId?: string;
  createdAt: string;
  description: string;
}

export interface Review {
  id: string;
  bookingId: string;
  clientId: string;
  clientName: string;
  companyId: string;
  companyName: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: 'published' | 'flagged' | 'removed';
  flagReason?: string;
  flaggedBy?: string;
  moderatedBy?: string;
  moderatedAt?: string;
}

export interface ModeratedContent {
  id: string;
  type: 'review' | 'profile_image' | 'company_description';
  contentId: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  reportedBy: string;
  moderatedBy?: string;
  moderatedAt?: string;
  content: string;
}

export interface AdminLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  target: string;
  targetId: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}
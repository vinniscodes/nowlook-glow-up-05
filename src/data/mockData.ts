import { Company, Service, Booking, PaymentData, Review, Professional } from '@/types';

export const mockServices: Service[] = [
  { id: '1', name: 'Corte Masculino', price: 25, duration: 30, description: 'Corte moderno e estiloso' },
  { id: '2', name: 'Barba', price: 15, duration: 20, description: 'Barba alinhada e aparada' },
  { id: '3', name: 'Manicure', price: 20, duration: 45, description: 'Cuidados completos para as unhas' },
  { id: '4', name: 'Pedicure', price: 25, duration: 60, description: 'Tratamento completo para os pés' },
  { id: '5', name: 'Escova', price: 30, duration: 40, description: 'Escova modeladora' },
  { id: '6', name: 'Coloração', price: 80, duration: 120, description: 'Coloração completa' },
];

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Barbearia Moderna',
    address: 'Rua das Flores, 123 - Centro',
    phone: '(11) 99999-1111',
    email: 'contato@barbearia.com',
    latitude: -23.5505,
    longitude: -46.6333,
    services: [mockServices[0], mockServices[1]],
    ownerId: '2',
    verified: true
  },
  {
    id: '2',
    name: 'Salão Beleza Total',
    address: 'Av. Paulista, 456 - Bela Vista',
    phone: '(11) 99999-2222',
    email: 'contato@belezatotal.com',
    latitude: -23.5616,
    longitude: -46.6562,
    services: [mockServices[2], mockServices[3], mockServices[4], mockServices[5]],
    ownerId: '2',
    verified: true
  },
  {
    id: '3',
    name: 'Studio Hair & Beauty',
    address: 'Rua Augusta, 789 - Consolação',
    phone: '(11) 99999-3333',
    email: 'contato@studiohair.com',
    latitude: -23.5558,
    longitude: -46.6396,
    services: mockServices,
    ownerId: '2',
    verified: true
  }
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    clientId: '3',
    clientName: 'João Silva',
    companyId: '1',
    companyName: 'Barbearia Moderna',
    serviceId: '1',
    serviceName: 'Corte Masculino',
    date: '2024-01-15',
    time: '10:00',
    price: 25,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    status: 'confirmed'
  },
  {
    id: '2',
    clientId: '3',
    clientName: 'João Silva',
    companyId: '2',
    companyName: 'Salão Beleza Total',
    serviceId: '3',
    serviceName: 'Manicure',
    date: '2024-01-16',
    time: '14:30',
    price: 20,
    paymentMethod: 'pix',
    paymentStatus: 'paid',
    status: 'completed'
  },
  {
    id: '3',
    clientId: '3',
    clientName: 'João Silva',
    companyId: '3',
    companyName: 'Studio Hair & Beauty',
    serviceId: '5',
    serviceName: 'Escova',
    date: '2024-01-18',
    time: '16:00',
    price: 30,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    status: 'confirmed'
  }
];

export const mockPayments: PaymentData[] = [
  {
    id: '1',
    bookingId: '1',
    amount: 25,
    method: 'card',
    status: 'paid',
    date: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    bookingId: '2',
    amount: 20,
    method: 'pix',
    status: 'paid',
    date: '2024-01-16T14:30:00Z'
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    clientId: '3',
    clientName: 'João Silva',
    companyId: '1',
    serviceId: '1',
    serviceName: 'Corte Masculino',
    rating: 5,
    comment: 'Excelente atendimento! Muito profissional e o resultado ficou perfeito.',
    date: '2024-01-15'
  },
  {
    id: '2',
    clientId: '3',
    clientName: 'João Silva',
    companyId: '2',
    serviceId: '3',
    serviceName: 'Manicure',
    rating: 4,
    comment: 'Bom atendimento, ambiente agradável. Voltarei em breve.',
    date: '2024-01-16'
  },
  {
    id: '3',
    clientId: '1',
    clientName: 'Maria Oliveira',
    companyId: '1',
    serviceId: '1',
    serviceName: 'Corte Masculino',
    rating: 5,
    comment: 'Sempre venho aqui, nunca me decepciona. Recomendo!',
    date: '2024-01-10'
  },
  {
    id: '4',
    clientId: '2',
    clientName: 'Ana Carolina',
    companyId: '2',
    serviceId: '4',
    serviceName: 'Pedicure',
    rating: 4,
    comment: 'Serviço muito bom, profissionais competentes.',
    date: '2024-01-12'
  },
  {
    id: '5',
    clientId: '1',
    clientName: 'Maria Oliveira',
    companyId: '3',
    serviceId: '5',
    serviceName: 'Escova',
    rating: 5,
    comment: 'Adorei o resultado! Voltarei com certeza.',
    date: '2024-01-08'
  }
];

export const mockProfessionals: Professional[] = [
  {
    id: '1',
    name: 'Carlos Santos',
    companyId: '1',
    specialty: 'Cortes Masculinos e Barba',
    rating: 4.8
  },
  {
    id: '2',
    name: 'Ana Silva',
    companyId: '2',
    specialty: 'Unhas e Tratamentos',
    rating: 4.9
  },
  {
    id: '3',
    name: 'Marina Costa',
    companyId: '2',
    specialty: 'Cabelos e Coloração',
    rating: 4.7
  },
  {
    id: '4',
    name: 'Roberto Lima',
    companyId: '3',
    specialty: 'Cortes e Escova',
    rating: 4.6
  },
  {
    id: '5',
    name: 'Juliana Neves',
    companyId: '3',
    specialty: 'Coloração e Tratamentos',
    rating: 4.8
  }
];
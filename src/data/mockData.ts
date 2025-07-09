
export interface UseCase {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  slug: string;
}

export interface CallRecord {
  id: string;
  caller: string;
  duration: string;
  status: 'completed' | 'transferred' | 'missed';
  timestamp: Date;
  summary: string;
}

export interface Appointment {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  service: string;
  date: Date;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'url';
  size?: string;
  uploadedAt: Date;
  status: 'processing' | 'ready' | 'error';
  url?: string;
}

export const useCases: UseCase[] = [
  {
    id: '1',
    title: 'Answering FAQ',
    description: 'Handle common customer questions automatically',
    icon: '❓',
    color: '#7B61FF',
    slug: 'faq-handler'
  },
  {
    id: '2',
    title: 'Gather Customer Info',
    description: 'Collect leads and customer details efficiently',
    icon: '📋',
    color: '#FF3E8E',
    slug: 'lead-capture'
  },
  {
    id: '3',
    title: 'Call Transfers',
    description: 'Route calls to the right department or person',
    icon: '📞',
    color: '#00CFC8',
    slug: 'call-routing'
  },
  {
    id: '4',
    title: 'Texting Links',
    description: 'Send follow-up texts with helpful links',
    icon: '💬',
    color: '#FCE38A',
    slug: 'text-links'
  },
  {
    id: '5',
    title: 'Booking Appointments',
    description: 'Schedule meetings and appointments seamlessly',
    icon: '📅',
    color: '#B17A50',
    slug: 'appointment-booking'
  },
  {
    id: '6',
    title: 'API Integrations',
    description: 'Connect with your existing tools and systems',
    icon: '🔗',
    color: '#4C51E0',
    slug: 'api-integrations'
  }
];

export const mockCalls: CallRecord[] = [
  {
    id: '1',
    caller: 'Sarah Johnson',
    duration: '2:45',
    status: 'completed',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    summary: 'Asked about pricing and scheduled a demo'
  },
  {
    id: '2',
    caller: 'Mike Chen',
    duration: '1:30',
    status: 'transferred',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    summary: 'Technical support request - transferred to engineering'
  },
  {
    id: '3',
    caller: 'Emma Wilson',
    duration: '3:20',
    status: 'completed',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    summary: 'Booked appointment for next week'
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    customerName: 'John Smith',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    service: 'Consultation',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24),
    time: '10:00 AM',
    status: 'confirmed',
    notes: 'First-time customer, interested in premium package'
  },
  {
    id: '2',
    customerName: 'Lisa Garcia',
    email: 'lisa@example.com',
    phone: '(555) 987-6543',
    service: 'Follow-up',
    date: new Date(Date.now() + 1000 * 60 * 60 * 48),
    time: '2:30 PM',
    status: 'pending'
  }
];

export const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Product Guide.pdf',
    type: 'pdf',
    size: '2.4 MB',
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: 'ready'
  },
  {
    id: '2',
    name: 'FAQ Document.docx',
    type: 'docx',
    size: '1.2 MB',
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    status: 'processing'
  },
  {
    id: '3',
    name: 'Company Website',
    type: 'url',
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    status: 'ready',
    url: 'https://example.com'
  }
];

export const kpiData = {
  callsHandled: 247,
  bookingsCompleted: 23,
  upsellRate: 18.5,
  customerSatisfaction: 4.8
};

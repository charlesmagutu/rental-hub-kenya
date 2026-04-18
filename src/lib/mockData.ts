import { Property, Unit, Tenant, Payment, Receipt, Expense, SecurityDeposit, Notice, Booking, Notification, MaintenanceRequest } from '../types';

export const mockProperties: Property[] = [
  {
    id: 'prop-1',
    name: 'Skyline Heights',
    address: 'Kileleshwa, Nairobi',
    description: 'Modern apartments with premium finishing and rooftop pool.',
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c7f8250c-26df-4474-b12f-e48d039cd83b/luxury-apartment-complex-5c8efcb0-1776519608095.webp',
    units_count: 24,
    owner_id: 'user-1',
    notice_period_days: 30
  },
  {
    id: 'prop-2',
    name: 'Gardenia Villas',
    address: 'Muthaiga, Nairobi',
    description: 'Serene gated community with lush gardens.',
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c7f8250c-26df-4474-b12f-e48d039cd83b/modern-interior-4bf08a38-1776519608075.webp',
    units_count: 12,
    owner_id: 'user-1',
    notice_period_days: 30
  }
];

export const mockUnits: Unit[] = [
  { 
    id: 'u-101', 
    property_id: 'prop-1', 
    unit_number: 'A101', 
    type: '2 Bedroom', 
    rent_amount: 85000, 
    status: 'OCCUPIED', 
    features: ['WiFi', 'Balcony', 'Parking'],
    layout_image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c7f8250c-26df-4474-b12f-e48d039cd83b/2-bedroom-floor-plan-72bc490b-1776520083415.webp'
  },
  { 
    id: 'u-102', 
    property_id: 'prop-1', 
    unit_number: 'A102', 
    type: 'Studio', 
    rent_amount: 45000, 
    status: 'AVAILABLE', 
    features: ['WiFi', 'Kitchenette'],
    layout_image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c7f8250c-26df-4474-b12f-e48d039cd83b/studio-floor-plan-23c4c809-1776520084536.webp'
  },
  { 
    id: 'u-201', 
    property_id: 'prop-2', 
    unit_number: 'V01', 
    type: '4 Bedroom Villa', 
    rent_amount: 250000, 
    status: 'OCCUPIED', 
    features: ['Pool', 'Garden', 'Servant Quarter'],
    layout_image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c7f8250c-26df-4474-b12f-e48d039cd83b/villa-floor-plan-e4f48fa9-1776520084706.webp'
  },
  { 
    id: 'u-202', 
    property_id: 'prop-2', 
    unit_number: 'V02', 
    type: '4 Bedroom Villa', 
    rent_amount: 250000, 
    status: 'AVAILABLE', 
    features: ['Pool', 'Garden'],
    layout_image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c7f8250c-26df-4474-b12f-e48d039cd83b/villa-floor-plan-e4f48fa9-1776520084706.webp'
  }
];

export const mockTenants: Tenant[] = [
  {
    id: 't-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+254712345678',
    id_number: '30123456',
    unit_id: 'u-101',
    property_id: 'prop-1',
    lease_start: '2023-01-01',
    lease_end: '2023-12-31',
    status: 'ACTIVE'
  },
  {
    id: 't-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+254787654321',
    id_number: '28987654',
    unit_id: 'u-201',
    property_id: 'prop-2',
    lease_start: '2023-06-01',
    lease_end: '2024-05-31',
    status: 'NOTICE'
  }
];

export const mockPayments: Payment[] = [
  { id: 'p-1', tenant_id: 't-1', unit_id: 'u-101', amount: 85000, method: 'MPESA', reference: 'RLJ9SK82LK', date: '2023-10-01', status: 'COMPLETED', type: 'RENT' },
  { id: 'p-2', tenant_id: 't-2', unit_id: 'u-201', amount: 250000, method: 'STRIPE', reference: 'ch_3Nabc123', date: '2023-10-02', status: 'COMPLETED', type: 'RENT' },
  { id: 'p-3', tenant_id: 't-1', unit_id: 'u-101', amount: 3500, method: 'MPESA', reference: 'MJK89L12OP', date: '2023-10-15', status: 'PENDING', type: 'UTILITY' }
];

export const mockReceipts: Receipt[] = [
  {
    id: 'rcp-1',
    receipt_number: 'RCP-2023-001',
    payment_id: 'p-1',
    tenant_name: 'John Doe',
    unit_number: 'A101',
    property_name: 'Skyline Heights',
    amount_paid: 85000,
    method: 'M-Pesa',
    reference: 'RLJ9SK82LK',
    date: 'Oct 1, 2023',
    verification_code: 'VER-8829'
  }
];

export const mockExpenses: Expense[] = [
  { id: 'e-1', property_id: 'prop-1', category: 'MAINTENANCE', amount: 15000, description: 'Fixing broken elevator', date: '2023-10-10', status: 'PAID' },
  { id: 'e-2', property_id: 'prop-1', category: 'UTILITY', amount: 45000, description: 'Communal area electricity', date: '2023-10-12', status: 'PAID' }
];

export const mockDeposits: SecurityDeposit[] = [
  { id: 'd-1', tenant_id: 't-1', amount: 85000, is_refunded: false, deductions: 0 }
];

export const mockNotices: Notice[] = [
  { id: 'n-1', tenant_id: 't-2', notice_date: '2023-10-01', move_out_date: '2023-11-01', reason: 'Moving to a new city', is_approved: true, status: 'APPROVED' }
];

export const mockBookings: Booking[] = [
  { id: 'b-1', unit_id: 'u-102', applicant_name: 'Michael Kariuki', applicant_email: 'mike@example.com', applicant_phone: '+254700112233', move_in_date: '2023-12-01', status: 'PENDING', created_at: '2023-10-25' }
];

export const mockNotifications: Notification[] = [
  { id: 'not-1', user_id: 'user-1', title: 'Payment Received', message: 'John Doe has paid KES 85,000 via M-Pesa.', channel: 'SYSTEM', is_sent: true, created_at: '2023-10-01T10:00:00Z', is_read: false },
  { id: 'not-2', user_id: 'user-1', title: 'New Booking', message: 'Michael Kariuki applied for Unit A102.', channel: 'SYSTEM', is_sent: true, created_at: '2023-10-25T14:30:00Z', is_read: false }
];

export const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'm-1',
    unit_id: 'u-101',
    tenant_id: 't-1',
    title: 'Leaking Faucet',
    description: 'The kitchen faucet is leaking since yesterday.',
    priority: 'MEDIUM',
    status: 'PENDING',
    created_at: '2023-10-20T09:00:00Z'
  },
  {
    id: 'm-2',
    unit_id: 'u-201',
    tenant_id: 't-2',
    title: 'AC Not Working',
    description: 'The AC unit in the master bedroom is not cooling.',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    created_at: '2023-10-21T14:20:00Z',
    scheduled_for: '2023-10-22T10:00:00Z'
  }
];
export type Role = 'ADMIN' | 'LANDLORD' | 'TENANT' | 'STAFF';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatar?: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  description: string;
  image: string;
  units_count: number;
  owner_id: string;
  notice_period_days: number;
}

export interface Unit {
  id: string;
  property_id: string;
  unit_number: string;
  type: string;
  rent_amount: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE';
  layout_image?: string;
  features: string[];
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  id_number: string;
  unit_id: string;
  property_id: string;
  lease_start: string;
  lease_end: string;
  status: 'ACTIVE' | 'NOTICE' | 'MOVED_OUT';
}

export interface Payment {
  id: string;
  tenant_id: string;
  unit_id: string;
  amount: number;
  method: 'MPESA' | 'STRIPE' | 'BANK' | 'CASH';
  reference: string;
  mpesa_receipt?: string;
  stripe_id?: string;
  date: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  type: 'RENT' | 'UTILITY' | 'DEPOSIT';
}

export interface Receipt {
  id: string;
  receipt_number: string;
  payment_id: string;
  tenant_name: string;
  unit_number: string;
  property_name: string;
  amount_paid: number;
  method: string;
  reference: string;
  date: string;
  verification_code: string;
  pdf_url?: string;
}

export interface UtilityBill {
  id: string;
  unit_id: string;
  type: 'WATER' | 'ELECTRICITY' | 'GAS' | 'GARBAGE' | 'SECURITY';
  amount: number;
  billing_month: string;
  status: 'PAID' | 'UNPAID';
  reading_prev?: number;
  reading_curr?: number;
}

export interface Booking {
  id: string;
  unit_id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  move_in_date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
}

export interface SecurityDeposit {
  id: string;
  tenant_id: string;
  amount: number;
  is_refunded: boolean;
  refund_date?: string;
  deductions: number;
  reason?: string;
}

export interface Notice {
  id: string;
  tenant_id: string;
  notice_date: string;
  move_out_date: string;
  reason: string;
  is_approved: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Expense {
  id: string;
  property_id: string;
  category: 'MAINTENANCE' | 'UTILITY' | 'TAX' | 'SALARY' | 'OTHER';
  amount: number;
  description: string;
  date: string;
  status: 'PAID' | 'PENDING';
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  channel: 'SMS' | 'EMAIL' | 'WHATSAPP' | 'SYSTEM';
  is_sent: boolean;
  created_at: string;
  is_read: boolean;
}

export interface MaintenanceRequest {
  id: string;
  unit_id: string;
  tenant_id: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  created_at: string;
  scheduled_for?: string;
  completed_at?: string;
  estimated_cost?: number;
  actual_cost?: number;
  images?: string[];
}
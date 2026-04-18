import axios from 'axios';
import { toast } from 'sonner';
import { 
  User, Property, Unit, Tenant, Payment, 
  Receipt, UtilityBill, SecurityDeposit, 
  Notice, Booking, Expense, Notification, MaintenanceRequest 
} from '../types';
import { 
  mockProperties, mockUnits, mockTenants, 
  mockPayments, mockReceipts, mockExpenses,
  mockDeposits, mockNotices, mockBookings,
  mockNotifications, mockMaintenanceRequests
} from './mockData';

const STORAGE_KEYS = {
  PROPERTIES: 'rf_properties',
  UNITS: 'rf_units',
  TENANTS: 'rf_tenants',
  PAYMENTS: 'rf_payments',
  RECEIPTS: 'rf_receipts',
  EXPENSES: 'rf_expenses',
  DEPOSITS: 'rf_deposits',
  NOTICES: 'rf_notices',
  BOOKINGS: 'rf_bookings',
  NOTIFICATIONS: 'rf_notifications',
  MAINTENANCE: 'rf_maintenance',
  AUTH: 'rf_auth_user'
};

class ApiService {
  public getData<T>(key: string, initial: T[]): T[] {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  }

  private saveData<T>(key: string, data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Auth
  async login(email: string, password: string): Promise<User> {
    const user: User = { id: 'user-1', name: 'Alex Kariuki', email, role: 'LANDLORD', avatar: 'AK' };
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
    return user;
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.AUTH);
    return data ? JSON.parse(data) : null;
  }

  logout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  }

  // Properties
  async getProperties(): Promise<Property[]> {
    return this.getData(STORAGE_KEYS.PROPERTIES, mockProperties);
  }

  // Units
  async getUnits(): Promise<Unit[]> {
    return this.getData(STORAGE_KEYS.UNITS, mockUnits);
  }

  async updateUnitStatus(id: string, status: Unit['status']) {
    const units = await this.getUnits();
    const updated = units.map(u => u.id === id ? { ...u, status } : u);
    this.saveData(STORAGE_KEYS.UNITS, updated);
  }

  // Tenants
  async getTenants(): Promise<Tenant[]> {
    return this.getData(STORAGE_KEYS.TENANTS, mockTenants);
  }

  // Deposits
  async getDeposits(): Promise<SecurityDeposit[]> {
    return this.getData(STORAGE_KEYS.DEPOSITS, mockDeposits);
  }

  async updateDeposit(id: string, updates: Partial<SecurityDeposit>) {
    const deposits = await this.getDeposits();
    const updated = deposits.map(d => d.id === id ? { ...d, ...updates } : d);
    this.saveData(STORAGE_KEYS.DEPOSITS, updated);
  }

  // Payments & M-Pesa/Stripe
  async getPayments(): Promise<Payment[]> {
    return this.getData(STORAGE_KEYS.PAYMENTS, mockPayments);
  }

  async triggerMpesaPush(phone: string, amount: number, tenantId: string): Promise<boolean> {
    toast.info(`Initiating M-Pesa STK Push to ${phone}...`);
    await new Promise(r => setTimeout(r, 2000));
    
    const payment: Payment = {
      id: Math.random().toString(36).substr(2, 9),
      tenant_id: tenantId,
      unit_id: 'u-101',
      amount,
      method: 'MPESA',
      reference: Math.random().toString(36).substr(2, 10).toUpperCase(),
      date: new Date().toISOString().split('T')[0],
      status: 'COMPLETED',
      type: 'RENT'
    };

    const payments = await this.getPayments();
    this.saveData(STORAGE_KEYS.PAYMENTS, [payment, ...payments]);
    
    const receipt: Receipt = {
      id: `rcp-${Date.now()}`,
      receipt_number: `RCP-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
      payment_id: payment.id,
      tenant_name: 'Mock Tenant',
      unit_number: 'A101',
      property_name: 'Skyline Heights',
      amount_paid: amount,
      method: 'M-Pesa',
      reference: payment.reference,
      date: new Date().toDateString(),
      verification_code: `VER-${Math.floor(Math.random() * 9000) + 1000}`
    };
    const receipts = await this.getReceipts();
    this.saveData(STORAGE_KEYS.RECEIPTS, [receipt, ...receipts]);

    return true;
  }

  // Receipts
  async getReceipts(): Promise<Receipt[]> {
    return this.getData(STORAGE_KEYS.RECEIPTS, mockReceipts);
  }

  async verifyReceipt(code: string): Promise<Receipt | null> {
    const receipts = await this.getReceipts();
    return receipts.find(r => r.verification_code === code || r.receipt_number === code || r.reference === code) || null;
  }

  // Notices
  async getNotices(): Promise<Notice[]> {
    return this.getData(STORAGE_KEYS.NOTICES, mockNotices);
  }

  async submitNotice(tenantId: string, reason: string, moveOutDate: string): Promise<Notice> {
    const notice: Notice = {
      id: `n-${Date.now()}`,
      tenant_id: tenantId,
      notice_date: new Date().toISOString().split('T')[0],
      move_out_date: moveOutDate,
      reason,
      is_approved: false,
      status: 'PENDING'
    };
    const notices = await this.getNotices();
    this.saveData(STORAGE_KEYS.NOTICES, [notice, ...notices]);
    return notice;
  }

  async updateNoticeStatus(id: string, status: Notice['status']) {
    const notices = await this.getNotices();
    const updated = notices.map(n => n.id === id ? { ...n, status, is_approved: status === 'APPROVED' } : n);
    this.saveData(STORAGE_KEYS.NOTICES, updated);
  }

  // Bookings
  async getBookings(): Promise<Booking[]> {
    return this.getData(STORAGE_KEYS.BOOKINGS, mockBookings);
  }

  async createBooking(unitId: string, applicant: { name: string, email: string, phone: string, date: string }): Promise<Booking> {
    const bookings = await this.getBookings();
    const exists = bookings.find(b => b.unit_id === unitId && b.move_in_date === applicant.date && b.status === 'APPROVED');
    if (exists) throw new Error('This unit is already booked for the selected date.');

    const booking: Booking = {
      id: `b-${Date.now()}`,
      unit_id: unitId,
      applicant_name: applicant.name,
      applicant_email: applicant.email,
      applicant_phone: applicant.phone,
      move_in_date: applicant.date,
      status: 'PENDING',
      created_at: new Date().toISOString()
    };
    
    this.saveData(STORAGE_KEYS.BOOKINGS, [booking, ...bookings]);
    return booking;
  }

  // Expenses
  async getExpenses(): Promise<Expense[]> {
    return this.getData(STORAGE_KEYS.EXPENSES, mockExpenses);
  }

  async addExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
    const newExpense = { ...expense, id: `e-${Date.now()}` };
    const expenses = await this.getExpenses();
    this.saveData(STORAGE_KEYS.EXPENSES, [newExpense, ...expenses]);
    return newExpense;
  }

  // Maintenance
  async getMaintenanceRequests(): Promise<MaintenanceRequest[]> {
    return this.getData(STORAGE_KEYS.MAINTENANCE, mockMaintenanceRequests);
  }

  async submitMaintenanceRequest(request: Omit<MaintenanceRequest, 'id' | 'created_at' | 'status'>): Promise<MaintenanceRequest> {
    const newRequest: MaintenanceRequest = {
      ...request,
      id: `m-${Date.now()}`,
      created_at: new Date().toISOString(),
      status: 'PENDING'
    };
    const requests = await this.getMaintenanceRequests();
    this.saveData(STORAGE_KEYS.MAINTENANCE, [newRequest, ...requests]);
    return newRequest;
  }

  async updateMaintenanceStatus(id: string, status: MaintenanceRequest['status']) {
    const requests = await this.getMaintenanceRequests();
    const updated = requests.map(r => r.id === id ? { ...r, status } : r);
    this.saveData(STORAGE_KEYS.MAINTENANCE, updated);
  }

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    return this.getData(STORAGE_KEYS.NOTIFICATIONS, mockNotifications);
  }

  async markNotificationRead(id: string) {
    const notifications = await this.getNotifications();
    const updated = notifications.map(n => n.id === id ? { ...n, is_read: true } : n);
    this.saveData(STORAGE_KEYS.NOTIFICATIONS, updated);
  }
}

export const api = new ApiService();
/**
 * FieldEdge API TypeScript Types
 * Field service management for HVAC, plumbing, electrical contractors
 */

export interface FieldEdgeConfig {
  apiKey: string;
  baseUrl?: string;
  environment?: 'production' | 'sandbox';
}

// Customer Types
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  email?: string;
  phone?: string;
  mobilePhone?: string;
  address?: Address;
  balance?: number;
  status: 'active' | 'inactive';
  type?: 'residential' | 'commercial';
  createdDate?: string;
  modifiedDate?: string;
  customFields?: Record<string, any>;
  tags?: string[];
  notes?: string;
}

export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

// Job/Work Order Types
export interface Job {
  id: string;
  jobNumber: string;
  customerId: string;
  locationId?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  priority: 'low' | 'normal' | 'high' | 'emergency';
  jobType: string;
  description?: string;
  scheduledDate?: string;
  scheduledStartTime?: string;
  scheduledEndTime?: string;
  actualStartTime?: string;
  actualEndTime?: string;
  assignedTechnicianIds?: string[];
  estimatedDuration?: number;
  tags?: string[];
  customFields?: Record<string, any>;
  createdDate: string;
  modifiedDate?: string;
  completedDate?: string;
}

export interface WorkOrder {
  id: string;
  jobId: string;
  workOrderNumber: string;
  status: 'open' | 'in_progress' | 'completed' | 'invoiced';
  lineItems?: LineItem[];
  subtotal?: number;
  tax?: number;
  total?: number;
  notes?: string;
  createdDate: string;
}

export interface LineItem {
  id?: string;
  type: 'labor' | 'material' | 'equipment' | 'service';
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxable?: boolean;
  itemId?: string;
}

// Scheduling Types
export interface Appointment {
  id: string;
  jobId: string;
  technicianId: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'en_route' | 'arrived' | 'completed' | 'cancelled';
  notes?: string;
  customerNotified?: boolean;
}

export interface Technician {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive';
  certifications?: string[];
  skills?: string[];
  hourlyRate?: number;
  color?: string; // For calendar display
  defaultSchedule?: WeeklySchedule;
  avatar?: string;
}

export interface WeeklySchedule {
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
}

export interface DaySchedule {
  start: string; // HH:mm format
  end: string;
  breaks?: TimeRange[];
}

export interface TimeRange {
  start: string;
  end: string;
}

// Invoice Types
export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  jobId?: string;
  workOrderId?: string;
  status: 'draft' | 'sent' | 'viewed' | 'partial' | 'paid' | 'overdue' | 'void';
  issueDate: string;
  dueDate: string;
  lineItems: LineItem[];
  subtotal: number;
  taxRate?: number;
  taxAmount: number;
  discountAmount?: number;
  total: number;
  amountPaid?: number;
  balance?: number;
  notes?: string;
  terms?: string;
  createdDate: string;
  paidDate?: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'check' | 'credit_card' | 'ach' | 'other';
  referenceNumber?: string;
  notes?: string;
}

// Estimate Types
export interface Estimate {
  id: string;
  estimateNumber: string;
  customerId: string;
  locationId?: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired';
  issueDate: string;
  expirationDate?: string;
  lineItems: LineItem[];
  subtotal: number;
  taxRate?: number;
  taxAmount: number;
  discountAmount?: number;
  total: number;
  notes?: string;
  terms?: string;
  acceptedDate?: string;
  jobId?: string; // If converted to job
  createdDate: string;
}

// Equipment Types
export interface Equipment {
  id: string;
  customerId: string;
  locationId?: string;
  type: string; // HVAC, Plumbing, Electrical
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  installDate?: string;
  warrantyExpiration?: string;
  notes?: string;
  status: 'active' | 'inactive' | 'retired';
  maintenanceSchedule?: MaintenanceSchedule;
  lastServiceDate?: string;
}

export interface MaintenanceSchedule {
  frequency: 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
  lastServiceDate?: string;
  nextServiceDate?: string;
  notes?: string;
}

// Inventory Types
export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category?: string;
  type: 'part' | 'material' | 'equipment';
  unitCost: number;
  unitPrice: number;
  quantityOnHand: number;
  reorderPoint?: number;
  reorderQuantity?: number;
  preferredVendor?: string;
  location?: string;
  status: 'active' | 'inactive' | 'discontinued';
}

export interface StockAdjustment {
  id: string;
  itemId: string;
  adjustmentType: 'addition' | 'subtraction' | 'transfer' | 'count';
  quantity: number;
  reason?: string;
  technicianId?: string;
  jobId?: string;
  date: string;
  notes?: string;
}

// Reporting Types
export interface RevenueReport {
  startDate: string;
  endDate: string;
  totalRevenue: number;
  invoicedAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  byJobType?: Record<string, number>;
  byTechnician?: Record<string, number>;
  byCustomer?: Record<string, number>;
}

export interface TechnicianPerformance {
  technicianId: string;
  technicianName: string;
  period: string;
  jobsCompleted: number;
  revenueGenerated: number;
  hoursWorked: number;
  avgJobDuration: number;
  customerRating?: number;
  efficiency?: number;
}

export interface CustomerReport {
  customerId: string;
  totalJobs: number;
  totalRevenue: number;
  averageInvoice: number;
  lastServiceDate?: string;
  lifetimeValue: number;
}

// Location Types (for multi-location customers)
export interface Location {
  id: string;
  customerId: string;
  name: string;
  address: Address;
  contactName?: string;
  contactPhone?: string;
  notes?: string;
  isPrimary?: boolean;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Search/Filter Types
export interface CustomerSearchParams {
  query?: string;
  status?: 'active' | 'inactive';
  type?: 'residential' | 'commercial';
  tags?: string[];
  page?: number;
  pageSize?: number;
  sortBy?: 'name' | 'createdDate' | 'balance';
  sortOrder?: 'asc' | 'desc';
}

export interface JobSearchParams {
  customerId?: string;
  status?: Job['status'];
  priority?: Job['priority'];
  technicianId?: string;
  startDate?: string;
  endDate?: string;
  jobType?: string;
  page?: number;
  pageSize?: number;
}

export interface InvoiceSearchParams {
  customerId?: string;
  status?: Invoice['status'];
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  pageSize?: number;
}

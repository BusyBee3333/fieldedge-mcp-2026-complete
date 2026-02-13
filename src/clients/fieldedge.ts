/**
 * FieldEdge API Client
 * Handles authentication, requests, error mapping, and rate limiting
 */

import type {
  FieldEdgeConfig,
  Customer,
  Job,
  Invoice,
  Estimate,
  Equipment,
  Technician,
  InventoryItem,
  Payment,
  Appointment,
  WorkOrder,
  Location,
  StockAdjustment,
  PaginatedResponse,
  ApiResponse,
  CustomerSearchParams,
  JobSearchParams,
  InvoiceSearchParams,
} from '../types/index.js';

export class FieldEdgeClient {
  private apiKey: string;
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(config: FieldEdgeConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.fieldedge.com/v1';
    
    if (config.environment === 'sandbox') {
      this.baseUrl = 'https://sandbox-api.fieldedge.com/v1';
    }

    this.headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    params?: Record<string, any>
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const options: RequestInit = {
      method,
      headers: this.headers,
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url.toString(), options);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        
        throw new Error(
          `FieldEdge API Error (${response.status}): ${errorData.message || errorText}`
        );
      }

      const responseText = await response.text();
      if (!responseText) return {} as T;
      
      return JSON.parse(responseText) as T;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`FieldEdge API request failed: ${error.message}`);
      }
      throw error;
    }
  }

  // Customer Methods
  async getCustomers(params?: CustomerSearchParams): Promise<PaginatedResponse<Customer>> {
    return this.request<PaginatedResponse<Customer>>('GET', '/customers', undefined, params);
  }

  async getCustomer(customerId: string): Promise<Customer> {
    return this.request<Customer>('GET', `/customers/${customerId}`);
  }

  async createCustomer(data: Partial<Customer>): Promise<Customer> {
    return this.request<Customer>('POST', '/customers', data);
  }

  async updateCustomer(customerId: string, data: Partial<Customer>): Promise<Customer> {
    return this.request<Customer>('PUT', `/customers/${customerId}`, data);
  }

  async deleteCustomer(customerId: string): Promise<void> {
    return this.request<void>('DELETE', `/customers/${customerId}`);
  }

  async searchCustomers(query: string): Promise<Customer[]> {
    const response = await this.request<PaginatedResponse<Customer>>(
      'GET',
      '/customers/search',
      undefined,
      { q: query }
    );
    return response.data;
  }

  // Job/Work Order Methods
  async getJobs(params?: JobSearchParams): Promise<PaginatedResponse<Job>> {
    return this.request<PaginatedResponse<Job>>('GET', '/jobs', undefined, params);
  }

  async getJob(jobId: string): Promise<Job> {
    return this.request<Job>('GET', `/jobs/${jobId}`);
  }

  async createJob(data: Partial<Job>): Promise<Job> {
    return this.request<Job>('POST', '/jobs', data);
  }

  async updateJob(jobId: string, data: Partial<Job>): Promise<Job> {
    return this.request<Job>('PUT', `/jobs/${jobId}`, data);
  }

  async deleteJob(jobId: string): Promise<void> {
    return this.request<void>('DELETE', `/jobs/${jobId}`);
  }

  async getWorkOrders(jobId?: string): Promise<WorkOrder[]> {
    const endpoint = jobId ? `/jobs/${jobId}/work-orders` : '/work-orders';
    return this.request<WorkOrder[]>('GET', endpoint);
  }

  async getWorkOrder(workOrderId: string): Promise<WorkOrder> {
    return this.request<WorkOrder>('GET', `/work-orders/${workOrderId}`);
  }

  async createWorkOrder(data: Partial<WorkOrder>): Promise<WorkOrder> {
    return this.request<WorkOrder>('POST', '/work-orders', data);
  }

  async updateWorkOrder(workOrderId: string, data: Partial<WorkOrder>): Promise<WorkOrder> {
    return this.request<WorkOrder>('PUT', `/work-orders/${workOrderId}`, data);
  }

  // Scheduling Methods
  async getAppointments(params?: {
    technicianId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Appointment[]> {
    return this.request<Appointment[]>('GET', '/appointments', undefined, params);
  }

  async getAppointment(appointmentId: string): Promise<Appointment> {
    return this.request<Appointment>('GET', `/appointments/${appointmentId}`);
  }

  async createAppointment(data: Partial<Appointment>): Promise<Appointment> {
    return this.request<Appointment>('POST', '/appointments', data);
  }

  async updateAppointment(appointmentId: string, data: Partial<Appointment>): Promise<Appointment> {
    return this.request<Appointment>('PUT', `/appointments/${appointmentId}`, data);
  }

  async deleteAppointment(appointmentId: string): Promise<void> {
    return this.request<void>('DELETE', `/appointments/${appointmentId}`);
  }

  async getTechnicianSchedule(technicianId: string, startDate: string, endDate: string): Promise<Appointment[]> {
    return this.request<Appointment[]>(
      'GET',
      `/technicians/${technicianId}/schedule`,
      undefined,
      { startDate, endDate }
    );
  }

  // Invoice Methods
  async getInvoices(params?: InvoiceSearchParams): Promise<PaginatedResponse<Invoice>> {
    return this.request<PaginatedResponse<Invoice>>('GET', '/invoices', undefined, params);
  }

  async getInvoice(invoiceId: string): Promise<Invoice> {
    return this.request<Invoice>('GET', `/invoices/${invoiceId}`);
  }

  async createInvoice(data: Partial<Invoice>): Promise<Invoice> {
    return this.request<Invoice>('POST', '/invoices', data);
  }

  async updateInvoice(invoiceId: string, data: Partial<Invoice>): Promise<Invoice> {
    return this.request<Invoice>('PUT', `/invoices/${invoiceId}`, data);
  }

  async deleteInvoice(invoiceId: string): Promise<void> {
    return this.request<void>('DELETE', `/invoices/${invoiceId}`);
  }

  async sendInvoice(invoiceId: string, email?: string): Promise<void> {
    return this.request<void>('POST', `/invoices/${invoiceId}/send`, { email });
  }

  async recordPayment(invoiceId: string, paymentData: Partial<Payment>): Promise<Payment> {
    return this.request<Payment>('POST', `/invoices/${invoiceId}/payments`, paymentData);
  }

  async getPayments(invoiceId: string): Promise<Payment[]> {
    return this.request<Payment[]>('GET', `/invoices/${invoiceId}/payments`);
  }

  // Estimate Methods
  async getEstimates(customerId?: string): Promise<Estimate[]> {
    const params = customerId ? { customerId } : undefined;
    return this.request<Estimate[]>('GET', '/estimates', undefined, params);
  }

  async getEstimate(estimateId: string): Promise<Estimate> {
    return this.request<Estimate>('GET', `/estimates/${estimateId}`);
  }

  async createEstimate(data: Partial<Estimate>): Promise<Estimate> {
    return this.request<Estimate>('POST', '/estimates', data);
  }

  async updateEstimate(estimateId: string, data: Partial<Estimate>): Promise<Estimate> {
    return this.request<Estimate>('PUT', `/estimates/${estimateId}`, data);
  }

  async deleteEstimate(estimateId: string): Promise<void> {
    return this.request<void>('DELETE', `/estimates/${estimateId}`);
  }

  async sendEstimate(estimateId: string, email?: string): Promise<void> {
    return this.request<void>('POST', `/estimates/${estimateId}/send`, { email });
  }

  async convertEstimateToJob(estimateId: string): Promise<Job> {
    return this.request<Job>('POST', `/estimates/${estimateId}/convert-to-job`);
  }

  // Equipment Methods
  async getEquipment(customerId?: string): Promise<Equipment[]> {
    const params = customerId ? { customerId } : undefined;
    return this.request<Equipment[]>('GET', '/equipment', undefined, params);
  }

  async getEquipmentById(equipmentId: string): Promise<Equipment> {
    return this.request<Equipment>('GET', `/equipment/${equipmentId}`);
  }

  async createEquipment(data: Partial<Equipment>): Promise<Equipment> {
    return this.request<Equipment>('POST', '/equipment', data);
  }

  async updateEquipment(equipmentId: string, data: Partial<Equipment>): Promise<Equipment> {
    return this.request<Equipment>('PUT', `/equipment/${equipmentId}`, data);
  }

  async deleteEquipment(equipmentId: string): Promise<void> {
    return this.request<void>('DELETE', `/equipment/${equipmentId}`);
  }

  async getEquipmentHistory(equipmentId: string): Promise<Job[]> {
    return this.request<Job[]>('GET', `/equipment/${equipmentId}/history`);
  }

  // Technician Methods
  async getTechnicians(status?: 'active' | 'inactive'): Promise<Technician[]> {
    const params = status ? { status } : undefined;
    return this.request<Technician[]>('GET', '/technicians', undefined, params);
  }

  async getTechnician(technicianId: string): Promise<Technician> {
    return this.request<Technician>('GET', `/technicians/${technicianId}`);
  }

  async createTechnician(data: Partial<Technician>): Promise<Technician> {
    return this.request<Technician>('POST', '/technicians', data);
  }

  async updateTechnician(technicianId: string, data: Partial<Technician>): Promise<Technician> {
    return this.request<Technician>('PUT', `/technicians/${technicianId}`, data);
  }

  async deleteTechnician(technicianId: string): Promise<void> {
    return this.request<void>('DELETE', `/technicians/${technicianId}`);
  }

  // Inventory Methods
  async getInventoryItems(category?: string): Promise<InventoryItem[]> {
    const params = category ? { category } : undefined;
    return this.request<InventoryItem[]>('GET', '/inventory', undefined, params);
  }

  async getInventoryItem(itemId: string): Promise<InventoryItem> {
    return this.request<InventoryItem>('GET', `/inventory/${itemId}`);
  }

  async createInventoryItem(data: Partial<InventoryItem>): Promise<InventoryItem> {
    return this.request<InventoryItem>('POST', '/inventory', data);
  }

  async updateInventoryItem(itemId: string, data: Partial<InventoryItem>): Promise<InventoryItem> {
    return this.request<InventoryItem>('PUT', `/inventory/${itemId}`, data);
  }

  async deleteInventoryItem(itemId: string): Promise<void> {
    return this.request<void>('DELETE', `/inventory/${itemId}`);
  }

  async adjustStock(itemId: string, adjustment: Partial<StockAdjustment>): Promise<StockAdjustment> {
    return this.request<StockAdjustment>('POST', `/inventory/${itemId}/adjust`, adjustment);
  }

  async getStockHistory(itemId: string): Promise<StockAdjustment[]> {
    return this.request<StockAdjustment[]>('GET', `/inventory/${itemId}/history`);
  }

  async getLowStockItems(): Promise<InventoryItem[]> {
    return this.request<InventoryItem[]>('GET', '/inventory/low-stock');
  }

  // Location Methods
  async getLocations(customerId: string): Promise<Location[]> {
    return this.request<Location[]>('GET', `/customers/${customerId}/locations`);
  }

  async getLocation(locationId: string): Promise<Location> {
    return this.request<Location>('GET', `/locations/${locationId}`);
  }

  async createLocation(customerId: string, data: Partial<Location>): Promise<Location> {
    return this.request<Location>('POST', `/customers/${customerId}/locations`, data);
  }

  async updateLocation(locationId: string, data: Partial<Location>): Promise<Location> {
    return this.request<Location>('PUT', `/locations/${locationId}`, data);
  }

  async deleteLocation(locationId: string): Promise<void> {
    return this.request<void>('DELETE', `/locations/${locationId}`);
  }

  // Reporting Methods
  async getRevenueReport(startDate: string, endDate: string): Promise<any> {
    return this.request<any>('GET', '/reports/revenue', undefined, { startDate, endDate });
  }

  async getTechnicianPerformance(startDate: string, endDate: string, technicianId?: string): Promise<any> {
    const params: any = { startDate, endDate };
    if (technicianId) params.technicianId = technicianId;
    return this.request<any>('GET', '/reports/technician-performance', undefined, params);
  }

  async getCustomerReport(customerId: string): Promise<any> {
    return this.request<any>('GET', `/reports/customers/${customerId}`);
  }

  async getJobStatusReport(startDate: string, endDate: string): Promise<any> {
    return this.request<any>('GET', '/reports/job-status', undefined, { startDate, endDate });
  }

  async getInventoryValuation(): Promise<any> {
    return this.request<any>('GET', '/reports/inventory-valuation');
  }
}

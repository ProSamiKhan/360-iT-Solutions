export type UserRole = 'admin' | 'client';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phoneNumber?: string;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Device {
  id: string;
  clientId: string;
  type: 'Laptop' | 'Desktop' | 'Other';
  brand: string;
  model: string;
  serialNumber?: string;
  condition?: string;
  accessories?: string[];
  createdAt: string;
}

export type RepairStatus = 'Received' | 'Diagnosing' | 'Repairing' | 'Waiting Parts' | 'Completed' | 'Delivered';

export interface Repair {
  id: string;
  trackingId: string;
  clientId: string;
  deviceId: string;
  problemDescription: string;
  serviceType: string;
  status: RepairStatus;
  technicianId?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  repairId: string;
  clientId: string;
  invoiceNumber: string;
  serviceCharge: number;
  partsCost: number;
  discount: number;
  totalAmount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Partial';
  paymentMethod?: string;
  createdAt: string;
}

export interface Technician {
  id: string;
  name: string;
  phone?: string;
  specialization?: string;
  active: boolean;
}

export interface Rating {
  id: string;
  repairId: string;
  clientId: string;
  score: number;
  comment?: string;
  createdAt: string;
}

import { db } from '../firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  limit
} from 'firebase/firestore';
import { Client, Device, Repair, Invoice, Technician, Rating } from '../types';

// Clients
export const getClients = (callback: (clients: Client[]) => void) => {
  return onSnapshot(query(collection(db, 'clients'), orderBy('createdAt', 'desc')), (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Client)));
  });
};

export const addClient = async (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
  const now = new Date().toISOString();
  return addDoc(collection(db, 'clients'), {
    ...client,
    createdAt: now,
    updatedAt: now
  });
};

// Repairs
export const getRepairs = (callback: (repairs: Repair[]) => void) => {
  return onSnapshot(query(collection(db, 'repairs'), orderBy('createdAt', 'desc')), (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Repair)));
  });
};

export const getRepairByTrackingId = async (trackingId: string) => {
  const q = query(collection(db, 'repairs'), where('trackingId', '==', trackingId), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Repair;
};

export const addRepair = async (repair: Omit<Repair, 'id' | 'createdAt' | 'updatedAt' | 'trackingId'>) => {
  const now = new Date().toISOString();
  const trackingId = 'RT-' + Math.floor(10000 + Math.random() * 90000);
  return addDoc(collection(db, 'repairs'), {
    ...repair,
    trackingId,
    createdAt: now,
    updatedAt: now
  });
};

export const updateRepairStatus = async (repairId: string, status: Repair['status']) => {
  return updateDoc(doc(db, 'repairs', repairId), {
    status,
    updatedAt: new Date().toISOString()
  });
};

// Invoices
export const getInvoices = (callback: (invoices: Invoice[]) => void) => {
  return onSnapshot(query(collection(db, 'invoices'), orderBy('createdAt', 'desc')), (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Invoice)));
  });
};

export const addInvoice = async (invoice: Omit<Invoice, 'id' | 'createdAt' | 'invoiceNumber'>) => {
  const now = new Date().toISOString();
  const invoiceNumber = 'INV-' + Date.now().toString().slice(-6);
  return addDoc(collection(db, 'invoices'), {
    ...invoice,
    invoiceNumber,
    createdAt: now
  });
};

// Technicians
export const getTechnicians = (callback: (techs: Technician[]) => void) => {
  return onSnapshot(collection(db, 'technicians'), (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Technician)));
  });
};

// Stats for Dashboard
export const getStats = async () => {
  const clients = await getDocs(collection(db, 'clients'));
  const repairs = await getDocs(collection(db, 'repairs'));
  const invoices = await getDocs(collection(db, 'invoices'));
  
  const repairDocs = repairs.docs.map(d => d.data() as Repair);
  const invoiceDocs = invoices.docs.map(d => d.data() as Invoice);
  
  return {
    totalClients: clients.size,
    totalRepairs: repairs.size,
    pendingRepairs: repairDocs.filter(r => r.status !== 'Delivered' && r.status !== 'Completed').length,
    completedRepairs: repairDocs.filter(r => r.status === 'Completed' || r.status === 'Delivered').length,
    totalRevenue: invoiceDocs.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0)
  };
};

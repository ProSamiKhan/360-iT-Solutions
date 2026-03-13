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

export const deleteClient = async (clientId: string) => {
  // In a real app, we might want to delete associated repairs too, but for now just client
  const { deleteDoc } = await import('firebase/firestore');
  return deleteDoc(doc(db, 'clients', clientId));
};

export const seedDemoData = async () => {
  const firstNames = ['Amit', 'Sriya', 'Vikram', 'Ananya', 'Zaid', 'Priya', 'Rohan', 'Sneha', 'Arjun', 'Meera', 'Rahul', 'Deepa', 'Karan', 'Neha', 'Aditya', 'Ishani', 'Suresh', 'Kavita', 'Rajesh', 'Pooja', 'Manish', 'Aarti', 'Sunil', 'Jyoti', 'Vijay'];
  const lastNames = ['Patel', 'Reddy', 'Singh', 'Iyer', 'Khan', 'Sharma', 'Gupta', 'Kapoor', 'Verma', 'Nair', 'Malhotra', 'Joshi', 'Chopra', 'Deshmukh', 'Bose', 'Das', 'Kulkarni', 'Pillai', 'Rao', 'Mehta', 'Pandey', 'Trivedi', 'Saxena', 'Gill', 'Yadav'];

  const repairTypes = ['Hardware Repair', 'Software Installation', 'Virus Removal', 'Data Recovery', 'Networking Setup'];
  const statuses: Repair['status'][] = ['Received', 'Diagnosing', 'Repairing', 'Waiting Parts', 'Completed', 'Delivered'];

  for (let i = 0; i < 25; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const name = `${firstName} ${lastName}`;
    const phone = `9${Math.floor(100000000 + Math.random() * 900000000)}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
    
    const clientRef = await addClient({
      name,
      phone,
      email,
      address: `${Math.floor(Math.random() * 100 + 1)}, Tech Park, City ${i}`
    });
    
    // Add 1-2 repairs for each client
    const numRepairs = Math.floor(Math.random() * 2) + 1;
    for (let j = 0; j < numRepairs; j++) {
      const repairType = repairTypes[Math.floor(Math.random() * repairTypes.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      const repairRef = await addRepair({
        clientId: clientRef.id,
        deviceId: 'Device-' + Math.random().toString(36).substring(7).toUpperCase(),
        problemDescription: `Automatic diagnostic for ${repairType} - Issue #${i}${j}`,
        serviceType: repairType,
        status: status,
        remarks: 'System generated demo data'
      });

      if (status === 'Completed' || status === 'Delivered') {
        await addInvoice({
          repairId: repairRef.id,
          clientId: clientRef.id,
          serviceCharge: 500 + Math.floor(Math.random() * 2000),
          partsCost: Math.floor(Math.random() * 1500),
          discount: 0,
          totalAmount: 2000 + Math.floor(Math.random() * 3000),
          paymentStatus: Math.random() > 0.3 ? 'Paid' : 'Pending',
          paymentMethod: 'UPI'
        });
      }
    }
  }
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

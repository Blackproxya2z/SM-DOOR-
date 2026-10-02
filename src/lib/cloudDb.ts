import { firestore } from './firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { 
  SiteSettings, 
  Product, 
  CalculatorRates, 
  CustomOrderInquiry 
} from '@/types';

// Diagnostic flag to track cloud database connectivity
let isCloudActive = false;
let cloudLastError: string | null = null;

export function getCloudDatabaseStatus() {
  return {
    isConfigured: !!firestore,
    isActive: isCloudActive,
    lastError: cloudLastError,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'stellar-psyche-410612',
    enableUrl: 'https://console.firebase.google.com/project/stellar-psyche-410612/firestore'
  };
}

// 1. SITE SETTINGS CLOUD CRUD
export async function getCloudSiteSettings(): Promise<SiteSettings | null> {
  if (!firestore) return null;
  try {
    const docRef = doc(firestore, 'sm_settings', 'site');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      isCloudActive = true;
      cloudLastError = null;
      return snap.data() as SiteSettings;
    }
    return null;
  } catch (error: any) {
    cloudLastError = error?.message || String(error);
    return null;
  }
}

export async function saveCloudSiteSettings(settings: SiteSettings): Promise<boolean> {
  if (!firestore) return false;
  try {
    const docRef = doc(firestore, 'sm_settings', 'site');
    await setDoc(docRef, {
      ...settings,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    isCloudActive = true;
    cloudLastError = null;
    return true;
  } catch (error: any) {
    cloudLastError = error?.message || String(error);
    console.warn('[CloudDB] Warning: Firestore write encountered error:', cloudLastError);
    return false;
  }
}

// 2. PRODUCTS CLOUD CRUD
export async function getCloudProducts(): Promise<Product[] | null> {
  if (!firestore) return null;
  try {
    const colRef = collection(firestore, 'sm_products');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      isCloudActive = true;
      const list: Product[] = [];
      snap.forEach(d => list.push(d.data() as Product));
      return list;
    }
    return null;
  } catch (error: any) {
    cloudLastError = error?.message || String(error);
    return null;
  }
}

export async function saveCloudProduct(product: Product): Promise<boolean> {
  if (!firestore) return false;
  try {
    const docRef = doc(firestore, 'sm_products', product.id);
    await setDoc(docRef, {
      ...product,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    isCloudActive = true;
    return true;
  } catch (error: any) {
    cloudLastError = error?.message || String(error);
    return false;
  }
}

export async function deleteCloudProduct(id: string): Promise<boolean> {
  if (!firestore) return false;
  try {
    const docRef = doc(firestore, 'sm_products', id);
    await deleteDoc(docRef);
    return true;
  } catch (error: any) {
    cloudLastError = error?.message || String(error);
    return false;
  }
}

// 3. CALCULATOR RATES CLOUD CRUD
export async function getCloudCalculatorRates(): Promise<CalculatorRates | null> {
  if (!firestore) return null;
  try {
    const docRef = doc(firestore, 'sm_calculator_rates', 'rates');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      isCloudActive = true;
      return snap.data() as CalculatorRates;
    }
    return null;
  } catch (error: any) {
    cloudLastError = error?.message || String(error);
    return null;
  }
}

export async function saveCloudCalculatorRates(rates: CalculatorRates): Promise<boolean> {
  if (!firestore) return false;
  try {
    const docRef = doc(firestore, 'sm_calculator_rates', 'rates');
    await setDoc(docRef, {
      ...rates,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    isCloudActive = true;
    return true;
  } catch (error: any) {
    cloudLastError = error?.message || String(error);
    return false;
  }
}

// 4. INQUIRIES CLOUD CRUD
export async function getCloudInquiries(): Promise<CustomOrderInquiry[] | null> {
  if (!firestore) return null;
  try {
    const colRef = collection(firestore, 'sm_inquiries');
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      isCloudActive = true;
      const list: CustomOrderInquiry[] = [];
      snap.forEach(d => list.push(d.data() as CustomOrderInquiry));
      return list;
    }
    return null;
  } catch (error: any) {
    cloudLastError = error?.message || String(error);
    return null;
  }
}

export async function saveCloudInquiry(inquiry: CustomOrderInquiry): Promise<boolean> {
  if (!firestore) return false;
  try {
    const docRef = doc(firestore, 'sm_inquiries', inquiry.id);
    await setDoc(docRef, inquiry, { merge: true });
    isCloudActive = true;
    return true;
  } catch (error: any) {
    cloudLastError = error?.message || String(error);
    return false;
  }
}

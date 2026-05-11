
import { db } from './firebase.config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface AppSettings {
  whatsappNumber: string;
  paymentQrUrl?: string;
  paymentDetails?: string;
}

const SETTINGS_DOC_ID = 'global';

export class SettingsRepository {
  private collectionName = 'settings';

  async getSettings(): Promise<AppSettings> {
    try {
      const docRef = doc(db, this.collectionName, SETTINGS_DOC_ID);
      const snap = await getDoc(docRef);
      
      if (!snap.exists()) {
        return { 
          whatsappNumber: '51900000000',
          paymentDetails: 'BCP: XXX-XXXXXX-X-XX\nCCI: XXX-XXX-XXXXXXXXXX-XX\nTITULAR: EMPRESA INDUSTRIAL S.A.C.'
        };
      }
      
      return snap.data() as AppSettings;
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Fallback for UI if permission denied or other error
      return { 
        whatsappNumber: '51900000000',
        paymentDetails: 'Datos de pago no configurados.'
      };
    }
  }

  async updateSettings(settings: AppSettings): Promise<void> {
    const docRef = doc(db, this.collectionName, SETTINGS_DOC_ID);
    await setDoc(docRef, settings, { merge: true });
  }
}

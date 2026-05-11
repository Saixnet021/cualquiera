
import { db } from './firebase.config';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

export interface Category {
  id: string;
  name: string;
  createdAt: any;
}

export class CategoryRepository {
  private collectionName = 'categories';

  async getAll(): Promise<Category[]> {
    const q = query(collection(db, this.collectionName), orderBy('name', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];
  }

  async add(name: string): Promise<string> {
    const docRef = await addDoc(collection(db, this.collectionName), {
      name,
      createdAt: new Date()
    });
    return docRef.id;
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, this.collectionName, id));
  }
}

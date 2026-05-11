/**
 * FirebaseProductRepository — Infrastructure Layer
 * 
 * Implementación concreta de IProductRepository usando Firestore.
 * Si mañana cambias a Supabase, solo cambias este archivo.
 */
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase.config';
import type { IProductRepository } from '@/src/domain/repositories/product.repository';
import type { ProductEntity, CreateProductData, UpdateProductData } from '@/src/domain/entities/product.entity';
import { AppError } from '@/src/shared/errors/app-error';

const COLLECTION = 'products';

export class FirebaseProductRepository implements IProductRepository {
  async getAll(): Promise<ProductEntity[]> {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs.map(this.mapDoc);
  }

  async getById(id: string): Promise<ProductEntity | null> {
    const docRef = doc(db, COLLECTION, id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return this.mapDoc(snapshot as any);
  }

  async getByCategory(category: string): Promise<ProductEntity[]> {
    const q = query(collection(db, COLLECTION), where('category', '==', category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(this.mapDoc);
  }

  async create(data: CreateProductData): Promise<ProductEntity> {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const created = await this.getById(docRef.id);
    if (!created) throw new AppError('Error al crear el producto', 'INTERNAL_ERROR', 500);
    return created;
  }

  async update(id: string, data: UpdateProductData): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  }

  private mapDoc(docSnap: any): ProductEntity {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      name: data.name ?? '',
      description: data.description ?? '',
      price: data.price ?? 0,
      stock: data.stock ?? 0,
      imageUrl: data.imageUrl ?? '',
      category: data.category ?? '',
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
      updatedAt: data.updatedAt?.toDate?.(),
    };
  }
}

/**
 * FirebaseOrderRepository — Infrastructure Layer
 */
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase.config';
import type { IOrderRepository } from '@/src/domain/repositories/order.repository';
import type { OrderEntity, CreateOrderData } from '@/src/domain/entities/order.entity';
import type { OrderStatus } from '@/src/domain/value-objects/order-status.vo';
import { AppError } from '@/src/shared/errors/app-error';

const COLLECTION = 'orders';

export class FirebaseOrderRepository implements IOrderRepository {
  async getAll(): Promise<OrderEntity[]> {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(this.mapDoc);
  }

  async getById(id: string): Promise<OrderEntity | null> {
    const docRef = doc(db, COLLECTION, id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return this.mapDoc(snapshot as any);
  }

  async getByUserId(userId: string): Promise<OrderEntity[]> {
    const q = query(collection(db, COLLECTION), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(this.mapDoc);
  }

  async getByStatus(status: OrderStatus): Promise<OrderEntity[]> {
    const q = query(collection(db, COLLECTION), where('status', '==', status));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(this.mapDoc);
  }

  async create(data: CreateOrderData): Promise<OrderEntity> {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const created = await this.getById(docRef.id);
    if (!created) throw new AppError('Error al crear la orden', 'INTERNAL_ERROR', 500);
    return created;
  }

  async updateStatus(id: string, status: OrderStatus): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, { status, updatedAt: serverTimestamp() });
  }

  private mapDoc(docSnap: any): OrderEntity {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      userId: data.userId ?? '',
      userEmail: data.userEmail ?? '',
      userName: data.userName ?? '',
      items: data.items ?? [],
      total: data.total ?? 0,
      discount: data.discount ?? 0,
      finalTotal: data.finalTotal ?? data.total ?? 0,
      status: data.status ?? 'pending',
      whatsappSent: data.whatsappSent ?? false,
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
      updatedAt: data.updatedAt?.toDate?.(),
    };
  }
}

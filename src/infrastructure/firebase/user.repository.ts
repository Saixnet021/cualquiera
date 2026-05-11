/**
 * FirebaseUserRepository — Infrastructure Layer
 * 
 * Gestiona perfiles de usuario en Firestore.
 * El `uid` de Firebase Auth se usa como ID del documento.
 */
import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase.config';
import type { IUserRepository } from '@/src/domain/repositories/user.repository';
import type { UserEntity, CreateUserData } from '@/src/domain/entities/user.entity';
import type { UserRole } from '@/src/domain/value-objects/role.vo';

const COLLECTION = 'users';

export class FirebaseUserRepository implements IUserRepository {
  async getAll(): Promise<UserEntity[]> {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs.map(this.mapDoc);
  }

  async getById(uid: string): Promise<UserEntity | null> {
    const docRef = doc(db, COLLECTION, uid);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return this.mapDoc(snapshot as any);
  }

  async getByEmail(email: string): Promise<UserEntity | null> {
    const q = query(collection(db, COLLECTION), where('email', '==', email));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return this.mapDoc(snapshot.docs[0] as any);
  }

  async create(data: CreateUserData): Promise<UserEntity> {
    // Usamos el uid como ID del documento para lookup O(1)
    const docRef = doc(db, COLLECTION, data.uid);
    await setDoc(docRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { ...data, id: data.uid, createdAt: new Date() };
  }

  async updateRole(uid: string, role: UserRole): Promise<void> {
    const docRef = doc(db, COLLECTION, uid);
    await updateDoc(docRef, { role, updatedAt: serverTimestamp() });
  }

  async update(uid: string, data: Partial<UserEntity>): Promise<void> {
    const docRef = doc(db, COLLECTION, uid);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  }

  private mapDoc(docSnap: any): UserEntity {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      uid: data.uid ?? docSnap.id,
      email: data.email ?? '',
      displayName: data.displayName ?? '',
      role: data.role ?? 'customer',
      purchaseCount: data.purchaseCount ?? 0,
      totalSpent: data.totalSpent ?? 0,
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
      updatedAt: data.updatedAt?.toDate?.(),
    };
  }
}

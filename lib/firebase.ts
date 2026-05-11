/**
 * lib/firebase.ts — Compatibility re-export
 * 
 * El singleton real vive en src/infrastructure/firebase/firebase.config.ts
 * Este archivo mantiene compatibilidad con todos los imports existentes
 * que usen '@/lib/firebase'.
 */
export { auth, db } from '@/src/infrastructure/firebase/firebase.config';

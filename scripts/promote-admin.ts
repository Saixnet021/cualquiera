
import { db } from '../src/infrastructure/firebase/firebase.config';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

async function promoteAdmin(email: string) {
  if (!email) {
    console.error('Por favor proporciona un email: npx ts-node scripts/promote-admin.ts email@ejemplo.com');
    process.exit(1);
  }

  console.log(`Buscando usuario: ${email}...`);
  
  const q = query(collection(db, 'users'), where('email', '==', email));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    console.error('Error: No se encontró ningún usuario con ese email en Firestore. ¿Ya te registraste en la app?');
    process.exit(1);
  }

  const userDoc = snapshot.docs[0];
  await updateDoc(doc(db, 'users', userDoc.id), {
    role: 'admin'
  });

  console.log(`✅ ¡Éxito! El usuario ${email} ahora es Administrador.`);
  process.exit(0);
}

const email = process.argv[2];
promoteAdmin(email);

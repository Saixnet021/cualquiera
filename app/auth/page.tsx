
'use client';

import { useState } from 'react';
import { useAuth } from '@/src/presentation/providers/auth.store';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const getFriendlyErrorMessage = (errorCode: string) => {
        switch (errorCode) {
            case 'auth/email-already-in-use':
                return 'EL CORREO YA ESTÁ REGISTRADO.';
            case 'auth/invalid-credential':
            case 'auth/wrong-password':
            case 'auth/user-not-found':
                return 'CREDENCIALES INCORRECTAS.';
            case 'auth/weak-password':
                return 'LA CONTRASEÑA ES MUY DÉBIL.';
            default:
                return 'ERROR AL PROCESAR LA SOLICITUD.';
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                if (password !== confirmPassword) {
                    setErrorMsg("LAS CONTRASEÑAS NO COINCIDEN.");
                    setLoading(false);
                    return;
                }
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                await updateProfile(user, { displayName: name });
                try {
                    await setDoc(doc(db, 'users', user.uid), {
                        email: user.email,
                        displayName: name,
                        createdAt: new Date(),
                        role: 'user'
                    });
                } catch (error) { console.error("Error al guardar datos del usuario:", error); }
            }
            router.push('/');
        } catch (error: any) { 
            setErrorMsg(getFriendlyErrorMessage(error.code)); 
        } 
        finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-sm">
                {/* Header */}
                <div className="mb-10 text-center">
                    <div className="w-12 h-12 bg-fg text-bg flex items-center justify-center font-black text-2xl mx-auto mb-6">E</div>
                    <h1 className="text-3xl font-black text-fg uppercase tracking-tighter">
                        {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                    </h1>
                    <p className="text-muted-fg mt-2 text-[10px] font-black uppercase tracking-widest">
                        {isLogin ? 'Accede a tu cuenta' : 'Únete a la plataforma'}
                    </p>
                </div>

                {/* Form */}
                <div className="border border-border bg-bg p-8 shadow-none space-y-6">
                    {errorMsg && (
                        <div className="bg-bg border border-red-500 text-red-500 p-4 text-[10px] font-black uppercase flex items-center gap-3">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <p>{errorMsg}</p>
                        </div>
                    )}
                    
                    <form onSubmit={handleAuth} className="space-y-5">
                        {!isLogin && (
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-muted-fg uppercase tracking-widest">Nombre Completo</label>
                                <Input
                                    type="text" placeholder="NOMBRE"
                                    value={name} onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-muted-fg uppercase tracking-widest">Correo Electrónico</label>
                            <Input
                                type="email" placeholder="CORREO@EJEMPLO.COM"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-muted-fg uppercase tracking-widest">Contraseña</label>
                            <Input
                                type="password" placeholder="••••••••"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        
                        {!isLogin && (
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-muted-fg uppercase tracking-widest">Confirmar Contraseña</label>
                                <Input
                                    type="password" placeholder="••••••••"
                                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        <Button type="submit" className="w-full h-12 mt-4 bg-fg text-bg hover:opacity-80 font-black uppercase text-sm tracking-tighter rounded-none" disabled={loading}>
                            {loading ? 'PROCESANDO...' : isLogin ? 'Ingresar al Portal' : 'Crear Registro'}
                        </Button>

                        <div className="relative flex items-center gap-4 py-4">
                            <div className="flex-1 h-px bg-border" />
                            <span className="text-[8px] font-black text-muted-fg uppercase tracking-widest">Ó</span>
                            <div className="flex-1 h-px bg-border" />
                        </div>

                        <Button
                            type="button" onClick={() => setIsLogin(!isLogin)}
                            variant="ghost" className="w-full h-12 text-[10px] font-black uppercase tracking-widest hover:bg-muted"
                        >
                            {isLogin ? 'Crear Cuenta Nueva' : 'Ya tengo cuenta'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { useAuth } from '@/store/auth';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
    const { setUser } = useAuth();
    const router = useRouter();

    const getFriendlyErrorMessage = (errorCode: string) => {
        switch (errorCode) {
            case 'auth/email-already-in-use':
                return 'Este correo electrónico ya está registrado. Por favor, inicia sesión.';
            case 'auth/invalid-credential':
            case 'auth/wrong-password':
            case 'auth/user-not-found':
                return 'Credenciales incorrectas. Verifica tu correo y contraseña.';
            case 'auth/weak-password':
                return 'La contraseña es muy débil. Debe tener al menos 6 caracteres.';
            case 'auth/invalid-email':
                return 'El formato del correo electrónico no es válido.';
            case 'auth/too-many-requests':
                return 'Demasiados intentos fallidos. Por favor, intenta más tarde.';
            case 'auth/network-request-failed':
                return 'Error de red. Verifica tu conexión a internet.';
            default:
                return 'Ocurrió un error inesperado al procesar tu solicitud.';
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
                    setErrorMsg("Las contraseñas no coinciden. Intenta de nuevo.");
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
                } catch (error) { console.error("Error saving user data:", error); }
            }
            router.push('/');
        } catch (error: any) { 
            console.error(error);
            setErrorMsg(getFriendlyErrorMessage(error.code)); 
        } 
        finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm">
                {/* Header */}
                <div className="mb-8 text-center animate-fade-in">
                    <div className="w-16 h-16 relative mx-auto mb-4 rounded-full overflow-hidden border border-[#1e293b]">
                        <Image src="/pedro.jpeg" alt="Logo" fill className="object-cover" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </h1>
                    <p className="text-[#9ca3af] mt-2 text-sm">
                        {isLogin ? 'Ingresa para continuar' : 'Regístrate'}
                    </p>
                </div>

                {/* Form */}
                <div className="border border-[#262a31] bg-[#10141a] rounded-2xl p-6 sm:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
                    {errorMsg && (
                        <div className="animate-fade-in mb-6 bg-red-900/30 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm flex items-start gap-3 shadow-lg">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <p>{errorMsg}</p>
                        </div>
                    )}
                    
                    <form onSubmit={handleAuth} className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-[#9ca3af] uppercase tracking-wide">Nombre</label>
                                <Input
                                    type="text" placeholder="Tu nombre"
                                    value={name} onChange={(e) => setName(e.target.value)}
                                    required
                                    className="bg-[#1e293b] border-none text-white placeholder:text-[#64748b]"
                                />
                            </div>
                        )}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#9ca3af] uppercase tracking-wide">Email</label>
                            <Input
                                type="email" placeholder="tu@email.com"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-[#1e293b] border-none text-white placeholder:text-[#64748b]"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#9ca3af] uppercase tracking-wide">Contraseña</label>
                            <Input
                                type="password" placeholder="••••••••"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-[#1e293b] border-none text-white placeholder:text-[#64748b]"
                            />
                        </div>
                        
                        {!isLogin && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-[#9ca3af] uppercase tracking-wide">Confirmar Contraseña</label>
                                <Input
                                    type="password" placeholder="••••••••"
                                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="bg-[#1e293b] border-none text-white placeholder:text-[#64748b]"
                                />
                            </div>
                        )}

                        <Button type="submit" className="w-full mt-2" disabled={loading}>
                            {loading ? 'Cargando...' : isLogin ? 'Ingresar' : 'Registrarse'}
                        </Button>

                        <div className="relative flex items-center gap-2 py-4">
                            <div className="flex-1 h-px bg-[#1e293b]" />
                            <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest">Ó</span>
                            <div className="flex-1 h-px bg-[#1e293b]" />
                        </div>

                        <Button
                            type="button" onClick={() => setIsLogin(!isLogin)}
                            variant="secondary" className="w-full text-xs"
                        >
                            {isLogin ? 'Crear una cuenta nueva' : 'Ya tengo cuenta'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}


'use client';

import { useAuth } from '../store/auth.store';
import { auth } from '@/lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function AuthButton({ className }: { className?: string }) {
    const { user, setUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => setUser(user));
        return () => unsubscribe();
    }, [setUser]);

    const handleSignOut = async () => {
        await signOut(auth);
        router.refresh();
    };

    if (user) {
        return (
            <div className={cn("flex items-center gap-2", className)}>
                <span className="text-[13px] font-[family-name:var(--font-manrope)] font-bold text-[#8d90a2] hidden md:flex items-center gap-1.5">
                    {user.displayName || user.email}
                </span>
                <button
                    onClick={handleSignOut}
                    className="p-2 rounded-xl text-[#8d90a2] hover:text-[#ffb4ab] hover:bg-[#690005]/20 border border-transparent hover:border-[#ffb4ab]/20 transition-all duration-300"
                    aria-label="Cerrar sesión"
                >
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <Link href="/auth" className={cn("flex items-center gap-2 text-[#c3c5d8] hover:text-white font-[family-name:var(--font-manrope)] font-bold text-sm transition-all hover:-translate-y-0.5", className)}>
            <UserIcon className="w-5 h-5" />
            <span className="hidden md:inline">Iniciar Sesión</span>
            <span className="md:hidden">Login</span>
        </Link>
    );
}

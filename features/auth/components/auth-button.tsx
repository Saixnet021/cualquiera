
'use client';

import { useAuth } from '@/src/presentation/providers/auth.store';
import { auth } from '@/lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { LogOut, User as UserIcon, LogIn } from 'lucide-react';
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
        router.push('/');
        router.refresh();
    };

    if (user) {
        return (
            <div className={cn("flex items-center gap-2", className)}>
                <span className="text-[10px] font-black text-muted-fg hidden lg:block uppercase tracking-tighter max-w-[100px] truncate">
                    {user.displayName || user.email?.split('@')[0]}
                </span>
                <button
                    onClick={handleSignOut}
                    className="w-9 h-9 flex items-center justify-center border border-border text-fg hover:bg-fg hover:text-bg transition-all group"
                    aria-label="Cerrar sesión"
                >
                    <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
            </div>
        );
    }

    return (
        <Link 
            href="/auth" 
            className={cn(
                "h-9 px-4 flex items-center gap-2 border border-border bg-bg text-fg hover:bg-fg hover:text-bg font-black text-[10px] uppercase tracking-widest transition-all", 
                className
            )}
        >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login</span>
        </Link>
    );
}

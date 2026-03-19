
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
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, [setUser]);

    const handleSignOut = async () => {
        await signOut(auth);
        router.refresh();
    };

    if (user) {
        return (
            <div className="flex items-center gap-4">
                <span className={cn("text-sm font-medium flex items-center gap-2 hidden md:flex", className || 'text-gray-900')}>
                    <UserIcon className="w-4 h-4" />
                    {user.displayName || user.email}
                </span>
                <Button
                    onClick={handleSignOut}
                    className="bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 font-bold transition-all"
                    size="sm"
                >
                    <LogOut className="w-4 h-4" />

                </Button>
            </div>
        );
    }

    return (
        <Link href="/auth">
            <Button
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] transition-all hover:scale-105 border border-blue-400/30"
                size="sm"
            >
                <UserIcon className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Iniciar Sesión</span>
                <span className="md:hidden">Login</span>
            </Button>
        </Link>
    );
}

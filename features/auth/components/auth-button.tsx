
'use client';

import { useAuth } from '@/src/presentation/providers/auth.store';
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
            <div className={cn("flex items-center gap-3", className)}>
                <span className="text-[11px] font-black text-[#666] hidden md:flex items-center gap-1.5 uppercase tracking-tighter">
                    {user.displayName || user.email}
                </span>
                <button
                    onClick={handleSignOut}
                    className="p-2 text-[#666] hover:text-white transition-colors"
                    aria-label="Log out"
                >
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <Link href="/auth" className={cn("flex items-center gap-2 text-white hover:opacity-70 font-black text-[11px] uppercase tracking-tighter transition-all", className)}>
            <UserIcon className="w-4 h-4" />
            <span>Login</span>
        </Link>
    );
}

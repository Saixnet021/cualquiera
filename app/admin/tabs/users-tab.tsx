
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users, Shield, UserPlus, Loader2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { FirebaseUserRepository } from '@/src/infrastructure/firebase/user.repository';
import { USER_ROLE_LABELS, UserRole } from '@/src/domain/value-objects/role.vo';
import type { UserEntity } from '@/src/domain/entities/user.entity';
import { Button } from '@/components/ui/button';
import { UpdateUserRoleUseCase } from '@/src/application/usecases/UpdateUserRoleUseCase';
import { useAuth } from '@/src/presentation/providers/auth.store';

const userRepo = new FirebaseUserRepository();
const updateRoleUC = new UpdateUserRoleUseCase();

function RoleSelect({ user, currentUid, onChanged }: { user: UserEntity, currentUid: string, onChanged: () => void }) {
  const [loading, setLoading] = useState(false);
  const isSelf = user.uid === currentUid;
  const isSuperAdmin = user.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;
  const disabled = isSelf || isSuperAdmin;

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as UserRole;
    if (newRole === user.role) return;
    setLoading(true);
    try {
      await updateRoleUC.execute(currentUid, user.uid, newRole);
      toast.success(`Rol actualizado`);
      onChanged();
    } catch (err: any) {
      toast.error(err.message ?? 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={user.role}
        onChange={handleChange}
        disabled={disabled || loading}
        className={`
          h-8 px-2 py-0 text-[10px] font-black uppercase rounded-none border transition-all focus:outline-none
          ${disabled
            ? 'opacity-40 cursor-not-allowed border-border bg-muted text-muted-fg'
            : 'border-border bg-bg text-fg hover:border-fg focus:border-fg cursor-pointer'}
        `}
      >
        <option value={UserRole.CUSTOMER}>Cliente</option>
        <option value={UserRole.ADMIN}>Administrador</option>
      </select>
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-fg" />}
    </div>
  );
}

function InviteAdmin({ currentUid, onChanged }: { currentUid: string, onChanged: () => void }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;
    setLoading(true);
    try {
      const target = await userRepo.getByEmail(trimmed);
      if (!target) {
        toast.error(`No encontrado`);
        return;
      }
      await updateRoleUC.execute(currentUid, target.uid, UserRole.ADMIN);
      toast.success(`Usuario promovido`);
      setEmail('');
      onChanged();
    } catch (err: any) {
      toast.error(err.message ?? 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 border border-border p-6 bg-bg">
      <div className="flex items-center gap-3 mb-6">
        <UserPlus className="w-5 h-5 text-fg" />
        <div>
          <h3 className="font-black text-fg text-xs uppercase tracking-widest">Promover Usuario</h3>
          <p className="text-[10px] text-muted-fg mt-1 uppercase font-bold">Eleva un usuario a rango Administrador.</p>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
            placeholder="correo@ejemplo.com"
            className="w-full pl-10 bg-input-bg border border-input-border text-fg placeholder:text-muted-fg h-10 text-[10px] font-black uppercase focus:outline-none focus:border-fg"
          />
        </div>
        <Button
          onClick={handleInvite}
          disabled={loading || !email.trim()}
          className="bg-fg text-bg hover:opacity-80 font-black h-10 px-6 uppercase text-[10px] tracking-widest rounded-none"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Promover'}
        </Button>
      </div>
    </div>
  );
}

export default function UsersTab() {
  const [users, setUsers] = useState<UserEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userRepo.getAll();
      const sorted = [...data].sort((a, b) => {
        if (a.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL) return -1;
        if (b.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL) return 1;
        if (a.role === UserRole.ADMIN && b.role !== UserRole.ADMIN) return -1;
        return 0;
      });
      setUsers(sorted);
    } catch {
      toast.error('Error al cargar');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const currentUid = currentUser?.uid ?? '';

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-fg flex items-center gap-4 uppercase tracking-tighter">
          <Users className="w-6 h-6" />
          Registro de Usuarios
          <span className="text-xs font-black bg-muted text-fg px-2 py-1 tracking-widest ml-2">
            {users.length}
          </span>
        </h2>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto border border-border bg-bg">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="py-4 px-6 font-black text-fg text-[10px] uppercase tracking-widest">Identidad</th>
                  <th className="py-4 px-6 font-black text-fg text-[10px] uppercase tracking-widest">Correo</th>
                  <th className="py-4 px-6 font-black text-fg text-[10px] uppercase tracking-widest">Estado</th>
                  <th className="py-4 px-6 font-black text-fg text-[10px] uppercase tracking-widest">Registro</th>
                  <th className="py-4 px-6 font-black text-fg text-[10px] uppercase tracking-widest">Gestión</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr
                    key={user.id}
                    className={`border-b border-border/50 hover:bg-muted/50 transition ${user.uid === currentUid ? 'bg-muted/30' : ''}`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-fg text-bg flex items-center justify-center text-[10px] font-black uppercase">
                          {(user.displayName || user.email || '?')[0].toUpperCase()}
                        </div>
                        <span className="font-black text-fg text-[10px] uppercase tracking-tight truncate max-w-[120px]">
                          {user.displayName || 'Anónimo'}
                          {user.uid === currentUid && <span className="ml-2 text-muted-fg">(TÚ)</span>}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[10px] font-black text-muted-fg uppercase tracking-tight">
                      {user.email}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-2 px-2 py-1 text-[9px] font-black border uppercase tracking-widest ${
                        user.role === UserRole.ADMIN
                          ? 'bg-fg text-bg border-fg'
                          : 'bg-bg text-muted-fg border-border'
                      }`}>
                        {user.role === UserRole.ADMIN && <Shield className="w-3 h-3" />}
                        {USER_ROLE_LABELS[user.role]}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[10px] font-black text-muted-fg uppercase">
                      {user.createdAt?.toLocaleDateString('es-ES') ?? '—'}
                    </td>
                    <td className="py-4 px-6">
                      <RoleSelect
                        user={user}
                        currentUid={currentUid}
                        onChanged={loadUsers}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <InviteAdmin currentUid={currentUid} onChanged={loadUsers} />
        </>
      )}
    </div>
  );
}

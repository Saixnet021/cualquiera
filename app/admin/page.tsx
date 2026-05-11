
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { AdminGuard } from '@/src/presentation/guards/admin-guard';
import { useAuthStore } from '@/src/presentation/providers/auth.store';
import { signOut } from 'firebase/auth';
import { auth } from '@/src/infrastructure/firebase/firebase.config';
import { Package, ShoppingBag, Users, LogOut, Tag, Database, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { seedDatabase } from '@/src/infrastructure/firebase/seeder';

const ProductsTab = dynamic(() => import('./tabs/products-tab'), {
  loading: () => <TabSkeleton />,
  ssr: false,
});
const OrdersTab = dynamic(() => import('./tabs/orders-tab'), {
  loading: () => <TabSkeleton />,
  ssr: false,
});
const UsersTab = dynamic(() => import('./tabs/users-tab'), {
  loading: () => <TabSkeleton />,
  ssr: false,
});
const CategoriesTab = dynamic(() => import('./tabs/categories-tab'), {
  loading: () => <TabSkeleton />,
  ssr: false,
});
const SettingsTab = dynamic(() => import('./tabs/settings-tab'), {
  loading: () => <TabSkeleton />,
  ssr: false,
});

type Tab = 'productos' | 'pedidos' | 'usuarios' | 'categorias' | 'configuracion';

function TabSkeleton() {
  return (
    <div className="p-6 space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-16 bg-muted animate-pulse" />
      ))}
    </div>
  );
}

function AdminDashboard() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('productos');
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  const [isSeeding, setIsSeeding] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Sesión cerrada correctamente');
    } catch {
      toast.error('Error al cerrar sesión');
    }
  };

  const TABS = [
    { id: 'productos' as Tab, label: 'Productos', icon: Package, badge: null },
    { id: 'pedidos' as Tab, label: 'Pedidos', icon: ShoppingBag, badge: pendingOrdersCount || null },
    { id: 'categorias' as Tab, label: 'Categorías', icon: Tag, badge: null },
    { id: 'usuarios' as Tab, label: 'Usuarios', icon: Users, badge: null },
    { id: 'configuracion' as Tab, label: 'Ajustes', icon: Settings, badge: null },
  ];

  return (
    <div className="min-h-screen bg-bg py-8 pt-28 relative">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-fg uppercase tracking-tighter leading-tight">
              Panel <span className="opacity-50">Control</span>
            </h1>
            <p className="text-muted-fg text-xs font-bold mt-1 uppercase">{user?.email}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                if (!confirm('¿Deseas poblar la base de datos con 20 productos demo?')) return;
                setIsSeeding(true);
                try {
                  await seedDatabase();
                  toast.success('Base de datos poblada con éxito');
                  window.location.reload();
                } catch (e) {
                  toast.error('Error al poblar');
                } finally {
                  setIsSeeding(false);
                }
              }}
              disabled={isSeeding}
              className="flex items-center justify-center gap-2 px-6 h-11 border border-border bg-bg text-muted-fg hover:bg-fg hover:text-bg hover:border-fg transition-all font-black uppercase text-[10px] tracking-widest disabled:opacity-50"
            >
              <Database className={`w-4 h-4 ${isSeeding ? 'animate-spin' : ''}`} />
              Poblar Datos
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 px-6 h-11 border border-border bg-bg text-muted-fg hover:bg-fg hover:text-bg hover:border-fg transition-all font-black uppercase text-[10px] tracking-widest"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-4 py-3 font-black uppercase text-[10px] tracking-widest whitespace-nowrap transition flex items-center gap-2 border-b-2 ${
                activeTab === id
                  ? 'border-fg text-fg'
                  : 'border-transparent text-muted-fg hover:text-fg'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {badge !== null && (
                <span className="bg-fg text-bg text-[9px] font-black px-2 py-0.5">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-bg border border-border">
          {activeTab === 'productos' && <ProductsTab />}
          {activeTab === 'pedidos' && (
            <OrdersTab onPendingCountChange={setPendingOrdersCount} />
          )}
          {activeTab === 'usuarios' && <UsersTab />}
          {activeTab === 'categorias' && <CategoriesTab />}
          {activeTab === 'configuracion' && <SettingsTab />}
        </div>

      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  );
}

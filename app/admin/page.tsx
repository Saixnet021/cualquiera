'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/store/auth.store';
import { auth } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product, Order } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Check, X, Package, ShoppingBag, LogOut, Users } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminPage() {
  const { user, setUser } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'productos' | 'pedidos' | 'usuarios'>('productos');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imageUrl: '',
    category: '',
    whatsappNumber: '',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [setUser]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setEmail('');
      setPassword('');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  // Convertir imagen a base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setNewProduct({ ...newProduct, imageUrl: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const loadData = async () => {
    const [productsSnapshot, ordersSnapshot] = await Promise.all([
      getDocs(collection(db, 'products')),
      getDocs(collection(db, 'orders')),
    ]);

    setProducts(
      productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Product[]
    );

    setOrders(
      ordersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Order[]
    );

    // Cargar usuarios desde Firestore
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        // Calcular total de órdenes para este usuario
        totalOrders: ordersSnapshot.docs.filter(d => d.data().userEmail === doc.data().email).length,
        lastOrder: ordersSnapshot.docs
          .filter(d => d.data().userEmail === doc.data().email)
          .sort((a, b) => (b.data().createdAt?.seconds || 0) - (a.data().createdAt?.seconds || 0))[0]
          ?.data().createdAt?.toDate() || null
      }));
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.whatsappNumber) {
      alert('Nombre, Precio y WhatsApp son obligatorios');
      return;
    }
    try {
      await addDoc(collection(db, 'products'), {
        ...newProduct,
        createdAt: new Date(),
      });
      setShowAddProduct(false);
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        imageUrl: '',
        category: '',
        whatsappNumber: '',
      });
      loadData();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error al agregar producto');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('¿Seguro que quieres eliminar este producto?')) {
      await deleteDoc(doc(db, 'products', id));
      loadData();
    }
  };

  const handleUpdateProduct = async (productId: string, updatedProduct: Partial<Product>) => {
    try {
      await updateDoc(doc(db, 'products', productId), updatedProduct);
      loadData();
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error al actualizar producto');
    }
  };

  const handleApproveOrder = async (order: Order) => {
    try {
      // Actualizar stock de productos
      for (const item of order.items) {
        const productRef = doc(db, 'products', item.id);
        const product = products.find((p) => p.id === item.id);
        if (product) {
          await updateDoc(productRef, {
            stock: product.stock - item.quantity,
          });
        }
      }

      // Actualizar estado de la orden
      await updateDoc(doc(db, 'orders', order.id), {
        status: 'approved',
      });

      loadData();
      alert('Pedido aprobado y stock actualizado');
    } catch (error) {
      console.error('Error approving order:', error);
      alert('Error al aprobar pedido');
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    await updateDoc(doc(db, 'orders', orderId), {
      status: 'rejected',
    });
    loadData();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black pointer-events-none" />
        <Card className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 relative z-10">
          <CardHeader>
            <CardTitle className="text-center text-white text-2xl">Panel de Administración</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <p className="text-sm text-gray-400 text-center mb-4">
                {isLogin ? 'Inicia sesión para acceder' : 'Crea una cuenta de administrador'}
              </p>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-white bg-black/40 border-white/10 focus:border-blue-600 placeholder-gray-500"
                required
              />
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-white bg-black/40 border-white/10 focus:border-blue-600 placeholder-gray-500"
                required
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]" disabled={loading}>
                {loading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </Button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
                >
                  {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Validar que solo admin@admin.com pueda acceder
  const ADMIN_EMAIL = 'admin@admin.com';
  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-center text-red-500">Acceso Denegado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-300">
              No tienes permisos para acceder al panel de administración.
            </p>
            <p className="text-center text-sm text-gray-500">
              Usuario: {user.email}
            </p>
            <Button onClick={handleSignOut} className="w-full bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/50">
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e14] py-8 pt-28 relative">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">Panel de <span className="text-[#1d4ed8]">Administración</span></h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[#262a31] overflow-x-auto">
          <button
            onClick={() => setActiveTab('productos')}
            className={`px-4 py-3 font-bold whitespace-nowrap transition ${activeTab === 'productos'
              ? 'border-b-2 border-[#1d4ed8] text-[#1d4ed8]'
              : 'text-[#64748b] hover:text-white'
              }`}
          >
            <Package className="w-4 h-4 inline mr-2" />
            Productos
          </button>
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`px-4 py-3 font-bold whitespace-nowrap transition ${activeTab === 'pedidos'
              ? 'border-b-2 border-[#1d4ed8] text-[#1d4ed8]'
              : 'text-[#64748b] hover:text-white'
              }`}
          >
            <ShoppingBag className="w-4 h-4 inline mr-2" />
            Pedidos ({orders.filter(o => o.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`px-4 py-3 font-bold whitespace-nowrap transition ${activeTab === 'usuarios'
              ? 'border-b-2 border-[#1d4ed8] text-[#1d4ed8]'
              : 'text-[#64748b] hover:text-white'
              }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Usuarios ({users.length})
          </button>
        </div>

        {/* Content */}
        <div className="bg-[#10141a] rounded-xl border border-[#262a31]">
          {/* Productos Tab */}
          {activeTab === 'productos' && (
            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Package className="w-6 h-6 text-[#1d4ed8]" />
                  Gestión de Productos
                </h2>
                <Button onClick={() => setShowAddProduct(!showAddProduct)} className="bg-[#1d4ed8] hover:bg-blue-800 w-full sm:w-auto shadow-none">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Producto
                </Button>
              </div>

              {showAddProduct && (
                <div className="mb-6 p-4 border border-[#262a31] rounded-lg bg-[#181c22] space-y-3">
                  <Input
                    placeholder="Nombre"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="text-white bg-[#0a0e14] border-[#262a31] focus:border-[#1d4ed8] placeholder-[#64748b]"
                  />
                  <Input
                    placeholder="Descripción"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="text-white bg-[#0a0e14] border-[#262a31] focus:border-[#1d4ed8] placeholder-[#64748b]"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      type="number"
                      placeholder="Precio"
                      value={newProduct.price || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                      className="text-white bg-[#0a0e14] border-[#262a31] focus:border-[#1d4ed8] placeholder-[#64748b]"
                    />
                    <Input
                      type="number"
                      placeholder="Stock"
                      value={newProduct.stock || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                      className="text-white bg-[#0a0e14] border-[#262a31] focus:border-[#1d4ed8] placeholder-[#64748b]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#c3c5d8] block">Imagen del producto</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="flex h-10 w-full rounded-md border border-[#262a31] bg-[#0a0e14] px-3 py-2 text-sm text-[#c3c5d8] focus:border-[#1d4ed8] file:bg-[#1d4ed8] file:text-white file:border-0 file:rounded-sm file:mr-2 file:cursor-pointer"
                    />
                    {newProduct.imageUrl && (
                      <div className="relative w-full h-24 bg-[#0a0e14] rounded-md overflow-hidden border border-[#262a31]">
                        <img
                          src={newProduct.imageUrl}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <Input
                    placeholder="Categoría"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="text-white bg-[#0a0e14] border-[#262a31] focus:border-[#1d4ed8] placeholder-[#64748b]"
                  />
                  <Input
                    placeholder="WhatsApp (ej: 51937074085)"
                    value={newProduct.whatsappNumber}
                    onChange={(e) => setNewProduct({ ...newProduct, whatsappNumber: e.target.value })}
                    className="text-white bg-[#0a0e14] border-[#262a31] focus:border-[#1d4ed8] placeholder-[#64748b]"
                  />
                  <Button onClick={handleAddProduct} className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold shadow-none">
                    Guardar Producto
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="p-4 border border-[#262a31] rounded-xl bg-[#181c22] hover:border-[#1d4ed8]/50 transition-all group">
                    <div className="space-y-3">
                      {editingProduct === product.id ? (
                        <>
                          <Input
                            value={product.name}
                            onChange={(e) => {
                              const updated = products.map(p => p.id === product.id ? { ...p, name: e.target.value } : p);
                              setProducts(updated);
                            }}
                            className="text-white bg-[#0a0e14] border-[#262a31] focus:border-[#1d4ed8]"
                          />
                          <Input
                            type="number"
                            value={product.stock}
                            onChange={(e) => {
                              const updated = products.map(p => p.id === product.id ? { ...p, stock: parseInt(e.target.value) } : p);
                              setProducts(updated);
                            }}
                            className="text-white bg-[#0a0e14] border-[#262a31] focus:border-[#1d4ed8]"
                            placeholder="Stock"
                          />
                          <Input
                            type="number"
                            value={product.price}
                            onChange={(e) => {
                              const updated = products.map(p => p.id === product.id ? { ...p, price: parseFloat(e.target.value) } : p);
                              setProducts(updated);
                            }}
                            className="text-white bg-[#0a0e14] border-[#262a31] focus:border-[#1d4ed8]"
                            placeholder="Precio"
                          />
                          <Input
                            value={product.whatsappNumber || ''}
                            onChange={(e) => {
                              const updated = products.map(p => p.id === product.id ? { ...p, whatsappNumber: e.target.value } : p);
                              setProducts(updated);
                            }}
                            className="text-white bg-[#0a0e14] border-[#262a31] focus:border-[#1d4ed8]"
                            placeholder="WhatsApp"
                          />
                        </>
                      ) : (
                        <>
                          <h4 className="font-bold text-white group-hover:text-[#1d4ed8] transition-colors">{product.name}</h4>
                          <div className="text-sm space-y-1">
                            <p className="text-[#1d4ed8] font-semibold">{formatPrice(product.price)}</p>
                            <p className="text-[#64748b]">
                              Stock: <span className={product.stock > 10 ? 'text-green-400 font-bold' : product.stock > 0 ? 'text-yellow-400 font-bold' : 'text-red-400 font-bold'}>{product.stock}</span>
                            </p>
                          </div>
                        </>
                      )}
                      <div className="flex gap-2 pt-2">
                        {editingProduct === product.id ? (
                          <>
                            <Button
                              onClick={() => handleUpdateProduct(product.id, {
                                name: product.name,
                                stock: product.stock,
                                price: product.price,
                                whatsappNumber: product.whatsappNumber
                              })}
                              size="sm"
                              className="flex-1 bg-[#10b981] hover:bg-[#059669] shadow-none border-none text-white"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => setEditingProduct(null)}
                              variant="outline"
                              size="sm"
                              className="flex-1 border-[#262a31] text-[#64748b] hover:bg-[#262a31] hover:text-white"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              onClick={() => setEditingProduct(product.id)}
                              variant="outline"
                              size="sm"
                              className="flex-1 border-[#1d4ed8] bg-transparent text-[#1d4ed8] hover:bg-[#1d4ed8] hover:text-white font-bold transition-colors shadow-none"
                            >
                              Editar
                            </Button>
                            <Button
                              onClick={() => handleDeleteProduct(product.id)}
                              size="sm"
                              className="flex-[0.5] bg-[#7f1d1d] hover:bg-[#991b1b] text-white shadow-none"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pedidos Tab */}
          {activeTab === 'pedidos' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
                <ShoppingBag className="w-6 h-6 text-[#1d4ed8]" />
                Gestión de Pedidos
              </h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {orders
                  .filter((order) => order.status === 'pending')
                  .map((order) => (
                    <div key={order.id} className="p-4 border border-[#262a31] rounded-xl bg-[#181c22] hover:border-[#1d4ed8]/50 transition">
                      <div className="mb-3">
                        <p className="font-bold text-white">{order.userEmail}</p>
                        <p className="text-sm text-[#64748b]">
                          Fecha: {order.createdAt?.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) || 'N/A'}
                        </p>
                      </div>
                      <div className="bg-[#0a0e14] p-3 rounded-lg border border-[#262a31] mb-3">
                        <p className="font-bold text-[#f7f5ff]">{order.items?.[0]?.name || 'Producto desconocido'} {order.items?.length > 1 ? `(+${order.items.length - 1} más)` : ''}</p>
                        <p className="text-[#c3c5d8] font-semibold text-sm">Items: {order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0}</p>
                        <p className="text-lg font-black text-[#1d4ed8] mt-1">Total: {formatPrice(order.finalTotal || order.total || 0)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApproveOrder(order)}
                          className="flex-1 bg-[#10b981] hover:bg-[#059669] text-white shadow-none"
                          size="sm"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Aprobar
                        </Button>
                        <Button
                          onClick={() => handleRejectOrder(order.id)}
                          className="flex-[0.5] bg-[#7f1d1d] hover:bg-[#991b1b] text-white shadow-none"
                          size="sm"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Rechazar
                        </Button>
                      </div>
                    </div>
                  ))}
                {orders.filter((order) => order.status === 'pending').length === 0 && (
                  <p className="text-center text-[#64748b] py-12 text-lg font-medium">No hay pedidos pendientes</p>
                )}
              </div>
            </div>
          )}

          {/* Usuarios Tab */}
          {activeTab === 'usuarios' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
                <Users className="w-6 h-6 text-[#1d4ed8]" />
                Gestión de Usuarios
              </h2>
              <div className="overflow-x-auto pb-4">
                <table className="w-full text-left min-w-[600px]">
                  <thead>
                    <tr className="border-b border-[#262a31]">
                      <th className="py-3 px-4 font-bold text-[#64748b]">Nombre</th>
                      <th className="py-3 px-4 font-bold text-[#64748b]">Email</th>
                      <th className="py-3 px-4 font-bold text-[#64748b]">Registrado</th>
                      <th className="py-3 px-4 font-bold text-[#64748b]">Total de Órdenes</th>
                      <th className="py-3 px-4 font-bold text-[#64748b]">Última Orden</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={index} className="border-b border-[#262a31]/50 hover:bg-[#181c22] transition">
                        <td className="py-3 px-4 text-white font-medium">{user.displayName || 'N/A'}</td>
                        <td className="py-3 px-4 text-[#c3c5d8]">{user.email}</td>
                        <td className="py-3 px-4 text-[#64748b] text-sm">{user.createdAt?.toLocaleDateString('es-ES') || 'N/A'}</td>
                        <td className="py-3 px-4">
                          <span className="bg-[#1d4ed8] text-white px-3 py-1 rounded-full font-bold text-xs">{user.totalOrders}</span>
                        </td>
                        <td className="py-3 px-4 text-[#64748b] text-sm">
                          {user.lastOrder?.toLocaleDateString('es-ES') || 'Sin pedidos'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <p className="text-center text-[#64748b] py-12 text-lg font-medium">No hay usuarios registrados</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

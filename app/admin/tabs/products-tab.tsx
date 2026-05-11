
'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, X, Package, Loader2, Upload, Filter, Search, Check } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { useImageUpload } from '@/src/shared/hooks/use-image-upload';
import { useCategories } from '@/features/catalog/hooks/use-categories';

import { FirebaseProductRepository } from '@/src/infrastructure/firebase/product.repository';
import { GetProductsUseCase } from '@/src/application/products/get-products.usecase';
import { CreateProductUseCase } from '@/src/application/products/create-product.usecase';
import { UpdateProductUseCase } from '@/src/application/products/update-product.usecase';
import { DeleteProductUseCase } from '@/src/application/products/delete-product.usecase';
import { AppError } from '@/src/shared/errors/app-error';
import type { ProductEntity } from '@/src/domain/entities/product.entity';
import { cn } from '@/lib/utils';

const productRepo = new FirebaseProductRepository();
const getProducts = new GetProductsUseCase(productRepo);
const createProduct = new CreateProductUseCase(productRepo);
const updateProduct = new UpdateProductUseCase(productRepo);
const deleteProduct = new DeleteProductUseCase(productRepo);

const EMPTY_PRODUCT = {
  name: '',
  description: '',
  price: 0,
  stock: 0,
  imageUrl: '',
  category: '',
  variants: [],
};

export default function ProductsTab() {
  const [products, setProducts] = useState<ProductEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<ProductEntity>>({});
  const [newProduct, setNewProduct] = useState(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  
  // Filtering states
  const [adminSearch, setAdminSearch] = useState('');
  const [adminCategory, setAdminCategory] = useState<string | null>(null);

  const { categories } = useCategories();
  const { upload, uploading, url: uploadedUrl, reset: resetUpload } = useImageUpload();

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProducts.execute();
      setProducts(data);
    } catch {
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  useEffect(() => {
    if (uploadedUrl) {
      if (editingId) {
        setEditValues(prev => ({ ...prev, imageUrl: uploadedUrl }));
      } else {
        setNewProduct(prev => ({ ...prev, imageUrl: uploadedUrl }));
      }
    }
  }, [uploadedUrl, editingId]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(adminSearch.toLowerCase());
      const matchesCategory = adminCategory ? p.category === adminCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [products, adminSearch, adminCategory]);

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await upload(file);
    if (url) toast.success('Imagen lista');
  };

  const handleCreate = async () => {
    if (!newProduct.category) {
      toast.error('Selecciona una categoría');
      return;
    }
    setSaving(true);
    try {
      await createProduct.execute(newProduct);
      toast.success('Producto creado');
      setNewProduct(EMPTY_PRODUCT);
      setShowAddForm(false);
      resetUpload();
      loadProducts();
    } catch (err) {
      const msg = AppError.isAppError(err) ? err.message : 'Error al crear';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (product: ProductEntity) => {
    setEditingId(product.id);
    setEditValues(product);
  };

  const handleUpdate = async (id: string) => {
    setSaving(true);
    try {
      await updateProduct.execute(id, editValues);
      toast.success('Actualizado');
      setEditingId(null);
      setEditValues({});
      resetUpload();
      loadProducts();
    } catch (err) {
      const msg = AppError.isAppError(err) ? err.message : 'Error al actualizar';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    try {
      await deleteProduct.execute(id);
      toast.success('Eliminado');
      loadProducts();
    } catch {
      toast.error('Error');
    }
  };

  return (
    <div className="p-8 bg-bg">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
        <div>
          <h2 className="text-3xl font-black text-fg uppercase tracking-tighter flex items-center gap-4">
            <Package className="w-8 h-8" />
            Control de Inventario
          </h2>
          <p className="text-muted-fg text-[10px] font-black uppercase tracking-[0.2em] mt-2">
            {products.length} Ítems Registrados
          </p>
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
          <Button
            onClick={() => {
                setShowAddForm(!showAddForm);
                if (editingId) {
                    setEditingId(null);
                    setEditValues({});
                }
            }}
            className="flex-1 lg:flex-none h-14 px-10 font-black uppercase text-xs tracking-widest"
          >
            {showAddForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {showAddForm ? 'Cerrar' : 'Nuevo Producto'}
          </Button>
        </div>
      </div>

      {/* Admin Filters */}
      {!showAddForm && (
        <div className="flex flex-col md:flex-row gap-4 mb-10 pb-8 border-b border-border">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" />
            <input
              type="text"
              placeholder="BUSCAR EN INVENTARIO..."
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              className="w-full bg-input-bg border border-input-border h-12 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest focus:border-fg outline-none"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
             <button
              onClick={() => setAdminCategory(null)}
              className={cn(
                "px-5 h-12 text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap",
                !adminCategory ? "bg-fg text-bg border-fg" : "bg-bg text-fg border-border hover:border-fg"
              )}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setAdminCategory(cat.name)}
                className={cn(
                  "px-5 h-12 text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap",
                  adminCategory === cat.name ? "bg-fg text-bg border-fg" : "bg-bg text-fg border-border hover:border-fg"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Formulario Crear */}
      {showAddForm && (
        <div className="mb-12 p-10 border border-border bg-muted/30 space-y-8 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-fg font-black text-xs uppercase tracking-[0.3em] border-b border-border pb-6">Registro Técnico de Producto</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <label className="text-[9px] font-black text-muted-fg uppercase tracking-widest">Nombre del Producto</label>
                <input
                  value={newProduct.name}
                  onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-input-bg border border-input-border h-12 px-4 text-sm font-black uppercase tracking-tighter focus:border-fg outline-none"
                  placeholder="EJ: SUDADERA CYBERPUNK"
                />
            </div>
            <div className="space-y-2">
                <label className="text-[9px] font-black text-muted-fg uppercase tracking-widest">Categoría</label>
                <select
                  value={newProduct.category}
                  onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))}
                  className="w-full bg-input-bg border border-input-border h-12 px-4 text-[10px] font-black uppercase tracking-widest focus:border-fg outline-none appearance-none cursor-pointer"
                >
                  <option value="">SELECCIONAR...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
            </div>
          </div>

          <div className="space-y-2">
              <label className="text-[9px] font-black text-muted-fg uppercase tracking-widest">Descripción Técnica</label>
              <textarea
                value={newProduct.description}
                onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))}
                className="w-full bg-input-bg border border-input-border min-h-[100px] p-4 text-xs font-bold uppercase tracking-tight focus:border-fg outline-none"
                placeholder="DETALLES DEL PRODUCTO..."
              />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <label className="text-[9px] font-black text-muted-fg uppercase tracking-widest">Precio (S/)</label>
                <input
                  type="number"
                  value={newProduct.price || ''}
                  onChange={e => setNewProduct(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))}
                  className="w-full bg-input-bg border border-input-border h-12 px-4 text-sm font-black tracking-tighter focus:border-fg outline-none"
                />
            </div>
            <div className="space-y-2">
                <label className="text-[9px] font-black text-muted-fg uppercase tracking-widest">Stock Inicial</label>
                <input
                  type="number"
                  value={newProduct.stock || ''}
                  onChange={e => setNewProduct(p => ({ ...p, stock: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-input-bg border border-input-border h-12 px-4 text-sm font-black tracking-tighter focus:border-fg outline-none"
                />
            </div>
          </div>

          <div className="pt-6 border-t border-border flex flex-col md:flex-row gap-10">
            <div className="flex-1">
                <label className="text-[9px] font-black text-muted-fg uppercase tracking-widest block mb-4">Recurso Media</label>
                <div className="flex items-center gap-6">
                  <label className="cursor-pointer h-14 px-8 flex items-center gap-3 border border-border hover:bg-fg hover:text-bg transition-all text-[10px] font-black uppercase tracking-widest bg-bg text-fg">
                    <Upload className="w-4 h-4" />
                    {uploading ? 'Procesando...' : 'Subir Imagen'}
                    <input type="file" accept="image/*" onChange={handleImageFile} className="hidden" disabled={uploading} />
                  </label>
                  {newProduct.imageUrl && (
                    <div className="flex items-center gap-2 text-green-500 font-black text-[10px] uppercase">
                       <Check className="w-4 h-4" /> Activo
                    </div>
                  )}
                </div>
            </div>
            {newProduct.imageUrl && (
              <div className="relative w-40 h-40 bg-bg border border-border p-2">
                <Image src={newProduct.imageUrl} alt="vista previa" fill className="object-cover" />
              </div>
            )}
          </div>

          <Button
            onClick={handleCreate}
            disabled={saving || uploading}
            className="w-full h-16 text-xs font-black tracking-[0.2em] uppercase"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Confirmar y Guardar en Inventario
          </Button>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="group border border-border bg-bg hover:border-fg transition-all flex flex-col"
            >
              <div className="relative h-56 bg-muted border-b border-border overflow-hidden">
                {product.imageUrl ? (
                  <Image src={product.imageUrl} alt={product.name} fill className="object-cover transition-all duration-500" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Package className="w-10 h-10 text-muted-fg/20" />
                  </div>
                )}
                <div className="absolute top-0 left-0 bg-fg text-bg px-3 py-1.5 text-[9px] font-black uppercase tracking-widest">
                    {product.category}
                </div>
                <div className="absolute bottom-0 right-0 bg-bg/90 text-fg border-l border-t border-border px-3 py-1.5 text-[9px] font-black uppercase tracking-widest">
                    Stock: {product.stock}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                {editingId === product.id ? (
                  <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-muted-fg uppercase tracking-widest">Nombre</label>
                        <input
                        value={editValues.name ?? ''}
                        onChange={e => setEditValues(p => ({ ...p, name: e.target.value }))}
                        className="w-full bg-input-bg border border-input-border h-10 px-3 text-xs font-black uppercase tracking-tighter"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <label className="text-[8px] font-black text-muted-fg uppercase tracking-widest">Precio</label>
                            <input
                            type="number"
                            value={editValues.price ?? ''}
                            onChange={e => setEditValues(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))}
                            className="w-full bg-input-bg border border-input-border h-10 px-3 text-xs font-black"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[8px] font-black text-muted-fg uppercase tracking-widest">Stock</label>
                            <input
                            type="number"
                            value={editValues.stock ?? ''}
                            onChange={e => setEditValues(p => ({ ...p, stock: parseInt(e.target.value) || 0 }))}
                            className="w-full bg-input-bg border border-input-border h-10 px-3 text-xs font-black"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-muted-fg uppercase tracking-widest">Imagen</label>
                        <div className="flex gap-2">
                            <label className="flex-1 cursor-pointer h-10 flex items-center justify-center gap-2 border border-border hover:bg-fg hover:text-bg transition-all text-[9px] font-black uppercase tracking-widest bg-bg text-fg">
                                <Upload className="w-3.5 h-3.5" />
                                {uploading ? '...' : 'CAMBIAR'}
                                <input type="file" accept="image/*" onChange={handleImageFile} className="hidden" disabled={uploading} />
                            </label>
                            {editValues.imageUrl !== product.imageUrl && (
                                <div className="w-10 h-10 border border-fg flex items-center justify-center bg-fg text-bg">
                                    <Check className="w-4 h-4" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button onClick={() => handleUpdate(product.id)} className="flex-1 h-10 text-[9px] font-black" disabled={saving || uploading}>
                        {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : 'GUARDAR'}
                      </Button>
                      <Button onClick={() => { setEditingId(null); setEditValues({}); resetUpload(); }} variant="outline" className="flex-1 h-10 text-[9px] font-black">
                        CANCELAR
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <h4 className="font-black text-fg text-sm uppercase truncate mb-1 tracking-tighter">{product.name}</h4>
                      <p className="text-muted-fg font-black text-lg tracking-tighter">{formatPrice(product.price)}</p>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={() => startEdit(product)}
                        variant="outline"
                        className="flex-1 h-11 text-[9px] font-black tracking-widest"
                      >
                        EDITAR
                      </Button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="px-4 h-11 border border-border text-muted-fg hover:text-red-500 hover:border-red-500 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
          
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-40 text-center border border-dashed border-border bg-muted/10">
               <Package className="w-16 h-16 text-muted-fg/20 mx-auto mb-6" />
               <p className="text-muted-fg font-black text-xs uppercase tracking-[0.4em]">Sin Resultados en Inventario</p>
               <Button variant="link" onClick={() => { setAdminSearch(''); setAdminCategory(null); }} className="mt-4 text-fg uppercase text-[9px] tracking-widest">Limpiar Filtros</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

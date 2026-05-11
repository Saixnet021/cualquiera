
'use client';

import { useState, useEffect } from 'react';
import { CategoryRepository, Category } from '@/src/infrastructure/firebase/category.repository';
import { Plus, Trash2, Tag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

const categoryRepo = new CategoryRepository();

export default function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryRepo.getAll();
      setCategories(data);
    } catch (error) {
      toast.error('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      setIsAdding(true);
      await categoryRepo.add(newName.trim());
      setNewName('');
      toast.success('Categoría añadida');
      loadCategories();
    } catch (error) {
      toast.error('Error al añadir categoría');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar esta categoría?')) return;

    try {
      await categoryRepo.delete(id);
      toast.success('Categoría eliminada');
      setCategories(categories.filter(c => c.id !== id));
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Tag className="w-6 h-6 text-fg" />
        <h2 className="text-2xl font-black text-fg uppercase tracking-tighter">Categorías</h2>
      </div>

      <form onSubmit={handleAdd} className="flex gap-3 mb-10 max-w-md">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="NUEVA CATEGORÍA..."
          className="flex-1 bg-input-bg border border-input-border px-4 h-11 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-fg"
          required
        />
        <Button disabled={isAdding} className="h-11 px-6 bg-fg text-bg hover:opacity-80 font-black uppercase text-[10px] tracking-widest">
          {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Añadir'}
        </Button>
      </form>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group flex items-center justify-between p-4 border border-border bg-bg hover:border-fg transition-all"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-fg">
                {category.name}
              </span>
              <button
                onClick={() => handleDelete(category.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-muted-fg hover:text-red-500 transition-all"
                aria-label="Eliminar categoría"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {categories.length === 0 && (
            <div className="col-span-full py-10 border border-dashed border-border flex flex-col items-center justify-center text-muted-fg uppercase font-black text-[10px] tracking-widest">
              <Tag className="w-8 h-8 mb-3 opacity-20" />
              No hay categorías registradas
            </div>
          )}
        </div>
      )}
    </div>
  );
}

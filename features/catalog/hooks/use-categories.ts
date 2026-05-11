
'use client';

import { useState, useEffect } from 'react';
import { CategoryRepository, Category } from '@/src/infrastructure/firebase/category.repository';

const categoryRepo = new CategoryRepository();

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await categoryRepo.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { categories, loading };
}

/**
 * useImageUpload — Shared Hook
 * 
 * Hook para subir imágenes a Cloudinary via API Route.
 * Reemplaza completamente la conversión a base64.
 */
'use client';

import { useState, useCallback } from 'react';

interface UploadState {
  url: string | null;
  uploading: boolean;
  error: string | null;
  progress: number;
}

export function useImageUpload() {
  const [state, setState] = useState<UploadState>({
    url: null,
    uploading: false,
    error: null,
    progress: 0,
  });

  const upload = useCallback(async (file: File): Promise<string | null> => {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!ALLOWED_TYPES.includes(file.type)) {
      setState(prev => ({ ...prev, error: 'Tipo de archivo no permitido (JPEG, PNG, WebP, GIF)' }));
      return null;
    }

    if (file.size > MAX_SIZE) {
      setState(prev => ({ ...prev, error: 'El archivo supera el límite de 5MB' }));
      return null;
    }

    setState({ url: null, uploading: true, error: null, progress: 0 });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al subir la imagen');
      }

      const data = await response.json();
      setState({ url: data.url, uploading: false, error: null, progress: 100 });
      return data.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setState({ url: null, uploading: false, error: message, progress: 0 });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ url: null, uploading: false, error: null, progress: 0 });
  }, []);

  return { ...state, upload, reset };
}

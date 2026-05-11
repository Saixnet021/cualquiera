/**
 * useAsync — Shared Hook
 * 
 * Hook genérico para manejar operaciones async con estados
 * de loading, error y data centralizados.
 */
'use client';

import { useState, useCallback } from 'react';
import { AppError } from '../errors/app-error';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

type AsyncFn<T, Args extends unknown[]> = (...args: Args) => Promise<T>;

export function useAsync<T, Args extends unknown[] = []>(
  asyncFn: AsyncFn<T, Args>
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      setState({ data: null, loading: true, error: null });
      try {
        const result = await asyncFn(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (err) {
        const appError = AppError.fromUnknown(err);
        setState({ data: null, loading: false, error: appError.message });
        return null;
      }
    },
    [asyncFn]
  );

  return { ...state, execute };
}

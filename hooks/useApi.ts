'use client';

/**
 * useApi — lightweight fetch wrapper with auth header injection.
 * Handles loading and error states automatically.
 */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useApi<T>(
  path: string | null,
  options?: { immediate?: boolean }
): UseApiState<T> {
  const { token } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!!path);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  const refetch = useCallback(() => setTrigger((t) => t + 1), []);

  useEffect(() => {
    if (!path || !token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(path, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Request failed');
        setData(json.data);
      })
      .catch((err: Error) => {
        setError(err.message);
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [path, token, trigger]);

  return { data, loading, error, refetch };
}

/**
 * useApiMutation — for POST/PATCH/DELETE requests with auth
 */
export function useApiMutation<TBody = unknown, TResponse = unknown>() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (
      path: string,
      method: 'POST' | 'PATCH' | 'DELETE',
      body?: TBody
    ): Promise<TResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(path, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: body ? JSON.stringify(body) : undefined,
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Request failed');
        return json.data as TResponse;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { mutate, loading, error };
}

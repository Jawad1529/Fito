'use client';

import { useCallback, useSyncExternalStore } from 'react';

const listeners = new Map();

const getKeyListeners = (key) => {
  if (!listeners.has(key)) listeners.set(key, new Set());
  return listeners.get(key);
};

const notify = (key) => {
  getKeyListeners(key).forEach((listener) => listener());
};

const getServerSnapshot = () => null;

export default function useLocalStorageState(key, defaultValue) {
  const subscribe = useCallback(
    (callback) => {
      const keyListeners = getKeyListeners(key);
      keyListeners.add(callback);

      const onStorage = (event) => {
        if (event.key === key) callback();
      };
      window.addEventListener('storage', onStorage);

      return () => {
        keyListeners.delete(callback);
        window.removeEventListener('storage', onStorage);
      };
    },
    [key]
  );

  const getSnapshot = useCallback(() => localStorage.getItem(key), [key]);

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = raw ? JSON.parse(raw) : defaultValue;

  const setValue = useCallback(
    (next) => {
      localStorage.setItem(key, JSON.stringify(next));
      notify(key);
    },
    [key]
  );

  return [value, setValue];
}

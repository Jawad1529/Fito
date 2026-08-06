'use client';

import { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorageState from '../hooks/useLocalStorageState';

const TestingModeContext = createContext(null);

export function TestingModeProvider({ children }) {
  // Defaults to true (ON) so the app behaves exactly as it does today
  // (mock/localStorage-only, no network calls) until someone opts out.
  const [testingMode, setStoredTestingMode] = useLocalStorageState('Fitoo_testingMode', true);

  const setTestingMode = useCallback(
    (value) => {
      setStoredTestingMode(value);
    },
    [setStoredTestingMode]
  );

  const value = useMemo(() => ({ testingMode, setTestingMode }), [testingMode, setTestingMode]);

  return <TestingModeContext.Provider value={value}>{children}</TestingModeContext.Provider>;
}

export function useTestingModeContext() {
  const ctx = useContext(TestingModeContext);
  if (!ctx) {
    throw new Error('useTestingModeContext must be used within a TestingModeProvider');
  }
  return ctx;
}

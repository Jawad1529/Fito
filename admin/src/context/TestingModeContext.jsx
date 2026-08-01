import { createContext, useContext, useMemo, useState } from 'react';

const TestingModeContext = createContext(null);

const STORAGE_KEY = 'Fito_admin_testingMode';

// Testing mode defaults to ON so the admin panel behaves exactly as it does
// today (mock data, no network calls) until someone opts into the real API.
const loadStoredValue = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === null ? true : raw === 'true';
};

export function TestingModeProvider({ children }) {
    const [testingMode, setTestingModeState] = useState(loadStoredValue);

    const setTestingMode = (value) => {
        localStorage.setItem(STORAGE_KEY, String(value));
        setTestingModeState(value);
    };

    const value = useMemo(() => ({ testingMode, setTestingMode }), [testingMode]);

    return <TestingModeContext.Provider value={value}>{children}</TestingModeContext.Provider>;
}

export const useTestingMode = () => {
    const ctx = useContext(TestingModeContext);
    if (!ctx) throw new Error('useTestingMode must be used within TestingModeProvider');
    return ctx;
};

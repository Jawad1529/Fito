import { useState } from 'react';
import { categories as initialCategories } from '../data/categories';

// Same sessionStorage-persisted pattern as useMockProducts, so testing-mode
// categories survive navigating away (e.g. to the product form) and back.
const STORAGE_KEY = 'Fito_admin_mock_categories';

const loadStoredCategories = () => {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : initialCategories;
    } catch {
        return initialCategories;
    }
};

export default function useMockCategories() {
    const [categories, setCategoriesState] = useState(loadStoredCategories);

    const setCategories = (updater) => {
        setCategoriesState((prev) => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    };

    return [categories, setCategories];
}

import { useState } from 'react';
import { products as initialProducts } from '../data/products';

// Mock products used to live as local state on ProductManagementPage, which
// worked while add/edit happened in a Drawer on that same page. Now that
// add/edit are separate routes, the list needs to survive navigating away and
// back, so it's persisted to sessionStorage instead (mirrors the pattern
// TestingModeContext uses for its own flag, just session- rather than
// permanently-scoped since this is only ever demo data).
const STORAGE_KEY = 'Fito_admin_mock_products';

const loadStoredProducts = () => {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : initialProducts;
    } catch {
        return initialProducts;
    }
};

export default function useMockProducts() {
    const [products, setProductsState] = useState(loadStoredProducts);

    const setProducts = (updater) => {
        setProductsState((prev) => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    };

    return [products, setProducts];
}

import { useEffect, useState } from 'react';
import { fetchCategories } from '../api/adminCategories.api';
import { useTestingMode } from '../context/TestingModeContext';
import useMockCategories from './useMockCategories';

// Read-only category list for pages that just need to populate a dropdown or
// filter (e.g. the product form/table) — CategoryManagementPage manages its
// own state directly since it also needs to create/update/delete.
export default function useCategories() {
    const { testingMode } = useTestingMode();
    const [mockCategories] = useMockCategories();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(!testingMode);

    useEffect(() => {
        if (testingMode) return undefined;
        let cancelled = false;
        setLoading(true);
        fetchCategories()
            .then((data) => {
                if (!cancelled) setCategories(data);
            })
            .catch(() => {
                if (!cancelled) setCategories([]);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [testingMode]);

    return { categories: testingMode ? mockCategories : categories, loading };
}

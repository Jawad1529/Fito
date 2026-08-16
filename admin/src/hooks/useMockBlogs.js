import { useState } from 'react';
import { blogs as initialBlogs } from '../data/blogs';

// Mirrors useMockProducts.js: now that add/edit are separate routes, the list
// needs to survive navigating away and back, so it's persisted to
// sessionStorage instead of held as local state.
const STORAGE_KEY = 'Fito_admin_mock_blogs';

const loadStoredBlogs = () => {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : initialBlogs;
    } catch {
        return initialBlogs;
    }
};

export default function useMockBlogs() {
    const [blogs, setBlogsState] = useState(loadStoredBlogs);

    const setBlogs = (updater) => {
        setBlogsState((prev) => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    };

    return [blogs, setBlogs];
}

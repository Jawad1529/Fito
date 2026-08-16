import { useEffect, useState } from 'react';
import { Button, Tag, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageHeading from '../../components/atoms/PageHeading';
import SearchBar from '../../components/molecules/SearchBar';
import RowActions from '../../components/molecules/RowActions';
import StatusTag from '../../components/atoms/StatusTag';
import DataTable from '../../components/organisms/DataTable';
import CategoryFormDrawer from '../../components/organisms/categories/CategoryFormDrawer';
import useTableQuery from '../../hooks/useTableQuery';
import useMockCategories from '../../hooks/useMockCategories';
import { useTestingMode } from '../../context/TestingModeContext';
import {
    fetchCategories,
    createCategory as createCategoryApi,
    updateCategory as updateCategoryApi,
    deleteCategory as deleteCategoryApi,
} from '../../api/adminCategories.api';

const apiError = (err, fallback) => err?.response?.data?.message || fallback;

export default function CategoryManagementPage() {
    const { testingMode } = useTestingMode();
    return <CategoryManagementPageInner key={testingMode} testingMode={testingMode} />;
}

function CategoryManagementPageInner({ testingMode }) {
    const [mockCategories, setMockCategories] = useMockCategories();
    const [apiCategories, setApiCategories] = useState([]);
    const [loading, setLoading] = useState(!testingMode);
    const [saving, setSaving] = useState(false);

    const loadCategories = () => {
        setLoading(true);
        fetchCategories()
            .then(setApiCategories)
            .catch((err) => message.error(apiError(err, 'Failed to load categories')))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (testingMode) return;
        loadCategories();
    }, [testingMode]);

    const categories = testingMode ? mockCategories : apiCategories;
    const clientQuery = useTableQuery(categories, { searchKeys: ['name', 'slug'] });

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const openCreate = () => {
        setEditingCategory(null);
        setDrawerOpen(true);
    };

    const openEdit = (category) => {
        setEditingCategory(category);
        setDrawerOpen(true);
    };

    const handleSubmit = async (values) => {
        if (testingMode) {
            if (editingCategory) {
                setMockCategories((prev) =>
                    prev.map((c) => (c.id === editingCategory.id ? { ...c, ...values } : c))
                );
                message.success('Category updated');
            } else {
                const slug = values.name
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');
                if (mockCategories.some((c) => c.slug === slug)) {
                    message.error('A category with this name already exists');
                    return;
                }
                setMockCategories((prev) => [
                    { ...values, id: Math.max(...prev.map((c) => c.id), 0) + 1, slug, productCount: 0 },
                    ...prev,
                ]);
                message.success('Category created');
            }
            setDrawerOpen(false);
            return;
        }

        setSaving(true);
        try {
            if (editingCategory) {
                await updateCategoryApi(editingCategory.id, values);
                message.success('Category updated');
            } else {
                await createCategoryApi(values);
                message.success('Category created');
            }
            loadCategories();
            setDrawerOpen(false);
        } catch (err) {
            message.error(apiError(err, 'Failed to save category'));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (category) => {
        if (testingMode) {
            if (category.productCount > 0) {
                message.error(`Cannot delete — ${category.productCount} product(s) still use this category`);
                return;
            }
            setMockCategories((prev) => prev.filter((c) => c.id !== category.id));
            message.success('Category deleted');
            return;
        }
        try {
            await deleteCategoryApi(category.id);
            loadCategories();
            message.success('Category deleted');
        } catch (err) {
            message.error(apiError(err, 'Failed to delete category'));
        }
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
        { title: 'Slug', dataIndex: 'slug', render: (slug) => <span className="font-mono text-xs">{slug}</span> },
        {
            title: 'Products',
            dataIndex: 'productCount',
            sorter: (a, b) => (a.productCount ?? 0) - (b.productCount ?? 0),
            render: (count) => <Tag>{count ?? 0}</Tag>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            filters: [
                { text: 'Active', value: 'active' },
                { text: 'Inactive', value: 'inactive' },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => <StatusTag status={status} />,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <RowActions onEdit={() => openEdit(record)} onDelete={() => handleDelete(record)} />
            ),
        },
    ];

    return (
        <div>
            <PageHeading
                title="Category Management"
                subtitle="Manage the categories products are organized and filtered by"
                actions={
                    <>
                        <SearchBar
                            value={clientQuery.searchText}
                            onChange={clientQuery.setSearchText}
                            placeholder="Search categories..."
                        />
                        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
                            Add Category
                        </Button>
                    </>
                }
            />

            <DataTable columns={columns} data={clientQuery.filteredData} loading={loading} />

            <CategoryFormDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                onSubmit={handleSubmit}
                initialValues={editingCategory}
                saving={saving}
            />
        </div>
    );
}

import { useEffect, useState } from 'react';
import { Modal, Descriptions, Image, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageHeading from '../../components/atoms/PageHeading';
import SearchBar from '../../components/molecules/SearchBar';
import RowActions from '../../components/molecules/RowActions';
import StatusTag from '../../components/atoms/StatusTag';
import RatingStars from '../../components/atoms/RatingStars';
import DataTable from '../../components/organisms/DataTable';
import ProductFormDrawer from '../../components/organisms/products/ProductFormDrawer';
import useTableQuery from '../../hooks/useTableQuery';
import { products as initialProducts } from '../../data/products';
import { PRODUCT_CATEGORIES } from '../../constants/productCategories';
import { useTestingMode } from '../../context/TestingModeContext';
import imageUrl from '../../utils/imageUrl';
import {
    fetchProducts,
    createProduct as createProductApi,
    updateProduct as updateProductApi,
    deleteProduct as deleteProductApi,
} from '../../api/adminProducts.api';

const apiError = (err, fallback) => err?.response?.data?.message || fallback;

export default function ProductManagementPage() {
    const { testingMode } = useTestingMode();
    // Remounts (resetting local state) whenever testing mode is toggled.
    return <ProductManagementPageInner key={testingMode} testingMode={testingMode} />;
}

function ProductManagementPageInner({ testingMode }) {
    const [products, setProducts] = useState(testingMode ? initialProducts : []);
    const [loading, setLoading] = useState(!testingMode);
    const [saving, setSaving] = useState(false);
    const { searchText, setSearchText, filteredData } = useTableQuery(products, {
        searchKeys: ['name', 'category'],
    });

    const [viewing, setViewing] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        if (testingMode) return undefined;
        let cancelled = false;
        fetchProducts()
            .then((data) => {
                if (!cancelled) setProducts(data);
            })
            .catch(() => {
                if (!cancelled) message.error('Failed to load products');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [testingMode]);

    const openCreate = () => {
        setEditingProduct(null);
        setDrawerOpen(true);
    };

    const openEdit = (product) => {
        setEditingProduct(product);
        setDrawerOpen(true);
    };

    const handleSubmit = async (values) => {
        if (testingMode) {
            if (editingProduct) {
                setProducts((prev) =>
                    prev.map((p) => (p.id === editingProduct.id ? { ...p, ...values } : p))
                );
                message.success('Product updated');
            } else {
                setProducts((prev) => [
                    { ...values, id: Math.max(...prev.map((p) => p.id), 0) + 1, rating: 0, reviews: 0 },
                    ...prev,
                ]);
                message.success('Product created');
            }
            setDrawerOpen(false);
            return;
        }

        setSaving(true);
        try {
            if (editingProduct) {
                const updated = await updateProductApi(editingProduct.id, values);
                setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
                message.success('Product updated');
            } else {
                const created = await createProductApi(values);
                setProducts((prev) => [created, ...prev]);
                message.success('Product created');
            }
            setDrawerOpen(false);
        } catch (err) {
            message.error(apiError(err, 'Failed to save product'));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (testingMode) {
            setProducts((prev) => prev.filter((p) => p.id !== id));
            message.success('Product deleted');
            return;
        }
        try {
            await deleteProductApi(id);
            setProducts((prev) => prev.filter((p) => p.id !== id));
            message.success('Product deleted');
        } catch (err) {
            message.error(apiError(err, 'Failed to delete product'));
        }
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            render: (image) => (
                <Image src={imageUrl(image)} width={48} height={48} className="rounded-lg object-cover" fallback="" />
            ),
        },
        { title: 'Name', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
        {
            title: 'Category',
            dataIndex: 'category',
            filters: PRODUCT_CATEGORIES.map((c) => ({ text: c, value: c })),
            onFilter: (value, record) => record.category === value,
        },
        { title: 'Price', dataIndex: 'price', sorter: (a, b) => a.price - b.price, render: (p) => `Rs. ${p.toFixed(2)}` },
        { title: 'Stock', dataIndex: 'stock', sorter: (a, b) => a.stock - b.stock },
        { title: 'Rating', dataIndex: 'rating', render: (r) => <RatingStars rating={r ?? 0} /> },
        {
            title: 'Status',
            dataIndex: 'status',
            filters: [
                { text: 'Published', value: 'published' },
                { text: 'Draft', value: 'draft' },
                { text: 'Out of Stock', value: 'out_of_stock' },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => <StatusTag status={status} />,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <RowActions
                    onView={() => setViewing(record)}
                    onEdit={() => openEdit(record)}
                    onDelete={() => handleDelete(record.id)}
                />
            ),
        },
    ];

    return (
        <div>
            <PageHeading
                title="Product Management"
                subtitle="Manage your store's products"
                actions={
                    <>
                        <SearchBar value={searchText} onChange={setSearchText} placeholder="Search products..." />
                        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
                            Add Product
                        </Button>
                    </>
                }
            />

            <DataTable columns={columns} data={filteredData} loading={loading} />

            <Modal open={!!viewing} title="Product Details" onCancel={() => setViewing(null)} footer={null}>
                {viewing && (
                    <div>
                        <Image
                            src={imageUrl(viewing.image)}
                            width="100%"
                            height={180}
                            className="rounded-lg object-cover mb-4"
                            fallback=""
                        />
                        <Descriptions column={1} bordered size="small">
                            <Descriptions.Item label="Name">{viewing.name}</Descriptions.Item>
                            <Descriptions.Item label="Category">{viewing.category}</Descriptions.Item>
                            <Descriptions.Item label="Price">{`Rs. ${viewing.price.toFixed(2)}`}</Descriptions.Item>
                            <Descriptions.Item label="Stock">{viewing.stock}</Descriptions.Item>
                            <Descriptions.Item label="Rating">
                                <RatingStars rating={viewing.rating ?? 0} /> ({viewing.reviews ?? 0} reviews)
                            </Descriptions.Item>
                            <Descriptions.Item label="Status"><StatusTag status={viewing.status} /></Descriptions.Item>
                            <Descriptions.Item label="Description">{viewing.description}</Descriptions.Item>
                        </Descriptions>
                    </div>
                )}
            </Modal>

            <ProductFormDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                onSubmit={handleSubmit}
                initialValues={editingProduct}
                uploadMode={!testingMode}
                saving={saving}
            />
        </div>
    );
}

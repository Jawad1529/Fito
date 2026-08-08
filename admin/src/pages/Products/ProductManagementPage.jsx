import { useState } from 'react';
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
import useServerTableQuery from '../../hooks/useServerTableQuery';
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
    const [mockProducts, setMockProducts] = useState(initialProducts);
    const clientQuery = useTableQuery(mockProducts, { searchKeys: ['name', 'category'] });
    const serverQuery = useServerTableQuery(fetchProducts, { enabled: !testingMode });

    const products = testingMode ? clientQuery.filteredData : serverQuery.items;
    const searchText = testingMode ? clientQuery.searchText : serverQuery.searchInput;
    const setSearchText = testingMode ? clientQuery.setSearchText : serverQuery.setSearchInput;
    const loading = !testingMode && serverQuery.loading;
    const [saving, setSaving] = useState(false);

    const [viewing, setViewing] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

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
                setMockProducts((prev) =>
                    prev.map((p) => (p.id === editingProduct.id ? { ...p, ...values } : p))
                );
                message.success('Product updated');
            } else {
                setMockProducts((prev) => [
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
                await updateProductApi(editingProduct.id, values);
                message.success('Product updated');
            } else {
                await createProductApi(values);
                message.success('Product created');
            }
            serverQuery.refetch();
            setDrawerOpen(false);
        } catch (err) {
            message.error(apiError(err, 'Failed to save product'));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (testingMode) {
            setMockProducts((prev) => prev.filter((p) => p.id !== id));
            message.success('Product deleted');
            return;
        }
        try {
            await deleteProductApi(id);
            serverQuery.refetch();
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
        { title: 'Name', dataIndex: 'name', sorter: testingMode ? (a, b) => a.name.localeCompare(b.name) : undefined },
        {
            title: 'Category',
            dataIndex: 'category',
            filters: PRODUCT_CATEGORIES.map((c) => ({ text: c, value: c })),
            filteredValue: testingMode ? undefined : [serverQuery.filters.category].filter(Boolean),
            onFilter: testingMode ? (value, record) => record.category === value : undefined,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: testingMode ? (a, b) => a.price - b.price : undefined,
            render: (p) => `Rs. ${p.toFixed(2)}`,
        },
        { title: 'Stock', dataIndex: 'stock', sorter: testingMode ? (a, b) => a.stock - b.stock : undefined },
        { title: 'Rating', dataIndex: 'rating', render: (r) => <RatingStars rating={r ?? 0} /> },
        {
            title: 'Status',
            dataIndex: 'status',
            filters: [
                { text: 'Published', value: 'published' },
                { text: 'Draft', value: 'draft' },
                { text: 'Out of Stock', value: 'out_of_stock' },
            ],
            filteredValue: testingMode ? undefined : [serverQuery.filters.status].filter(Boolean),
            onFilter: testingMode ? (value, record) => record.status === value : undefined,
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

            <DataTable
                columns={columns}
                data={products}
                loading={loading}
                pagination={testingMode ? undefined : { ...serverQuery.pagination, total: serverQuery.total }}
                onChange={testingMode ? undefined : serverQuery.handleTableChange}
            />

            <Modal
                open={!!viewing}
                title="Product Details"
                onCancel={() => setViewing(null)}
                footer={null}
                centered
                styles={{ body: { maxHeight: '70vh', overflowY: 'auto', paddingRight: 8 } }}
            >
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

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Descriptions, Image, Button, Tag, Table, message } from 'antd';
import Modal from '../../components/atoms/AppModal';
import { PlusOutlined } from '@ant-design/icons';
import PageHeading from '../../components/atoms/PageHeading';
import SearchBar from '../../components/molecules/SearchBar';
import RowActions from '../../components/molecules/RowActions';
import StatusTag from '../../components/atoms/StatusTag';
import RatingStars from '../../components/atoms/RatingStars';
import DataTable from '../../components/organisms/DataTable';
import useTableQuery from '../../hooks/useTableQuery';
import useServerTableQuery from '../../hooks/useServerTableQuery';
import useMockProducts from '../../hooks/useMockProducts';
import useCategories from '../../hooks/useCategories';
import { ROUTES, productEditPath } from '../../constants/routes';
import { useTestingMode } from '../../context/TestingModeContext';
import imageUrl from '../../utils/imageUrl';
import { fetchProducts, deleteProduct as deleteProductApi } from '../../api/adminProducts.api';

const apiError = (err, fallback) => err?.response?.data?.message || fallback;

// The real API already includes `discountedPrice`; mock/testing-mode products
// don't, so it's derived here from price + discountPercent when missing.
const finalPrice = (product) =>
    product.discountedPrice ??
    (product.discountPercent > 0
        ? Math.round(product.price * (1 - product.discountPercent / 100) * 100) / 100
        : product.price);

export default function ProductManagementPage() {
    const { testingMode } = useTestingMode();
    // Remounts (resetting local state) whenever testing mode is toggled.
    return <ProductManagementPageInner key={testingMode} testingMode={testingMode} />;
}

function ProductManagementPageInner({ testingMode }) {
    const navigate = useNavigate();
    const [mockProducts, setMockProducts] = useMockProducts();
    const clientQuery = useTableQuery(mockProducts, { searchKeys: ['name', 'category'] });
    const serverQuery = useServerTableQuery(fetchProducts, { enabled: !testingMode });
    const { categories } = useCategories();
    const categoryName = (slug) => categories.find((c) => c.slug === slug)?.name ?? slug;

    const products = testingMode ? clientQuery.filteredData : serverQuery.items;
    const searchText = testingMode ? clientQuery.searchText : serverQuery.searchInput;
    const setSearchText = testingMode ? clientQuery.setSearchText : serverQuery.setSearchInput;
    const loading = !testingMode && serverQuery.loading;

    // Set when arriving from the dashboard's "Best Selling"/"Out of Stock"
    // lists — highlights and scrolls to the product that was clicked.
    const location = useLocation();
    const highlightProductId = location.state?.highlightProductId;

    useEffect(() => {
        if (!highlightProductId || loading) return;
        const row = document.querySelector(`tr[data-row-key="${highlightProductId}"]`);
        row?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, [highlightProductId, loading]);

    const [viewing, setViewing] = useState(null);

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
            filters: categories.map((c) => ({ text: c.name, value: c.slug })),
            filteredValue: testingMode ? undefined : [serverQuery.filters.category].filter(Boolean),
            onFilter: testingMode ? (value, record) => record.category === value : undefined,
            render: (category) => categoryName(category),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: testingMode ? (a, b) => a.price - b.price : undefined,
            render: (p, record) =>
                record.discountPercent > 0 ? (
                    <span className="text-gray-400 line-through">{`Rs. ${p.toFixed(2)}`}</span>
                ) : (
                    `Rs. ${p.toFixed(2)}`
                ),
        },
        {
            title: 'Discount',
            dataIndex: 'discountPercent',
            render: (discountPercent) =>
                discountPercent > 0 ? <Tag color="green">{discountPercent}% off</Tag> : <Tag>None</Tag>,
        },
        {
            title: 'Final Price',
            key: 'finalPrice',
            render: (_, record) => <span className="font-semibold">{`Rs. ${finalPrice(record).toFixed(2)}`}</span>,
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
                    onEdit={() => navigate(productEditPath(record.id))}
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
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(ROUTES.PRODUCT_ADD)}>
                            Add Product
                        </Button>
                    </>
                }
            />

            <DataTable
                columns={columns}
                data={products}
                loading={loading}
                rowClassName={(record) => (record.id === highlightProductId ? 'row-highlight' : '')}
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
                            <Descriptions.Item label="Category">{categoryName(viewing.category)}</Descriptions.Item>
                            <Descriptions.Item label="Price">
                                {viewing.discountPercent > 0 ? (
                                    <>
                                        <span className="text-gray-400 line-through mr-2">{`Rs. ${viewing.price.toFixed(2)}`}</span>
                                        <span className="font-semibold">{`Rs. ${finalPrice(viewing).toFixed(2)}`}</span>
                                        <Tag color="green" className="ml-2">{viewing.discountPercent}% off</Tag>
                                    </>
                                ) : (
                                    `Rs. ${viewing.price.toFixed(2)}`
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Stock">{viewing.stock}</Descriptions.Item>
                            <Descriptions.Item label="Rating">
                                <RatingStars rating={viewing.rating ?? 0} /> ({viewing.reviews ?? 0} reviews)
                            </Descriptions.Item>
                            <Descriptions.Item label="Status"><StatusTag status={viewing.status} /></Descriptions.Item>
                            <Descriptions.Item label="Description">{viewing.description}</Descriptions.Item>
                        </Descriptions>
                        {viewing.nutritionFacts?.length > 0 && (
                            <div className="mt-4">
                                <div className="text-sm text-gray-500 mb-2">Nutrition Facts</div>
                                <Table
                                    size="small"
                                    pagination={false}
                                    showHeader={false}
                                    rowKey="key"
                                    dataSource={viewing.nutritionFacts}
                                    columns={[
                                        { dataIndex: 'key', className: 'font-medium' },
                                        { dataIndex: 'value' },
                                    ]}
                                />
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}

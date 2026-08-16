import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Modal, Descriptions, Select, Table, message } from 'antd';
import PageHeading from '../../components/atoms/PageHeading';
import SearchBar from '../../components/molecules/SearchBar';
import RowActions from '../../components/molecules/RowActions';
import StatusTag from '../../components/atoms/StatusTag';
import DataTable from '../../components/organisms/DataTable';
import useTableQuery from '../../hooks/useTableQuery';
import useServerTableQuery from '../../hooks/useServerTableQuery';
import { orders as initialOrders, ORDER_STATUSES, PAYMENT_METHODS } from '../../data/orders';
import { useTestingMode } from '../../context/TestingModeContext';
import { fetchOrders, updateOrderStatus as updateOrderStatusApi } from '../../api/adminOrders.api';

const paymentLabel = (value) => PAYMENT_METHODS.find((p) => p.value === value)?.label ?? value;
const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

export default function OrderManagementPage() {
    const { testingMode } = useTestingMode();
    // Remounts (resetting all local state) whenever testing mode is toggled,
    // instead of syncing that reset through an effect.
    return <OrderManagementPageInner key={testingMode} testingMode={testingMode} />;
}

function OrderManagementPageInner({ testingMode }) {
    const [mockOrders, setMockOrders] = useState(initialOrders);
    const clientQuery = useTableQuery(mockOrders, { searchKeys: ['id', 'transactionId'] });
    const serverQuery = useServerTableQuery(fetchOrders, { enabled: !testingMode });

    const orders = testingMode ? clientQuery.filteredData : serverQuery.items;
    const searchText = testingMode ? clientQuery.searchText : serverQuery.searchInput;
    const setSearchText = testingMode ? clientQuery.setSearchText : serverQuery.setSearchInput;
    const loading = !testingMode && serverQuery.loading;

    const [viewing, setViewing] = useState(null);
    const [statusEditing, setStatusEditing] = useState(null);

    // Set when arriving from the dashboard's "Recent Orders" list — highlights
    // and scrolls to the order that was clicked.
    const location = useLocation();
    const highlightOrderId = location.state?.highlightOrderId;

    useEffect(() => {
        if (!highlightOrderId || loading) return;
        const row = document.querySelector(`tr[data-row-key="${highlightOrderId}"]`);
        row?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, [highlightOrderId, loading]);

    const handleStatusChange = async (status) => {
        if (testingMode) {
            setMockOrders((prev) =>
                prev.map((o) => (o.id === statusEditing.id ? { ...o, status } : o))
            );
            message.success('Order status updated');
            setStatusEditing(null);
            return;
        }

        try {
            await updateOrderStatusApi(statusEditing.id, status);
            serverQuery.refetch();
            message.success('Order status updated');
            setStatusEditing(null);
        } catch {
            message.error('Failed to update order status');
        }
    };

    const handleDelete = (id) => {
        setMockOrders((prev) => prev.filter((o) => o.id !== id));
        message.success('Order deleted');
    };

    const columns = [
        { title: 'Order #', dataIndex: 'orderNumber', render: (value) => value || '—' },
        { title: 'Customer', dataIndex: ['shipping', 'name'] },
        { title: 'City', dataIndex: ['shipping', 'city'] },
        {
            title: 'Items',
            key: 'items',
            render: (_, record) => record.items.reduce((sum, i) => sum + i.qty, 0),
        },
        {
            title: 'Total',
            dataIndex: 'total',
            sorter: testingMode ? (a, b) => a.total - b.total : undefined,
            render: (total) => `Rs. ${total.toFixed(2)}`,
        },
        {
            title: 'Payment',
            dataIndex: 'paymentMethod',
            render: (method) => paymentLabel(method),
        },
        {
            title: 'Placed At',
            dataIndex: 'placedAt',
            sorter: testingMode ? (a, b) => a.placedAt.localeCompare(b.placedAt) : undefined,
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            filters: ORDER_STATUSES.map((s) => ({ text: capitalize(s), value: s })),
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
                    onEdit={() => setStatusEditing(record)}
                    onDelete={testingMode ? () => handleDelete(record.id) : undefined}
                />
            ),
        },
    ];

    const itemColumns = [
        { title: 'Item', dataIndex: 'name' },
        { title: 'Qty', dataIndex: 'qty' },
        { title: 'Price', dataIndex: 'price', render: (price) => `Rs. ${price.toFixed(2)}` },
    ];

    return (
        <div>
            <PageHeading
                title="Order Management"
                subtitle="View customer orders and update their fulfillment status"
                actions={<SearchBar value={searchText} onChange={setSearchText} placeholder="Search orders..." />}
            />

            <DataTable
                columns={columns}
                data={orders}
                loading={loading}
                rowClassName={(record) => (record.id === highlightOrderId ? 'row-highlight' : '')}
                pagination={testingMode ? undefined : { ...serverQuery.pagination, total: serverQuery.total }}
                onChange={testingMode ? undefined : serverQuery.handleTableChange}
            />

            <Modal open={!!viewing} title="Order Details" onCancel={() => setViewing(null)} footer={null} width={560}>
                {viewing && (
                    <>
                        <Descriptions column={1} bordered size="small">
                            <Descriptions.Item label="Order #">{viewing.orderNumber || '—'}</Descriptions.Item>
                            <Descriptions.Item label="Status"><StatusTag status={viewing.status} /></Descriptions.Item>
                            <Descriptions.Item label="Placed At">{new Date(viewing.placedAt).toLocaleString()}</Descriptions.Item>
                            <Descriptions.Item label="Customer">{viewing.shipping.name}</Descriptions.Item>
                            <Descriptions.Item label="Email">{viewing.shipping.email || '—'}</Descriptions.Item>
                            <Descriptions.Item label="Phone">{viewing.shipping.phone}</Descriptions.Item>
                            <Descriptions.Item label="Address">{`${viewing.shipping.address}, ${viewing.shipping.city}`}</Descriptions.Item>
                            <Descriptions.Item label="Payment Method">{paymentLabel(viewing.paymentMethod)}</Descriptions.Item>
                            {viewing.paymentMethod === 'online' && (
                                <>
                                    <Descriptions.Item label="Transaction ID">{viewing.transactionId || '—'}</Descriptions.Item>
                                    <Descriptions.Item label="Payment Screenshot">
                                        {viewing.screenshotAttached ? 'Attached' : 'Not attached'}
                                    </Descriptions.Item>
                                </>
                            )}
                            <Descriptions.Item label="Total">{`Rs. ${viewing.total.toFixed(2)}`}</Descriptions.Item>
                        </Descriptions>

                        <Table
                            className="mt-4"
                            rowKey="name"
                            columns={itemColumns}
                            dataSource={viewing.items}
                            pagination={false}
                            size="small"
                        />
                    </>
                )}
            </Modal>

            <Modal
                open={!!statusEditing}
                title="Update Order Status"
                onCancel={() => setStatusEditing(null)}
                footer={null}
            >
                {statusEditing && (
                    <Select
                        className="w-full"
                        value={statusEditing.status}
                        onChange={handleStatusChange}
                        options={ORDER_STATUSES.map((s) => ({ value: s, label: capitalize(s) }))}
                    />
                )}
            </Modal>
        </div>
    );
}

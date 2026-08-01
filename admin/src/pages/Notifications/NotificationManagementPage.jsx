import { useState } from 'react';
import { Modal, Descriptions, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageHeading from '../../components/atoms/PageHeading';
import SearchBar from '../../components/molecules/SearchBar';
import RowActions from '../../components/molecules/RowActions';
import StatusTag from '../../components/atoms/StatusTag';
import DataTable from '../../components/organisms/DataTable';
import NotificationFormDrawer from '../../components/organisms/notifications/NotificationFormDrawer';
import useTableQuery from '../../hooks/useTableQuery';
import {
    notifications as initialNotifications,
    NOTIFICATION_TYPES,
    NOTIFICATION_AUDIENCES,
} from '../../data/notifications';

const typeLabel = (value) => NOTIFICATION_TYPES.find((t) => t.value === value)?.label ?? value;
const audienceLabel = (value) => NOTIFICATION_AUDIENCES.find((a) => a.value === value)?.label ?? value;

export default function NotificationManagementPage() {
    const [notifications, setNotifications] = useState(initialNotifications);
    const { searchText, setSearchText, filteredData } = useTableQuery(notifications, {
        searchKeys: ['title', 'message'],
    });

    const [viewing, setViewing] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingNotification, setEditingNotification] = useState(null);

    const openCreate = () => {
        setEditingNotification(null);
        setDrawerOpen(true);
    };

    const openEdit = (notification) => {
        setEditingNotification(notification);
        setDrawerOpen(true);
    };

    const handleSubmit = (values) => {
        if (editingNotification) {
            setNotifications((prev) =>
                prev.map((n) => (n.id === editingNotification.id ? { ...n, ...values } : n))
            );
            message.success('Notification updated');
        } else {
            const newNotification = {
                ...values,
                id: Math.max(...notifications.map((n) => n.id), 0) + 1,
            };
            setNotifications((prev) => [newNotification, ...prev]);
            message.success('Notification created');
        }
        setDrawerOpen(false);
    };

    const handleDelete = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        message.success('Notification deleted');
    };

    const columns = [
        { title: 'Title', dataIndex: 'title', sorter: (a, b) => a.title.localeCompare(b.title) },
        { title: 'Message', dataIndex: 'message', ellipsis: true },
        {
            title: 'Type',
            dataIndex: 'type',
            filters: NOTIFICATION_TYPES.map((t) => ({ text: t.label, value: t.value })),
            onFilter: (value, record) => record.type === value,
            render: (type) => <StatusTag status={type} />,
        },
        {
            title: 'Audience',
            dataIndex: 'audience',
            render: (audience) => audienceLabel(audience),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            filters: [
                { text: 'Sent', value: 'sent' },
                { text: 'Scheduled', value: 'scheduled' },
                { text: 'Draft', value: 'draft' },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => <StatusTag status={status} />,
        },
        { title: 'Date', dataIndex: 'date', sorter: (a, b) => a.date.localeCompare(b.date) },
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
                title="Notification Management"
                subtitle="Send and manage notifications to your users"
                actions={
                    <>
                        <SearchBar value={searchText} onChange={setSearchText} placeholder="Search notifications..." />
                        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
                            New Notification
                        </Button>
                    </>
                }
            />

            <DataTable columns={columns} data={filteredData} />

            <Modal open={!!viewing} title="Notification Details" onCancel={() => setViewing(null)} footer={null}>
                {viewing && (
                    <Descriptions column={1} bordered size="small">
                        <Descriptions.Item label="Title">{viewing.title}</Descriptions.Item>
                        <Descriptions.Item label="Message">{viewing.message}</Descriptions.Item>
                        <Descriptions.Item label="Type">{typeLabel(viewing.type)}</Descriptions.Item>
                        <Descriptions.Item label="Audience">{audienceLabel(viewing.audience)}</Descriptions.Item>
                        <Descriptions.Item label="Status"><StatusTag status={viewing.status} /></Descriptions.Item>
                        <Descriptions.Item label="Date">{viewing.date}</Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>

            <NotificationFormDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                onSubmit={handleSubmit}
                initialValues={editingNotification}
            />
        </div>
    );
}

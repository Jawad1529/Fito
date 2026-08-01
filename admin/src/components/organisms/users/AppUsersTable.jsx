import { useEffect, useState } from 'react';
import { Modal, Descriptions, Form, Input, Select, message } from 'antd';
import PageHeading from '../../atoms/PageHeading';
import SearchBar from '../../molecules/SearchBar';
import RowActions from '../../molecules/RowActions';
import StatusTag from '../../atoms/StatusTag';
import DataTable from '../DataTable';
import useTableQuery from '../../../hooks/useTableQuery';
import { appUsers as initialAppUsers } from '../../../data/appUsers';
import { useTestingMode } from '../../../context/TestingModeContext';
import { fetchAppUsers, updateAppUserStatus } from '../../../api/adminUsers.api';

const STATUS_OPTIONS = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Blocked', value: 'blocked' },
];

const toRow = (user) => ({ ...user, joinedDate: user.createdAt?.slice(0, 10) });

export default function AppUsersTable() {
    const { testingMode } = useTestingMode();
    // Remounts (resetting all local state) whenever testing mode is toggled,
    // instead of syncing that reset through an effect.
    return <AppUsersTableInner key={testingMode} testingMode={testingMode} />;
}

function AppUsersTableInner({ testingMode }) {
    const [users, setUsers] = useState(testingMode ? initialAppUsers : []);
    const [loading, setLoading] = useState(!testingMode);
    const { searchText, setSearchText, filteredData } = useTableQuery(users, {
        searchKeys: ['name', 'email', 'phone'],
    });

    const [viewing, setViewing] = useState(null);
    const [editing, setEditing] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        if (testingMode) return;
        let cancelled = false;
        fetchAppUsers()
            .then((data) => {
                if (!cancelled) setUsers(data.map(toRow));
            })
            .catch(() => {
                if (!cancelled) message.error('Failed to load users');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [testingMode]);

    const openEdit = (user) => {
        setEditing(user);
        form.setFieldsValue(testingMode ? user : { status: user.status });
    };

    const handleSaveEdit = async () => {
        const values = await form.validateFields();

        if (testingMode) {
            setUsers((prev) => prev.map((u) => (u.id === editing.id ? { ...u, ...values } : u)));
            message.success('User updated');
            setEditing(null);
            return;
        }

        try {
            const updated = await updateAppUserStatus(editing.id, values.status);
            setUsers((prev) => prev.map((u) => (u.id === editing.id ? toRow(updated) : u)));
            message.success('User status updated');
            setEditing(null);
        } catch {
            message.error('Failed to update user status');
        }
    };

    const handleDelete = (id) => {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        message.success('User deleted');
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
        { title: 'Email', dataIndex: 'email' },
        { title: 'Phone', dataIndex: 'phone' },
        { title: 'Joined Date', dataIndex: 'joinedDate', sorter: (a, b) => (a.joinedDate ?? '').localeCompare(b.joinedDate ?? '') },
        {
            title: 'Status',
            dataIndex: 'status',
            filters: STATUS_OPTIONS.map(({ label, value }) => ({ text: label, value })),
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
                    onDelete={testingMode ? () => handleDelete(record.id) : undefined}
                />
            ),
        },
    ];

    return (
        <div>
            <PageHeading
                title="App Users"
                actions={<SearchBar value={searchText} onChange={setSearchText} placeholder="Search users..." />}
            />
            <DataTable columns={columns} data={filteredData} loading={loading} />

            <Modal open={!!viewing} title="User Details" onCancel={() => setViewing(null)} footer={null}>
                {viewing && (
                    <Descriptions column={1} bordered size="small">
                        <Descriptions.Item label="Name">{viewing.name}</Descriptions.Item>
                        <Descriptions.Item label="Email">{viewing.email}</Descriptions.Item>
                        <Descriptions.Item label="Phone">{viewing.phone || '—'}</Descriptions.Item>
                        <Descriptions.Item label="Joined Date">{viewing.joinedDate}</Descriptions.Item>
                        <Descriptions.Item label="Status"><StatusTag status={viewing.status} /></Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>

            <Modal
                open={!!editing}
                title={testingMode ? 'Edit User' : 'Update User Status'}
                onCancel={() => setEditing(null)}
                onOk={handleSaveEdit}
                okText="Save"
            >
                <Form form={form} layout="vertical" className="mt-4">
                    {testingMode && (
                        <>
                            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </>
                    )}
                    <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                        <Select options={STATUS_OPTIONS} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

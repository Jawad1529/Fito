import { useState } from 'react';
import { Descriptions, Form, Input, Select, Tag, message } from 'antd';
import Modal from '../../atoms/AppModal';
import PageHeading from '../../atoms/PageHeading';
import SearchBar from '../../molecules/SearchBar';
import RowActions from '../../molecules/RowActions';
import StatusTag from '../../atoms/StatusTag';
import DataTable from '../DataTable';
import useTableQuery from '../../../hooks/useTableQuery';
import useServerTableQuery from '../../../hooks/useServerTableQuery';
import { appUsers as initialAppUsers } from '../../../data/appUsers';
import { useTestingMode } from '../../../context/TestingModeContext';
import { fetchAppUsers, updateAppUserStatus } from '../../../api/adminUsers.api';

const STATUS_OPTIONS = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Blocked', value: 'blocked' },
];

const PROVIDER_OPTIONS = [
    { label: 'App', value: 'app' },
    { label: 'Google', value: 'google' },
];

const ProviderTag = ({ provider }) => (
    <Tag color={provider === 'google' ? 'blue' : 'default'} className="capitalize">
        {provider === 'google' ? 'Google' : 'App'}
    </Tag>
);

const toRow = (user) => ({ ...user, joinedDate: user.createdAt?.slice(0, 10) });

export default function AppUsersTable() {
    const { testingMode } = useTestingMode();
    // Remounts (resetting all local state) whenever testing mode is toggled,
    // instead of syncing that reset through an effect.
    return <AppUsersTableInner key={testingMode} testingMode={testingMode} />;
}

function AppUsersTableInner({ testingMode }) {
    // Testing mode: a mutable local copy of the mock data, filtered/paginated
    // client-side. Real mode: backend-driven pagination/search/filters.
    const [mockUsers, setMockUsers] = useState(initialAppUsers);
    const clientQuery = useTableQuery(mockUsers, { searchKeys: ['name', 'email', 'phone'] });
    const serverQuery = useServerTableQuery(
        (params) => fetchAppUsers(params).then((data) => ({ ...data, items: data.items.map(toRow) })),
        { enabled: !testingMode }
    );

    const users = testingMode ? clientQuery.filteredData : serverQuery.items;
    const searchText = testingMode ? clientQuery.searchText : serverQuery.searchInput;
    const setSearchText = testingMode ? clientQuery.setSearchText : serverQuery.setSearchInput;

    const [viewing, setViewing] = useState(null);
    const [editing, setEditing] = useState(null);
    const [form] = Form.useForm();

    const openEdit = (user) => {
        setEditing(user);
        form.setFieldsValue(testingMode ? user : { status: user.status });
    };

    const handleSaveEdit = async () => {
        const values = await form.validateFields();

        if (testingMode) {
            setMockUsers((prev) => prev.map((u) => (u.id === editing.id ? { ...u, ...values } : u)));
            message.success('User updated');
            setEditing(null);
            return;
        }

        try {
            await updateAppUserStatus(editing.id, values.status);
            serverQuery.refetch();
            message.success('User status updated');
            setEditing(null);
        } catch {
            message.error('Failed to update user status');
        }
    };

    const handleDelete = (id) => {
        setMockUsers((prev) => prev.filter((u) => u.id !== id));
        message.success('User deleted');
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', sorter: testingMode ? (a, b) => a.name.localeCompare(b.name) : undefined },
        { title: 'Email', dataIndex: 'email' },
        { title: 'Phone', dataIndex: 'phone' },
        {
            title: 'Joined Date',
            dataIndex: 'joinedDate',
            sorter: testingMode ? (a, b) => (a.joinedDate ?? '').localeCompare(b.joinedDate ?? '') : undefined,
        },
        {
            title: 'Login Via',
            dataIndex: 'provider',
            filters: PROVIDER_OPTIONS.map(({ label, value }) => ({ text: label, value })),
            filteredValue: testingMode ? undefined : [serverQuery.filters.provider].filter(Boolean),
            onFilter: testingMode ? (value, record) => record.provider === value : undefined,
            render: (provider) => <ProviderTag provider={provider} />,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            filters: STATUS_OPTIONS.map(({ label, value }) => ({ text: label, value })),
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
            <DataTable
                columns={columns}
                data={users}
                loading={!testingMode && serverQuery.loading}
                pagination={testingMode ? undefined : { ...serverQuery.pagination, total: serverQuery.total }}
                onChange={testingMode ? undefined : serverQuery.handleTableChange}
            />

            <Modal open={!!viewing} title="User Details" onCancel={() => setViewing(null)} footer={null}>
                {viewing && (
                    <Descriptions column={1} bordered size="small">
                        <Descriptions.Item label="Name">{viewing.name}</Descriptions.Item>
                        <Descriptions.Item label="Email">{viewing.email}</Descriptions.Item>
                        <Descriptions.Item label="Phone">{viewing.phone || '—'}</Descriptions.Item>
                        <Descriptions.Item label="Joined Date">{viewing.joinedDate}</Descriptions.Item>
                        <Descriptions.Item label="Login Via"><ProviderTag provider={viewing.provider} /></Descriptions.Item>
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

import { useState } from 'react';
import { Descriptions, Form, Input, Select, message } from 'antd';
import Modal from '../../atoms/AppModal';
import PageHeading from '../../atoms/PageHeading';
import SearchBar from '../../molecules/SearchBar';
import RowActions from '../../molecules/RowActions';
import StatusTag from '../../atoms/StatusTag';
import DataTable from '../DataTable';
import useTableQuery from '../../../hooks/useTableQuery';
import useServerTableQuery from '../../../hooks/useServerTableQuery';
import { adminUsers as initialAdminUsers } from '../../../data/adminUsers';
import { ROLE_LABELS, ROLES } from '../../../constants/roles';
import { ADMIN_STATUS, ADMIN_STATUS_LABELS } from '../../../constants/adminStatus';
import { useTestingMode } from '../../../context/TestingModeContext';
import { fetchAdmins, updateAdminStatus } from '../../../api/adminAuth.api';

const STATUS_OPTIONS = Object.values(ADMIN_STATUS).map((value) => ({
    label: ADMIN_STATUS_LABELS[value],
    value,
}));

export default function AdminUsersTable() {
    const { testingMode } = useTestingMode();
    // Remounts (resetting all local state) whenever testing mode is toggled,
    // instead of syncing that reset through an effect.
    return <AdminUsersTableInner key={testingMode} testingMode={testingMode} />;
}

function AdminUsersTableInner({ testingMode }) {
    const [mockUsers, setMockUsers] = useState(initialAdminUsers);
    const clientQuery = useTableQuery(mockUsers, { searchKeys: ['name', 'email'] });
    const serverQuery = useServerTableQuery(fetchAdmins, { enabled: !testingMode });

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
            message.success('Admin user updated');
            setEditing(null);
            return;
        }

        try {
            await updateAdminStatus(editing.id, values.status);
            serverQuery.refetch();
            message.success('Admin status updated');
            setEditing(null);
        } catch {
            message.error('Failed to update admin status');
        }
    };

    const handleDelete = (id) => {
        setMockUsers((prev) => prev.filter((u) => u.id !== id));
        message.success('Admin user deleted');
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', sorter: testingMode ? (a, b) => a.name.localeCompare(b.name) : undefined },
        { title: 'Email', dataIndex: 'email' },
        {
            title: 'Role',
            dataIndex: 'role',
            filters: Object.values(ROLES).map((r) => ({ text: ROLE_LABELS[r], value: r })),
            filteredValue: testingMode ? undefined : [serverQuery.filters.role].filter(Boolean),
            onFilter: testingMode ? (value, record) => record.role === value : undefined,
            render: (role) => ROLE_LABELS[role],
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
            title: 'Created At',
            dataIndex: 'createdAt',
            sorter: testingMode ? (a, b) => (a.createdAt ?? '').localeCompare(b.createdAt ?? '') : undefined,
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
                title="Admin Users"
                actions={<SearchBar value={searchText} onChange={setSearchText} placeholder="Search admins..." />}
            />
            <DataTable
                columns={columns}
                data={users}
                loading={!testingMode && serverQuery.loading}
                pagination={testingMode ? undefined : { ...serverQuery.pagination, total: serverQuery.total }}
                onChange={testingMode ? undefined : serverQuery.handleTableChange}
            />

            <Modal open={!!viewing} title="Admin User Details" onCancel={() => setViewing(null)} footer={null}>
                {viewing && (
                    <Descriptions column={1} bordered size="small">
                        <Descriptions.Item label="Name">{viewing.name}</Descriptions.Item>
                        <Descriptions.Item label="Email">{viewing.email}</Descriptions.Item>
                        <Descriptions.Item label="Role">{ROLE_LABELS[viewing.role]}</Descriptions.Item>
                        <Descriptions.Item label="Status"><StatusTag status={viewing.status} /></Descriptions.Item>
                        <Descriptions.Item label="Created At">{viewing.createdAt}</Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>

            <Modal
                open={!!editing}
                title={testingMode ? 'Edit Admin User' : 'Update Admin Status'}
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
                            <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                                <Select
                                    options={Object.values(ROLES).map((r) => ({ label: ROLE_LABELS[r], value: r }))}
                                />
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

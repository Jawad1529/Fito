import { useEffect, useState } from 'react';
import { Modal, Descriptions, Form, Input, Select, message } from 'antd';
import PageHeading from '../../atoms/PageHeading';
import SearchBar from '../../molecules/SearchBar';
import RowActions from '../../molecules/RowActions';
import StatusTag from '../../atoms/StatusTag';
import DataTable from '../DataTable';
import useTableQuery from '../../../hooks/useTableQuery';
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
    const [users, setUsers] = useState(testingMode ? initialAdminUsers : []);
    const [loading, setLoading] = useState(!testingMode);
    const { searchText, setSearchText, filteredData } = useTableQuery(users, {
        searchKeys: ['name', 'email'],
    });

    const [viewing, setViewing] = useState(null);
    const [editing, setEditing] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        if (testingMode) return;
        let cancelled = false;
        fetchAdmins()
            .then((data) => {
                if (!cancelled) setUsers(data);
            })
            .catch(() => {
                if (!cancelled) message.error('Failed to load admin users');
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
            message.success('Admin user updated');
            setEditing(null);
            return;
        }

        try {
            const updated = await updateAdminStatus(editing.id, values.status);
            setUsers((prev) => prev.map((u) => (u.id === editing.id ? updated : u)));
            message.success('Admin status updated');
            setEditing(null);
        } catch {
            message.error('Failed to update admin status');
        }
    };

    const handleDelete = (id) => {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        message.success('Admin user deleted');
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
        { title: 'Email', dataIndex: 'email' },
        {
            title: 'Role',
            dataIndex: 'role',
            filters: Object.values(ROLES).map((r) => ({ text: ROLE_LABELS[r], value: r })),
            onFilter: (value, record) => record.role === value,
            render: (role) => ROLE_LABELS[role],
        },
        {
            title: 'Status',
            dataIndex: 'status',
            filters: STATUS_OPTIONS.map(({ label, value }) => ({ text: label, value })),
            onFilter: (value, record) => record.status === value,
            render: (status) => <StatusTag status={status} />,
        },
        { title: 'Created At', dataIndex: 'createdAt', sorter: (a, b) => (a.createdAt ?? '').localeCompare(b.createdAt ?? '') },
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
            <DataTable columns={columns} data={filteredData} loading={loading} />

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

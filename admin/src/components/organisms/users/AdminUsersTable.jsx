import { useState } from 'react';
import { Modal, Descriptions, Form, Input, Select, message } from 'antd';
import PageHeading from '../../atoms/PageHeading';
import SearchBar from '../../molecules/SearchBar';
import RowActions from '../../molecules/RowActions';
import StatusTag from '../../atoms/StatusTag';
import DataTable from '../DataTable';
import useTableQuery from '../../../hooks/useTableQuery';
import { adminUsers as initialAdminUsers } from '../../../data/adminUsers';
import { ROLE_LABELS, ROLES } from '../../../constants/roles';

export default function AdminUsersTable() {
    const [users, setUsers] = useState(initialAdminUsers);
    const { searchText, setSearchText, filteredData } = useTableQuery(users, {
        searchKeys: ['name', 'email'],
    });

    const [viewing, setViewing] = useState(null);
    const [editing, setEditing] = useState(null);
    const [form] = Form.useForm();

    const openEdit = (user) => {
        setEditing(user);
        form.setFieldsValue(user);
    };

    const handleSaveEdit = async () => {
        const values = await form.validateFields();
        setUsers((prev) => prev.map((u) => (u.id === editing.id ? { ...u, ...values } : u)));
        message.success('Admin user updated');
        setEditing(null);
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
            filters: [{ text: 'Active', value: 'active' }, { text: 'Inactive', value: 'inactive' }],
            onFilter: (value, record) => record.status === value,
            render: (status) => <StatusTag status={status} />,
        },
        { title: 'Created At', dataIndex: 'createdAt', sorter: (a, b) => a.createdAt.localeCompare(b.createdAt) },
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
                title="Admin Users"
                actions={<SearchBar value={searchText} onChange={setSearchText} placeholder="Search admins..." />}
            />
            <DataTable columns={columns} data={filteredData} />

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
                title="Edit Admin User"
                onCancel={() => setEditing(null)}
                onOk={handleSaveEdit}
                okText="Save"
            >
                <Form form={form} layout="vertical" className="mt-4">
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
                    <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                        <Select
                            options={[
                                { label: 'Active', value: 'active' },
                                { label: 'Inactive', value: 'inactive' },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

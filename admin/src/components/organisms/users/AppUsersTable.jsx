import { useState } from 'react';
import { Modal, Descriptions, Form, Input, Select, message } from 'antd';
import PageHeading from '../../atoms/PageHeading';
import SearchBar from '../../molecules/SearchBar';
import RowActions from '../../molecules/RowActions';
import StatusTag from '../../atoms/StatusTag';
import DataTable from '../DataTable';
import useTableQuery from '../../../hooks/useTableQuery';
import { appUsers as initialAppUsers } from '../../../data/appUsers';

export default function AppUsersTable() {
    const [users, setUsers] = useState(initialAppUsers);
    const { searchText, setSearchText, filteredData } = useTableQuery(users, {
        searchKeys: ['name', 'email', 'phone'],
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
        message.success('User updated');
        setEditing(null);
    };

    const handleDelete = (id) => {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        message.success('User deleted');
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
        { title: 'Email', dataIndex: 'email' },
        { title: 'Phone', dataIndex: 'phone' },
        { title: 'Joined Date', dataIndex: 'joinedDate', sorter: (a, b) => a.joinedDate.localeCompare(b.joinedDate) },
        {
            title: 'Status',
            dataIndex: 'status',
            filters: [
                { text: 'Active', value: 'active' },
                { text: 'Inactive', value: 'inactive' },
                { text: 'Blocked', value: 'blocked' },
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
                title="App Users"
                actions={<SearchBar value={searchText} onChange={setSearchText} placeholder="Search users..." />}
            />
            <DataTable columns={columns} data={filteredData} />

            <Modal open={!!viewing} title="User Details" onCancel={() => setViewing(null)} footer={null}>
                {viewing && (
                    <Descriptions column={1} bordered size="small">
                        <Descriptions.Item label="Name">{viewing.name}</Descriptions.Item>
                        <Descriptions.Item label="Email">{viewing.email}</Descriptions.Item>
                        <Descriptions.Item label="Phone">{viewing.phone}</Descriptions.Item>
                        <Descriptions.Item label="Joined Date">{viewing.joinedDate}</Descriptions.Item>
                        <Descriptions.Item label="Status"><StatusTag status={viewing.status} /></Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>

            <Modal
                open={!!editing}
                title="Edit User"
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
                    <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                        <Select
                            options={[
                                { label: 'Active', value: 'active' },
                                { label: 'Inactive', value: 'inactive' },
                                { label: 'Blocked', value: 'blocked' },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

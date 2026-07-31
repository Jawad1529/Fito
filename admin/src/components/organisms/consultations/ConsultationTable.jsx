import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Form, Select, DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import SearchBar from '../../molecules/SearchBar';
import RowActions from '../../molecules/RowActions';
import StatusTag from '../../atoms/StatusTag';
import DataTable from '../DataTable';
import useTableQuery from '../../../hooks/useTableQuery';
import { CONSULTATION_STATUSES } from '../../../constants/consultationGoals';
import { consultationDetailPath } from '../../../constants/routes';

export default function ConsultationTable({ initialData }) {
    const [data, setData] = useState(initialData);
    const { searchText, setSearchText, filteredData } = useTableQuery(data, {
        searchKeys: ['id', 'user'],
    });

    const navigate = useNavigate();
    const [editing, setEditing] = useState(null);
    const [form] = Form.useForm();

    const openEdit = (record) => {
        setEditing(record);
        form.setFieldsValue({ status: record.status, assignedDate: dayjs(record.assignedDate) });
    };

    const handleSaveEdit = async () => {
        const values = await form.validateFields();
        setData((prev) =>
            prev.map((r) =>
                r.id === editing.id
                    ? { ...r, ...values, assignedDate: values.assignedDate.format('YYYY-MM-DD') }
                    : r
            )
        );
        message.success('Consultation updated');
        setEditing(null);
    };

    const handleDelete = (id) => {
        setData((prev) => prev.filter((r) => r.id !== id));
        message.success('Consultation deleted');
    };

    const columns = [
        { title: 'Consultation ID', dataIndex: 'id' },
        { title: 'User', dataIndex: 'user', sorter: (a, b) => a.user.localeCompare(b.user) },
        {
            title: 'Status',
            dataIndex: 'status',
            filters: CONSULTATION_STATUSES.map((s) => ({ text: s, value: s })),
            onFilter: (value, record) => record.status === value,
            render: (status) => <StatusTag status={status} />,
        },
        { title: 'Assigned Date', dataIndex: 'assignedDate', sorter: (a, b) => a.assignedDate.localeCompare(b.assignedDate) },
        { title: 'Created At', dataIndex: 'createdAt', sorter: (a, b) => a.createdAt.localeCompare(b.createdAt) },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <RowActions
                    onView={() => navigate(consultationDetailPath(record.id))}
                    onEdit={() => openEdit(record)}
                    onDelete={() => handleDelete(record.id)}
                />
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-end mb-4">
                <SearchBar value={searchText} onChange={setSearchText} placeholder="Search consultations..." />
            </div>
            <DataTable columns={columns} data={filteredData} />

            <Modal
                open={!!editing}
                title="Edit Consultation"
                onCancel={() => setEditing(null)}
                onOk={handleSaveEdit}
                okText="Save"
            >
                <Form form={form} layout="vertical" className="mt-4">
                    <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                        <Select options={CONSULTATION_STATUSES.map((s) => ({ label: s, value: s }))} />
                    </Form.Item>
                    <Form.Item name="assignedDate" label="Assigned Date" rules={[{ required: true }]}>
                        <DatePicker className="w-full" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

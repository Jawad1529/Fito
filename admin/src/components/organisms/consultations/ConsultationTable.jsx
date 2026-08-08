import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Form, Select, DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import SearchBar from '../../molecules/SearchBar';
import RowActions from '../../molecules/RowActions';
import StatusTag from '../../atoms/StatusTag';
import DataTable from '../DataTable';
import useTableQuery from '../../../hooks/useTableQuery';
import { CONSULTATION_GOALS, CONSULTATION_STATUSES } from '../../../constants/consultationGoals';
import { consultationDetailPath } from '../../../constants/routes';
import { useAuth } from '../../../context/AuthContext';
import { updateConsultation, deleteConsultation } from '../../../api/consultations.api';

export default function ConsultationTable({ initialData, testingMode = true, loading = false, showGoal = false }) {
    const { isSuperAdmin } = useAuth();
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
        const assignedDate = values.assignedDate.format('YYYY-MM-DD');

        if (testingMode) {
            setData((prev) => prev.map((r) => (r.id === editing.id ? { ...r, ...values, assignedDate } : r)));
            message.success('Consultation updated');
            setEditing(null);
            return;
        }

        try {
            const updated = await updateConsultation(editing.id, { status: values.status, assignedDate });
            setData((prev) =>
                prev.map((r) => (r.id === editing.id ? { ...updated, user: updated.personalInfo?.fullName } : r))
            );
            message.success('Consultation updated');
            setEditing(null);
        } catch {
            message.error('Failed to update consultation');
        }
    };

    const handleDelete = async (id) => {
        if (testingMode) {
            setData((prev) => prev.filter((r) => r.id !== id));
            message.success('Consultation deleted');
            return;
        }

        try {
            await deleteConsultation(id);
            setData((prev) => prev.filter((r) => r.id !== id));
            message.success('Consultation deleted');
        } catch {
            message.error('Failed to delete consultation');
        }
    };

    // Deletion is super-admin-only on the backend once wired to the real API.
    const canDelete = testingMode || isSuperAdmin;

    const columns = [
        { title: 'Consultation ID', dataIndex: 'id' },
        { title: 'User', dataIndex: 'user', sorter: (a, b) => a.user.localeCompare(b.user) },
        ...(showGoal
            ? [
                  {
                      title: 'Goal',
                      dataIndex: 'goal',
                      filters: CONSULTATION_GOALS.map((g) => ({ text: g.title, value: g.id })),
                      onFilter: (value, record) => record.goal === value,
                      render: (goal) => {
                          const goalConfig = CONSULTATION_GOALS.find((g) => g.id === goal);
                          return (
                              <span>
                                  {goalConfig?.icon} {goalConfig?.title ?? goal}
                              </span>
                          );
                      },
                  },
              ]
            : []),
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
                    onDelete={canDelete ? () => handleDelete(record.id) : undefined}
                />
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-end mb-4">
                <SearchBar value={searchText} onChange={setSearchText} placeholder="Search consultations..." />
            </div>
            <DataTable columns={columns} data={filteredData} loading={loading} />

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

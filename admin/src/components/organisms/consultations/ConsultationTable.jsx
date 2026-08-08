import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Form, Select, DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import SearchBar from '../../molecules/SearchBar';
import RowActions from '../../molecules/RowActions';
import StatusTag from '../../atoms/StatusTag';
import DataTable from '../DataTable';
import useTableQuery from '../../../hooks/useTableQuery';
import useServerTableQuery from '../../../hooks/useServerTableQuery';
import { CONSULTATION_GOALS, CONSULTATION_STATUSES } from '../../../constants/consultationGoals';
import { consultationDetailPath } from '../../../constants/routes';
import { useAuth } from '../../../context/AuthContext';
import { fetchConsultations, updateConsultation, deleteConsultation } from '../../../api/consultations.api';

const toRow = (c) => ({ ...c, user: c.personalInfo?.fullName });

// `goal` fixes this table to one goal category (used by the per-goal tabs);
// omit it for the "All" tab, where the Goal column's own filter applies instead.
export default function ConsultationTable({ initialData, testingMode = true, goal, showGoal = false }) {
    const { isSuperAdmin } = useAuth();
    const navigate = useNavigate();

    const [mockData, setMockData] = useState(initialData);
    const clientQuery = useTableQuery(mockData, { searchKeys: ['id', 'user'] });
    const serverQuery = useServerTableQuery(
        (params) =>
            fetchConsultations({ ...params, goal: goal ?? params.goal }).then((data) => ({
                ...data,
                items: data.items.map(toRow),
            })),
        { enabled: !testingMode }
    );

    const data = testingMode ? clientQuery.filteredData : serverQuery.items;
    const searchText = testingMode ? clientQuery.searchText : serverQuery.searchInput;
    const setSearchText = testingMode ? clientQuery.setSearchText : serverQuery.setSearchInput;
    const loading = !testingMode && serverQuery.loading;

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
            setMockData((prev) => prev.map((r) => (r.id === editing.id ? { ...r, ...values, assignedDate } : r)));
            message.success('Consultation updated');
            setEditing(null);
            return;
        }

        try {
            await updateConsultation(editing.id, { status: values.status, assignedDate });
            serverQuery.refetch();
            message.success('Consultation updated');
            setEditing(null);
        } catch {
            message.error('Failed to update consultation');
        }
    };

    const handleDelete = async (id) => {
        if (testingMode) {
            setMockData((prev) => prev.filter((r) => r.id !== id));
            message.success('Consultation deleted');
            return;
        }

        try {
            await deleteConsultation(id);
            serverQuery.refetch();
            message.success('Consultation deleted');
        } catch {
            message.error('Failed to delete consultation');
        }
    };

    // Deletion is super-admin-only on the backend once wired to the real API.
    const canDelete = testingMode || isSuperAdmin;

    const columns = [
        { title: 'Consultation ID', dataIndex: 'id' },
        { title: 'User', dataIndex: 'user', sorter: testingMode ? (a, b) => a.user.localeCompare(b.user) : undefined },
        ...(showGoal
            ? [
                  {
                      title: 'Goal',
                      dataIndex: 'goal',
                      filters: CONSULTATION_GOALS.map((g) => ({ text: g.title, value: g.id })),
                      filteredValue: testingMode ? undefined : [serverQuery.filters.goal].filter(Boolean),
                      onFilter: testingMode ? (value, record) => record.goal === value : undefined,
                      render: (goalId) => {
                          const goalConfig = CONSULTATION_GOALS.find((g) => g.id === goalId);
                          return (
                              <span>
                                  {goalConfig?.icon} {goalConfig?.title ?? goalId}
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
            filteredValue: testingMode ? undefined : [serverQuery.filters.status].filter(Boolean),
            onFilter: testingMode ? (value, record) => record.status === value : undefined,
            render: (status) => <StatusTag status={status} />,
        },
        {
            title: 'Assigned Date',
            dataIndex: 'assignedDate',
            sorter: testingMode ? (a, b) => a.assignedDate.localeCompare(b.assignedDate) : undefined,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            sorter: testingMode ? (a, b) => a.createdAt.localeCompare(b.createdAt) : undefined,
        },
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
            <DataTable
                columns={columns}
                data={data}
                loading={loading}
                pagination={testingMode ? undefined : { ...serverQuery.pagination, total: serverQuery.total }}
                onChange={testingMode ? undefined : serverQuery.handleTableChange}
            />

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

import { useState } from 'react';
import { Descriptions, Button, message, Typography } from 'antd';
import Modal from '../../components/atoms/AppModal';
import { PlusOutlined } from '@ant-design/icons';
import PageHeading from '../../components/atoms/PageHeading';
import SearchBar from '../../components/molecules/SearchBar';
import RowActions from '../../components/molecules/RowActions';
import StatusTag from '../../components/atoms/StatusTag';
import DataTable from '../../components/organisms/DataTable';
import CareerFormDrawer from '../../components/organisms/careers/CareerFormDrawer';
import useTableQuery from '../../hooks/useTableQuery';
import useServerTableQuery from '../../hooks/useServerTableQuery';
import { useTestingMode } from '../../context/TestingModeContext';
import { careers as initialCareers } from '../../data/careers';
import {
    fetchCareers,
    createCareer as createCareerApi,
    updateCareer as updateCareerApi,
    deleteCareer as deleteCareerApi,
} from '../../api/adminCareers.api';

const apiError = (err, fallback) => err?.response?.data?.message || fallback;

export default function CareerManagementPage() {
    const { testingMode } = useTestingMode();
    return <CareerManagementPageInner key={testingMode} testingMode={testingMode} />;
}

function CareerManagementPageInner({ testingMode }) {
    const [mockCareers, setMockCareers] = useState(initialCareers);
    const clientQuery = useTableQuery(mockCareers, { searchKeys: ['title', 'description'] });
    const serverQuery = useServerTableQuery(fetchCareers, { enabled: !testingMode });

    const careers = testingMode ? clientQuery.filteredData : serverQuery.items;
    const searchText = testingMode ? clientQuery.searchText : serverQuery.searchInput;
    const setSearchText = testingMode ? clientQuery.setSearchText : serverQuery.setSearchInput;
    const loading = !testingMode && serverQuery.loading;
    const [saving, setSaving] = useState(false);

    const [viewing, setViewing] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingCareer, setEditingCareer] = useState(null);

    const openCreate = () => {
        setEditingCareer(null);
        setDrawerOpen(true);
    };

    const openEdit = (career) => {
        setEditingCareer(career);
        setDrawerOpen(true);
    };

    const handleSubmit = async (values) => {
        if (testingMode) {
            if (editingCareer) {
                setMockCareers((prev) =>
                    prev.map((c) => (c.id === editingCareer.id ? { ...c, ...values } : c))
                );
                message.success('Job posting updated');
            } else {
                const newCareer = {
                    ...values,
                    id: Math.max(...mockCareers.map((c) => c.id), 0) + 1,
                };
                setMockCareers((prev) => [newCareer, ...prev]);
                message.success('Job posting created');
            }
            setDrawerOpen(false);
            return;
        }

        setSaving(true);
        try {
            if (editingCareer) {
                await updateCareerApi(editingCareer.id, values);
                message.success('Job posting updated');
            } else {
                await createCareerApi(values);
                message.success('Job posting created');
            }
            serverQuery.refetch();
            setDrawerOpen(false);
        } catch (err) {
            message.error(apiError(err, 'Failed to save job posting'));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (testingMode) {
            setMockCareers((prev) => prev.filter((c) => c.id !== id));
            message.success('Job posting deleted');
            return;
        }
        try {
            await deleteCareerApi(id);
            serverQuery.refetch();
            message.success('Job posting deleted');
        } catch (err) {
            message.error(apiError(err, 'Failed to delete job posting'));
        }
    };

    const columns = [
        { title: 'Title', dataIndex: 'title', sorter: testingMode ? (a, b) => a.title.localeCompare(b.title) : undefined },
        { title: 'Description', dataIndex: 'description', ellipsis: true },
        { title: 'Contact Email', dataIndex: 'email' },
        {
            title: 'Status',
            dataIndex: 'isOpen',
            filters: [
                { text: 'Open', value: true },
                { text: 'Closed', value: false },
            ],
            onFilter: testingMode ? (value, record) => record.isOpen === value : undefined,
            render: (isOpen) => <StatusTag status={isOpen ? 'open' : 'closed'} />,
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
                title="Career Management"
                subtitle="Publish and manage open job postings"
                actions={
                    <>
                        <SearchBar value={searchText} onChange={setSearchText} placeholder="Search job postings..." />
                        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
                            New Job Posting
                        </Button>
                    </>
                }
            />

            <DataTable
                columns={columns}
                data={careers}
                loading={loading}
                pagination={testingMode ? undefined : { ...serverQuery.pagination, total: serverQuery.total }}
                onChange={testingMode ? undefined : serverQuery.handleTableChange}
            />

            <Modal
                open={!!viewing}
                title="Job Posting Details"
                onCancel={() => setViewing(null)}
                footer={null}
                centered
                styles={{ body: { maxHeight: '70vh', overflowY: 'auto', paddingRight: 8 } }}
            >
                {viewing && (
                    <Descriptions column={1} bordered size="small">
                        <Descriptions.Item label="Title">{viewing.title}</Descriptions.Item>
                        <Descriptions.Item label="Description">
                            <Typography.Paragraph className="!mb-0 whitespace-pre-wrap">
                                {viewing.description}
                            </Typography.Paragraph>
                        </Descriptions.Item>
                        <Descriptions.Item label="Application Link">
                            <a href={viewing.link} target="_blank" rel="noreferrer">
                                {viewing.link}
                            </a>
                        </Descriptions.Item>
                        <Descriptions.Item label="Contact Email">{viewing.email}</Descriptions.Item>
                        <Descriptions.Item label="Status">
                            <StatusTag status={viewing.isOpen ? 'open' : 'closed'} />
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>

            <CareerFormDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                onSubmit={handleSubmit}
                initialValues={editingCareer}
                saving={saving}
            />
        </div>
    );
}

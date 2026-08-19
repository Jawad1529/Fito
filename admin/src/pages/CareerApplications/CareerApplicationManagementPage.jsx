import { useState } from 'react';
import { Descriptions, message } from 'antd';
import Modal from '../../components/atoms/AppModal';
import PageHeading from '../../components/atoms/PageHeading';
import SearchBar from '../../components/molecules/SearchBar';
import RowActions from '../../components/molecules/RowActions';
import DataTable from '../../components/organisms/DataTable';
import useTableQuery from '../../hooks/useTableQuery';
import useServerTableQuery from '../../hooks/useServerTableQuery';
import { useTestingMode } from '../../context/TestingModeContext';
import { careerApplications as initialApplications } from '../../data/careerApplications';
import {
    fetchCareerApplications,
    deleteCareerApplication as deleteCareerApplicationApi,
} from '../../api/adminCareerApplications.api';

const apiError = (err, fallback) => err?.response?.data?.message || fallback;

export default function CareerApplicationManagementPage() {
    const { testingMode } = useTestingMode();
    return <CareerApplicationManagementPageInner key={testingMode} testingMode={testingMode} />;
}

function CareerApplicationManagementPageInner({ testingMode }) {
    const [mockApplications, setMockApplications] = useState(initialApplications);
    const clientQuery = useTableQuery(mockApplications, {
        searchKeys: ['name', 'email', 'phone', 'referralName', 'referralEmail'],
    });
    const serverQuery = useServerTableQuery(fetchCareerApplications, { enabled: !testingMode });

    const applications = testingMode ? clientQuery.filteredData : serverQuery.items;
    const searchText = testingMode ? clientQuery.searchText : serverQuery.searchInput;
    const setSearchText = testingMode ? clientQuery.setSearchText : serverQuery.setSearchInput;
    const loading = !testingMode && serverQuery.loading;

    const [viewing, setViewing] = useState(null);

    const handleDelete = async (id) => {
        if (testingMode) {
            setMockApplications((prev) => prev.filter((a) => a.id !== id));
            message.success('Application removed');
            return;
        }
        try {
            await deleteCareerApplicationApi(id);
            serverQuery.refetch();
            message.success('Application removed');
        } catch (err) {
            message.error(apiError(err, 'Failed to remove application'));
        }
    };

    const columns = [
        { title: 'Applicant', dataIndex: 'name', sorter: testingMode ? (a, b) => a.name.localeCompare(b.name) : undefined },
        { title: 'Email', dataIndex: 'email' },
        { title: 'Phone', dataIndex: 'phone' },
        { title: 'Job', dataIndex: 'career', render: (career) => career?.title ?? '—' },
        {
            title: 'Referred By',
            dataIndex: 'referralName',
            render: (referralName) => referralName || '—',
        },
        {
            title: 'Applied On',
            dataIndex: 'createdAt',
            sorter: testingMode ? (a, b) => String(a.createdAt ?? '').localeCompare(String(b.createdAt ?? '')) : undefined,
            render: (date) => (date ? new Date(date).toLocaleDateString() : '—'),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <RowActions onView={() => setViewing(record)} onDelete={() => handleDelete(record.id)} />
            ),
        },
    ];

    return (
        <div>
            <PageHeading
                title="Job Applications"
                subtitle="Everyone who applied to an open role through the app"
                actions={
                    <SearchBar value={searchText} onChange={setSearchText} placeholder="Search applicants..." />
                }
            />

            <DataTable
                columns={columns}
                data={applications}
                loading={loading}
                pagination={testingMode ? undefined : { ...serverQuery.pagination, total: serverQuery.total }}
                onChange={testingMode ? undefined : serverQuery.handleTableChange}
            />

            <Modal
                open={!!viewing}
                title="Application Details"
                onCancel={() => setViewing(null)}
                footer={null}
                centered
                styles={{ body: { maxHeight: '70vh', overflowY: 'auto', paddingRight: 8 } }}
            >
                {viewing && (
                    <Descriptions column={1} bordered size="small">
                        <Descriptions.Item label="Job">{viewing.career?.title ?? '—'}</Descriptions.Item>
                        <Descriptions.Item label="Name">{viewing.name}</Descriptions.Item>
                        <Descriptions.Item label="Email">{viewing.email}</Descriptions.Item>
                        <Descriptions.Item label="Phone">{viewing.phone}</Descriptions.Item>
                        <Descriptions.Item label="Resume">
                            <a href={viewing.resumeLink} target="_blank" rel="noreferrer">
                                {viewing.resumeLink}
                            </a>
                        </Descriptions.Item>
                        <Descriptions.Item label="Referral Name">{viewing.referralName || '—'}</Descriptions.Item>
                        <Descriptions.Item label="Referral Email">{viewing.referralEmail || '—'}</Descriptions.Item>
                        <Descriptions.Item label="Referral Phone">{viewing.referralPhone || '—'}</Descriptions.Item>
                        <Descriptions.Item label="Applied On">
                            {viewing.createdAt ? new Date(viewing.createdAt).toLocaleString() : '—'}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
}

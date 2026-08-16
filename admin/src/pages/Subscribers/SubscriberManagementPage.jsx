import { useState } from 'react';
import { Button, Modal, Input, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import PageHeading from '../../components/atoms/PageHeading';
import SearchBar from '../../components/molecules/SearchBar';
import ConfirmDeleteButton from '../../components/molecules/ConfirmDeleteButton';
import DataTable from '../../components/organisms/DataTable';
import RichTextEditor from '../../components/molecules/RichTextEditor';
import useTableQuery from '../../hooks/useTableQuery';
import useServerTableQuery from '../../hooks/useServerTableQuery';
import { subscribers as initialSubscribers } from '../../data/subscribers';
import { useTestingMode } from '../../context/TestingModeContext';
import {
    fetchSubscribers,
    sendBroadcast as sendBroadcastApi,
    deleteSubscriber as deleteSubscriberApi,
} from '../../api/adminSubscribers.api';

const apiError = (err, fallback) => err?.response?.data?.message || fallback;

export default function SubscriberManagementPage() {
    const { testingMode } = useTestingMode();
    return <SubscriberManagementPageInner key={testingMode} testingMode={testingMode} />;
}

function SubscriberManagementPageInner({ testingMode }) {
    const [mockSubscribers, setMockSubscribers] = useState(initialSubscribers);
    const clientQuery = useTableQuery(mockSubscribers, { searchKeys: ['email'] });
    const serverQuery = useServerTableQuery(fetchSubscribers, { enabled: !testingMode });

    const subscribers = testingMode ? clientQuery.filteredData : serverQuery.items;
    const searchText = testingMode ? clientQuery.searchText : serverQuery.searchInput;
    const setSearchText = testingMode ? clientQuery.setSearchText : serverQuery.setSearchInput;
    const loading = !testingMode && serverQuery.loading;
    const subscriberCount = testingMode ? mockSubscribers.length : serverQuery.total;

    const [composeOpen, setComposeOpen] = useState(false);
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [sending, setSending] = useState(false);

    const closeCompose = () => {
        setComposeOpen(false);
        setSubject('');
        setBody('');
    };

    const handleSend = async () => {
        if (!subject.trim() || !body.trim()) {
            message.warning('Write a subject and message first');
            return;
        }

        if (testingMode) {
            setSending(true);
            setTimeout(() => {
                setSending(false);
                message.success(`Sent to ${mockSubscribers.length} subscriber(s)`);
                closeCompose();
            }, 800);
            return;
        }

        setSending(true);
        try {
            const { sent, failed } = await sendBroadcastApi({ subject, message: body });
            message[failed ? 'warning' : 'success'](
                failed ? `Sent to ${sent}, failed for ${failed}` : `Sent to ${sent} subscriber(s)`
            );
            closeCompose();
        } catch (err) {
            message.error(apiError(err, 'Failed to send email'));
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (id) => {
        if (testingMode) {
            setMockSubscribers((prev) => prev.filter((s) => s.id !== id));
            message.success('Subscriber removed');
            return;
        }
        try {
            await deleteSubscriberApi(id);
            serverQuery.refetch();
            message.success('Subscriber removed');
        } catch (err) {
            message.error(apiError(err, 'Failed to remove subscriber'));
        }
    };

    const columns = [
        { title: 'Email', dataIndex: 'email', sorter: testingMode ? (a, b) => a.email.localeCompare(b.email) : undefined },
        {
            title: 'Subscribed On',
            dataIndex: 'createdAt',
            sorter: testingMode ? (a, b) => String(a.createdAt ?? '').localeCompare(String(b.createdAt ?? '')) : undefined,
            render: (date) => (date ? new Date(date).toLocaleDateString() : '—'),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <ConfirmDeleteButton onConfirm={() => handleDelete(record.id)} title="Remove this subscriber?" />
            ),
        },
    ];

    return (
        <div>
            <PageHeading
                title="Newsletter Subscribers"
                subtitle="Everyone who signed up for the newsletter on the site"
                actions={
                    <>
                        <SearchBar value={searchText} onChange={setSearchText} placeholder="Search subscribers..." />
                        <Button
                            type="primary"
                            icon={<MailOutlined />}
                            disabled={!subscriberCount}
                            onClick={() => setComposeOpen(true)}
                        >
                            Send Email
                        </Button>
                    </>
                }
            />

            <DataTable
                columns={columns}
                data={subscribers}
                loading={loading}
                pagination={testingMode ? undefined : { ...serverQuery.pagination, total: serverQuery.total }}
                onChange={testingMode ? undefined : serverQuery.handleTableChange}
            />

            <Modal
                open={composeOpen}
                title={`Email ${subscriberCount} Subscriber${subscriberCount === 1 ? '' : 's'}`}
                onCancel={closeCompose}
                onOk={handleSend}
                okText="Send"
                okButtonProps={{ loading: sending }}
                width={640}
                centered
            >
                <Input
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mb-3!"
                />
                <RichTextEditor value={body} onChange={setBody} placeholder="Write your email..." />
            </Modal>
        </div>
    );
}

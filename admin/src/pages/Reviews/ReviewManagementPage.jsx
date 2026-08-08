import { useState } from 'react';
import { Modal, Input, Button, message, Tag, Empty } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import PageHeading from '../../components/atoms/PageHeading';
import SearchBar from '../../components/molecules/SearchBar';
import ConfirmDeleteButton from '../../components/molecules/ConfirmDeleteButton';
import RatingStars from '../../components/atoms/RatingStars';
import DataTable from '../../components/organisms/DataTable';
import useTableQuery from '../../hooks/useTableQuery';
import useServerTableQuery from '../../hooks/useServerTableQuery';
import { reviews as initialReviews } from '../../data/reviews';
import { useTestingMode } from '../../context/TestingModeContext';
import {
    fetchReviews,
    addReply as addReplyApi,
    updateReply as updateReplyApi,
    deleteReply as deleteReplyApi,
    deleteReview as deleteReviewApi,
} from '../../api/adminReviews.api';

const apiError = (err, fallback) => err?.response?.data?.message || fallback;

// A review can carry several replies; the table column shows the latest one
// written by the admin side.
const latestAdminReply = (review) =>
    [...(review.replies ?? [])].reverse().find((r) => r.authorType === 'admin') ?? null;

export default function ReviewManagementPage() {
    const { testingMode } = useTestingMode();
    return <ReviewManagementPageInner key={testingMode} testingMode={testingMode} />;
}

function ReviewManagementPageInner({ testingMode }) {
    const [mockReviews, setMockReviews] = useState(initialReviews);
    const clientQuery = useTableQuery(mockReviews, { searchKeys: ['name', 'productName', 'comment'] });
    const serverQuery = useServerTableQuery(fetchReviews, { enabled: !testingMode });

    const reviews = testingMode ? clientQuery.filteredData : serverQuery.items;
    const searchText = testingMode ? clientQuery.searchText : serverQuery.searchInput;
    const setSearchText = testingMode ? clientQuery.setSearchText : serverQuery.setSearchInput;
    const loading = !testingMode && serverQuery.loading;
    const [saving, setSaving] = useState(false);

    const [replying, setReplying] = useState(null);
    const [replyText, setReplyText] = useState('');

    // Keeps the modal in sync after a reply is added, edited, or removed, and
    // refreshes the table's current page in the background.
    const applyUpdated = (updated) => {
        setMockReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        setReplying(updated);
        if (!testingMode) serverQuery.refetch();
    };

    const openReply = (record) => {
        setReplying(record);
        setReplyText(testingMode ? record.adminReply || '' : '');
    };

    const handleSendReply = async () => {
        if (!replyText.trim()) {
            message.warning('Write a reply first');
            return;
        }

        if (testingMode) {
            setMockReviews((prev) =>
                prev.map((r) => (r.id === replying.id ? { ...r, adminReply: replyText } : r))
            );
            message.success('Reply saved');
            setReplying(null);
            return;
        }

        setSaving(true);
        try {
            const updated = await addReplyApi(replying.id, replyText);
            applyUpdated(updated);
            setReplyText('');
            message.success('Reply posted');
        } catch (err) {
            message.error(apiError(err, 'Failed to post reply'));
        } finally {
            setSaving(false);
        }
    };

    const handleEditReply = async (reply) => {
        const next = window.prompt('Edit reply', reply.message);
        if (next === null || !next.trim() || next === reply.message) return;
        try {
            applyUpdated(await updateReplyApi(replying.id, reply.id, next));
            message.success('Reply updated');
        } catch (err) {
            message.error(apiError(err, 'Failed to update reply'));
        }
    };

    const handleDeleteReply = async (reply) => {
        try {
            applyUpdated(await deleteReplyApi(replying.id, reply.id));
            message.success('Reply deleted');
        } catch (err) {
            message.error(apiError(err, 'Failed to delete reply'));
        }
    };

    const handleDelete = async (id) => {
        if (testingMode) {
            setMockReviews((prev) => prev.filter((r) => r.id !== id));
            message.success('Review deleted');
            return;
        }
        try {
            await deleteReviewApi(id);
            serverQuery.refetch();
            message.success('Review deleted');
        } catch (err) {
            message.error(apiError(err, 'Failed to delete review'));
        }
    };

    const columns = [
        { title: 'Product', dataIndex: 'productName', render: (name) => name || '—' },
        { title: 'User', dataIndex: 'name' },
        {
            title: 'Rating',
            dataIndex: 'rating',
            sorter: testingMode ? (a, b) => a.rating - b.rating : undefined,
            render: (r) => <RatingStars rating={r} />,
        },
        { title: 'Review', dataIndex: 'comment', ellipsis: true },
        {
            title: 'Created At',
            dataIndex: 'date',
            sorter: testingMode ? (a, b) => String(a.date ?? '').localeCompare(String(b.date ?? '')) : undefined,
        },
        {
            title: 'Admin Reply',
            key: 'adminReply',
            ellipsis: true,
            render: (_, record) => {
                const reply = testingMode ? record.adminReply : latestAdminReply(record)?.message;
                return reply || <span className="text-gray-400">No reply yet</span>;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div className="flex items-center gap-1">
                    <Button type="text" icon={<MessageOutlined />} onClick={() => openReply(record)} />
                    <ConfirmDeleteButton onConfirm={() => handleDelete(record.id)} title="Delete this review?" />
                </div>
            ),
        },
    ];

    return (
        <div>
            <PageHeading
                title="Review Management"
                subtitle="Manage product reviews and reply to customers"
                actions={<SearchBar value={searchText} onChange={setSearchText} placeholder="Search reviews..." />}
            />

            <DataTable
                columns={columns}
                data={reviews}
                loading={loading}
                pagination={testingMode ? undefined : { ...serverQuery.pagination, total: serverQuery.total }}
                onChange={testingMode ? undefined : serverQuery.handleTableChange}
            />

            <Modal
                open={!!replying}
                title="Review Thread"
                onCancel={() => setReplying(null)}
                footer={null}
                width={560}
                centered
                styles={{ body: { maxHeight: '70vh', overflowY: 'auto', paddingRight: 8 } }}
            >
                {replying && (
                    <>
                        <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-1">
                                {replying.name} on {replying.productName || 'this product'}
                            </p>
                            <RatingStars rating={replying.rating} />
                            <p className="text-sm bg-gray-50 rounded-lg p-3 mt-2">{replying.comment}</p>
                        </div>

                        {!testingMode && (
                            <div className="mb-4">
                                <div className="text-sm font-medium text-gray-700 mb-2">Replies</div>
                                {(replying.replies ?? []).length === 0 ? (
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description="No replies yet"
                                    />
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {replying.replies.map((reply) => (
                                            <div
                                                key={reply.id}
                                                className="border border-gray-100 rounded-lg p-3"
                                            >
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium">
                                                            {reply.authorName}
                                                        </span>
                                                        <Tag color={reply.authorType === 'admin' ? 'blue' : 'default'}>
                                                            {reply.authorType === 'admin' ? 'Admin' : 'Customer'}
                                                        </Tag>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {/* Only admin replies can be reworded; customer
                                                            replies are moderated by deletion. */}
                                                        {reply.authorType === 'admin' && (
                                                            <Button
                                                                type="link"
                                                                size="small"
                                                                onClick={() => handleEditReply(reply)}
                                                            >
                                                                Edit
                                                            </Button>
                                                        )}
                                                        <ConfirmDeleteButton
                                                            onConfirm={() => handleDeleteReply(reply)}
                                                            title="Delete this reply?"
                                                        />
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">{reply.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <Input.TextArea
                            rows={4}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write a reply..."
                        />
                        <div className="flex justify-end mt-3">
                            <Button type="primary" loading={saving} onClick={handleSendReply}>
                                {testingMode ? 'Save Reply' : 'Post Reply'}
                            </Button>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
}

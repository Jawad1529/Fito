import { useState } from 'react';
import { Modal, Input, Button, message } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import PageHeading from '../../components/atoms/PageHeading';
import SearchBar from '../../components/molecules/SearchBar';
import ConfirmDeleteButton from '../../components/molecules/ConfirmDeleteButton';
import RatingStars from '../../components/atoms/RatingStars';
import DataTable from '../../components/organisms/DataTable';
import useTableQuery from '../../hooks/useTableQuery';
import { reviews as initialReviews } from '../../data/reviews';

export default function ReviewManagementPage() {
    const [reviews, setReviews] = useState(initialReviews);
    const { searchText, setSearchText, filteredData } = useTableQuery(reviews, {
        searchKeys: ['name', 'productName', 'comment'],
    });

    const [replying, setReplying] = useState(null);
    const [replyText, setReplyText] = useState('');

    const openReply = (record) => {
        setReplying(record);
        setReplyText(record.adminReply || '');
    };

    const handleSaveReply = () => {
        setReviews((prev) =>
            prev.map((r) => (r.id === replying.id ? { ...r, adminReply: replyText } : r))
        );
        message.success('Reply saved');
        setReplying(null);
    };

    const handleDelete = (id) => {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        message.success('Review deleted');
    };

    const columns = [
        { title: 'Review ID', dataIndex: 'id' },
        { title: 'Product ID', dataIndex: 'productId' },
        { title: 'Product Name', dataIndex: 'productName' },
        { title: 'User', dataIndex: 'name' },
        {
            title: 'Rating',
            dataIndex: 'rating',
            sorter: (a, b) => a.rating - b.rating,
            render: (r) => <RatingStars rating={r} />,
        },
        { title: 'Review', dataIndex: 'comment', ellipsis: true },
        { title: 'Created At', dataIndex: 'date', sorter: (a, b) => a.date.localeCompare(b.date) },
        {
            title: 'Admin Reply',
            dataIndex: 'adminReply',
            ellipsis: true,
            render: (reply) => reply || <span className="text-gray-400">No reply yet</span>,
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

            <DataTable columns={columns} data={filteredData} />

            <Modal
                open={!!replying}
                title="Reply to Review"
                onCancel={() => setReplying(null)}
                onOk={handleSaveReply}
                okText="Save Reply"
            >
                {replying && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">
                            {replying.name} on {replying.productName}
                        </p>
                        <p className="text-sm bg-gray-50 rounded-lg p-3">{replying.comment}</p>
                    </div>
                )}
                <Input.TextArea
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                />
            </Modal>
        </div>
    );
}

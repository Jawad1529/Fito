import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Descriptions, Image, Button, message } from 'antd';
import Modal from '../../components/atoms/AppModal';
import { PlusOutlined } from '@ant-design/icons';
import PageHeading from '../../components/atoms/PageHeading';
import SearchBar from '../../components/molecules/SearchBar';
import RowActions from '../../components/molecules/RowActions';
import StatusTag from '../../components/atoms/StatusTag';
import DataTable from '../../components/organisms/DataTable';
import useTableQuery from '../../hooks/useTableQuery';
import useServerTableQuery from '../../hooks/useServerTableQuery';
import useMockBlogs from '../../hooks/useMockBlogs';
import { BLOG_CATEGORIES } from '../../data/blogs';
import { useTestingMode } from '../../context/TestingModeContext';
import imageUrl from '../../utils/imageUrl';
import { ROUTES, blogEditPath } from '../../constants/routes';
import { fetchBlogs, deleteBlog as deleteBlogApi } from '../../api/adminBlogs.api';

const apiError = (err, fallback) => err?.response?.data?.message || fallback;

export default function BlogManagementPage() {
    const { testingMode } = useTestingMode();
    return <BlogManagementPageInner key={testingMode} testingMode={testingMode} />;
}

function BlogManagementPageInner({ testingMode }) {
    const navigate = useNavigate();
    const [mockBlogs, setMockBlogs] = useMockBlogs();
    const clientQuery = useTableQuery(mockBlogs, { searchKeys: ['title', 'author', 'category'] });
    const serverQuery = useServerTableQuery(fetchBlogs, { enabled: !testingMode });

    const blogs = testingMode ? clientQuery.filteredData : serverQuery.items;
    const searchText = testingMode ? clientQuery.searchText : serverQuery.searchInput;
    const setSearchText = testingMode ? clientQuery.setSearchText : serverQuery.setSearchInput;
    const loading = !testingMode && serverQuery.loading;

    const [viewing, setViewing] = useState(null);

    const handleDelete = async (id) => {
        if (testingMode) {
            setMockBlogs((prev) => prev.filter((b) => b.id !== id));
            message.success('Blog deleted');
            return;
        }
        try {
            await deleteBlogApi(id);
            serverQuery.refetch();
            message.success('Blog deleted');
        } catch (err) {
            message.error(apiError(err, 'Failed to delete blog'));
        }
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            render: (image) => (
                <Image src={imageUrl(image)} width={48} height={48} className="rounded-lg object-cover" fallback="" />
            ),
        },
        { title: 'Title', dataIndex: 'title', sorter: testingMode ? (a, b) => a.title.localeCompare(b.title) : undefined },
        {
            title: 'Category',
            dataIndex: 'category',
            filters: BLOG_CATEGORIES.map((c) => ({ text: c, value: c })),
            filteredValue: testingMode ? undefined : [serverQuery.filters.category].filter(Boolean),
            onFilter: testingMode ? (value, record) => record.category === value : undefined,
        },
        { title: 'Author', dataIndex: 'author' },
        {
            title: 'Date',
            dataIndex: 'date',
            sorter: testingMode ? (a, b) => String(a.date ?? '').localeCompare(String(b.date ?? '')) : undefined,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            filters: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }],
            filteredValue: testingMode ? undefined : [serverQuery.filters.status].filter(Boolean),
            onFilter: testingMode ? (value, record) => record.status === value : undefined,
            render: (status) => <StatusTag status={status} />,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <RowActions
                    onView={() => setViewing(record)}
                    onEdit={() => navigate(blogEditPath(record.id))}
                    onDelete={() => handleDelete(record.id)}
                />
            ),
        },
    ];

    return (
        <div>
            <PageHeading
                title="Blog Management"
                subtitle="Manage articles and posts"
                actions={
                    <>
                        <SearchBar value={searchText} onChange={setSearchText} placeholder="Search blogs..." />
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(ROUTES.BLOG_ADD)}>
                            Add Blog
                        </Button>
                    </>
                }
            />

            <DataTable
                columns={columns}
                data={blogs}
                loading={loading}
                pagination={testingMode ? undefined : { ...serverQuery.pagination, total: serverQuery.total }}
                onChange={testingMode ? undefined : serverQuery.handleTableChange}
            />

            <Modal
                open={!!viewing}
                title="Blog Details"
                onCancel={() => setViewing(null)}
                footer={null}
                centered
                styles={{ body: { maxHeight: '70vh', overflowY: 'auto', paddingRight: 8 } }}
            >
                {viewing && (
                    <div>
                        <Image
                            src={imageUrl(viewing.image)}
                            width="100%"
                            height={180}
                            className="rounded-lg object-cover mb-4"
                            fallback=""
                        />
                        <Descriptions column={1} bordered size="small">
                            <Descriptions.Item label="Title">{viewing.title}</Descriptions.Item>
                            <Descriptions.Item label="Slug">{viewing.slug}</Descriptions.Item>
                            <Descriptions.Item label="Category">{viewing.category}</Descriptions.Item>
                            <Descriptions.Item label="Author">{viewing.author}</Descriptions.Item>
                            <Descriptions.Item label="Date">{viewing.date}</Descriptions.Item>
                            <Descriptions.Item label="Read Time">{viewing.readTime}</Descriptions.Item>
                            <Descriptions.Item label="Status"><StatusTag status={viewing.status} /></Descriptions.Item>
                            <Descriptions.Item label="Excerpt">{viewing.excerpt}</Descriptions.Item>
                        </Descriptions>
                    </div>
                )}
            </Modal>
        </div>
    );
}

import { useState } from 'react';
import { Modal, Descriptions, Image, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageHeading from '../../components/atoms/PageHeading';
import SearchBar from '../../components/molecules/SearchBar';
import RowActions from '../../components/molecules/RowActions';
import StatusTag from '../../components/atoms/StatusTag';
import DataTable from '../../components/organisms/DataTable';
import BlogFormDrawer from '../../components/organisms/blogs/BlogFormDrawer';
import useTableQuery from '../../hooks/useTableQuery';
import { blogs as initialBlogs, BLOG_CATEGORIES } from '../../data/blogs';

export default function BlogManagementPage() {
    const [blogs, setBlogs] = useState(initialBlogs);
    const { searchText, setSearchText, filteredData } = useTableQuery(blogs, {
        searchKeys: ['title', 'author', 'category'],
    });

    const [viewing, setViewing] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);

    const openCreate = () => {
        setEditingBlog(null);
        setDrawerOpen(true);
    };

    const openEdit = (blog) => {
        setEditingBlog(blog);
        setDrawerOpen(true);
    };

    const handleSubmit = (values) => {
        if (editingBlog) {
            setBlogs((prev) => prev.map((b) => (b.id === editingBlog.id ? { ...b, ...values } : b)));
            message.success('Blog updated');
        } else {
            const newBlog = {
                ...values,
                id: Math.max(...blogs.map((b) => b.id), 0) + 1,
                slug: values.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            };
            setBlogs((prev) => [newBlog, ...prev]);
            message.success('Blog created');
        }
        setDrawerOpen(false);
    };

    const handleDelete = (id) => {
        setBlogs((prev) => prev.filter((b) => b.id !== id));
        message.success('Blog deleted');
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            render: (image) => <Image src={image} width={48} height={48} className="rounded-lg object-cover" />,
        },
        { title: 'Title', dataIndex: 'title', sorter: (a, b) => a.title.localeCompare(b.title) },
        {
            title: 'Category',
            dataIndex: 'category',
            filters: BLOG_CATEGORIES.map((c) => ({ text: c, value: c })),
            onFilter: (value, record) => record.category === value,
        },
        { title: 'Author', dataIndex: 'author' },
        { title: 'Date', dataIndex: 'date', sorter: (a, b) => a.date.localeCompare(b.date) },
        {
            title: 'Status',
            dataIndex: 'status',
            filters: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }],
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
                title="Blog Management"
                subtitle="Manage articles and posts"
                actions={
                    <>
                        <SearchBar value={searchText} onChange={setSearchText} placeholder="Search blogs..." />
                        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
                            Add Blog
                        </Button>
                    </>
                }
            />

            <DataTable columns={columns} data={filteredData} />

            <Modal open={!!viewing} title="Blog Details" onCancel={() => setViewing(null)} footer={null}>
                {viewing && (
                    <div>
                        <Image src={viewing.image} width="100%" height={180} className="rounded-lg object-cover mb-4" />
                        <Descriptions column={1} bordered size="small">
                            <Descriptions.Item label="Title">{viewing.title}</Descriptions.Item>
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

            <BlogFormDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                onSubmit={handleSubmit}
                initialValues={editingBlog}
            />
        </div>
    );
}

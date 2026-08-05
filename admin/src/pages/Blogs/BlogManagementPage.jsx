import { useEffect, useState } from 'react';
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
import { useTestingMode } from '../../context/TestingModeContext';
import imageUrl from '../../utils/imageUrl';
import {
    fetchBlogs,
    createBlog as createBlogApi,
    updateBlog as updateBlogApi,
    deleteBlog as deleteBlogApi,
} from '../../api/adminBlogs.api';

const apiError = (err, fallback) => err?.response?.data?.message || fallback;

export default function BlogManagementPage() {
    const { testingMode } = useTestingMode();
    return <BlogManagementPageInner key={testingMode} testingMode={testingMode} />;
}

function BlogManagementPageInner({ testingMode }) {
    const [blogs, setBlogs] = useState(testingMode ? initialBlogs : []);
    const [loading, setLoading] = useState(!testingMode);
    const [saving, setSaving] = useState(false);
    const { searchText, setSearchText, filteredData } = useTableQuery(blogs, {
        searchKeys: ['title', 'author', 'category'],
    });

    const [viewing, setViewing] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);

    useEffect(() => {
        if (testingMode) return undefined;
        let cancelled = false;
        fetchBlogs()
            .then((data) => {
                if (!cancelled) setBlogs(data);
            })
            .catch(() => {
                if (!cancelled) message.error('Failed to load blogs');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [testingMode]);

    const openCreate = () => {
        setEditingBlog(null);
        setDrawerOpen(true);
    };

    const openEdit = (blog) => {
        setEditingBlog(blog);
        setDrawerOpen(true);
    };

    const handleSubmit = async (values) => {
        if (testingMode) {
            if (editingBlog) {
                setBlogs((prev) => prev.map((b) => (b.id === editingBlog.id ? { ...b, ...values } : b)));
                message.success('Blog updated');
            } else {
                setBlogs((prev) => [
                    {
                        ...values,
                        id: Math.max(...prev.map((b) => b.id), 0) + 1,
                        slug: values.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    },
                    ...prev,
                ]);
                message.success('Blog created');
            }
            setDrawerOpen(false);
            return;
        }

        setSaving(true);
        try {
            if (editingBlog) {
                const updated = await updateBlogApi(editingBlog.id, values);
                setBlogs((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
                message.success('Blog updated');
            } else {
                const created = await createBlogApi(values);
                setBlogs((prev) => [created, ...prev]);
                message.success('Blog created');
            }
            setDrawerOpen(false);
        } catch (err) {
            message.error(apiError(err, 'Failed to save blog'));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (testingMode) {
            setBlogs((prev) => prev.filter((b) => b.id !== id));
            message.success('Blog deleted');
            return;
        }
        try {
            await deleteBlogApi(id);
            setBlogs((prev) => prev.filter((b) => b.id !== id));
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
        { title: 'Title', dataIndex: 'title', sorter: (a, b) => a.title.localeCompare(b.title) },
        {
            title: 'Category',
            dataIndex: 'category',
            filters: BLOG_CATEGORIES.map((c) => ({ text: c, value: c })),
            onFilter: (value, record) => record.category === value,
        },
        { title: 'Author', dataIndex: 'author' },
        {
            title: 'Date',
            dataIndex: 'date',
            sorter: (a, b) => String(a.date ?? '').localeCompare(String(b.date ?? '')),
        },
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

            <DataTable columns={columns} data={filteredData} loading={loading} />

            <Modal open={!!viewing} title="Blog Details" onCancel={() => setViewing(null)} footer={null}>
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

            <BlogFormDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                onSubmit={handleSubmit}
                initialValues={editingBlog}
                uploadMode={!testingMode}
                saving={saving}
            />
        </div>
    );
}

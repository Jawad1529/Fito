import { Drawer, Form, Input, Select, Button, Image } from 'antd';
import { useEffect } from 'react';
import { BLOG_CATEGORIES } from '../../../data/blogs';

export default function BlogFormDrawer({ open, onClose, onSubmit, initialValues }) {
    const [form] = Form.useForm();
    const imageUrl = Form.useWatch('image', form);

    useEffect(() => {
        if (open) {
            form.resetFields();
            if (initialValues) form.setFieldsValue(initialValues);
        }
    }, [open, initialValues, form]);

    const handleFinish = (values) => {
        onSubmit({ ...initialValues, ...values });
    };

    return (
        <Drawer
            open={open}
            onClose={onClose}
            title={initialValues ? 'Edit Blog' : 'Create Blog'}
            width={460}
            destroyOnHidden
            extra={
                <Button type="primary" onClick={() => form.submit()}>
                    Save
                </Button>
            }
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                    <Input placeholder="How Much Protein Do You Need?" />
                </Form.Item>

                <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                    <Select options={BLOG_CATEGORIES.map((c) => ({ label: c, value: c }))} />
                </Form.Item>

                <Form.Item name="author" label="Author" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                    <Input placeholder="YYYY-MM-DD" />
                </Form.Item>

                <Form.Item name="readTime" label="Read Time">
                    <Input placeholder="5 min read" />
                </Form.Item>

                <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                    <Select
                        options={[
                            { label: 'Published', value: 'published' },
                            { label: 'Draft', value: 'draft' },
                        ]}
                    />
                </Form.Item>

                <Form.Item name="image" label="Image URL">
                    <Input placeholder="https://..." />
                </Form.Item>

                {imageUrl && (
                    <div className="mb-4">
                        <Image src={imageUrl} width={120} height={120} className="rounded-lg object-cover" fallback="" />
                    </div>
                )}

                <Form.Item name="excerpt" label="Excerpt" rules={[{ required: true }]}>
                    <Input.TextArea rows={4} />
                </Form.Item>
            </Form>
        </Drawer>
    );
}

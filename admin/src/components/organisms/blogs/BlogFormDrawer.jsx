import { Drawer, Form, Input, Select, Button, Image, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { BLOG_CATEGORIES } from '../../../data/blogs';
import imageUrl from '../../../utils/imageUrl';

// In upload mode (real API) the cover image is picked as a file and `content`
// is edited as paragraphs split on blank lines. Testing mode keeps the simpler
// URL field so the mock data shape still works.
export default function BlogFormDrawer({
    open,
    onClose,
    onSubmit,
    initialValues,
    uploadMode = false,
    saving = false,
}) {
    const [form] = Form.useForm();
    const urlValue = Form.useWatch('image', form);
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (!open) return;
        form.resetFields();
        setFile(null);
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                content: (initialValues.content ?? []).join('\n\n'),
            });
        }
    }, [open, initialValues, form]);

    const handleFinish = (values) => {
        if (!uploadMode) {
            onSubmit({ ...initialValues, ...values });
            return;
        }
        // The controller splits a plain-text body on blank lines, so it's
        // forwarded as-is rather than pre-parsed here.
        onSubmit({ ...values, image: file?.originFileObj });
    };

    const currentImage = initialValues?.image;

    return (
        <Drawer
            open={open}
            onClose={onClose}
            title={initialValues ? 'Edit Blog' : 'Create Blog'}
            width={460}
            rootClassName="mobile-full-drawer"
            destroyOnHidden
            extra={
                <Button type="primary" loading={saving} onClick={() => form.submit()}>
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

                {uploadMode ? (
                    <>
                        {currentImage && !file && (
                            <div className="mb-3">
                                <div className="text-sm text-gray-500 mb-2">Current Cover</div>
                                <Image
                                    src={imageUrl(currentImage)}
                                    width={120}
                                    height={90}
                                    className="rounded-lg object-cover"
                                    fallback=""
                                />
                            </div>
                        )}
                        <Form.Item label="Cover Image">
                            <Upload
                                listType="picture-card"
                                fileList={file ? [file] : []}
                                beforeUpload={() => false}
                                onChange={({ fileList }) => setFile(fileList[fileList.length - 1] ?? null)}
                                onRemove={() => setFile(null)}
                                accept="image/*"
                                maxCount={1}
                            >
                                {file ? null : (
                                    <div>
                                        <PlusOutlined />
                                        <div className="mt-1 text-xs">Upload</div>
                                    </div>
                                )}
                            </Upload>
                        </Form.Item>
                    </>
                ) : (
                    <>
                        <Form.Item name="image" label="Image URL">
                            <Input placeholder="https://..." />
                        </Form.Item>
                        {urlValue && (
                            <div className="mb-4">
                                <Image
                                    src={urlValue}
                                    width={120}
                                    height={120}
                                    className="rounded-lg object-cover"
                                    fallback=""
                                />
                            </div>
                        )}
                    </>
                )}

                <Form.Item name="excerpt" label="Excerpt" rules={[{ required: true }]}>
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item
                    name="content"
                    label="Body"
                    extra="Separate paragraphs with a blank line."
                >
                    <Input.TextArea rows={8} placeholder="First paragraph...&#10;&#10;Second paragraph..." />
                </Form.Item>
            </Form>
        </Drawer>
    );
}

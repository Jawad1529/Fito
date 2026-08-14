import { Drawer, Form, Input, InputNumber, Select, Button, Image, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { PRODUCT_CATEGORIES } from '../../../constants/productCategories';
import imageUrl from '../../../utils/imageUrl';

// `uploadMode` is on when the panel talks to the real API: images are picked as
// files and uploaded with the form. In testing mode a plain URL field is used
// instead, matching the shape of the mock data.
export default function ProductFormDrawer({
    open,
    onClose,
    onSubmit,
    initialValues,
    uploadMode = false,
    saving = false,
}) {
    const [form] = Form.useForm();
    const urlValue = Form.useWatch('image', form);

    const [files, setFiles] = useState([]);
    const [keptImages, setKeptImages] = useState([]);

    useEffect(() => {
        if (!open) return;
        form.resetFields();
        setFiles([]);
        setKeptImages(initialValues?.images ?? []);
        if (initialValues) form.setFieldsValue(initialValues);
    }, [open, initialValues, form]);

    const handleFinish = (values) => {
        if (!uploadMode) {
            onSubmit({ ...initialValues, ...values });
            return;
        }
        onSubmit({
            ...values,
            images: files.map((f) => f.originFileObj).filter(Boolean),
            // Only meaningful on edit; the controller ignores it on create.
            existingImages: initialValues ? keptImages : undefined,
        });
    };

    return (
        <Drawer
            open={open}
            onClose={onClose}
            title={initialValues ? 'Edit Product' : 'Create Product'}
            width={420}
            rootClassName="mobile-full-drawer"
            destroyOnHidden
            extra={
                <Button type="primary" loading={saving} onClick={() => form.submit()}>
                    Save
                </Button>
            }
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
                    <Input placeholder="Whey Protein Isolate" />
                </Form.Item>

                <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                    <Select options={PRODUCT_CATEGORIES.map((c) => ({ label: c, value: c }))} />
                </Form.Item>

                <Form.Item name="price" label="Price (Rs.)" rules={[{ required: true }]}>
                    <InputNumber min={0} step={0.01} className="w-full" />
                </Form.Item>

                <Form.Item
                    name="discountPercent"
                    label="Discount (%)"
                    initialValue={0}
                    tooltip="Shown as a struck-through original price on the storefront."
                >
                    <InputNumber min={0} max={100} step={1} className="w-full" />
                </Form.Item>

                <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
                    <InputNumber min={0} className="w-full" />
                </Form.Item>

                <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                    <Select
                        options={[
                            { label: 'Published', value: 'published' },
                            { label: 'Draft', value: 'draft' },
                            { label: 'Out of Stock', value: 'out_of_stock' },
                        ]}
                    />
                </Form.Item>

                {uploadMode ? (
                    <>
                        {keptImages.length > 0 && (
                            <div className="mb-4">
                                <div className="text-sm text-gray-500 mb-2">Current Images</div>
                                <div className="flex flex-wrap gap-2">
                                    {keptImages.map((src) => (
                                        <div key={src} className="relative">
                                            <Image
                                                src={imageUrl(src)}
                                                width={72}
                                                height={72}
                                                className="rounded-lg object-cover"
                                            />
                                            <Button
                                                size="small"
                                                danger
                                                type="text"
                                                className="absolute -top-2 -right-2 bg-white shadow"
                                                onClick={() =>
                                                    setKeptImages((prev) => prev.filter((s) => s !== src))
                                                }
                                            >
                                                ✕
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Form.Item label="Add Images (max 6)">
                            <Upload
                                listType="picture-card"
                                fileList={files}
                                beforeUpload={() => false}
                                onChange={({ fileList }) => setFiles(fileList.slice(0, 6))}
                                accept="image/*"
                                multiple
                            >
                                {files.length >= 6 ? null : (
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

                <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                    <Input.TextArea rows={4} />
                </Form.Item>
            </Form>
        </Drawer>
    );
}

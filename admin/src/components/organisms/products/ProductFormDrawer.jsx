import { Drawer, Form, Input, InputNumber, Select, Button, Image } from 'antd';
import { useEffect } from 'react';
import { PRODUCT_CATEGORIES } from '../../../constants/productCategories';

export default function ProductFormDrawer({ open, onClose, onSubmit, initialValues }) {
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
            title={initialValues ? 'Edit Product' : 'Create Product'}
            width={420}
            destroyOnHidden
            extra={
                <Button type="primary" onClick={() => form.submit()}>
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

                <Form.Item name="price" label="Price ($)" rules={[{ required: true }]}>
                    <InputNumber min={0} step={0.01} className="w-full" />
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

                <Form.Item name="image" label="Image URL">
                    <Input placeholder="https://..." />
                </Form.Item>

                {imageUrl && (
                    <div className="mb-4">
                        <Image src={imageUrl} width={120} height={120} className="rounded-lg object-cover" fallback="" />
                    </div>
                )}

                <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                    <Input.TextArea rows={4} />
                </Form.Item>
            </Form>
        </Drawer>
    );
}

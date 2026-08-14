import { useEffect, useState } from 'react';
import { Modal, Form, InputNumber, Button, Tag, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import PageHeading from '../../components/atoms/PageHeading';
import DataTable from '../../components/organisms/DataTable';
import { CONSULTATION_GOALS } from '../../constants/consultationGoals';
import { consultationPlans as mockConsultationPlans } from '../../data/consultationPlans';
import { useTestingMode } from '../../context/TestingModeContext';
import {
    fetchConsultationPlans,
    updateConsultationPlan as updateConsultationPlanApi,
} from '../../api/adminConsultationPlans.api';

const apiError = (err, fallback) => err?.response?.data?.message || fallback;

const goalTitle = (goalId) => CONSULTATION_GOALS.find((g) => g.id === goalId)?.title ?? goalId;

const formatRs = (value) => `Rs. ${Number(value ?? 0).toLocaleString('en-US')}`;

const withDiscountedPrice = (plan) => ({
    ...plan,
    discountedPrice:
        plan.discountedPrice ??
        (plan.discountPercent > 0
            ? Math.round(plan.price * (1 - plan.discountPercent / 100))
            : plan.price),
});

export default function ConsultationPlanManagementPage() {
    const { testingMode } = useTestingMode();
    return <ConsultationPlanManagementPageInner key={testingMode} testingMode={testingMode} />;
}

function ConsultationPlanManagementPageInner({ testingMode }) {
    const [plans, setPlans] = useState(testingMode ? mockConsultationPlans.map(withDiscountedPrice) : []);
    const [loading, setLoading] = useState(!testingMode);
    const [editingPlan, setEditingPlan] = useState(null);
    const [saving, setSaving] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (testingMode) return undefined;
        let cancelled = false;

        setLoading(true);
        fetchConsultationPlans()
            .then((data) => {
                if (!cancelled) setPlans(data);
            })
            .catch((err) => {
                if (!cancelled) message.error(apiError(err, 'Failed to load consultation plans'));
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [testingMode]);

    const openEdit = (plan) => {
        setEditingPlan(plan);
        form.setFieldsValue({ price: plan.price, discountPercent: plan.discountPercent ?? 0 });
    };

    const closeEdit = () => setEditingPlan(null);

    const handleSave = async () => {
        const values = await form.validateFields();

        if (testingMode) {
            setPlans((prev) =>
                prev.map((p) =>
                    p.goal === editingPlan.goal && p.id === editingPlan.id
                        ? withDiscountedPrice({ ...p, ...values })
                        : p
                )
            );
            message.success('Plan updated');
            closeEdit();
            return;
        }

        setSaving(true);
        try {
            const updated = await updateConsultationPlanApi(editingPlan.goal, editingPlan.id, values);
            setPlans((prev) =>
                prev.map((p) => (p.goal === updated.goal && p.id === updated.id ? updated : p))
            );
            message.success('Plan updated');
            closeEdit();
        } catch (err) {
            message.error(apiError(err, 'Failed to update plan'));
        } finally {
            setSaving(false);
        }
    };

    const columns = [
        {
            title: 'Goal',
            dataIndex: 'goal',
            render: (goal) => goalTitle(goal),
            sorter: (a, b) => goalTitle(a.goal).localeCompare(goalTitle(b.goal)),
        },
        { title: 'Plan', dataIndex: 'label' },
        {
            title: 'Price',
            dataIndex: 'price',
            render: (price, record) =>
                record.discountPercent > 0 ? (
                    <span className="text-gray-400 line-through">{formatRs(price)}</span>
                ) : (
                    formatRs(price)
                ),
        },
        {
            title: 'Discount',
            dataIndex: 'discountPercent',
            render: (discountPercent) =>
                discountPercent > 0 ? <Tag color="green">{discountPercent}% off</Tag> : <Tag>None</Tag>,
        },
        {
            title: 'Final Price',
            dataIndex: 'discountedPrice',
            render: (discountedPrice) => <span className="font-semibold">{formatRs(discountedPrice)}</span>,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(record)}>
                    Edit
                </Button>
            ),
        },
    ];

    return (
        <div>
            <PageHeading
                title="Consultation Plan Pricing"
                subtitle="Manage the price and discount for each consultation plan"
            />

            <DataTable columns={columns} data={plans} loading={loading} rowKey={(r) => `${r.goal}-${r.id}`} />

            <Modal
                open={!!editingPlan}
                title={editingPlan ? `${goalTitle(editingPlan.goal)} — ${editingPlan.label}` : ''}
                onCancel={closeEdit}
                onOk={handleSave}
                confirmLoading={saving}
                okText="Save"
                destroyOnHidden
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="price" label="Price (Rs.)" rules={[{ required: true }]}>
                        <InputNumber min={0} step={1} className="w-full" />
                    </Form.Item>
                    <Form.Item name="discountPercent" label="Discount (%)" rules={[{ required: true }]}>
                        <InputNumber min={0} max={100} step={1} className="w-full" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Typography, Tag, Divider, Row, Col, Image, Card, message, Result } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import KeyValueGrid from '../../components/molecules/KeyValueGrid';
import ConsultationConversation from '../../components/organisms/consultations/ConsultationConversation';
import { CONSULTATION_GOALS, STATUS_COLORS } from '../../constants/consultationGoals';
import { consultationsByGoal } from '../../data/consultations';
import { ROUTES } from '../../constants/routes';

const { Title, Text } = Typography;

const findConsultation = (id) => {
    for (const list of Object.values(consultationsByGoal)) {
        const found = list.find((c) => c.id === id);
        if (found) return found;
    }
    return null;
};

function UploadGallery({ title, images }) {
    return (
        <div className="mb-4">
            <Text className="!text-gray-400 text-xs block mb-2">
                {title} ({(images || []).length})
            </Text>
            {(images || []).length > 0 ? (
                <Image.PreviewGroup>
                    <div className="flex gap-2 flex-wrap">
                        {images.map((src, idx) => (
                            <Image key={idx} src={src} width={88} height={88} className="rounded-lg object-cover" />
                        ))}
                    </div>
                </Image.PreviewGroup>
            ) : (
                <Text type="secondary">No files uploaded</Text>
            )}
        </div>
    );
}

export default function ConsultationDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [consultation, setConsultation] = useState(() => findConsultation(id));

    if (!consultation) {
        return (
            <Result
                status="404"
                title="Consultation not found"
                extra={
                    <Button type="primary" onClick={() => navigate(ROUTES.CONSULTATIONS)}>
                        Back to Consultations
                    </Button>
                }
            />
        );
    }

    const goalConfig = CONSULTATION_GOALS.find((g) => g.id === consultation.goal);
    const uploads = consultation.uploads || {};

    const handleSendMessage = (text) => {
        setConsultation((prev) => ({
            ...prev,
            conversation: [
                ...(prev.conversation || []),
                {
                    id: `dietitian-${Date.now()}`,
                    sender: 'dietitian',
                    text,
                    timestamp: new Date().toISOString(),
                },
            ],
        }));
        message.success('Reply sent to user');
    };

    return (
        <div>
            <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(ROUTES.CONSULTATIONS)}
                className="!px-0 !mb-4"
            >
                Back to Consultations
            </Button>

            <Card className="rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{goalConfig?.icon ?? '📋'}</span>
                        <div>
                            <Title level={4} className="!mb-0">
                                {goalConfig?.title ?? 'Consultation'} · {consultation.id}
                            </Title>
                            <Text type="secondary" className="text-sm">
                                Submitted{' '}
                                {consultation.submittedAt ? new Date(consultation.submittedAt).toLocaleString() : '—'}
                            </Text>
                        </div>
                    </div>
                    <Tag color={STATUS_COLORS[consultation.status] ?? 'gold'} className="capitalize !text-sm !px-3 !py-1">
                        {consultation.status?.replace('_', ' ')}
                    </Tag>
                </div>

                {consultation.plan && (
                    <>
                        <Divider className="!my-3" />
                        <Row gutter={[16, 12]}>
                            <Col xs={12} sm={8}>
                                <Text className="!text-gray-400 text-xs block mb-1">Plan</Text>
                                <Text>{consultation.plan.label}</Text>
                            </Col>
                            <Col xs={12} sm={8}>
                                <Text className="!text-gray-400 text-xs block mb-1">Duration</Text>
                                <Text>{consultation.plan.durationMonths} month(s)</Text>
                            </Col>
                            <Col xs={12} sm={8}>
                                <Text className="!text-gray-400 text-xs block mb-1">Price</Text>
                                <Text>Rs. {consultation.plan.price?.toLocaleString('en-US')}</Text>
                            </Col>
                        </Row>
                    </>
                )}

                <Divider className="!my-3" />
                <Title level={5} className="!mb-3">Personal Information</Title>
                <KeyValueGrid data={consultation.personalInfo || {}} />

                {consultation.goalData && Object.keys(consultation.goalData).length > 0 && (
                    <>
                        <Divider className="!my-3" />
                        <Title level={5} className="!mb-3">Goal Details</Title>
                        <KeyValueGrid data={consultation.goalData} />
                    </>
                )}

                <Divider className="!my-3" />
                <Title level={5} className="!mb-3">Uploads</Title>
                <UploadGallery title="Body Photos" images={uploads.bodyPhotos} />
                <UploadGallery title="Medical Reports" images={uploads.reports} />
                <UploadGallery title="Payment Screenshot" images={uploads.paymentScreenshot} />

                {consultation.transactionId && (
                    <>
                        <Divider className="!my-3" />
                        <Text className="!text-gray-400 text-xs block mb-1">Transaction ID</Text>
                        <Text>{consultation.transactionId}</Text>
                    </>
                )}
            </Card>

            <Card className="rounded-2xl border border-gray-100 shadow-sm mt-6">
                <Title level={5} className="!mb-3">Conversation with User</Title>
                <ConsultationConversation messages={consultation.conversation} onSend={handleSendMessage} />
            </Card>
        </div>
    );
}

'use client';

import {
  Card,
  Typography,
  Upload,
  Input,
  Alert,
} from 'antd';

import {
  UploadOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function PaymentStep({
  formData,
  updateField,
}) {
  const uploads = formData.uploads || {};

  const handlePaymentUpload = ({ fileList }) => {
    updateField("uploads", {
      ...uploads,
      paymentScreenshot: fileList,
    });
  };

  return (
    <div className="space-y-6">

      <div>

        <Title level={3} className="!text-white">
          Complete Your Payment
        </Title>

        <Paragraph className="!text-gray-400">
          Upload your payment proof to complete your consultation request.
        </Paragraph>

      </div>

      <Alert
        type="info"
        showIcon
        icon={<SafetyCertificateOutlined />}
        message="Your payment is secure."
      />

      <Card className="bg-white/5 border-white/10">

        <Title level={5}>
          Consultation Fee
        </Title>

        <div className="text-4xl font-bold text-yellow-400">
          Rs. 2,500
        </div>

      </Card>

      <Card className="bg-white/5 border-white/10">

        <Title level={5}>
          Payment Details
        </Title>

        <div className="space-y-3">

          <div>
            <Text>Bank Name</Text>
            <div className="text-white font-medium">
              Meezan Bank
            </div>
          </div>

          <div>
            <Text>Account Title</Text>
            <div className="text-white font-medium">
              Fito Nutrition
            </div>
          </div>

          <div>
            <Text>Account Number</Text>
            <div className="text-white font-medium">
              123456789012
            </div>
          </div>

          <div>
            <Text>IBAN</Text>
            <div className="text-white font-medium">
              PK00MEEZ000000000000000
            </div>
          </div>

        </div>

      </Card>

      <Card className="bg-white/5 border-white/10">

        <Title level={5}>
          Transaction ID (Optional)
        </Title>

        <Input
          placeholder="Enter transaction reference"
          value={formData.transactionId}
          onChange={(e)=>
            updateField(
              "transactionId",
              e.target.value
            )
          }
        />

      </Card>

      <Card className="bg-white/5 border-white/10">

        <Title level={5}>
          Upload Payment Screenshot
        </Title>

        <Upload
          beforeUpload={() => false}
          fileList={uploads.paymentScreenshot}
          onChange={handlePaymentUpload}
        >

          <button className="px-5 py-3 rounded-xl border border-white/20 hover:bg-white/10 text-white">

            <UploadOutlined />

            <span className="ml-2">
              Upload Screenshot
            </span>

          </button>

        </Upload>

      </Card>

    </div>
  );
}
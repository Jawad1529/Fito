'use client';

import { UploadOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

import Card from '../../atoms/Card';
import { H3, H5, Text } from '../../atoms/Typography';
import Alert from '../../atoms/Alert';
import Input from '../../atoms/Input';
import Upload from '../../atoms/Upload';

export default function PaymentStep({
  formData,
  updateField,
}) {
  const uploads = formData.uploads || {};

  const handlePaymentUpload = (files) => {
    updateField("uploads", {
      ...uploads,
      paymentScreenshot: files,
    });
  };

  return (
    <div className="space-y-6!">

      <div>

        <H3>
          Complete Your Payment
        </H3>

        <Text muted>
          Upload your payment proof to complete your consultation request.
        </Text>

      </div>

      <Alert
        type="info"
        icon={<SafetyCertificateOutlined />}
        message="Your payment is secure."
      />

      <Card className="bg-surface border border-border">

        <H5 className="mb-2">
          Consultation Fee
        </H5>

        <div className="text-4xl font-bold text-primary">
          Rs. 2,500
        </div>

      </Card>

      <Card className="bg-surface border border-border">

        <H5 className="mb-3">
          Payment Details
        </H5>

        <div className="space-y-3">

          <div>
            <Text muted>Bank Name</Text>
            <div className="text-text font-medium">
              Meezan Bank
            </div>
          </div>

          <div>
            <Text muted>Account Title</Text>
            <div className="text-text font-medium">
              Fito Nutrition
            </div>
          </div>

          <div>
            <Text muted>Account Number</Text>
            <div className="text-text font-medium">
              123456789012
            </div>
          </div>

          <div>
            <Text muted>IBAN</Text>
            <div className="text-text font-medium">
              PK00MEEZ000000000000000
            </div>
          </div>

        </div>

      </Card>

      <Card className="bg-surface border border-border">

        <H5 className="mb-3">
          Transaction ID (Optional)
        </H5>

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

      <Card className="bg-surface border border-border">

        <H5 className="mb-3">
          Upload Payment Screenshot
        </H5>

        <Upload
          value={uploads.paymentScreenshot || []}
          onChange={handlePaymentUpload}
        >
          <UploadOutlined />
          <span className="ml-2">Upload Screenshot</span>
        </Upload>

      </Card>

    </div>
  );
}

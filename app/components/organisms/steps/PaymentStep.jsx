'use client';

import { useState } from 'react';
import { message } from 'antd';
import {
  UploadOutlined,
  SafetyCertificateOutlined,
  BankOutlined,
  IdcardOutlined,
  NumberOutlined,
  CopyOutlined,
  CheckOutlined,
} from '@ant-design/icons';

import Card from '../../atoms/Card';
import { H3, H5, Text } from '../../atoms/Typography';
import Alert from '../../atoms/Alert';
import Input from '../../atoms/Input';
import Upload from '../../atoms/Upload';

const PAYMENT_DETAILS = [
  { label: 'Bank Name', value: 'Meezan Bank', icon: <BankOutlined />, copyable: false },
  { label: 'Account Title', value: 'Fitoo Nutrition', icon: <IdcardOutlined />, copyable: false },
  { label: 'Account Number', value: '123456789012', icon: <NumberOutlined />, copyable: true },
  { label: 'IBAN', value: 'PK00MEEZ000000000000000', icon: <NumberOutlined />, copyable: true },
];

function CopyableRow({ label, value, icon, copyable }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      message.success(`${label} copied`);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      message.error('Could not copy — please copy it manually.');
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-border-light last:border-b-0">
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
          {icon}
        </span>
        <div className="min-w-0">
          <Text muted className="text-xs">{label}</Text>
          <div className="text-text font-medium truncate">{value}</div>
        </div>
      </div>

      {copyable && (
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
          aria-label={`Copy ${label}`}
        >
          {copied ? <CheckOutlined className="text-success" /> : <CopyOutlined />}
        </button>
      )}
    </div>
  );
}

export default function PaymentStep({
  formData,
  updateField,
  selectedPlan,
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

      <Card className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">

        <Text muted className="block mb-1">
          {selectedPlan ? `${selectedPlan.label} Plan` : "Consultation Fee"}
        </Text>

        <div className="text-4xl font-bold text-primary">
          {selectedPlan
            ? `Rs. ${selectedPlan.price.toLocaleString("en-US")}`
            : "Rs. 2,500"}
        </div>

        {selectedPlan?.durationMonths && (
          <Text muted className="text-sm mt-1">
            Rs. {Math.round(selectedPlan.price / selectedPlan.durationMonths).toLocaleString("en-US")} / month
            {' · '}{selectedPlan.durationMonths} month{selectedPlan.durationMonths > 1 ? 's' : ''}
          </Text>
        )}

      </Card>

      <Card className="glass border border-border-light">

        <H5 className="mb-3">
          Payment Details
        </H5>

        <div>
          {PAYMENT_DETAILS.map((detail) => (
            <CopyableRow key={detail.label} {...detail} />
          ))}
        </div>

      </Card>

      <Card className="glass border border-border-light">

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

      <Card className="glass border border-border-light">

        <div className="flex items-center justify-between mb-3">
          <H5>
            Upload Payment Screenshot
          </H5>
          {(uploads.paymentScreenshot || []).length > 0 && (
            <span className="text-xs font-medium text-success bg-success/10 rounded-full px-2.5 py-1 flex items-center gap-1">
              <CheckOutlined /> Attached
            </span>
          )}
        </div>

        <Upload
          value={uploads.paymentScreenshot || []}
          onChange={handlePaymentUpload}
          triggerClassName="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-border-light text-text-secondary hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors"
        >
          <UploadOutlined />
          <span className="ml-2">Upload Screenshot</span>
        </Upload>

      </Card>

    </div>
  );
}

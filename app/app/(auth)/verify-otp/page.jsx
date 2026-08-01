'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Form, message } from 'antd';
import { MailOutlined, NumberOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import useAuth from '@/hooks/useAuth';

const RESEND_COOLDOWN_SECONDS = 60;

function VerifyOtpForm() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const router = useRouter();
  const { verifyOtp, resendOtp } = useAuth();
  const [form] = Form.useForm();

  useEffect(() => {
    if (emailParam) form.setFieldsValue({ email: emailParam });
  }, [emailParam, form]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await verifyOtp({ email: values.email, otp: values.otp });
      message.success('Email verified! You are now logged in.');
      router.push('/');
    } catch (error) {
      message.error(error?.response?.data?.message || 'Invalid or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    const email = form.getFieldValue('email');
    if (!email) {
      message.error('Please enter your email first');
      return;
    }
    setResending(true);
    try {
      const result = await resendOtp({ email });
      message.success(result?.message || 'Verification code resent');
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      message.error(error?.response?.data?.message || 'Could not resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text">Verify Your Email</h1>
        <p className="text-text-muted mt-2">Enter the 6-digit code we emailed you</p>
      </div>

      <Form
        form={form}
        name="verify-otp"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        requiredMark={false}
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input icon={<MailOutlined />} placeholder="Email address" />
        </Form.Item>

        <Form.Item
          name="otp"
          rules={[
            { required: true, message: 'Please enter the code' },
            { len: 6, message: 'Code must be 6 digits' },
          ]}
        >
          <Input icon={<NumberOutlined />} placeholder="6-digit code" maxLength={6} inputMode="numeric" />
        </Form.Item>

        <Button type="submit" size="lg" fullWidth loading={loading}>
          Verify
        </Button>

        <div className="text-center mt-4 text-text-muted text-sm">
          Didn&apos;t get a code?{' '}
          <button
            type="button"
            onClick={onResend}
            disabled={resending || cooldown > 0}
            className="text-primary hover:text-primary-hover font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
          </button>
        </div>

        <div className="text-center mt-4">
          <Link href="/login" className="text-text-muted hover:text-text-secondary text-sm">
            ← Back to login
          </Link>
        </div>
      </Form>
    </motion.div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  );
}

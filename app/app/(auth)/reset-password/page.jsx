'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Form, message } from 'antd';
import { MailOutlined, NumberOutlined, LockOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import useAuth from '@/hooks/useAuth';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [form] = Form.useForm();

  useEffect(() => {
    if (emailParam) form.setFieldsValue({ email: emailParam });
  }, [emailParam, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await resetPassword({
        email: values.email,
        otp: values.otp,
        newPassword: values.newPassword,
      });
      message.success(result?.message || 'Password reset successfully. You can now log in.');
      router.push('/login');
    } catch (error) {
      message.error(error?.response?.data?.message || 'Invalid or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text">Set a New Password</h1>
        <p className="text-text-muted mt-2">Enter the code we emailed you and your new password</p>
      </div>

      <Form
        form={form}
        name="reset-password"
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

        <Form.Item
          name="newPassword"
          rules={[
            { required: true, message: 'Please enter a new password' },
            { min: 8, message: 'Password must be at least 8 characters' },
          ]}
        >
          <Input type="password" icon={<LockOutlined />} placeholder="New password" />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Please confirm your new password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match'));
              },
            }),
          ]}
        >
          <Input type="password" icon={<LockOutlined />} placeholder="Confirm new password" />
        </Form.Item>

        <Button type="submit" size="lg" fullWidth loading={loading}>
          Reset Password
        </Button>

        <div className="text-center mt-4">
          <Link href="/login" className="text-text-muted hover:text-text-secondary text-sm">
            ← Back to login
          </Link>
        </div>
      </Form>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

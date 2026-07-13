'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
      message.success('Password reset link sent to your email!');
    } catch (error) {
      message.error('Something went wrong. Please try again.');
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
      <div className="text-center  mb-8">
        <h1 className="text-3xl font-bold text-white">Reset Password</h1>
        <p className="text-gray-400 mt-2">We'll send you a link to reset your password</p>
      </div>

      {submitted ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <MailOutlined className="text-3xl text-yellow-400" />
          </div>
          <h3 className="text-xl text-white font-semibold">Check your inbox</h3>
          <p className="text-gray-400 mt-2">
            We've sent a password reset link to your email address.
          </p>
          <div className="mt-6">
            <Link href="/login" className="text-yellow-400 hover:text-yellow-300 font-medium">
              Back to login
            </Link>
          </div>
        </div>
      ) : (
        <Form
          name="forgot-password"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="Email address" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            Send Reset Link
          </Button>

          <div className="text-center mt-4">
            <Link href="/login" className="text-gray-400 hover:text-gray-300 text-sm">
              ← Back to login
            </Link>
          </div>
        </Form>
      )}
    </motion.div>
  );
}
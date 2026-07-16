'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Checkbox, Divider, message } from 'antd';
import { MailOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values) => {
    setLoading(true);
    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      message.success('Logged in successfully!');
      router.push('/');
    } catch (error) {
      message.error('Invalid credentials. Please try again.');
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
        <h1 className="text-3xl font-bold text-text">Welcome Back</h1>
        <p className="text-text-muted mt-2">Sign in to your Fito account</p>
      </div>

      <Form
        name="login"
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
          <Input prefix={<MailOutlined className="text-text-muted" />} placeholder="Email address" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password prefix={<LockOutlined className="text-text-muted" />} placeholder="Password" />
        </Form.Item>

        <div className="flex justify-between items-center mb-6">
          <Checkbox className="text-text-secondary">Remember me</Checkbox>
          <Link href="/forgot-password" className="text-primary hover:text-primary-hover text-sm">
            Forgot password?
          </Link>
        </div>

        <Button type="primary" htmlType="submit" block loading={loading}>
          Sign In
        </Button>

        <Divider className="border-border-light my-6">
          <span className="text-text-muted text-sm">or continue with</span>
        </Divider>

        <div className="flex gap-4">
          <Button
            icon={<GoogleOutlined />}
            className="flex-1 bg-overlay border-border-light text-text hover:bg-overlay-strong"
            onClick={() => message.info('Google login coming soon')}
          >
            Google
          </Button>
          <Button
            icon={<FacebookOutlined />}
            className="flex-1 bg-overlay border-border-light text-text hover:bg-overlay-strong"
            onClick={() => message.info('Facebook login coming soon')}
          >
            Facebook
          </Button>
        </div>

        <div className="text-center mt-6 text-text-muted">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary hover:text-primary-hover font-medium">
            Sign up now
          </Link>
        </div>
      </Form>
    </motion.div>
  );
}
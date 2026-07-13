'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Checkbox, Divider, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      message.success('Account created successfully!');
      router.push('/login');
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
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Create Account</h1>
        <p className="text-gray-400 mt-2">Join Fito and start your fitness journey</p>
      </div>

      <Form
        name="register"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        size="large"
        requiredMark={false}
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Please enter your full name' }]}
        >
          <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Full name" />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="Email address" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Please enter a password' },
            { min: 8, message: 'Password must be at least 8 characters' },
          ]}
        >
          <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="Password" />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="Confirm password" />
        </Form.Item>

        <Form.Item
          name="terms"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('You must accept the terms and conditions')),
            },
          ]}
        >
          <Checkbox className="text-gray-300">
            I agree to the <Link href="/terms" className="text-yellow-400 hover:text-yellow-300">Terms of Service</Link> and{' '}
            <Link href="/privacy" className="text-yellow-400 hover:text-yellow-300">Privacy Policy</Link>
          </Checkbox>
        </Form.Item>

        <Button type="primary" htmlType="submit" block loading={loading}>
          Create Account
        </Button>

        <Divider className="border-white/10 my-6">
          <span className="text-gray-500 text-sm">or sign up with</span>
        </Divider>


        <div className="text-center mt-6 text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-yellow-400 hover:text-yellow-300 font-medium">
            Sign in
          </Link>
        </div>
      </Form>
    </motion.div>
  );
}
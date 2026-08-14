import { useState } from 'react';
import { Form, Input, Button, Alert, Card } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { signupAdmin } from '../../api/adminAuth.api';
import { ROUTES } from '../../constants/routes';
import logo from '../../assets/logo/fitoo-logo.svg';

export default function SignupPage() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const onFinish = async ({ name, email, password }) => {
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const { message } = await signupAdmin({ name, email, password });
            setSuccess(message || 'Signup successful. A super admin needs to activate your account before you can log in.');
            setTimeout(() => navigate(ROUTES.LOGIN), 2500);
        } catch (err) {
            setError(err?.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{
                background:
                    'radial-gradient(circle at 50% 0%, var(--color-primary-light) 0%, var(--color-page) 55%)',
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="w-full max-w-sm"
            >
                <Card
                    className="rounded-2xl shadow-sm border border-gray-100"
                    styles={{ body: { padding: 32 } }}
                >
                    <div className="text-center mb-7">
                        <img src={logo} alt="Fitoo" className="h-12 w-auto mx-auto mb-4" />
                        <h1 className="text-xl font-semibold text-gray-900">Fito Admin</h1>
                        <p className="text-sm text-gray-500 mt-1">Request an admin account</p>
                    </div>

                    {error && <Alert type="error" message={error} className="mb-4" showIcon />}
                    {success && <Alert type="success" message={success} className="mb-4" showIcon />}

                    <Form layout="vertical" onFinish={onFinish} disabled={!!success}>
                        <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
                            <Input size="large" prefix={<UserOutlined className="text-gray-400" />} placeholder="Your name" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Email is required' },
                                { type: 'email', message: 'Enter a valid email' },
                            ]}
                        >
                            <Input size="large" prefix={<MailOutlined className="text-gray-400" />} placeholder="you@Fito.com" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                { required: true, message: 'Password is required' },
                                { min: 8, message: 'Password must be at least 8 characters' },
                            ]}
                        >
                            <Input.Password size="large" prefix={<LockOutlined className="text-gray-400" />} placeholder="••••••••" />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            label="Confirm Password"
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
                            <Input.Password size="large" prefix={<LockOutlined className="text-gray-400" />} placeholder="••••••••" />
                        </Form.Item>
                        <Button type="primary" size="large" htmlType="submit" block loading={loading} className="mt-2">
                            Sign Up
                        </Button>
                    </Form>

                    <p className="text-sm text-gray-500 text-center mt-6">
                        Already have an account?{' '}
                        <Link to={ROUTES.LOGIN} className="text-primary font-medium">
                            Sign in
                        </Link>
                    </p>
                </Card>
            </motion.div>
        </div>
    );
}

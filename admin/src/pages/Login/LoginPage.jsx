import { useState } from 'react';
import { Form, Input, Button, Alert, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTestingMode } from '../../context/TestingModeContext';
import TestingModeToggle from '../../components/atoms/TestingModeToggle';
import { ROUTES } from '../../constants/routes';
import logo from '../../assets/logo/fitoo-logo.svg';

export default function LoginPage() {
    const { login } = useAuth();
    const { testingMode } = useTestingMode();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onFinish = async ({ email, password }) => {
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate(ROUTES.DASHBOARD);
        } catch (err) {
            setError(err.message);
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
            <div className="fixed top-4 right-4">
                <TestingModeToggle />
            </div>

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
                        <p className="text-sm text-gray-500 mt-1">Sign in to manage your store</p>
                    </div>

                    {error && <Alert type="error" message={error} className="mb-4" showIcon />}

                    <Form
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={
                            testingMode ? { email: 'super@Fito.com', password: 'password' } : undefined
                        }
                    >
                        <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Email is required' }]}>
                            <Input size="large" prefix={<UserOutlined className="text-gray-400" />} placeholder="you@Fito.com" />
                        </Form.Item>
                        <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Password is required' }]}>
                            <Input.Password size="large" prefix={<LockOutlined className="text-gray-400" />} placeholder="••••••••" />
                        </Form.Item>
                        <Button type="primary" size="large" htmlType="submit" block loading={loading} className="mt-2">
                            Sign In
                        </Button>
                    </Form>

                    {testingMode && (
                        <p className="text-xs text-gray-400 text-center mt-6">
                            Demo: super@Fito.com / admin@Fito.com — password: password
                        </p>
                    )}

                    <p className="text-sm text-gray-500 text-center mt-6">
                        Need an account?{' '}
                        <Link to={ROUTES.SIGNUP} className="text-primary font-medium">
                            Sign up
                        </Link>
                    </p>
                </Card>
            </motion.div>
        </div>
    );
}

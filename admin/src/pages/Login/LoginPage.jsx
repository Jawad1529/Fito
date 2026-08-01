import { useState } from 'react';
import { Form, Input, Button, Alert, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';

export default function LoginPage() {
    const { login } = useAuth();
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
                        <div className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center text-lg font-bold mx-auto mb-4">
                            F
                        </div>
                        <h1 className="text-xl font-semibold text-gray-900">Fitoo Admin</h1>
                        <p className="text-sm text-gray-500 mt-1">Sign in to manage your store</p>
                    </div>

                    {error && <Alert type="error" message={error} className="mb-4" showIcon />}

                    <Form layout="vertical" onFinish={onFinish} initialValues={{ email: 'super@Fitoo.com', password: 'password' }}>
                        <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Email is required' }]}>
                            <Input size="large" prefix={<UserOutlined className="text-gray-400" />} placeholder="you@Fitoo.com" />
                        </Form.Item>
                        <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Password is required' }]}>
                            <Input.Password size="large" prefix={<LockOutlined className="text-gray-400" />} placeholder="••••••••" />
                        </Form.Item>
                        <Button type="primary" size="large" htmlType="submit" block loading={loading} className="mt-2">
                            Sign In
                        </Button>
                    </Form>

                    <p className="text-xs text-gray-400 text-center mt-6">
                        Demo: super@Fitoo.com / admin@Fitoo.com — password: password
                    </p>
                </Card>
            </motion.div>
        </div>
    );
}

import { useState } from 'react';
import { Form, Input, Button, Alert, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
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
        <div className="min-h-screen flex items-center justify-center bg-[#f5f6fa] px-4">
            <Card className="w-full max-w-sm rounded-2xl shadow-sm border border-gray-100">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-primary">Fito Admin</h1>
                    <p className="text-sm text-gray-500 mt-1">Sign in to manage your store</p>
                </div>

                {error && <Alert type="error" message={error} className="mb-4" showIcon />}

                <Form layout="vertical" onFinish={onFinish} initialValues={{ email: 'super@fito.com', password: 'password' }}>
                    <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Email is required' }]}>
                        <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="you@fito.com" />
                    </Form.Item>
                    <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Password is required' }]}>
                        <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="••••••••" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading} className="mt-2">
                        Sign In
                    </Button>
                </Form>

                <p className="text-xs text-gray-400 text-center mt-5">
                    Demo: super@fito.com / admin@fito.com — password: password
                </p>
            </Card>
        </div>
    );
}

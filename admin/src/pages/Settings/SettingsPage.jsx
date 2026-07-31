import { Tabs, Form, Input, Button, Switch, message, Card } from 'antd';
import { useAuth } from '../../context/AuthContext';
import PageHeading from '../../components/atoms/PageHeading';

function AdminProfileTab() {
    const { user } = useAuth();
    const [form] = Form.useForm();

    return (
        <Card className="rounded-2xl border border-gray-100 shadow-sm max-w-lg">
            <Form
                form={form}
                layout="vertical"
                initialValues={{ name: user?.name, email: user?.email }}
                onFinish={() => message.success('Profile updated')}
            >
                <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                </Form.Item>
                <Button type="primary" htmlType="submit">Save Changes</Button>
            </Form>
        </Card>
    );
}

function ChangePasswordTab() {
    const [form] = Form.useForm();

    return (
        <Card className="rounded-2xl border border-gray-100 shadow-sm max-w-lg">
            <Form form={form} layout="vertical" onFinish={() => { message.success('Password updated'); form.resetFields(); }}>
                <Form.Item name="current" label="Current Password" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item name="newPassword" label="New Password" rules={[{ required: true, min: 6 }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item name="confirm" label="Confirm New Password" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>
                <Button type="primary" htmlType="submit">Update Password</Button>
            </Form>
        </Card>
    );
}

function NotificationSettingsTab() {
    return (
        <Card className="rounded-2xl border border-gray-100 shadow-sm max-w-lg">
            <div className="space-y-4">
                {[
                    'Email me for new consultations',
                    'Email me for new orders',
                    'Email me for new reviews',
                    'Push notifications',
                ].map((label) => (
                    <div key={label} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{label}</span>
                        <Switch defaultChecked onChange={() => message.success('Preference saved')} />
                    </div>
                ))}
            </div>
        </Card>
    );
}

function GeneralSettingsTab() {
    const [form] = Form.useForm();

    return (
        <Card className="rounded-2xl border border-gray-100 shadow-sm max-w-lg">
            <Form
                form={form}
                layout="vertical"
                initialValues={{ storeName: 'Fito', supportEmail: 'support@fito.com' }}
                onFinish={() => message.success('Settings saved')}
            >
                <Form.Item name="storeName" label="Store Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="supportEmail" label="Support Email" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                </Form.Item>
                <Button type="primary" htmlType="submit">Save Settings</Button>
            </Form>
        </Card>
    );
}

export default function SettingsPage() {
    return (
        <div>
            <PageHeading title="Settings" subtitle="Manage your admin profile and preferences" />
            <Tabs
                defaultActiveKey="profile"
                items={[
                    { key: 'profile', label: 'Admin Profile', children: <AdminProfileTab /> },
                    { key: 'password', label: 'Change Password', children: <ChangePasswordTab /> },
                    { key: 'notifications', label: 'Notification Settings', children: <NotificationSettingsTab /> },
                    { key: 'general', label: 'General Settings', children: <GeneralSettingsTab /> },
                ]}
            />
        </div>
    );
}

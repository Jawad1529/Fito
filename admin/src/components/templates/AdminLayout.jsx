import { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from '../organisms/Sidebar';
import Header from '../organisms/Header';

const { Sider, Content } = Layout;

export default function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout className="min-h-screen">
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                width={230}
                className="admin-scrollbar"
                style={{ overflow: 'auto', height: '100vh', position: 'sticky', top: 0, left: 0 }}
            >
                <Sidebar collapsed={collapsed} />
            </Sider>
            <Layout>
                <Header collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
                <Content className="p-4 sm:p-6 bg-page min-h-[calc(100vh-64px)]">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}

import { Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    DashboardOutlined,
    TeamOutlined,
    MedicineBoxOutlined,
    ShoppingOutlined,
    StarOutlined,
    ReadOutlined,
    SettingOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';

export default function Sidebar({ collapsed }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { isSuperAdmin, logout } = useAuth();

    const items = [
        { key: ROUTES.DASHBOARD, icon: <DashboardOutlined />, label: 'Dashboard' },
        isSuperAdmin && { key: ROUTES.USERS, icon: <TeamOutlined />, label: 'User Management' },
        { key: ROUTES.CONSULTATIONS, icon: <MedicineBoxOutlined />, label: 'Consultation Management' },
        { key: ROUTES.PRODUCTS, icon: <ShoppingOutlined />, label: 'Product Management' },
        isSuperAdmin && { key: ROUTES.REVIEWS, icon: <StarOutlined />, label: 'Review Management' },
        { key: ROUTES.BLOGS, icon: <ReadOutlined />, label: 'Blog Management' },
        { key: ROUTES.SETTINGS, icon: <SettingOutlined />, label: 'Settings' },
        { type: 'divider' },
        { key: 'signout', icon: <LogoutOutlined />, label: 'Sign Out', danger: true },
    ].filter(Boolean);

    const handleClick = ({ key }) => {
        if (key === 'signout') {
            logout();
            navigate(ROUTES.LOGIN);
            return;
        }
        navigate(key);
    };

    const selectedKey =
        items.find((i) => i.key === location.pathname)?.key ??
        (location.pathname.startsWith(ROUTES.USERS) ? ROUTES.USERS : undefined);

    return (
        <div className="h-full flex flex-col bg-white border-r border-gray-100">
            <div className="h-16 flex items-center justify-center border-b border-gray-100 px-4">
                <span className="text-xl font-bold text-primary">{collapsed ? 'F' : 'Fito Admin'}</span>
            </div>
            <Menu
                mode="inline"
                selectedKeys={selectedKey ? [selectedKey] : [location.pathname]}
                items={items}
                onClick={handleClick}
                className="flex-1 border-none pt-2"
            />
        </div>
    );
}

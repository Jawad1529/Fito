import { Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    DashboardOutlined,
    TeamOutlined,
    MedicineBoxOutlined,
    TagsOutlined,
    ShoppingOutlined,
    ShoppingCartOutlined,
    StarOutlined,
    ReadOutlined,
    BellOutlined,
    SettingOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';

export default function Sidebar({ collapsed }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { isSuperAdmin, logout } = useAuth();

    const primaryItems = [
        { key: ROUTES.DASHBOARD, icon: <DashboardOutlined />, label: 'Dashboard' },
        isSuperAdmin && { key: ROUTES.USERS, icon: <TeamOutlined />, label: 'User Management' },
        { key: ROUTES.CONSULTATIONS, icon: <MedicineBoxOutlined />, label: 'Consultation Management' },
        { key: ROUTES.CONSULTATION_PLANS, icon: <TagsOutlined />, label: 'Consultation Plan Pricing' },
        { key: ROUTES.PRODUCTS, icon: <ShoppingOutlined />, label: 'Product Management' },
        isSuperAdmin && { key: ROUTES.REVIEWS, icon: <StarOutlined />, label: 'Review Management' },
        isSuperAdmin && { key: ROUTES.ORDERS, icon: <ShoppingCartOutlined />, label: 'Order Management' },
        { key: ROUTES.BLOGS, icon: <ReadOutlined />, label: 'Blog Management' },
        { key: ROUTES.NOTIFICATIONS, icon: <BellOutlined />, label: 'Notification Management' },
    ].filter(Boolean);

    // Kept in a separate Menu so this section stays pinned to the bottom of
    // the sidebar regardless of how many items are in primaryItems above.
    const secondaryItems = [
        { key: ROUTES.SETTINGS, icon: <SettingOutlined />, label: 'Settings' },
        { type: 'divider' },
        { key: 'signout', icon: <LogoutOutlined />, label: 'Sign Out', danger: true },
    ];

    const handleClick = ({ key }) => {
        if (key === 'signout') {
            logout();
            navigate(ROUTES.LOGIN);
            return;
        }
        navigate(key);
    };

    const selectedKey =
        [...primaryItems, ...secondaryItems].find((i) => i.key === location.pathname)?.key ??
        (location.pathname.startsWith(ROUTES.USERS) ? ROUTES.USERS : undefined);
    const selectedKeys = selectedKey ? [selectedKey] : [location.pathname];

    return (
        <div className="h-full flex flex-col bg-white border-r border-gray-100">
            <div className="h-16 flex items-center justify-center gap-2.5 border-b border-gray-100 px-4 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                    F
                </div>
                {!collapsed && (
                    <span className="text-base font-semibold text-gray-900 tracking-tight">Fito Admin</span>
                )}
            </div>

            <Menu
                mode="inline"
                selectedKeys={selectedKeys}
                items={primaryItems}
                onClick={handleClick}
                className="flex-1 border-none pt-2"
            />

            <Menu
                mode="inline"
                selectedKeys={selectedKeys}
                items={secondaryItems}
                onClick={handleClick}
                className="border-none border-t border-gray-100 pt-2 pb-2 shrink-0"
            />
        </div>
    );
}

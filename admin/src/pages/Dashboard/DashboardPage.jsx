import { Row, Col, List, Avatar, Tag } from 'antd';
import {
    TeamOutlined,
    CrownOutlined,
    ShoppingOutlined,
    MedicineBoxOutlined,
    ReadOutlined,
    StarOutlined,
    DollarOutlined,
    UserOutlined,
} from '@ant-design/icons';
import PageHeading from '../../components/atoms/PageHeading';
import SummaryCard from '../../components/molecules/SummaryCard';
import SalesChart from '../../components/organisms/SalesChart';
import RecentListCard from '../../components/organisms/RecentListCard';
import StatusTag from '../../components/atoms/StatusTag';
import { dashboardSummary } from '../../data/analytics';
import { appUsers } from '../../data/appUsers';
import { recentOrders } from '../../data/orders';
import { reviews } from '../../data/reviews';

export default function DashboardPage() {
    const cards = [
        { icon: <TeamOutlined />, label: 'Total Users', value: dashboardSummary.totalUsers.toLocaleString(), accent: '#CF4842' },
        { icon: <CrownOutlined />, label: 'Total Admins', value: dashboardSummary.totalAdmins, accent: '#f59e0b' },
        { icon: <ShoppingOutlined />, label: 'Total Products', value: dashboardSummary.totalProducts, accent: '#3b82f6' },
        { icon: <MedicineBoxOutlined />, label: 'Total Consultations', value: dashboardSummary.totalConsultations, accent: '#10b981' },
        { icon: <ReadOutlined />, label: 'Total Blogs', value: dashboardSummary.totalBlogs, accent: '#ec4899' },
        { icon: <StarOutlined />, label: 'Total Reviews', value: dashboardSummary.totalReviews, accent: '#eab308' },
        { icon: <DollarOutlined />, label: 'Total Sales', value: `$${dashboardSummary.totalSales.toLocaleString()}`, accent: '#ef4444' },
    ];

    return (
        <div>
            <PageHeading title="Dashboard" subtitle="Overview of your store performance" />

            <Row gutter={[16, 16]} className="mb-6">
                {cards.map((c) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={c.label}>
                        <SummaryCard {...c} />
                    </Col>
                ))}
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <SalesChart />
                </Col>
                <Col xs={24} lg={8}>
                    <RecentListCard
                        title="Recent Users"
                        dataSource={appUsers.slice(0, 5)}
                        renderItem={(user) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar icon={<UserOutlined />} className="bg-primary-light text-primary" />}
                                    title={user.name}
                                    description={user.email}
                                />
                                <StatusTag status={user.status} />
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>

            <Row gutter={[16, 16]} className="mt-6">
                <Col xs={24} lg={12}>
                    <RecentListCard
                        title="Recent Orders"
                        dataSource={recentOrders}
                        renderItem={(order) => (
                            <List.Item>
                                <List.Item.Meta title={order.id} description={`${order.customer} · ${order.date}`} />
                                <div className="text-right">
                                    <p className="font-medium">${order.amount.toFixed(2)}</p>
                                    <StatusTag status={order.status} />
                                </div>
                            </List.Item>
                        )}
                    />
                </Col>
                <Col xs={24} lg={12}>
                    <RecentListCard
                        title="Latest Reviews"
                        dataSource={reviews.slice(0, 5)}
                        renderItem={(review) => (
                            <List.Item>
                                <List.Item.Meta
                                    title={`${review.name} · ${review.productName}`}
                                    description={review.comment}
                                />
                                <Tag color="gold">{review.rating}★</Tag>
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
        </div>
    );
}

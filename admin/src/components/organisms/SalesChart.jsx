import { Card, Tabs } from 'antd';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';
import { salesLast7Days, salesLast30Days, salesLast12Months } from '../../data/analytics';

const RANGES = [
    { key: '7d', label: 'Last 7 Days', data: salesLast7Days },
    { key: '30d', label: 'Last 30 Days', data: salesLast30Days },
    { key: '12m', label: 'Last 12 Months', data: salesLast12Months },
];

export default function SalesChart() {
    return (
        <Card className="rounded-2xl border border-gray-100 shadow-sm" title="Sales Overview">
            <Tabs
                defaultActiveKey="7d"
                items={RANGES.map(({ key, label, data }) => ({
                    key,
                    label,
                    children: (
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#CF4842" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#CF4842" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="label"
                                        tick={{ fontSize: 12, fill: '#8c8c8c' }}
                                        interval={key === '30d' ? 4 : 0}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis tick={{ fontSize: 12, fill: '#8c8c8c' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']}
                                        contentStyle={{ borderRadius: 8, border: '1px solid #eee' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="sales"
                                        stroke="#CF4842"
                                        strokeWidth={2}
                                        fill="url(#salesGradient)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ),
                }))}
            />
        </Card>
    );
}

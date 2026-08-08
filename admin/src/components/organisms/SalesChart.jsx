import { useEffect, useState } from 'react';
import { Card, Tabs, Spin } from 'antd';
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
import { fetchSalesAnalytics } from '../../api/adminDashboard.api';
import { BRAND } from '../../constants/theme';

const RANGE_TABS = [
    { key: '7d', label: 'Last 7 Days' },
    { key: '30d', label: 'Last 30 Days' },
    { key: '12m', label: 'Last 12 Months' },
];

const STATIC_DATA = { '7d': salesLast7Days, '30d': salesLast30Days, '12m': salesLast12Months };

export default function SalesChart({ testingMode }) {
    const [salesData, setSalesData] = useState(testingMode ? STATIC_DATA : {});
    const [loading, setLoading] = useState(!testingMode);

    useEffect(() => {
        if (testingMode) return undefined;
        let cancelled = false;
        Promise.all(RANGE_TABS.map((r) => fetchSalesAnalytics(r.key)))
            .then((results) => {
                if (cancelled) return;
                setSalesData(Object.fromEntries(RANGE_TABS.map((r, i) => [r.key, results[i]])));
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [testingMode]);

    return (
        <Card className="rounded-2xl border border-gray-100 shadow-sm" title="Sales Overview">
            <Tabs
                defaultActiveKey="7d"
                items={RANGE_TABS.map(({ key, label }) => ({
                    key,
                    label,
                    children: (
                        <div className="h-72 w-full">
                            {loading ? (
                                <div className="h-full flex items-center justify-center">
                                    <Spin />
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={salesData[key] ?? []}
                                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={BRAND.primary} stopOpacity={0.4} />
                                                <stop offset="95%" stopColor={BRAND.primary} stopOpacity={0} />
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
                                            formatter={(value) => [`Rs. ${value.toLocaleString()}`, 'Sales']}
                                            contentStyle={{ borderRadius: 8, border: '1px solid #eee' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="sales"
                                            stroke={BRAND.primary}
                                            strokeWidth={2}
                                            fill="url(#salesGradient)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    ),
                }))}
            />
        </Card>
    );
}

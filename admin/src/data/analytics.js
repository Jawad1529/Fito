const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const salesLast7Days = dayLabels.map((day, i) => ({
    label: day,
    sales: [1200, 1900, 1500, 2100, 1800, 2600, 2300][i],
}));

export const salesLast30Days = Array.from({ length: 30 }, (_, i) => ({
    label: `Day ${i + 1}`,
    sales: Math.round(1000 + Math.sin(i / 3) * 500 + (i % 7 === 0 ? 800 : 0) + i * 15),
}));

export const salesLast12Months = [
    'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
].map((month, i) => ({
    label: month,
    sales: 24000 + i * 1800 + (i % 3 === 0 ? 4000 : 0),
}));

export const dashboardSummary = {
    totalUsers: 1284,
    totalAdmins: 4,
    totalProducts: 8,
    totalConsultations: 25,
    totalBlogs: 6,
    totalReviews: 13,
    totalSales: 184320,
};

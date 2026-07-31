import { Card } from 'antd';

export default function SummaryCard({ icon, label, value, accent = '#CF4842' }) {
    return (
        <Card
            className="rounded-2xl border border-gray-100 shadow-sm"
            styles={{ body: { padding: '20px' } }}
        >
            <div className="flex items-center gap-4">
                <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: `${accent}1A`, color: accent }}
                >
                    {icon}
                </div>
                <div className="min-w-0">
                    <p className="text-sm text-gray-500 truncate">{label}</p>
                    <p className="text-xl font-semibold text-gray-900">{value}</p>
                </div>
            </div>
        </Card>
    );
}

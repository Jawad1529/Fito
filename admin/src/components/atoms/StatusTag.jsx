import { Tag } from 'antd';

const COLOR_MAP = {
    active: 'green',
    inactive: 'default',
    blocked: 'red',
    pending: 'gold',
    in_review: 'blue',
    completed: 'green',
    published: 'green',
    draft: 'default',
    out_of_stock: 'red',
    delivered: 'green',
    processing: 'blue',
    shipped: 'cyan',
    cancelled: 'red',
};

const formatLabel = (value) =>
    String(value)
        .replace(/_/g, ' ')
        .replace(/^./, (c) => c.toUpperCase());

export default function StatusTag({ status }) {
    return (
        <Tag color={COLOR_MAP[status] ?? 'default'} className="capitalize">
            {formatLabel(status)}
        </Tag>
    );
}

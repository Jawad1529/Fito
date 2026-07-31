import { Card, List } from 'antd';

export default function RecentListCard({ title, dataSource, renderItem }) {
    return (
        <Card className="rounded-2xl border border-gray-100 shadow-sm" title={title}>
            <List
                size="small"
                dataSource={dataSource}
                locale={{ emptyText: 'No data yet' }}
                renderItem={renderItem}
            />
        </Card>
    );
}

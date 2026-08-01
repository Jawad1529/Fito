import { Table, Empty } from 'antd';

export default function DataTable({ columns, data, loading, rowKey = 'id', pageSize = 8 }) {
    return (
        <Table
            rowKey={rowKey}
            columns={columns}
            dataSource={data}
            loading={loading}
            scroll={{ x: 'max-content' }}
            locale={{ emptyText: <Empty description="No records found" /> }}
            pagination={{
                pageSize,
                showSizeChanger: true,
                pageSizeOptions: [5, 8, 10, 20],
                showTotal: (total) => `${total} items`,
            }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        />
    );
}

import { Table, Empty } from 'antd';

const PAGINATION_DEFAULTS = {
    showSizeChanger: true,
    pageSizeOptions: [5, 8, 10, 20],
    showTotal: (total) => `${total} items`,
};

// `pagination` + `onChange`: pass the object/handler from useServerTableQuery
// for backend-driven paging (page/pageSize/filters all trigger a refetch).
// Omit them to keep the old client-side behaviour (antd paginates `data` —
// which must already hold every row — in the browser).
export default function DataTable({
    columns,
    data,
    loading,
    rowKey = 'id',
    pageSize = 8,
    rowClassName,
    pagination,
    onChange,
}) {
    return (
        <Table
            rowKey={rowKey}
            columns={columns}
            dataSource={data}
            loading={loading}
            scroll={{ x: 'max-content' }}
            rowClassName={rowClassName}
            locale={{ emptyText: <Empty description="No records found" /> }}
            pagination={pagination ? { ...PAGINATION_DEFAULTS, ...pagination } : { ...PAGINATION_DEFAULTS, pageSize }}
            onChange={onChange}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        />
    );
}

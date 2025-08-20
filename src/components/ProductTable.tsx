import React, { useMemo } from "react";
import { Table, TableColumnsType, Typography, Tag, Space, Button, Popconfirm } from "antd";
import { LinkOutlined, DeleteOutlined } from "@ant-design/icons";
import { Product } from "../types";
import dayjs from "dayjs";

interface ProductTableProps {
  data?: Product[];
  onDelete?: (id: number) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ data = [], onDelete }) => {
  // Generate filter options from data
  const filterOptions = useMemo(() => {
    const brands = Array.from(new Set(data.map(item => item.brand))).sort();
    const types = Array.from(new Set(data.map(item => item.type))).sort();
    const titles = Array.from(new Set(data.map(item => item.title))).sort();
    
    return {
      brands: brands.map(brand => ({ text: brand, value: brand })),
      types: types.map(type => ({ text: type, value: type })),
      titles: titles.map(title => ({ text: title, value: title }))
    };
  }, [data]);

  const columns: TableColumnsType<Product> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
      render: (id: number) => (
        <Typography.Text type="secondary">#{id}</Typography.Text>
      ),
    },
    {
      title: "產品標題",
      dataIndex: "title",
      key: "title",
      width: 200,
      ellipsis: true,
      filters: filterOptions.titles,
      onFilter: (value, record) => record.title === value,
      filterSearch: true,
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (title: string) => (
        <Typography.Text strong>{title}</Typography.Text>
      ),
    },
    {
      title: "品牌",
      dataIndex: "brand",
      key: "brand",
      width: 120,
      filters: filterOptions.brands,
      onFilter: (value, record) => record.brand === value,
      sorter: (a, b) => a.brand.localeCompare(b.brand),
      render: (brand: string) => (
        <Tag color="blue">{brand}</Tag>
      ),
    },
    {
      title: "類型",
      dataIndex: "type",
      key: "type",
      width: 120,
      filters: filterOptions.types,
      onFilter: (value, record) => record.type === value,
      sorter: (a, b) => a.type.localeCompare(b.type),
      render: (type: string) => (
        <Tag color="green">{type}</Tag>
      ),
    },
    {
      title: "價格",
      dataIndex: "price",
      key: "price",
      width: 100,
      align: 'right',
      sorter: (a, b) => a.price - b.price,
      render: (price: number) => (
        <Typography.Text strong style={{ color: '#f5222d' }}>
          ¥{typeof price === 'number' ? price.toFixed(2) : '0.00'}
        </Typography.Text>
      ),
    },
    {
      title: "規格",
      dataIndex: "specification",
      key: "specification",
      width: 150,
      ellipsis: true,
      render: (specification: string) => (
        <Typography.Text type="secondary">
          {specification || '-'}
        </Typography.Text>
      ),
    },
    {
      title: "日期",
      dataIndex: "date",
      key: "date",
      width: 120,
      sorter: (a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
      render: (date: string) => (
        <Typography.Text>
          {date ? dayjs(date).format('YYYY-MM-DD') : '-'}
        </Typography.Text>
      ),
    },
    {
      title: "備註",
      dataIndex: "remark",
      key: "remark",
      width: 150,
      ellipsis: true,
      render: (remark: string) => (
        <Typography.Text type="secondary">
          {remark || '-'}
        </Typography.Text>
      ),
    },
    {
      title: "創建時間",
      dataIndex: "created_at",
      key: "created_at",
      width: 150,
      sorter: (a, b) => dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf(),
      render: (created_at: string) => (
        <Typography.Text type="secondary">
          {created_at ? dayjs(created_at).format('YYYY-MM-DD HH:mm') : '-'}
        </Typography.Text>
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          {record.url && (
            <Button 
              type="text" 
              size="small"
              icon={<LinkOutlined />}
              onClick={() => window.open(record.url, '_blank', 'noopener,noreferrer')}
              title="訪問網站"
            />
          )}
          {onDelete && record.id && (
            <Popconfirm
              title="確認刪除"
              description="確定要刪除這個產品嗎？"
              onConfirm={() => onDelete(record.id!)}
              okText="確認"
              cancelText="取消"
            >
              <Button 
                type="text" 
                danger 
                size="small"
                icon={<DeleteOutlined />}
                title="刪除產品"
              />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Typography.Title level={3} style={{ marginBottom: 16 }}>
        產品列表 ({data.length} 項)
      </Typography.Title>
      <Table<Product>
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id?.toString() || record.url}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          responsive: true,
          showTotal: (total, range) => 
            `第 ${range[0]}-${range[1]} 項，共 ${total} 項`,
        }}
        scroll={{ x: 1200 }}
        size="middle"
        bordered={false}
      />
    </Space>
  );
};

export default ProductTable;

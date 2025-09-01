import React from "react";
import { Table, TableColumnsType, Typography, Tag, Space, theme } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import { Product } from "../types";

interface ProductTableProps {
  data?: Product[];
}

const ProductTable: React.FC<ProductTableProps> = ({ data = [] }) => {
  const { token } = theme.useToken();
  
  const columns: TableColumnsType<Product> = [
    {
      title: "網址",
      dataIndex: "url",
      key: "url",
      width: 200,
      ellipsis: true,
      render: (url: string) => (
        <Space>
          <LinkOutlined style={{ color: token.colorPrimary }} />
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: token.colorPrimary }}
          >
            {url}
          </a>
        </Space>
      ),
    },
    {
      title: "標題",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      render: (title: string) => (
        <Typography.Text strong>{title}</Typography.Text>
      ),
    },
    {
      title: "品牌",
      dataIndex: "brand",
      key: "brand",
      width: 120,
      render: (brand: string) => (
        <Tag color="blue">{brand}</Tag>
      ),
    },
    {
      title: "類型",
      dataIndex: "type",
      key: "type",
      width: 120,
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
      render: (price: number) => (
        <Typography.Text strong style={{ color: '#f5222d' }}>
          ¥{price?.toFixed(2) || '0.00'}
        </Typography.Text>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Typography.Title level={3} style={{ marginBottom: 16 }}>
        產品列表
      </Typography.Title>
      <Table<Product>
        columns={columns}
        dataSource={data}
        rowKey="url"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          responsive: true,
          showTotal: (total, range) => 
            `第 ${range[0]}-${range[1]} 項，共 ${total} 項`,
        }}
        scroll={{ x: 800 }}
        size="middle"
        bordered={false}
      />
    </Space>
  );
};

export default ProductTable;

import React from "react";
import { Table, TableColumnsType } from "antd";
import { Product } from "../types";

interface ProductTableProps {
  data?: Product[];
}

const ProductTable: React.FC<ProductTableProps> = ({ data = [] }) => {
  const columns: TableColumnsType<Product> = [
    {
      title: "網址",
      dataIndex: "url",
      key: "url",
      render: (url: string) => (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 truncate block max-w-xs"
        >
          {url}
        </a>
      ),
    },
    {
      title: "標題",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "品牌",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "類型",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "價格",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `¥${price?.toFixed(2) || '0.00'}`,
    },
  ];

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">產品列表</h3>
      <Table<Product>
        columns={columns}
        dataSource={data}
        rowKey="url"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default ProductTable;

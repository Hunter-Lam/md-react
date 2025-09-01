import React, { useState } from 'react';
import { Button, Checkbox, Space, Typography, Popover } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

export interface ColumnConfig {
  key: string;
  title: string;
  visible: boolean;
}

interface ColumnControllerProps {
  columns: ColumnConfig[];
  onColumnChange: (columns: ColumnConfig[]) => void;
}

const ColumnController: React.FC<ColumnControllerProps> = ({
  columns,
  onColumnChange,
}) => {
  const [open, setOpen] = useState(false);

  const handleColumnToggle = (key: string, checked: boolean) => {
    const updatedColumns = columns.map(col =>
      col.key === key ? { ...col, visible: checked } : col
    );
    onColumnChange(updatedColumns);
  };

  const content = (
    <div style={{ width: 200 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        {columns.map((column) => (
          <Checkbox
            key={column.key}
            checked={column.visible}
            onChange={(e) => handleColumnToggle(column.key, e.target.checked)}
          >
            {column.title}
          </Checkbox>
        ))}
      </Space>
    </div>
  );

  return (
    <Popover
      content={content}
      title="選擇顯示列"
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomLeft"
    >
      <Button icon={<SettingOutlined />} size="small">
        列設置
      </Button>
    </Popover>
  );
};

export default ColumnController;

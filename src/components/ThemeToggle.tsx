import React from 'react';
import { Button, Tooltip } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Tooltip title={isDarkMode ? '切換到淺色模式' : '切換到深色模式'}>
      <Button
        type="text"
        icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
        onClick={toggleTheme}
        size="large"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        {isDarkMode ? '淺色' : '深色'}
      </Button>
    </Tooltip>
  );
};

export default ThemeToggle;

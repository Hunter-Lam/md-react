import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Typography, Select, Space, Empty } from 'antd';
import { Product } from '../types';
import dayjs from 'dayjs';

interface PriceHistoryChartProps {
  data: Product[];
}

interface ChartDataPoint {
  date: string;
  price: number;
  title: string;
  brand: string;
}

const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ data }) => {
  const [selectedBrand, setSelectedBrand] = React.useState<string>('all');
  const [selectedType, setSelectedType] = React.useState<string>('all');

  // Get unique brands and types for filtering
  const brands = useMemo(() => {
    const uniqueBrands = Array.from(new Set(data.map(item => item.brand)));
    return uniqueBrands.sort();
  }, [data]);

  const types = useMemo(() => {
    const uniqueTypes = Array.from(new Set(data.map(item => item.type)));
    return uniqueTypes.sort();
  }, [data]);

  // Process data for chart
  const chartData = useMemo(() => {
    let filteredData = data;

    // Filter by brand
    if (selectedBrand !== 'all') {
      filteredData = filteredData.filter(item => item.brand === selectedBrand);
    }

    // Filter by type
    if (selectedType !== 'all') {
      filteredData = filteredData.filter(item => item.type === selectedType);
    }

    // Sort by date and format for chart
    const processedData: ChartDataPoint[] = filteredData
      .filter(item => item.date && item.price) // Only include items with valid date and price
      .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())
      .map(item => ({
        date: dayjs(item.date).format('YYYY-MM-DD'),
        price: Number(item.price),
        title: item.title,
        brand: item.brand,
      }));

    return processedData;
  }, [data, selectedBrand, selectedType]);

  // Calculate average price for the period
  const averagePrice = useMemo(() => {
    if (chartData.length === 0) return 0;
    const sum = chartData.reduce((acc, item) => acc + item.price, 0);
    return sum / chartData.length;
  }, [chartData]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '10px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{`日期: ${label}`}</p>
          <p style={{ margin: 0, color: '#1890ff' }}>{`價格: ¥${payload[0].value.toFixed(2)}`}</p>
          <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{`品牌: ${data.brand}`}</p>
          <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{`產品: ${data.title}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card title="價格歷史趨勢圖" variant="outlined">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* Filters */}
        <Space wrap>
          <Space>
            <Typography.Text>品牌:</Typography.Text>
            <Select
              value={selectedBrand}
              onChange={setSelectedBrand}
              style={{ width: 120 }}
              options={[
                { label: '全部', value: 'all' },
                ...brands.map(brand => ({ label: brand, value: brand }))
              ]}
            />
          </Space>
          <Space>
            <Typography.Text>類型:</Typography.Text>
            <Select
              value={selectedType}
              onChange={setSelectedType}
              style={{ width: 120 }}
              options={[
                { label: '全部', value: 'all' },
                ...types.map(type => ({ label: type, value: type }))
              ]}
            />
          </Space>
        </Space>

        {/* Statistics */}
        {chartData.length > 0 && (
          <Space wrap>
            <Typography.Text type="secondary">
              數據點數: {chartData.length}
            </Typography.Text>
            <Typography.Text type="secondary">
              平均價格: ¥{averagePrice.toFixed(2)}
            </Typography.Text>
            <Typography.Text type="secondary">
              最低價格: ¥{Math.min(...chartData.map(d => d.price)).toFixed(2)}
            </Typography.Text>
            <Typography.Text type="secondary">
              最高價格: ¥{Math.max(...chartData.map(d => d.price)).toFixed(2)}
            </Typography.Text>
          </Space>
        )}

        {/* Chart */}
        {chartData.length > 0 ? (
          <div style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) => dayjs(value).format('MM-DD')}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) => `¥${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#1890ff" 
                  strokeWidth={2}
                  dot={{ fill: '#1890ff', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#1890ff', strokeWidth: 2 }}
                  name="價格 (¥)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <Empty 
            description="暫無價格數據"
            style={{ padding: '60px 0' }}
          />
        )}
      </Space>
    </Card>
  );
};

export default PriceHistoryChart;

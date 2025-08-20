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
  [key: string]: any; // Allow dynamic product price keys
}

const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ data }) => {
  const [selectedBrand, setSelectedBrand] = React.useState<string>('all');
  const [selectedType, setSelectedType] = React.useState<string>('all');
  const [chartMode, setChartMode] = React.useState<'combined' | 'individual'>('combined');

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
  const { chartData, productLines } = useMemo(() => {
    let filteredData = data;

    // Filter by brand
    if (selectedBrand !== 'all') {
      filteredData = filteredData.filter(item => item.brand === selectedBrand);
    }

    // Filter by type
    if (selectedType !== 'all') {
      filteredData = filteredData.filter(item => item.type === selectedType);
    }

    if (chartMode === 'combined') {
      // Combined mode: all data points in one line
      const processedData: ChartDataPoint[] = filteredData
        .filter(item => item.date && item.price)
        .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())
        .map(item => ({
          date: dayjs(item.date).format('YYYY-MM-DD'),
          price: Number(item.price),
          title: item.title,
          brand: item.brand,
        }));

      return { chartData: processedData, productLines: [] };
    } else {
      // Individual mode: separate lines for each product
      const productGroups = filteredData
        .filter(item => item.date && item.price)
        .reduce((groups, item) => {
          const key = item.title;
          if (!groups[key]) {
            groups[key] = [];
          }
          groups[key].push(item);
          return groups;
        }, {} as Record<string, Product[]>);

      // Get all unique dates
      const allDates = Array.from(new Set(
        filteredData.map(item => dayjs(item.date).format('YYYY-MM-DD'))
      )).sort();

      // Create chart data with separate columns for each product
      const processedData: ChartDataPoint[] = allDates.map(date => {
        const dataPoint: ChartDataPoint = { date };
        
        Object.entries(productGroups).forEach(([productTitle, products]) => {
          const productOnDate = products.find(p => dayjs(p.date).format('YYYY-MM-DD') === date);
          if (productOnDate) {
            dataPoint[productTitle] = Number(productOnDate.price);
          }
        });

        return dataPoint;
      });

      const productLinesList = Object.keys(productGroups);
      return { chartData: processedData, productLines: productLinesList };
    }
  }, [data, selectedBrand, selectedType, chartMode]);

  // Calculate statistics
  const statistics = useMemo(() => {
    if (chartData.length === 0) return { count: 0, average: 0, min: 0, max: 0 };
    
    let allPrices: number[] = [];
    
    if (chartMode === 'combined') {
      allPrices = chartData.map(item => item.price).filter(price => price != null);
    } else {
      // For individual mode, collect all price values from all product lines
      chartData.forEach(item => {
        productLines.forEach(productLine => {
          if (item[productLine] != null) {
            allPrices.push(item[productLine]);
          }
        });
      });
    }
    
    if (allPrices.length === 0) return { count: 0, average: 0, min: 0, max: 0 };
    
    const sum = allPrices.reduce((acc, price) => acc + price, 0);
    return {
      count: allPrices.length,
      average: sum / allPrices.length,
      min: Math.min(...allPrices),
      max: Math.max(...allPrices)
    };
  }, [chartData, chartMode, productLines]);

  // Generate colors for different product lines
  const colors = ['#1890ff', '#52c41a', '#fa8c16', '#eb2f96', '#722ed1', '#13c2c2', '#faad14', '#f5222d'];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '10px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{`日期: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ margin: 0, color: entry.color }}>
              {`${entry.name}: ¥${entry.value?.toFixed(2) || 'N/A'}`}
            </p>
          ))}
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
          <Space>
            <Typography.Text>顯示模式:</Typography.Text>
            <Select
              value={chartMode}
              onChange={setChartMode}
              style={{ width: 120 }}
              options={[
                { label: '合併顯示', value: 'combined' },
                { label: '分別顯示', value: 'individual' }
              ]}
            />
          </Space>
        </Space>

        {/* Statistics */}
        {chartData.length > 0 && (
          <Space wrap>
            <Typography.Text type="secondary">
              數據點數: {statistics.count}
            </Typography.Text>
            <Typography.Text type="secondary">
              平均價格: ¥{statistics.average.toFixed(2)}
            </Typography.Text>
            <Typography.Text type="secondary">
              最低價格: ¥{statistics.min.toFixed(2)}
            </Typography.Text>
            <Typography.Text type="secondary">
              最高價格: ¥{statistics.max.toFixed(2)}
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
                {chartMode === 'combined' ? (
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#1890ff" 
                    strokeWidth={2}
                    dot={{ fill: '#1890ff', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#1890ff', strokeWidth: 2 }}
                    name="價格 (¥)"
                  />
                ) : (
                  productLines.map((productLine, index) => (
                    <Line 
                      key={productLine}
                      type="monotone" 
                      dataKey={productLine} 
                      stroke={colors[index % colors.length]} 
                      strokeWidth={2}
                      dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5, stroke: colors[index % colors.length], strokeWidth: 2 }}
                      name={productLine}
                      connectNulls={false}
                    />
                  ))
                )}
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

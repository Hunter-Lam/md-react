import React from "react";
import { InputNumber, Space, Typography, theme } from "antd";

const { Text } = Typography;

interface DiscountInputProps {
  format: string;
}

const DiscountInput: React.FC<DiscountInputProps> = ({ format }) => {
  const { token } = theme.useToken();
  
  const renderDiscountFormat = () => {
    switch (format) {
      case "折扣":
        return (
          <Space.Compact>
            <InputNumber 
              min={0} 
              max={10} 
              precision={1} 
              placeholder="折扣值" 
              addonAfter="折" 
            />
          </Space.Compact>
        );
      
      case "滿金額折":
        return (
          <Space.Compact size="small" wrap>
            <Text>滿</Text>
            <InputNumber 
              min={0}
              precision={0} 
              placeholder="金額" 
            />
            <Text>元</Text>
            <InputNumber 
              min={0}
              max={10} 
              precision={1} 
              placeholder="折扣" 
            />
            <Text>折</Text>
          </Space.Compact>
        );
      
      case "滿件折":
        return (
          <Space.Compact size="small" wrap>
            <Text>滿</Text>
            <InputNumber 
              min={0}
              precision={0} 
              placeholder="件數" 
            />
            <Text>件</Text>
            <InputNumber 
              min={0}
              max={10} 
              precision={1} 
              placeholder="折扣" 
            />
            <Text>折</Text>
          </Space.Compact>
        );
      
      case "每滿減":
        return (
          <Space.Compact size="small" wrap>
            <Text>每滿</Text>
            <InputNumber 
              min={0}
              precision={0} 
              placeholder="金額" 
            />
            <Text>元 減</Text>
            <InputNumber 
              min={0}
              precision={0} 
              placeholder="減額" 
            />
            <Text>元</Text>
          </Space.Compact>
        );
      
      case "滿減":
        return (
          <Space.Compact size="small" wrap>
            <Text>滿</Text>
            <InputNumber 
              min={0}
              precision={0} 
              placeholder="金額" 
            />
            <Text>元 減</Text>
            <InputNumber 
              min={0}
              precision={0} 
              placeholder="減額" 
            />
            <Text>元</Text>
          </Space.Compact>
        );
      
      case "首購":
      case "立減":
        return (
          <Space.Compact>
            <InputNumber 
              min={0}
              precision={0} 
              placeholder="金額" 
            />
            <Text>元</Text>
          </Space.Compact>
        );
      
      case "紅包":
        return (
          <Space.Compact>
            <InputNumber 
              min={0}
              placeholder="金額" 
            />
          </Space.Compact>
        );
      
      default:
        return null;
    }
  };

  return renderDiscountFormat();
};

export default DiscountInput;

import React from "react";
import { InputNumber, Space } from "antd";

interface DiscountInputProps {
  format: string;
}

const DiscountInput: React.FC<DiscountInputProps> = ({ format }) => {
  
  const renderDiscountFormat = () => {
    switch (format) {
      case "折扣":
        return (
          <Space.Compact size="small">
            <InputNumber 
              min={0} 
              max={10} 
              precision={1} 
              placeholder="折扣" 
              addonAfter="折" 
            />
          </Space.Compact>
        );
      
      case "滿金額折":
        return (
          <Space.Compact size="small">
            <InputNumber 
              min={0}
              precision={0} 
              placeholder="金額" 
              addonBefore="滿"
              addonAfter="元"
            />
            <InputNumber 
              min={0}
              max={10} 
              precision={1} 
              placeholder="折扣" 
              addonAfter="折"
            />
          </Space.Compact>
        );
      
      case "滿件折":
        return (
          <Space.Compact size="small">
            <InputNumber 
              min={0}
              precision={0} 
              placeholder="件數" 
              addonBefore="滿"
              addonAfter="件"
            />
            <InputNumber 
              min={0}
              max={10} 
              precision={1} 
              placeholder="折扣" 
              addonAfter="折"
            />
          </Space.Compact>
        );
      
      case "每滿減":
        return (
          <Space.Compact size="small">
            <InputNumber 
              min={0}
              precision={0} 
              placeholder="金額" 
              addonBefore="每滿"
              addonAfter="元"
            />
            <InputNumber 
              min={0}
              precision={0} 
              placeholder="減額" 
              addonBefore="減"
              addonAfter="元"
            />
          </Space.Compact>
        );
      
      case "滿減":
        return (
          <Space.Compact size="small">
            <InputNumber 
              min={0}
              precision={0} 
              placeholder="金額" 
              addonBefore="滿"
              addonAfter="元"
            />
            <InputNumber 
              min={0}
              precision={0} 
              placeholder="減額" 
              addonBefore="減"
              addonAfter="元"
            />
          </Space.Compact>
        );
      
      case "首購":
      case "立減":
      case "紅包":
        return (
          <Space.Compact size="small">
            <InputNumber 
              min={0}
              precision={0} 
              placeholder="金額" 
              addonAfter="元"
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

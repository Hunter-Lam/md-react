import React from "react";
import { InputNumber, Space } from "antd";

interface DiscountInputProps {
  format: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
}

const DiscountInput: React.FC<DiscountInputProps> = ({ format, value, onChange }) => {
  
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
              value={typeof value === 'number' ? value : undefined}
              onChange={(val) => onChange?.(val || 0)}
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
        // Parse value like "满800减65" into two parts
        let minAmount = 0;
        let reductionAmount = 0;
        if (typeof value === 'string' && value.includes('满') && value.includes('减')) {
          const match = value.match(/满(\d+)减(\d+)/);
          if (match) {
            minAmount = parseInt(match[1]);
            reductionAmount = parseInt(match[2]);
          }
        }
        
        return (
          <Space.Compact size="small">
            <InputNumber 
              min={0}
              precision={0} 
              placeholder="金額" 
              addonBefore="滿"
              addonAfter="元"
              value={minAmount || undefined}
              onChange={(val1) => {
                const newMinAmount = val1 || 0;
                const newValue = `满${newMinAmount}减${reductionAmount}`;
                onChange?.(newValue);
              }}
            />
            <InputNumber 
              min={0}
              precision={0} 
              placeholder="減額" 
              addonBefore="減"
              addonAfter="元"
              value={reductionAmount || undefined}
              onChange={(val2) => {
                const newReductionAmount = val2 || 0;
                const newValue = `满${minAmount}减${newReductionAmount}`;
                onChange?.(newValue);
              }}
            />
          </Space.Compact>
        );
      
      case "首購":
      case "立減":
        return (
          <Space.Compact size="small">
            <InputNumber 
              min={0}
              precision={0} 
              placeholder="金額" 
              addonAfter="元"
              value={typeof value === 'number' ? value : undefined}
              onChange={(val) => onChange?.(val || 0)}
            />
          </Space.Compact>
        );
      
      case "紅包":
        return (
          <Space.Compact size="small">
            <InputNumber 
              min={0}
              precision={2} 
              placeholder="金額" 
              addonAfter="元"
              value={typeof value === 'number' ? value : undefined}
              onChange={(val) => onChange?.(val || 0)}
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

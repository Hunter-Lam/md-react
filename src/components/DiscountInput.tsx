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
        // Parse value like "满3件9.5折" into two parts
        let minQuantity = 0;
        let discountRate = 0;
        if (typeof value === 'string' && value.includes('满') && value.includes('件') && value.includes('折')) {
          const match = value.match(/满(\d+)件([\d.]+)折/);
          if (match) {
            minQuantity = parseInt(match[1]);
            discountRate = parseFloat(match[2]);
          }
        }
        
        return (
          <Space.Compact size="small">
            <InputNumber 
              min={0}
              precision={0} 
              placeholder="件數" 
              addonBefore="滿"
              addonAfter="件"
              value={minQuantity || undefined}
              onChange={(val1) => {
                const newMinQuantity = val1 || 0;
                const newValue = `满${newMinQuantity}件${discountRate}折`;
                onChange?.(newValue);
              }}
            />
            <InputNumber 
              min={0}
              max={10} 
              precision={1} 
              placeholder="折扣" 
              addonAfter="折"
              value={discountRate || undefined}
              onChange={(val2) => {
                const newDiscountRate = val2 || 0;
                const newValue = `满${minQuantity}件${newDiscountRate}折`;
                onChange?.(newValue);
              }}
            />
          </Space.Compact>
        );
      
      case "每滿減":
        // Parse value like "每满1件减40" or "每满68减20" into two parts
        let everyQuantity = 0;
        let everyReduction = 0;
        let isAmountBased = false;
        
        if (typeof value === 'string' && value.includes('每满') && value.includes('减')) {
          // Check for amount-based pattern first (每满68减20)
          const amountMatch = value.match(/每满(\d+)减(\d+)/);
          if (amountMatch && !value.includes('件')) {
            everyQuantity = parseInt(amountMatch[1]);
            everyReduction = parseInt(amountMatch[2]);
            isAmountBased = true;
          } else {
            // Check for item-based pattern (每满1件减40)
            const itemMatch = value.match(/每满(\d+)件减(\d+)/);
            if (itemMatch) {
              everyQuantity = parseInt(itemMatch[1]);
              everyReduction = parseInt(itemMatch[2]);
              isAmountBased = false;
            }
          }
        }
        
        return (
          <Space.Compact size="small">
            <InputNumber 
              min={0}
              precision={0} 
              placeholder={isAmountBased ? "金額" : "件數"} 
              addonBefore="每滿"
              addonAfter={isAmountBased ? "元" : "件"}
              value={everyQuantity || undefined}
              onChange={(val1) => {
                const newEveryQuantity = val1 || 0;
                const newValue = isAmountBased 
                  ? `每满${newEveryQuantity}减${everyReduction}`
                  : `每满${newEveryQuantity}件减${everyReduction}`;
                onChange?.(newValue);
              }}
            />
            <InputNumber 
              min={0}
              precision={0} 
              placeholder="減額" 
              addonBefore="減"
              addonAfter="元"
              value={everyReduction || undefined}
              onChange={(val2) => {
                const newEveryReduction = val2 || 0;
                const newValue = isAmountBased 
                  ? `每满${everyQuantity}减${newEveryReduction}`
                  : `每满${everyQuantity}件减${newEveryReduction}`;
                onChange?.(newValue);
              }}
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
              precision={2} 
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

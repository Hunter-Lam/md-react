import React from "react";
import { InputNumber } from "antd";

interface DiscountInputProps {
  format: string;
}

const DiscountInput: React.FC<DiscountInputProps> = ({ format }) => {
  const renderDiscountFormat = () => {
    switch (format) {
      case "折扣":
        return (
          <div className="flex items-center gap-1">
            <InputNumber 
              style={{ width: "100%" }} 
              min={0} 
              max={10} 
              precision={1} 
              placeholder="折扣值" 
            />
            折
          </div>
        );
      
      case "滿金額折":
        return (
          <div className="flex items-center gap-1">
            滿
            <InputNumber 
              style={{ width: "100%" }} 
              min={0} 
              precision={0} 
              placeholder="金額" 
            />
            元
            <InputNumber 
              style={{ width: "100%" }} 
              min={0} 
              max={10} 
              precision={1} 
              placeholder="折扣" 
            />
            折
          </div>
        );
      
      case "滿件折":
        return (
          <div className="flex items-center gap-1">
            滿
            <InputNumber 
              style={{ width: "100%" }} 
              min={0} 
              precision={0} 
              placeholder="件數" 
            />
            件
            <InputNumber 
              style={{ width: "100%" }} 
              min={0} 
              max={10} 
              precision={1} 
              placeholder="折扣" 
            />
            折
          </div>
        );
      
      case "每滿減":
        return (
          <div className="flex items-center gap-1">
            每滿
            <InputNumber 
              style={{ width: "100%" }} 
              min={0} 
              precision={0} 
              placeholder="金額" 
            />
            元 減
            <InputNumber 
              style={{ width: "100%" }} 
              min={0} 
              precision={0} 
              placeholder="減額" 
            />
            元
          </div>
        );
      
      case "滿減":
        return (
          <div className="flex items-center gap-1">
            滿
            <InputNumber 
              style={{ width: "100%" }} 
              min={0} 
              precision={0} 
              placeholder="金額" 
            />
            元 減
            <InputNumber 
              style={{ width: "100%" }} 
              min={0} 
              precision={0} 
              placeholder="減額" 
            />
            元
          </div>
        );
      
      case "首購":
      case "立減":
        return (
          <div className="flex items-center gap-1">
            <InputNumber 
              style={{ width: "100%" }} 
              min={0} 
              precision={0} 
              placeholder="金額" 
            />
            元
          </div>
        );
      
      case "紅包":
        return (
          <div className="flex items-center gap-1">
            <InputNumber 
              style={{ width: "100%" }} 
              min={0} 
              placeholder="金額" 
            />
            元
          </div>
        );
      
      default:
        return null;
    }
  };

  return renderDiscountFormat();
};

export default DiscountInput;

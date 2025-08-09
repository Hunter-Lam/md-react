import React from "react";
import { Button, Form, Select } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { DISCOUNT_ORGANIZERS, DISCOUNT_METHODS } from "../constants";
import DiscountInput from "./DiscountInput";

interface DiscountSectionProps {
  form: any;
}

const DiscountSection: React.FC<DiscountSectionProps> = ({ form }) => {
  return (
    <Form.Item name="discount" label="優惠">
      <Form.List name="discount">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} className="flex items-baseline gap-1 mb-2">
                <Form.Item
                  {...restField}
                  name={[name, "discountOwner"]}
                  rules={[{ required: true, message: "請選擇優惠提供者" }]}
                >
                  <Select 
                    placeholder="優惠提供者" 
                    popupMatchSelectWidth={false} 
                    options={DISCOUNT_ORGANIZERS.map(v => ({ label: v, value: v }))}
                  />
                </Form.Item>
                
                <Form.Item
                  {...restField}
                  name={[name, "discountType"]}
                  rules={[{ required: true, message: "請選擇優惠類型" }]}
                >
                  <Select 
                    placeholder="優惠類型" 
                    popupMatchSelectWidth={false} 
                    options={DISCOUNT_METHODS.map(v => ({ label: v, value: v }))}
                  />
                </Form.Item>
                
                <Form.Item
                  {...restField}
                  name={[name, "discountValue"]}
                  rules={[{ required: true, message: "請輸入優惠值" }]}
                >
                  <DiscountInput 
                    format={form.getFieldValue(["discount", name, "discountType"])} 
                  />
                </Form.Item>
                
                <MinusCircleOutlined 
                  className="text-red-500 hover:text-red-700 cursor-pointer" 
                  onClick={() => remove(name)} 
                />
              </div>
            ))}
            
            <Form.Item noStyle>
              <Button 
                type="dashed" 
                onClick={() => add()} 
                block 
                icon={<PlusOutlined />}
                className="mt-2"
              >
                新增優惠
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form.Item>
  );
};

export default DiscountSection;

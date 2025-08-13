import React from "react";
import { Button, Form, Select, Space, theme } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { DISCOUNT_ORGANIZERS, DISCOUNT_METHODS } from "../constants";
import DiscountInput from "./DiscountInput";

interface DiscountSectionProps {
  form: any;
}

const DiscountSection: React.FC<DiscountSectionProps> = ({ form }) => {
  const { token } = theme.useToken();
  
  return (
    <Form.Item name="discount" label="優惠">
      <Form.List name="discount">
        {(fields, { add, remove }) => (
          <Space direction="vertical" style={{ width: '100%' }}>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} wrap style={{ marginBottom: 8, width: '100%' }}>
                <Form.Item
                  {...restField}
                  name={[name, "discountOwner"]}
                  rules={[{ required: true, message: "請選擇優惠提供者" }]}
                  style={{ marginBottom: 0, minWidth: 120 }}
                >
                  <Select 
                    placeholder="優惠提供者" 
                    popupMatchSelectWidth={false} 
                    options={DISCOUNT_ORGANIZERS.map(v => ({ label: v, value: v }))}
                    style={{ width: 120 }}
                  />
                </Form.Item>
                
                <Form.Item
                  {...restField}
                  name={[name, "discountType"]}
                  rules={[{ required: true, message: "請選擇優惠類型" }]}
                  style={{ marginBottom: 0, minWidth: 120 }}
                >
                  <Select 
                    placeholder="優惠類型" 
                    popupMatchSelectWidth={false} 
                    options={DISCOUNT_METHODS.map(v => ({ label: v, value: v }))}
                    style={{ width: 120 }}
                  />
                </Form.Item>
                
                <Form.Item
                  {...restField}
                  name={[name, "discountValue"]}
                  rules={[{ required: true, message: "請輸入優惠值" }]}
                  style={{ marginBottom: 0, minWidth: 200 }}
                >
                  <DiscountInput 
                    format={form.getFieldValue(["discount", name, "discountType"])} 
                  />
                </Form.Item>
                
                <MinusCircleOutlined 
                  style={{ 
                    color: token.colorError, 
                    cursor: 'pointer',
                    fontSize: 16,
                    padding: 4
                  }}
                  onClick={() => remove(name)} 
                />
              </Space>
            ))}
            
            <Button 
              type="dashed" 
              onClick={() => add()} 
              block 
              icon={<PlusOutlined />}
              style={{ marginTop: 8 }}
            >
              新增優惠
            </Button>
          </Space>
        )}
      </Form.List>
    </Form.Item>
  );
};

export default DiscountSection;

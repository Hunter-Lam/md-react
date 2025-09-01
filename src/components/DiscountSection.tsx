import React from "react";
import { Button, Form, Select, Space, Flex } from "antd";
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
          <Space direction="vertical" style={{ width: '100%' }}>
            {fields.map(({ key, name, ...restField }) => (
              <Flex key={key} align="baseline" gap="small" style={{ marginBottom: 8 }}>
                <Form.Item
                  {...restField}
                  name={[name, "discountOwner"]}
                  rules={[{ required: true, message: "請選擇優惠提供者" }]}
                  style={{ marginBottom: 0, flex: 1 }}
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
                  style={{ marginBottom: 0, flex: 1 }}
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
                  style={{ marginBottom: 0, flex: 2 }}
                >
                  <DiscountInput 
                    format={form.getFieldValue(["discount", name, "discountType"])} 
                  />
                </Form.Item>
                
                <MinusCircleOutlined 
                  style={{ 
                    color: '#ff4d4f', 
                    cursor: 'pointer',
                    fontSize: 16,
                    padding: 4
                  }}
                  onClick={() => remove(name)} 
                />
              </Flex>
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

import React from "react";
import { Button, Form, Input, Select, Space } from "antd";
import { SOURCES } from "../constants";
import { parseUrl } from "../utils/urlParser";

interface SourceInputProps {
  form: any;
  onSourceTypeChange: (rule: any[]) => void;
}

const SourceInput: React.FC<SourceInputProps> = ({ form, onSourceTypeChange }) => {
  const handleParseUrl = () => {
    const value = form.getFieldValue(["source", "address"]);
    if (!value) return;
    
    const parsedUrl = parseUrl(value);
    form.setFieldValue(["source", "address"], parsedUrl);
  };

  return (
    <Form.Item label="產品來源">
      <Form.List name="source">
        {() => (
          <Space.Compact style={{ width: '100%' }}>
            <Form.Item noStyle name="type" initialValue={SOURCES[0]}>
              <Select 
                style={{ width: 120 }}
                options={SOURCES.map(v => ({ label: v, value: v }))} 
                popupMatchSelectWidth={false}
                onChange={(value: string) => {
                  const rule = value === SOURCES[0] 
                    ? [{ type: "url" }] 
                    : [{ type: "string" }];
                  onSourceTypeChange(rule);
                }}
              />
            </Form.Item>
            <Form.Item noStyle name="address">
              <Input placeholder="輸入連結或地址" style={{ flex: 1 }} />
            </Form.Item>
            <Form.Item noStyle>
              <Button type="primary" onClick={handleParseUrl}>
                解析
              </Button>
            </Form.Item>
          </Space.Compact>
        )}
      </Form.List>
    </Form.Item>
  );
};

export default SourceInput;

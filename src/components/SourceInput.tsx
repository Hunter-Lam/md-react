import React from "react";
import { Button, Form, Input, Select } from "antd";
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
          <div className="flex items-center gap-1">
            <Form.Item noStyle name="type" initialValue={SOURCES[0]}>
              <Select 
                className="flex-1" 
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
              <Input placeholder="輸入連結或地址" />
            </Form.Item>
            <Form.Item noStyle>
              <Button className="ml-3" type="primary" onClick={handleParseUrl}>
                解析
              </Button>
            </Form.Item>
          </div>
        )}
      </Form.List>
    </Form.Item>
  );
};

export default SourceInput;

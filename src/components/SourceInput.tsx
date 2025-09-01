import React, { useState } from "react";
import { Button, Form, Input, Select, message } from "antd";
import { SOURCES } from "../constants";
import { formatUrl } from "../utils/urlFormatter";
import { fetchJDProductInfo } from "../utils/urlParser";

interface SourceInputProps {
  form: any;
  onSourceTypeChange: (rule: any[]) => void;
}

const SourceInput: React.FC<SourceInputProps> = ({ form, onSourceTypeChange }) => {
  const [loading, setLoading] = useState(false);

  const isUrl = (value: string) => /^https?:\/\/|www\.|\.com|\.cn/.test(value);

  const autoCopyUrl = async (value: string) => {
    if (!value?.trim() || !isUrl(value)) return;
    
    try {
      const formattedUrl = formatUrl(value);
      
      // Only copy if we have a valid formatted URL
      if (formattedUrl && formattedUrl.trim()) {
        await navigator.clipboard.writeText(formattedUrl);
        form.setFieldValue(["source", "address"], formattedUrl);
        
        if (formattedUrl !== value) {
          message.success("URL 已自動格式化並複製");
        } else {
          message.success("URL 已複製到剪貼板");
        }
      }
    } catch (error) {
      console.log("Auto-copy failed:", error);
    }
  };

  const handleParseUrl = async () => {
    const value = form.getFieldValue(["source", "address"]);
    if (!value) return;
    
    setLoading(true);
    
    try {
      const formattedUrl = formatUrl(value);
      form.setFieldValue(["source", "address"], formattedUrl);
      
      if (formattedUrl.includes("item.jd.com")) {
        message.loading("正在獲取產品信息...");
        
        const productInfo = await fetchJDProductInfo(formattedUrl);
        
        if (productInfo) {
          form.setFieldsValue({
            title: productInfo.title,
            brand: productInfo.brand,
            price: productInfo.price,
          });
          message.success("產品信息獲取成功！");
        } else {
          message.warning("無法獲取產品信息，請手動填寫");
        }
      } else {
        message.info("URL 已清理，請手動填寫產品信息");
      }
    } catch (error) {
      message.error("解析 URL 時發生錯誤");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form.Item label="產品來源">
      <Input.Group compact>
        <Form.Item noStyle name={["source", "type"]} initialValue={SOURCES[0]}>
          <Select 
            style={{ width: 120 }}
            options={SOURCES.map(v => ({ label: v, value: v }))}
            onChange={(value: string) => {
              const rule = value === SOURCES[0] ? [{ type: "url" }] : [{ type: "string" }];
              onSourceTypeChange(rule);
            }}
          />
        </Form.Item>
        <Form.Item noStyle name={["source", "address"]}>
          <Input 
            placeholder="輸入連結或地址" 
            style={{ width: 'calc(100% - 180px)' }}
            onBlur={(e) => autoCopyUrl(e.target.value)}
          />
        </Form.Item>
        <Button 
          type="primary" 
          onClick={handleParseUrl}
          loading={loading}
          style={{ width: 60 }}
        >
          解析
        </Button>
      </Input.Group>
    </Form.Item>
  );
};

export default SourceInput;

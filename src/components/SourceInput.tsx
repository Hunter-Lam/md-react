import React, { useState } from "react";
import { Button, Form, Input, Select, Space, message } from "antd";
import { SOURCES } from "../constants";
import { formatUrl } from "../utils/urlFormatter";
import { fetchJDProductInfo } from "../utils/urlParser";

interface SourceInputProps {
  form: any;
  onSourceTypeChange: (rule: any[]) => void;
}

const SourceInput: React.FC<SourceInputProps> = ({ form, onSourceTypeChange }) => {
  const [loading, setLoading] = useState(false);

  const handleParseUrl = async () => {
    const value = form.getFieldValue(["source", "address"]);
    if (!value) return;
    
    setLoading(true);
    
    try {
      // First clean the URL
      const formattedUrl = formatUrl(value);
      form.setFieldValue(["source", "address"], formattedUrl);
      
      // Check if it's a JD URL and fetch product info
      if (formattedUrl.includes("item.jd.com")) {
        message.loading({ content: "正在獲取產品信息...", key: "fetchProduct" });
        
        const productInfo = await fetchJDProductInfo(parsedUrl);
        
        if (productInfo) {
          // Auto-fill form fields with fetched product information
          form.setFieldsValue({
            title: productInfo.title,
            brand: productInfo.brand,
            price: productInfo.price,
          });
          
          message.success({ 
            content: "產品信息獲取成功！", 
            key: "fetchProduct",
            duration: 2 
          });
        } else {
          message.warning({ 
            content: "無法獲取產品信息，請手動填寫", 
            key: "fetchProduct",
            duration: 3 
          });
        }
      } else {
        message.info("URL 已清理，請手動填寫產品信息");
      }
    } catch (error) {
      console.error("Error parsing URL:", error);
      message.error({ 
        content: "解析 URL 時發生錯誤", 
        key: "fetchProduct",
        duration: 3 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form.Item label="產品來源">
      <Space.Compact style={{ width: '100%' }}>
        <Form.Item noStyle name={["source", "type"]} initialValue={SOURCES[0]}>
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
        <Form.Item noStyle name={["source", "address"]}>
          <Input placeholder="輸入連結或地址" style={{ flex: 1 }} />
        </Form.Item>
        <Form.Item noStyle>
          <Button 
            type="primary" 
            onClick={handleParseUrl}
            loading={loading}
          >
            解析
          </Button>
        </Form.Item>
      </Space.Compact>
    </Form.Item>
  );
};

export default SourceInput;

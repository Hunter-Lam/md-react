import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, FormProps, Input, InputNumber, Select, Row, Col, Card, Space, Typography, ConfigProvider, theme } from "antd";
import dayjs from "dayjs";
import { FormData, Product } from "./types";
import { CATEGORIES } from "./constants";
import { SourceInput, DiscountSection, ProductTable, ThemeToggle } from "./components";
import { useTheme } from "./contexts/ThemeContext";

const App: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [sourceTypeRule, setSourceTypeRule] = useState<any[]>([{ type: "url" }]);
  const [products, setProducts] = useState<Product[]>([]);

  const onFinish: FormProps<FormData>["onFinish"] = (values) => {
    console.log("表單提交成功:", values);
    
    // 將表單數據轉換為產品並添加到列表
    const newProduct: Product = {
      url: values.source?.address || "",
      title: values.title || "",
      brand: values.brand || "",
      type: values.type || "",
      price: values.price || 0,
    };
    
    setProducts(prev => [...prev, newProduct]);
    form.resetFields();
  };

  const onFinishFailed: FormProps<FormData>["onFinishFailed"] = (errorInfo) => {
    console.log("表單提交失敗:", errorInfo);
  };

  const handleSourceTypeChange = (rule: any[]) => {
    setSourceTypeRule(rule);
  };

  useEffect(() => {
    form.validateFields([["source", "address"]]);
  }, [sourceTypeRule, form]);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
        },
      }}
    >
      <div className="app-container" style={{ 
        minHeight: '100vh', 
        padding: '24px 0'
      }}>
        <div className="container">
          <Row justify="center">
            <Col xs={24} sm={24} md={24} lg={24} xl={20} xxl={18}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 32 }}>
              <Col>
                <Typography.Title 
                  level={1} 
                  style={{ 
                    margin: 0
                  }}
                >
                  產品管理系統
                </Typography.Title>
              </Col>
              <Col>
                <ThemeToggle />
              </Col>
            </Row>
            
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card 
                title="新增產品" 
                variant="outlined"
              >
                <Form
                  form={form}
                  name="productForm"
                  layout="vertical"
                  initialValues={{ 
                    remember: true,
                    date: dayjs()
                  }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                  size="large"
                >
              <SourceInput 
                form={form} 
                onSourceTypeChange={handleSourceTypeChange} 
              />

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="title"
                    label="產品標題"
                    rules={[{ required: true, message: "請輸入產品標題" }]}
                  >
                    <Input placeholder="請輸入產品標題" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="brand"
                    label="品牌"
                    rules={[{ required: true, message: "請輸入品牌" }]}
                  >
                    <Input placeholder="請輸入品牌" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="type"
                    label="產品類型"
                    rules={[{ required: true, message: "請選擇產品類型" }]}
                  >
                    <Select
                      placeholder="請選擇產品類型"
                      options={CATEGORIES.map(v => ({ label: v, value: v }))}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="price"
                    label="價格"
                    rules={[{ required: true, message: "請輸入價格" }]}
                  >
                    <Space.Compact style={{ width: '100%' }}>
                      <InputNumber
                        style={{ width: "100%" }}
                        step="0.01"
                        stringMode
                        precision={2}
                        placeholder="0.00"
                        min={0}
                      />
                      <Input
                        style={{ width: 60 }}
                        value="元"
                        disabled
                      />
                    </Space.Compact>
                  </Form.Item>
                </Col>
              </Row>

              <DiscountSection form={form} />

              <Form.Item
                name="specification"
                label="產品規格"
              >
                <Input.TextArea 
                  rows={3} 
                  placeholder="請輸入產品規格說明" 
                  autoSize
                />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="date"
                    label="日期"
                    initialValue={dayjs()}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="remark"
                label="備註"
              >
                <Input.TextArea 
                  rows={3} 
                  placeholder="請輸入備註" 
                  autoSize
                />
              </Form.Item>

              <Form.Item>
                <Space size="middle" wrap>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    size="large"
                  >
                    提交
                  </Button>
                  <Button 
                    onClick={() => form.resetFields()}
                    size="large"
                  >
                    清空
                  </Button>
                </Space>
              </Form.Item>
                </Form>
              </Card>

              <Card 
                variant="outlined"
              >
                <ProductTable data={products} />
              </Card>
            </Space>
            </Col>
          </Row>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default App;

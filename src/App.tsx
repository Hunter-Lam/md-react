import React, { useCallback, useEffect, useState } from "react";
import { Button, DatePicker, Form, FormProps, Input, InputNumber, Select, Row, Col, Card, Space, Typography, ConfigProvider, theme, message } from "antd";
import dayjs from "dayjs";
import { invoke } from "@tauri-apps/api/core";
import { mockTauriApi, isTauriEnvironment } from "./utils/mockTauri";
import type { FormData, Product, ProductInput } from "./types";
import { CATEGORIES } from "./constants";
import { SourceInput, DiscountSection, DiscountParser, ProductTable, ColumnController, ThemeToggle, PriceHistoryChart } from "./components";
import type { ColumnConfig } from "./components/ColumnController";
import { useTheme } from "./contexts/ThemeContext";

const App: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [form] = Form.useForm();
  const [sourceTypeRule, setSourceTypeRule] = useState<Array<{ type: string }>>([{ type: "url" }]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Column visibility configuration
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>([
    { key: "id", title: "ID", visible: true },
    { key: "title", title: "產品標題", visible: true },
    { key: "brand", title: "品牌", visible: true },
    { key: "type", title: "類型", visible: true },
    { key: "price", title: "價格", visible: true },
    { key: "specification", title: "規格", visible: true },
    { key: "date", title: "日期", visible: true },
    { key: "remark", title: "備註", visible: true },
    { key: "created_at", title: "創建時間", visible: true },
    { key: "action", title: "操作", visible: true },
  ]);

  const loadProducts = useCallback(async () => {
    try {
      const isTauri = isTauriEnvironment();
      console.log("Environment detection:", {
        isTauri,
        hasWindow: typeof window !== 'undefined',
        hasTauriObject: typeof window !== 'undefined' && !!(window as any).__TAURI__,
        hasTauriInternals: typeof window !== 'undefined' && !!(window as any).__TAURI_INTERNALS__,
        hasTauriMetadata: typeof window !== 'undefined' && !!(window as any).__TAURI_METADATA__,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'
      });      
      const api = isTauri ? { invoke } : mockTauriApi;
      const result = await api.invoke<Product[]>("get_products");
      setProducts(result);
      
      console.log("Loaded products count:", result.length);
    } catch (error) {
      console.error("Failed to load products:", error);
      message.error("加載產品失敗");
    }
  }, []);

  // Load products from database on component mount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const onFinish: FormProps<FormData>["onFinish"] = async (values) => {
    console.log("表單提交成功:", values);
    setLoading(true);
    
    try {
      // Prepare product data for saving
      const productInput: ProductInput = {
        url: values.source?.address || "",
        title: values.title || "",
        brand: values.brand || "",
        type: values.type || "",
        price: values.price || 0,
        specification: values.specification || "",
        date: values.date ? dayjs(values.date).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
        remark: values.remark || "",
      };
      
      // Save to database via Tauri or mock
      const api = isTauriEnvironment() ? { invoke } : mockTauriApi;
      const savedProduct = await api.invoke<Product>("save_product", { product: productInput });
      
      // Update local state
      setProducts(prev => [savedProduct, ...prev]);
      
      // Reset form
      form.resetFields();
      form.setFieldValue("date", dayjs());
      
      message.success("產品保存成功！");
    } catch (error) {
      console.error("Failed to save product:", error);
      message.error("保存產品失敗");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed: FormProps<FormData>["onFinishFailed"] = (errorInfo) => {
    console.log("表單提交失敗:", errorInfo);
  };

  const handleSourceTypeChange = useCallback((rule: Array<{ type: string }>) => {
    setSourceTypeRule(rule);
  }, []);

  const handleDeleteProduct = useCallback(async (id: number) => {
    try {
      const api = isTauriEnvironment() ? { invoke } : mockTauriApi;
      await api.invoke("delete_product", { id });
      setProducts(prev => prev.filter(p => p.id !== id));
      message.success("產品刪除成功！");
    } catch (error) {
      console.error("Failed to delete product:", error);
      message.error("刪除產品失敗");
    }
  }, []);

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
                    name="date"
                    label="日期"
                    initialValue={dayjs()}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                      name="originalPrice"
                      label="原價"
                  >
                    <InputNumber
                        style={{ width: "100%" }}
                        step="0.01"
                        precision={2}
                        placeholder="0.00"
                        min={0}
                        addonAfter="元"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="price"
                    label="最終價格"
                    rules={[{ required: true, message: "請輸入最終價格" }]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      step="0.01"
                      precision={2}
                      placeholder="0.00"
                      min={0}
                      addonAfter="元"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <DiscountParser form={form} />

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
                    loading={loading}
                  >
                    提交
                  </Button>
                  <Button 
                    onClick={() => {
                      form.resetFields();
                      form.setFieldValue("date", dayjs());
                    }}
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
                <ProductTable 
                  data={products} 
                  onDelete={handleDeleteProduct}
                  visibleColumns={columnConfig}
                  columnController={
                    <ColumnController
                      columns={columnConfig}
                      onColumnChange={setColumnConfig}
                    />
                  }
                />
              </Card>

              <PriceHistoryChart data={products} />
            </Space>
            </Col>
          </Row>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default App;

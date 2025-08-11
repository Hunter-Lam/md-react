import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, FormProps, Input, InputNumber, Select } from "antd";
import dayjs from "dayjs";
import { FormData, Product } from "./types";
import { CATEGORIES } from "./constants";
import { SourceInput, DiscountSection, ProductTable } from "./components";

const App: React.FC = () => {
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            產品管理系統
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">新增產品</h2>
            
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
              className="space-y-4"
            >
              <SourceInput 
                form={form} 
                onSourceTypeChange={handleSourceTypeChange} 
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="title"
                  label="產品標題"
                  rules={[{ required: true, message: "請輸入產品標題" }]}
                >
                  <Input placeholder="請輸入產品標題" />
                </Form.Item>

                <Form.Item
                  name="brand"
                  label="品牌"
                  rules={[{ required: true, message: "請輸入品牌" }]}
                >
                  <Input placeholder="請輸入品牌" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <Form.Item
                  name="price"
                  label="價格"
                  rules={[{ required: true, message: "請輸入價格" }]}
                >
                  <div className="flex items-center gap-2">
                    <InputNumber
                      style={{ width: "100%" }}
                      step="0.01"
                      stringMode
                      precision={2}
                      placeholder="0.00"
                      min={0}
                    />
                    <span className="text-gray-500">元</span>
                  </div>
                </Form.Item>
              </div>

              <DiscountSection form={form} />

              <Form.Item
                name="specification"
                label="產品規格"
              >
                <Input.TextArea 
                  rows={3} 
                  placeholder="請輸入產品規格說明" 
                />
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="date"
                  label="日期"
                  initialValue={dayjs()}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                  name="remark"
                  label="備註"
                >
                  <Input.TextArea 
                    rows={3} 
                    placeholder="請輸入備註" 
                  />
                </Form.Item>
              </div>

              <Form.Item className="mb-0">
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    size="large"
                    className="w-full sm:w-auto px-8"
                  >
                    提交
                  </Button>
                  <Button 
                    onClick={() => form.resetFields()}
                    size="large"
                    className="w-full sm:w-auto px-8"
                  >
                    清空
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <ProductTable data={products} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

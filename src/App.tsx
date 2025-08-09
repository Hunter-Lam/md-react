import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Button, DatePicker, Form, FormProps, Input, InputNumber, Select, Table, TableColumnsType } from "antd";
import type { Rule } from "antd/es/form";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

interface DataType {
  url: string;
  title: string;
  brand: string;
  type: string;
  price: number;
}

const columns: TableColumnsType<DataType> = [{
  title: "Url", dataIndex: "url",
}, {
  title: "Title", dataIndex: "title",
}, {
  title: "Brand", dataIndex: "brand",
}, {
  title: "Type", dataIndex: "type",
}, {
  title: "Price", dataIndex: "price",
},];

const App: React.FC = () => {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", {name}));
  }

  const [form] = Form.useForm();

  type FieldType = {
    url?: string; title?: string; brand?: string; type?: string; price?: number;
  };

  const sources = ["URL", "商鋪",];

  const categories = ["醫用", "藥用", "數碼", "家電", "電器", "家俱", "廚用", "衞浴", "家紡", "衣物", "藥材", "水果", "零食", "飲品", "五金", "糧食",];

  const discountOrganizers = ["平台", "店舖", "支付",];

  const discountMethods = ["折扣", "滿金額折", "滿件折", "每滿減", "滿減", "首購", "立減",];

  const watchSourceType = Form.useWatch((["source", "type"]), form);

  const [sourceTypeRule, setSourceTypeRule] = useState<Rule[]>([{type: "url"}]);

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const parseUrl = () => {
    const value = form.getFieldValue(["source", "address"]);
    console.debug(value);
    if (!value) {
      return;
    }
    // format url to extract data
    const url = URL.parse(value);
    console.debug(url);
    if (!url) {
      console.error("Invalid URL");
      return;
    }
    // https://detail.tmall.com/item.htm?id=807978649708&spm=a1z0d.6639537/202410.item.d807978649708.b6c974840xbLjp&from=cart&skuId=5660286183077
    // https://item.jd.com/100057375320.html
    const searchParams = url.searchParams;
    console.debug(searchParams);
    if (searchParams.size === 0) {
      return;
    }
    if (url.host === "detail.tmall.com" || url.host === "item.taobao.com") {
      const keysToDelete = Array.from(searchParams.keys() ?? []).filter(k => k !== "id" && k !== "skuId");
      keysToDelete.forEach(key => searchParams.delete(key));
      form.setFieldValue(["source", "address"], url.toString());
      console.debug(url.toString());
    }
  };

  const getDiscountFormat = (format: string) => {
    console.debug(format);
    switch (format) {
      case "折扣":
        return <div className="flex items-center gap-1">
          <InputNumber style={{width: "100%"}} min={0} max={10} precision={1} placeholder="Discount Value"/>折
        </div>;
      case "滿金額折":
        return <div className="flex items-center gap-1">
          滿
          <InputNumber style={{width: "100%"}} min={0} precision={0} placeholder="Discount Value"/>
          元
          <InputNumber style={{width: "100%"}} min={0} max={10} precision={1} placeholder="Discount Value"/>
          折
        </div>;
      case "滿件折":
        return <div className="flex items-center gap-1">
          <span>滿</span>
          <span><InputNumber style={{width: "100%"}} min={0} precision={0} placeholder="Discount Value"/></span>
          <span>件</span>
          <span><InputNumber style={{width: "100%"}} min={0} max={10} precision={1} placeholder="Discount Value"/></span>
          <span>折</span>
        </div>;
      case "每滿減":
        return <div className="flex items-center gap-1">
          <span>每滿</span>
          <span><InputNumber style={{width: "100%"}} min={0} precision={0} placeholder="Discount Value"/></span>
          <span>元 減</span>
          <span><InputNumber style={{width: "100%"}} min={0} precision={0} placeholder="Discount Value"/></span>
          <span>元</span>
        </div>;
      case "滿減":
        return <div className="flex items-center gap-1">
          <span>滿</span>
          <span><InputNumber style={{width: "100%"}} min={0} precision={0} placeholder="Discount Value"/></span>
          <span>元 減</span>
          <span><InputNumber style={{width: "100%"}} min={0} precision={0} placeholder="Discount Value"/></span>
          <span>元</span>
        </div>;
      case "首購":
        return <div className="flex items-center gap-1">
          <InputNumber style={{width: "100%"}} min={0} precision={0} placeholder="Discount Value"/>元
        </div>;
      case "立減":
        return <div className="flex items-center gap-1">
          <InputNumber style={{width: "100%"}} min={0} precision={0} placeholder="Discount Value"/>元
        </div>;
      case "紅包":
        return <div className="flex items-center gap-1">
          <InputNumber style={{width: "100%"}} min={0} placeholder="Discount Value"/>元
        </div>;

    }
    // 滿<InputNumber style={{width: '100%'}} min={0} precision={0} placeholder="Discount Value"/>元
    // <InputNumber style={{width: '100%'}} min={0} max={10} precision={1} placeholder="Discount Value"/>折
    //
    // 滿<InputNumber style={{width: '100%'}} min={0} precision={0} placeholder="Discount Value"/>件
    // <InputNumber style={{width: '100%'}} min={0} max={10} precision={1} placeholder="Discount Value"/>折
    //
    // 每滿<InputNumber style={{width: '100%'}} min={0} precision={0} placeholder="Discount Value"/>元
    // 減<InputNumber style={{width: '100%'}} min={0} precision={0} placeholder="Discount Value"/>元
    //
    // 滿<InputNumber style={{width: '100%'}} min={0} precision={0} placeholder="Discount Value"/>元
    // 減<InputNumber style={{width: '100%'}} min={0} precision={0} placeholder="Discount Value"/>元
    //
    // 減<InputNumber style={{width: '100%'}} min={0} precision={0} placeholder="Discount Value"/>元
    //
    // 減<InputNumber style={{width: '100%'}} min={0} placeholder="Discount Value"/>元
    //   *.9
    //       滿200元9折
    //       滿2件9折
    //       每滿200元10元
    //       滿200元10元
    //       首購-5
    //       -5
  };

  useEffect(() => {
    form.validateFields([["source", "address"]]);
  }, [watchSourceType, form]);

  return (<main className="container">
    <Form
      form={form}
      name="basic"
      labelCol={{span: 8}}
      wrapperCol={{span: 16}}
      initialValues={{remember: true}}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Source"
      >
        <Form.List name="source">
          {() => {
            return (<div className="flex items-center gap-1">
              <Form.Item noStyle name="type" initialValue={sources[0]}>
                <Select className="flex-1" options={sources.map(v => ({label: v, value: v}))} popupMatchSelectWidth={false}
                        onChange={(value: string) => {
                          value === sources[0] ? setSourceTypeRule([{type: "url"}]) : setSourceTypeRule([{type: "string"}]);
                        }}/>
              </Form.Item>
              <Form.Item noStyle name="address" rules={sourceTypeRule}>
                <Input placeholder="Input link or addrdess"/>
              </Form.Item>
              <Form.Item noStyle>
                <Button className="ml-3" type="primary" onClick={parseUrl}>
                  Parse
                </Button>
              </Form.Item>
            </div>);
          }}
        </Form.List>
      </Form.Item>
      <Form.Item
        name="title"
        label="Title"
      >
        <Input/>
      </Form.Item>
      <Form.Item
        name="brand"
        label="Brand"
      >
        <Input/>
      </Form.Item>
      <Form.Item
        name="type"
        label="Type"
      >
        <Select
          options={categories
            .map(v => ({label: v, value: v}))}
        />
      </Form.Item>
      <Form.Item
        name="price"
        label="Price"
      >
        <div className="flex items-center gap-2">
          <InputNumber<number>
            style={{width: "100%"}}
            step="0.01"
            stringMode
            precision={2}
          />
          元
        </div>
      </Form.Item>
      <Form.Item
        name="discount"
        label="Discount"
      >
        <Form.List name="discount">
          {(fields, {add, remove}) => (<>
            {fields.map(({key, name, ...restField}) => (<div key={key} className="flex items-baseline gap-1">
              <Form.Item
                {...restField}
                name={[name, "discountOwner"]}
                rules={[{required: true, message: "Missing discount owner"}]}
              >
                <Select className="" placeholder="Discount Owner" popupMatchSelectWidth={false} options={discountOrganizers.map(v => ({label: v, value: v}))}/>
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, "discountType"]}
                rules={[{required: true, message: "Missing discount type"}]}
              >
                <Select placeholder="Discount Type" popupMatchSelectWidth={false} options={discountMethods.map(v => ({label: v, value: v}))}/>
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, "discountValue"]}
                rules={[{required: true, message: "Missing discount value"}]}
              >
                {getDiscountFormat(form.getFieldValue(["discount", name, "discountType"]))}
              </Form.Item>
              <MinusCircleOutlined onClick={() => remove(name)}/>
            </div>))}
            <Form.Item noStyle>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                Add field
              </Button>
            </Form.Item>
          </>)}
        </Form.List>
      </Form.Item>
      <Form.Item
        name="specification"
        label="Specification"
      >
        <Input.TextArea/>
      </Form.Item>
      <Form.Item
        name="date"
        label="Date"
        initialValue={dayjs()}
      >
        <DatePicker/>
      </Form.Item>
      <Form.Item
        name="remark"
        label="Remark"
      >
        <Input.TextArea/>
      </Form.Item>
      <Form.Item label={null}>
        <div className="flex items-center gap-1">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button onClick={() => form.resetFields()}>
            Clear
          </Button>
        </div>
      </Form.Item>
    </Form>
    <Table<DataType>
      columns={columns}
    />
  </main>);
};

export default App;

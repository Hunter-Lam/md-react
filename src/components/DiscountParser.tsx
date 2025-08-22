import React, { useState } from "react";
import { Button, Input, Space, Typography, Card, message, Divider } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";
import type { DiscountItem } from "../types";

interface DiscountParserProps {
  form: FormInstance;
  onParsedDiscounts?: (discounts: DiscountItem[]) => void;
}

interface ParsedDiscount {
  finalPrice: number;
  originalPrice: number;
  discounts: DiscountItem[];
  soldCount?: string;
  endTime?: string;
}

const DiscountParser: React.FC<DiscountParserProps> = ({ form, onParsedDiscounts }) => {
  const [inputText, setInputText] = useState("");
  const [parsedResults, setParsedResults] = useState<ParsedDiscount[]>([]);

  const parseDiscountText = (text: string): ParsedDiscount[] => {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    const results: ParsedDiscount[] = [];
      let finalPrice = 0;
      let originalPrice = 0;
      const discounts: DiscountItem[] = [];
      let soldCount = "";
      let endTime = "";

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Parse final price (券後價格 or 到手價)
        if (line === "券後" || line === "券后" || line === "到手價" || line === "到手价") {
          const nextLine = lines[i + 1];
          if (nextLine === "¥" && lines[i + 2]) {
            finalPrice = parseFloat(lines[i + 2]) || 0;
          } else if (nextLine && nextLine.startsWith("¥")) {
            finalPrice = parseFloat(nextLine.substring(1)) || 0;
          }
        }
        
        // Parse original price (優惠前 or 京東價)
        if (line === "優惠前" || line === "优惠前" || line === "京東價" || line === "京东价") {
          const nextLine = lines[i + 1];
          if (nextLine === "¥" && lines[i + 2]) {
            originalPrice = parseFloat(lines[i + 2]) || 0;
          } else if (nextLine && nextLine.startsWith("¥")) {
            originalPrice = parseFloat(nextLine.substring(1)) || 0;
          }
        }
        
        // Parse direct price format (¥2799.2, ¥189)
        if (line.startsWith("¥") && !isNaN(parseFloat(line.substring(1)))) {
          const price = parseFloat(line.substring(1));
          // Check if next line indicates this is original price
          const nextLine = lines[i + 1];
          if (nextLine && (nextLine.includes("京东价") || nextLine.includes("京東價") || nextLine.includes("优惠前") || nextLine.includes("優惠前"))) {
            originalPrice = price;
          } else if (finalPrice === 0) {
            finalPrice = price;
          } else if (originalPrice === 0 && price > finalPrice) {
            originalPrice = price;
          }
        }
        
        // Parse sold count
        if (line.includes("已售")) {
          soldCount = line;
        }
        
        // Parse end time
        if (line.includes("结束")) {
          endTime = lines[i - 1] + " " + line;
        }
        
        // Parse discounts (use else-if to prevent duplicates)
        if (line.includes("立减") && line.includes("%")) {
          const match = line.match(/立减(\d+)%省([\d.]+)元/);
          if (match) {
            // Check if it's "官方立减" (store discount) or general platform discount
            const discountOwner = line.includes("官方立减") ? "店舖" : "平台";
            discounts.push({
              discountOwner,
              discountType: "折扣",
              discountValue: (100 - parseInt(match[1])) / 10
            });
          }
        } else if (line.includes("满") && line.includes("减")) {
          const match = line.match(/满(\d+)减(\d+)/);
          if (match) {
            discounts.push({
              discountOwner: "店舖",
              discountType: "滿減",
              discountValue: `满${match[1]}减${match[2]}`
            });
          }
        } else if (line.includes("百亿补贴")) {
          const match = line.match(/¥(\d+)百亿补贴/);
          if (match) {
            discounts.push({
              discountOwner: "平台",
              discountType: "立減",
              discountValue: parseInt(match[1])
            });
          }
        } else if (line.includes("淘金币已抵")) {
          const match = line.match(/淘金币已抵([\d.]+)元/);
          if (match) {
            discounts.push({
              discountOwner: "平台",
              discountType: "紅包",
              discountValue: parseFloat(match[1])
            });
          }
        } else if (line.includes("政府补贴") || line.includes("补贴")) {
          // For government subsidies, calculate as percentage discount
          const match = line.match(/补贴¥?([\d.]+)/);
          if (match) {
            const subsidyAmount = parseFloat(match[1]);
            // If we have both original and final prices, calculate percentage
            if (originalPrice > 0 && finalPrice > 0) {
              const discountPercent = Math.round((finalPrice / originalPrice) * 10) / 10;
              discounts.push({
                discountOwner: "政府",
                discountType: "折扣",
                discountValue: discountPercent
              });
            } else {
              // Fallback to flat reduction if we don't have price info
              discounts.push({
                discountOwner: "政府",
                discountType: "立減",
                discountValue: subsidyAmount
              });
            }
          }
        } else if (line.includes("首购礼金")) {
          const match = line.match(/首购礼金\s*(\d+)元/);
          if (match) {
            discounts.push({
              discountOwner: "平台",
              discountType: "首購",
              discountValue: parseInt(match[1])
            });
          }
        } else if (line.includes("购买立减")) {
          const match = line.match(/购买立减[¥\s]*([\d.]+)/);
          if (match) {
            discounts.push({
              discountOwner: "平台",
              discountType: "立減",
              discountValue: parseFloat(match[1])
            });
          }
        } else if (line.includes("折") && line.match(/([\d.]+)折/)) {
          const match = line.match(/([\d.]+)折/);
          if (match) {
            discounts.push({
              discountOwner: "平台",
              discountType: "折扣",
              discountValue: parseFloat(match[1])
            });
          }
        } else if (line.includes("减") && line.match(/减[¥\s]*([\d.]+)/)) {
          const match = line.match(/减[¥\s]*([\d.]+)/);
          if (match && !line.includes("满") && !line.includes("立减")) {
            discounts.push({
              discountOwner: "平台",
              discountType: "立減",
              discountValue: parseFloat(match[1])
            });
          }
        }
      }

    // Post-process government subsidies and calculate final price if needed
    if (originalPrice > 0) {
      // Calculate final price from government subsidy if not already set
      if (finalPrice === 0) {
        const govSubsidy = discounts.find(d => d.discountOwner === "政府" && d.discountType === "立減");
        if (govSubsidy && typeof govSubsidy.discountValue === 'number') {
          finalPrice = originalPrice - govSubsidy.discountValue;
        }
      }
      
      // Convert government subsidies to percentage discounts
      if (finalPrice > 0) {
        discounts.forEach(discount => {
          if (discount.discountOwner === "政府" && discount.discountType === "立減") {
            // Convert to percentage discount
            const discountPercent = Math.round((finalPrice / originalPrice) * 10) / 10;
            discount.discountType = "折扣";
            discount.discountValue = discountPercent;
          }
        });
      }
    }

    if (finalPrice > 0 || originalPrice > 0 || discounts.length > 0) {
      results.push({
        finalPrice,
        originalPrice,
        discounts,
        soldCount,
        endTime
      });
    }

    return results;
  };

  const handleParse = () => {
    if (!inputText.trim()) {
      message.warning("請輸入要解析的優惠資訊");
      return;
    }

    try {
      const results = parseDiscountText(inputText);
      setParsedResults(results);
      
      if (results.length > 0) {
        message.success("成功解析優惠資訊");
        
        // Apply the first result to the form
        const firstResult = results[0];
        const fieldsToUpdate: any = {};
        
        if (firstResult.finalPrice > 0) {
          fieldsToUpdate.price = firstResult.finalPrice;
        }
        
        if (firstResult.originalPrice > 0) {
          fieldsToUpdate.originalPrice = firstResult.originalPrice;
        }
        
        if (firstResult.discounts.length > 0) {
          fieldsToUpdate.discount = firstResult.discounts;
          onParsedDiscounts?.(firstResult.discounts);
        }
        
        form.setFieldsValue(fieldsToUpdate);
      } else {
        message.warning("未能解析出有效的優惠資訊");
      }
    } catch (error) {
      console.error("Parse error:", error);
      message.error("解析失敗，請檢查輸入格式");
    }
  };

  const handleClear = () => {
    setInputText("");
    setParsedResults([]);
  };

  const applyResult = (result: ParsedDiscount) => {
    const fieldsToUpdate: any = {};
    
    if (result.finalPrice > 0) {
      fieldsToUpdate.price = result.finalPrice;
    }
    
    if (result.originalPrice > 0) {
      fieldsToUpdate.originalPrice = result.originalPrice;
    }
    
    if (result.discounts.length > 0) {
      fieldsToUpdate.discount = result.discounts;
      onParsedDiscounts?.(result.discounts);
    }
    
    console.log("Applying fields to form:", fieldsToUpdate);
    console.log("Current form values before:", form.getFieldsValue());
    
    form.setFieldsValue(fieldsToUpdate);
    
    console.log("Current form values after:", form.getFieldsValue());
    message.success("已應用該優惠資訊到表單");
  };

  return (
    <Card title="優惠資訊解析器" size="small" style={{ marginBottom: 16 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input.TextArea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="請貼上單個商品的優惠資訊"
          rows={6}
          autoSize={{ minRows: 6, maxRows: 12 }}
        />
        
        <Space>
          <Button 
            type="primary" 
            icon={<FileTextOutlined />}
            onClick={handleParse}
            disabled={!inputText.trim()}
          >
            解析優惠資訊
          </Button>
          <Button onClick={handleClear}>
            清空
          </Button>
        </Space>

        {parsedResults.length > 0 && (
          <>
            <Divider orientation="left">解析結果</Divider>
            <Space direction="vertical" style={{ width: '100%' }}>
              {parsedResults.map((result, index) => (
                <Card 
                  key={index} 
                  size="small" 
                  extra={
                    <Button 
                      type="link" 
                      size="small"
                      onClick={() => applyResult(result)}
                    >
                      應用到表單
                    </Button>
                  }
                >
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    {result.finalPrice > 0 && (
                      <Typography.Text>
                        <strong>最終價格:</strong> ¥{result.finalPrice}
                      </Typography.Text>
                    )}
                    {result.originalPrice > 0 && (
                      <Typography.Text>
                        <strong>原價:</strong> ¥{result.originalPrice}
                      </Typography.Text>
                    )}
                    {result.soldCount && (
                      <Typography.Text>
                        <strong>銷量:</strong> {result.soldCount}
                      </Typography.Text>
                    )}
                    {result.endTime && (
                      <Typography.Text>
                        <strong>結束時間:</strong> {result.endTime}
                      </Typography.Text>
                    )}
                    {result.discounts.length > 0 && (
                      <div>
                        <Typography.Text strong>優惠詳情:</Typography.Text>
                        <ul style={{ margin: '4px 0', paddingLeft: 20 }}>
                          {result.discounts.map((discount, idx) => (
                            <li key={idx}>
                              {discount.discountOwner} - {discount.discountType}: {discount.discountValue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Space>
                </Card>
              ))}
            </Space>
          </>
        )}
      </Space>
    </Card>
  );
};

export default DiscountParser;

import React, { useState } from "react";
import { Button, Input, Space, Typography, Card, message, Divider, Alert } from "antd";
import { FileTextOutlined, InfoCircleOutlined } from "@ant-design/icons";
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
  savings?: number;
  savingsPercentage?: number;
}

interface ParsedLine {
  line: string;
  index: number;
  processed: boolean;
}

const DiscountParser: React.FC<DiscountParserProps> = ({ form, onParsedDiscounts }) => {
  const [inputText, setInputText] = useState("");
  const [parsedResults, setParsedResults] = useState<ParsedDiscount[]>([]);
  const [parseWarnings, setParseWarnings] = useState<string[]>([]);

  // Price parsing patterns
  const PRICE_PATTERNS = {
    finalPrice: ["券後", "券后", "到手價", "到手价", "秒杀价", "现价", "現價"],
    originalPrice: ["優惠前", "优惠前", "京東價", "京东价", "超级立减活动价", "原价", "原價", "市场价", "市場價"]
  };

  // Discount parsing patterns with improved regex
  const DISCOUNT_PATTERNS = [
    {
      pattern: /超级立减(\d+)%/,
      type: "折扣",
      owner: "店舖",
      getValue: (match: RegExpMatchArray) => (100 - parseInt(match[1])) / 10,
      priority: 1
    },
    {
      pattern: /立减(\d+)%省([\d.]+)元/,
      type: "立減",
      owner: (line: string) => line.includes("官方立减") ? "店舖" : "平台",
      getValue: (match: RegExpMatchArray) => parseFloat(match[2]),
      priority: 2
    },
    {
      pattern: /超级立减(\d+)元/,
      type: "立減",
      owner: "店舖",
      getValue: (match: RegExpMatchArray) => parseInt(match[1]),
      priority: 3
    },
    {
      pattern: /每满(\d+)件减(\d+)/,
      type: "每滿減",
      owner: "店舖",
      getValue: (match: RegExpMatchArray) => `每满${match[1]}件减${match[2]}`,
      priority: 4
    },
    {
      pattern: /\d+号\d+点满(\d+)减(\d+)/,
      type: "滿減",
      owner: "店舖",
      getValue: (match: RegExpMatchArray) => `满${match[1]}减${match[2]}`,
      priority: 6.5
    },
    {
      pattern: /同店每(\d+)减(\d+)/,
      type: "每滿減",
      owner: "店舖",
      getValue: (match: RegExpMatchArray) => `每满${match[1]}减${match[2]}`,
      priority: 4.5
    },
    {
      pattern: /满(\d+)件([\d.]+)折/,
      type: "滿件折",
      owner: "店舖",
      getValue: (match: RegExpMatchArray) => `满${match[1]}件${match[2]}折`,
      priority: 5
    },
    {
      pattern: /满(\d+)减(\d+)/,
      type: "滿減",
      owner: "店舖",
      getValue: (match: RegExpMatchArray) => `满${match[1]}减${match[2]}`,
      priority: 6
    },
    {
      pattern: /¥(\d+)百亿补贴/,
      type: "立減",
      owner: "平台",
      getValue: (match: RegExpMatchArray) => parseInt(match[1]),
      priority: 7
    },
    {
      pattern: /淘金币已抵([\d.]+)元/,
      type: "紅包",
      owner: "平台",
      getValue: (match: RegExpMatchArray) => parseFloat(match[1]),
      priority: 8
    },
    {
      pattern: /店[铺舖]新客立减(\d+)元/,
      type: "首購",
      owner: "店舖",
      getValue: (match: RegExpMatchArray) => parseInt(match[1]),
      priority: 9
    },
    {
      pattern: /首购礼金\s*(\d+)元/,
      type: "首購",
      owner: "平台",
      getValue: (match: RegExpMatchArray) => parseInt(match[1]),
      priority: 10
    },
    {
      pattern: /购买立减[¥\s]*([\d.]+)/,
      type: "立減",
      owner: "平台",
      getValue: (match: RegExpMatchArray) => parseFloat(match[1]),
      priority: 11
    },
    {
      pattern: /优惠券¥?([\d.]+)/,
      type: "立減",
      owner: "平台",
      getValue: (match: RegExpMatchArray) => parseFloat(match[1]),
      priority: 11.2
    },
    {
      pattern: /满(\d+)享([\d.]+)折减([\d.]+)/,
      type: "滿件折",
      owner: "店舖",
      getValue: (match: RegExpMatchArray) => `满${match[1]}件${match[2]}折`,
      priority: 5.5
    },
    {
      pattern: /全场立减[¥\s]*([\d.]+)/,
      type: "立減",
      owner: "平台",
      getValue: (match: RegExpMatchArray) => parseFloat(match[1]),
      priority: 11.5
    },
    {
      pattern: /直降([\d.]+)元/,
      type: "立減",
      owner: "店舖",
      getValue: (match: RegExpMatchArray) => parseFloat(match[1]),
      priority: 12
    },
    {
      pattern: /([\d.]+)折/,
      type: "折扣",
      owner: "平台",
      getValue: (match: RegExpMatchArray) => parseFloat(match[1]),
      priority: 13,
      condition: (line: string) => !line.includes("满") && !line.includes("件")
    }
  ];

  const parsePrice = (lines: string[], index: number): number => {
    const nextLine = lines[index + 1];
    if (nextLine === "¥" && lines[index + 2]) {
      return parseFloat(lines[index + 2]) || 0;
    } else if (nextLine && nextLine.startsWith("¥")) {
      return parseFloat(nextLine.substring(1)) || 0;
    }
    return 0;
  };

  const parseDirectPrice = (line: string, lines: string[], index: number): { price: number; type: 'final' | 'original' | 'unknown' } => {
    if (!line.startsWith("¥")) return { price: 0, type: 'unknown' };
    
    const price = parseFloat(line.substring(1));
    if (isNaN(price)) return { price: 0, type: 'unknown' };

    const nextLine = lines[index + 1];
    if (nextLine && PRICE_PATTERNS.originalPrice.some(pattern => nextLine.includes(pattern))) {
      return { price, type: 'original' };
    }
    
    return { price, type: 'unknown' };
  };

  const parseDiscounts = (lines: string[]): DiscountItem[] => {
    const discounts: DiscountItem[] = [];
    const processedLines = new Set<number>();

    // Sort patterns by priority
    const sortedPatterns = [...DISCOUNT_PATTERNS].sort((a, b) => a.priority - b.priority);

    lines.forEach((line, index) => {
      if (processedLines.has(index)) return;

      for (const pattern of sortedPatterns) {
        const match = line.match(pattern.pattern);
        if (match && (!pattern.condition || pattern.condition(line))) {
          const owner = typeof pattern.owner === 'function' ? pattern.owner(line) : pattern.owner;
          const value = pattern.getValue(match);
          
          discounts.push({
            discountOwner: owner as any,
            discountType: pattern.type as any,
            discountValue: value
          });
          
          processedLines.add(index);
          break;
        }
      }
    });

    return discounts;
  };

  const parseGovernmentSubsidy = (lines: string[], finalPrice: number, originalPrice: number): DiscountItem[] => {
    const subsidies: DiscountItem[] = [];
    
    lines.forEach(line => {
      if (line.includes("政府补贴") || (line.includes("补贴") && !line.includes("百亿"))) {
        const match = line.match(/补贴¥?([\d.]+)/);
        if (match) {
          const subsidyAmount = parseFloat(match[1]);
          
          if (originalPrice > 0 && finalPrice > 0) {
            const discountPercent = Math.round((finalPrice / originalPrice) * 10) / 10;
            subsidies.push({
              discountOwner: "政府",
              discountType: "折扣",
              discountValue: discountPercent
            });
          } else {
            subsidies.push({
              discountOwner: "政府",
              discountType: "立減",
              discountValue: subsidyAmount
            });
          }
        }
      }
    });

    return subsidies;
  };

  const parseEndTime = (lines: string[]): string => {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes("结束")) {
        if (line.includes("距结束")) {
          return line;
        } else {
          return lines[i - 1] ? `${lines[i - 1]} ${line}` : line;
        }
      }
    }
    return "";
  };

  const parseSoldCount = (lines: string[]): string => {
    for (const line of lines) {
      if (line.includes("已售")) {
        return line;
      }
    }
    return "";
  };

  const calculateSavings = (originalPrice: number, finalPrice: number): { savings: number; percentage: number } => {
    if (originalPrice <= 0 || finalPrice <= 0) return { savings: 0, percentage: 0 };
    
    const savings = originalPrice - finalPrice;
    const percentage = Math.round((savings / originalPrice) * 100 * 10) / 10;
    
    return { savings, percentage };
  };

  const validateParsedData = (result: ParsedDiscount): string[] => {
    const warnings: string[] = [];
    
    if (result.finalPrice <= 0 && result.originalPrice <= 0) {
      warnings.push("未能識別有效的價格資訊");
    }
    
    if (result.finalPrice > result.originalPrice && result.originalPrice > 0) {
      warnings.push("最終價格高於原價，請檢查數據");
    }
    
    if (result.discounts.length === 0) {
      warnings.push("未能識別任何優惠資訊");
    }
    
    return warnings;
  };

  const parseDiscountText = (text: string): ParsedDiscount[] => {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    const results: ParsedDiscount[] = [];
    const warnings: string[] = [];

    let finalPrice = 0;
    let originalPrice = 0;

    // Parse prices with enhanced logic for direct price format
    const priceLines: { price: number; index: number }[] = [];
    
    lines.forEach((line, index) => {
      // Check for price indicators
      if (PRICE_PATTERNS.finalPrice.includes(line)) {
        const price = parsePrice(lines, index);
        if (price > 0) finalPrice = price;
      } else if (PRICE_PATTERNS.originalPrice.includes(line)) {
        const price = parsePrice(lines, index);
        if (price > 0) originalPrice = price;
      } else if (line.startsWith("¥")) {
        // Handle both "¥53.03" and "¥" followed by "53.03" on next line
        const sameLine = line.match(/^¥([\d.]+)$/);
        if (sameLine) {
          // Price on same line as ¥ symbol
          const price = parseFloat(sameLine[1]);
          if (!isNaN(price) && price > 0) {
            priceLines.push({ price, index });
          }
        } else if (line === "¥" && lines[index + 1]) {
          // ¥ symbol alone, check next line for price
          const nextLine = lines[index + 1];
          const nextLinePrice = parseFloat(nextLine);
          if (!isNaN(nextLinePrice) && nextLinePrice > 0) {
            priceLines.push({ price: nextLinePrice, index: index + 1 });
          }
        }
      }
    });

    // If we have direct prices but no explicit indicators, infer from context
    if (finalPrice === 0 && originalPrice === 0 && priceLines.length > 0) {
      if (priceLines.length >= 2) {
        // First price is likely final price, second is likely original price
        finalPrice = priceLines[0].price;
        originalPrice = priceLines[1].price;
      } else if (priceLines.length === 1) {
        // Single price - treat as final price
        finalPrice = priceLines[0].price;
      }
    } else if (finalPrice === 0 && originalPrice > 0 && priceLines.length > 0) {
      // We have original price but no final price, find the price that's NOT the original price
      for (const priceLine of priceLines) {
        if (Math.abs(priceLine.price - originalPrice) > 0.01) {
          finalPrice = priceLine.price;
          break;
        }
      }
      // If we couldn't find a different price, use the first one
      if (finalPrice === 0) {
        finalPrice = priceLines[0].price;
      }
    } else if (originalPrice === 0 && finalPrice > 0 && priceLines.length > 1) {
      // We have final price but no original price, find the price that's NOT the final price
      for (const priceLine of priceLines) {
        if (Math.abs(priceLine.price - finalPrice) > 0.01) {
          originalPrice = priceLine.price;
          break;
        }
      }
    }

    // Parse discounts
    const discounts = parseDiscounts(lines);
    
    // Parse government subsidies
    const govSubsidies = parseGovernmentSubsidy(lines, finalPrice, originalPrice);
    discounts.push(...govSubsidies);

    // Parse additional info
    const endTime = parseEndTime(lines);
    const soldCount = parseSoldCount(lines);

    // Calculate savings
    const { savings, percentage } = calculateSavings(originalPrice, finalPrice);

    if (finalPrice > 0 || originalPrice > 0 || discounts.length > 0) {
      const result: ParsedDiscount = {
        finalPrice,
        originalPrice,
        discounts,
        soldCount,
        endTime,
        savings,
        savingsPercentage: percentage
      };

      // Validate and collect warnings
      const resultWarnings = validateParsedData(result);
      warnings.push(...resultWarnings);

      results.push(result);
    }

    setParseWarnings(warnings);
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
          // Sort discounts by priority before applying to form
          const sortedDiscounts = firstResult.discounts.sort((a, b) => {
            const getPriority = (discount: any) => {
              const pattern = DISCOUNT_PATTERNS.find(p => 
                p.type === discount.discountType && 
                (typeof p.owner === 'string' ? p.owner === discount.discountOwner : true)
              );
              return pattern?.priority || 999;
            };
            return getPriority(a) - getPriority(b);
          });
          
          fieldsToUpdate.discount = sortedDiscounts;
          onParsedDiscounts?.(sortedDiscounts);
        }
        
        form.setFieldsValue(fieldsToUpdate);
      } else {
        message.warning("未能解析出有效的優惠資訊");
      }
    } catch (error) {
      console.error("Parse error:", error);
      message.error("解析失敗，請檢查輸入格式");
      setParseWarnings(["解析過程中發生錯誤，請檢查輸入格式"]);
    }
  };

  const handleClear = () => {
    setInputText("");
    setParsedResults([]);
    setParseWarnings([]);
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
    
    form.setFieldsValue(fieldsToUpdate);
    message.success("已應用該優惠資訊到表單");
  };

  return (
    <Card title="優惠資訊解析器" size="small" style={{ marginBottom: 16 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input.TextArea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="請貼上商品的優惠資訊，支持多種格式：&#10;• 券后/到手价/秒杀价&#10;• 优惠前/原价/京东价&#10;• 满减/立减/折扣等各种优惠&#10;• 距结束时间/已售数量等信息"
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

        {parseWarnings.length > 0 && (
          <Alert
            message="解析警告"
            description={
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {parseWarnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            }
            type="warning"
            icon={<InfoCircleOutlined />}
            showIcon
            closable
          />
        )}

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
                    {result.savings && result.savings > 0 && (
                      <Typography.Text style={{ 
                        fontSize: '14px', 
                        fontWeight: 'bold', 
                        color: '#1890ff',
                        fontFamily: 'monospace'
                      }}>
                        {(() => {
                          // Proper calculation with correct order of operations
                          let calculatedPrice = result.originalPrice;
                          const fixedDiscounts: number[] = [];
                          const percentageDiscounts: number[] = [];
                          const formulaParts: string[] = [];
                          let optimizationSuggestion = '';
                          
                          // Separate percentage and fixed discounts
                          result.discounts.forEach((discount) => {
                            if (discount.discountType === "立減" || discount.discountType === "首購" || discount.discountType === "紅包") {
                              if (typeof discount.discountValue === 'number') {
                                fixedDiscounts.push(discount.discountValue);
                              }
                            } else if (discount.discountType === "折扣") {
                              if (typeof discount.discountValue === 'number') {
                                percentageDiscounts.push(discount.discountValue);
                              }
                            } else if (discount.discountType === "滿減") {
                              const value = discount.discountValue as string;
                              const match = value.match(/满(\d+)减(\d+)/);
                              if (match && result.originalPrice >= parseInt(match[1])) {
                                const reduction = parseInt(match[2]);
                                fixedDiscounts.push(reduction);
                              }
                            } else if (discount.discountType === "滿件折") {
                              const value = discount.discountValue as string;
                              const match = value.match(/满(\d+)件([\d.]+)折/);
                              if (match) {
                                const minQuantity = parseInt(match[1]);
                                const discountRate = parseFloat(match[2]);
                                // Assume quantity meets requirement for calculation
                                if (minQuantity <= 1) {
                                  percentageDiscounts.push(discountRate);
                                }
                              }
                            } else if (discount.discountType === "每滿減") {
                              const value = discount.discountValue as string;
                              // Handle both "每满1件减40" and "每满68减20" patterns
                              const itemMatch = value.match(/每满(\d+)件减(\d+)/);
                              const amountMatch = value.match(/每满(\d+)减(\d+)/);
                              
                              if (itemMatch) {
                                const minQuantity = parseInt(itemMatch[1]);
                                const reduction = parseInt(itemMatch[2]);
                                // For "每满1件减40", apply once for single item
                                if (minQuantity <= 1) {
                                  fixedDiscounts.push(reduction);
                                }
                              } else if (amountMatch) {
                                const threshold = parseInt(amountMatch[1]);
                                const reduction = parseInt(amountMatch[2]);
                                // For "每满68减20", check if original price meets threshold
                                if (result.originalPrice >= threshold) {
                                  // Calculate how many times the threshold is met
                                  const times = Math.floor(result.originalPrice / threshold);
                                  const totalReduction = times * reduction;
                                  fixedDiscounts.push(totalReduction);
                                  
                                  // Calculate optimization suggestion for buying 2 items
                                  const currentUnitPrice = result.finalPrice;
                                  const quantity2OriginalPrice = result.originalPrice * 2;
                                  
                                  // Calculate all discounts for quantity 2
                                  let quantity2Price = quantity2OriginalPrice;
                                  
                                  // Apply other fixed discounts (multiply by 2 for per-item discounts)
                                  result.discounts.forEach((otherDiscount) => {
                                    if (otherDiscount.discountType === "立減" || otherDiscount.discountType === "首購" || otherDiscount.discountType === "紅包") {
                                      if (typeof otherDiscount.discountValue === 'number') {
                                        quantity2Price -= otherDiscount.discountValue * 2; // Apply to both items
                                      }
                                    }
                                  });
                                  
                                  // Apply the threshold discount for quantity 2
                                  const quantity2Times = Math.floor(quantity2OriginalPrice / threshold);
                                  const quantity2ThresholdReduction = quantity2Times * reduction;
                                  quantity2Price -= quantity2ThresholdReduction;
                                  
                                  const quantity2UnitPrice = quantity2Price / 2;
                                  
                                  if (quantity2UnitPrice < currentUnitPrice) {
                                    optimizationSuggestion = `💡 优化建议: 买2件单价更低 (${quantity2UnitPrice.toFixed(2)}元/件 vs ${currentUnitPrice}元/件)`;
                                  }
                                }
                              }
                            }
                          });
                          
                          // Apply percentage discounts first (multiply original price)
                          if (percentageDiscounts.length > 0) {
                            // Apply all percentage discounts
                            let totalPercentage = 1;
                            percentageDiscounts.forEach(rate => {
                              totalPercentage *= (rate / 10);
                            });
                            calculatedPrice = result.originalPrice * totalPercentage;
                            formulaParts.push(`${result.originalPrice} × ${totalPercentage.toFixed(3)}`);
                          } else {
                            formulaParts.push(`${result.originalPrice}`);
                          }
                          
                          // Then subtract fixed discounts
                          fixedDiscounts.forEach(discount => {
                            calculatedPrice -= discount;
                            formulaParts.push(`${discount}`);
                          });
                          
                          const calculationFormula = formulaParts.length > 1 
                            ? `計算式: ${calculatedPrice.toFixed(2)} = ${formulaParts[0]} - ${formulaParts.slice(1).join(' - ')}`
                            : `計算式: ${calculatedPrice.toFixed(2)} = ${formulaParts[0]}`;
                          
                          const accuracyCheck = Math.abs(calculatedPrice - result.finalPrice) < 0.01 ? '✓' : `❌ (實際: ${result.finalPrice})`;
                          
                          return `${calculationFormula} ${accuracyCheck}${optimizationSuggestion ? '\n' + optimizationSuggestion : ''}`;
                        })()}
                      </Typography.Text>
                    )}
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
                    {result.savings && result.savings > 0 && (
                      <Typography.Text type="success">
                        <strong>節省:</strong> ¥{result.savings.toFixed(2)} ({result.savingsPercentage}% off)
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
                          {result.discounts
                            .sort((a, b) => {
                              // Sort by priority (lower priority number = higher importance)
                              const getPriority = (discount: any) => {
                                const pattern = DISCOUNT_PATTERNS.find(p => 
                                  p.type === discount.discountType && 
                                  (typeof p.owner === 'string' ? p.owner === discount.discountOwner : true)
                                );
                                return pattern?.priority || 999;
                              };
                              return getPriority(a) - getPriority(b);
                            })
                            .map((discount, idx) => (
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

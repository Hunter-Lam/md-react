import React, { useState } from "react";
import { Button, Input, Space, Typography, Card, message, Divider, Alert } from "antd";
import { FileTextOutlined, InfoCircleOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";
import type { DiscountItem } from "../types";

// ===== TYPES =====
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

interface PriceLine {
  price: number;
  index: number;
}

interface DiscountPattern {
  pattern: RegExp;
  type: string;
  owner: string | ((line: string) => string);
  getValue: (match: RegExpMatchArray) => string | number;
  priority: number;
  condition?: (line: string) => boolean;
}

// ===== CONSTANTS =====
const PRICE_PATTERNS = {
  finalPrice: ["券後", "券后", "到手價", "到手价", "秒杀价", "现价", "現價"],
  originalPrice: ["優惠前", "优惠前", "京東價", "京东价", "超级立减活动价", "原价", "原價", "市场价", "市場價"]
};

const DISCOUNT_PATTERNS: DiscountPattern[] = [
  {
    pattern: /超级立减(\d+)%/,
    type: "折扣",
    owner: "店舖",
    getValue: (match) => (100 - parseInt(match[1])) / 10,
    priority: 1
  },
  {
    pattern: /立减(\d+)%省([\d.]+)元/,
    type: "立減",
    owner: (line) => line.includes("官方立减") ? "店舖" : "平台",
    getValue: (match) => parseFloat(match[2]),
    priority: 2
  },
  {
    pattern: /超级立减(\d+)元/,
    type: "立減",
    owner: "店舖",
    getValue: (match) => parseInt(match[1]),
    priority: 3
  },
  {
    pattern: /每满(\d+)件减(\d+)/,
    type: "每滿減",
    owner: "店舖",
    getValue: (match) => `每满${match[1]}件减${match[2]}`,
    priority: 4
  },
  {
    pattern: /同店每(\d+)减(\d+)/,
    type: "每滿減",
    owner: "店舖",
    getValue: (match) => `每满${match[1]}减${match[2]}`,
    priority: 4.5
  },
  {
    pattern: /满(\d+)件([\d.]+)折/,
    type: "滿件折",
    owner: "店舖",
    getValue: (match) => `满${match[1]}件${match[2]}折`,
    priority: 5
  },
  {
    pattern: /满(\d+)享([\d.]+)折减([\d.]+)/,
    type: "立減",
    owner: "店舖",
    getValue: (match) => parseFloat(match[3]),
    priority: 5.5
  },
  {
    pattern: /满(\d+)减(\d+)/,
    type: "滿減",
    owner: "店舖",
    getValue: (match) => `满${match[1]}减${match[2]}`,
    priority: 6
  },
  {
    pattern: /\d+号\d+点满(\d+)减(\d+)/,
    type: "滿減",
    owner: "店舖",
    getValue: (match) => `满${match[1]}减${match[2]}`,
    priority: 6.5
  },
  {
    pattern: /¥(\d+)百亿补贴/,
    type: "立減",
    owner: "平台",
    getValue: (match) => parseInt(match[1]),
    priority: 7
  },
  {
    pattern: /淘金币已抵([\d.]+)元/,
    type: "紅包",
    owner: "平台",
    getValue: (match) => parseFloat(match[1]),
    priority: 8
  },
  {
    pattern: /店[铺舖]新客立减(\d+)元/,
    type: "首購",
    owner: "店舖",
    getValue: (match) => parseInt(match[1]),
    priority: 9
  },
  {
    pattern: /首购礼金\s*(\d+)元/,
    type: "首購",
    owner: "店舖",
    getValue: (match) => parseInt(match[1]),
    priority: 10
  },
  {
    pattern: /购买立减[¥\s]*([\d.]+)/,
    type: "立減",
    owner: "平台",
    getValue: (match) => parseFloat(match[1]),
    priority: 11
  },
  {
    pattern: /优惠券¥?([\d.]+)/,
    type: "立減",
    owner: "平台",
    getValue: (match) => parseFloat(match[1]),
    priority: 11.2
  },
  {
    pattern: /促销¥?([\d.]+)/,
    type: "立減",
    owner: "店舖",
    getValue: (match) => parseFloat(match[1]),
    priority: 11.3
  },
  {
    pattern: /全场立减[¥\s]*([\d.]+)/,
    type: "立減",
    owner: "平台",
    getValue: (match) => parseFloat(match[1]),
    priority: 11.5
  },
  {
    pattern: /直降([\d.]+)元/,
    type: "立減",
    owner: "店舖",
    getValue: (match) => parseFloat(match[1]),
    priority: 12
  },
  {
    pattern: /([\d.]+)折/,
    type: "折扣",
    owner: "平台",
    getValue: (match) => parseFloat(match[1]),
    priority: 13,
    condition: (line) => !line.includes("满") && !line.includes("件")
  }
];

// ===== PARSING UTILITIES =====
class PriceParser {
  static parseExplicitPrice(lines: string[], index: number): number {
    const nextLine = lines[index + 1];
    if (nextLine === "¥" && lines[index + 2]) {
      return parseFloat(lines[index + 2]) || 0;
    } else if (nextLine?.startsWith("¥")) {
      return parseFloat(nextLine.substring(1)) || 0;
    }
    return 0;
  }

  static extractDirectPrices(lines: string[]): PriceLine[] {
    const priceLines: PriceLine[] = [];
    
    lines.forEach((line, index) => {
      if (!line.startsWith("¥")) return;

      // Skip lines that are part of discount descriptions
      const prevLine = lines[index - 1];
      const nextLine = lines[index + 1];
      
      // Skip if this appears to be part of a discount description
      if (prevLine && (
        prevLine.includes("购买立减") || 
        prevLine.includes("立减") || 
        prevLine.includes("优惠券") ||
        prevLine.includes("减") ||
        prevLine.includes("补贴")
      )) {
        return;
      }

      // Handle "¥53.03" format
      const sameLine = line.match(/^¥([\d.]+)$/);
      if (sameLine) {
        const price = parseFloat(sameLine[1]);
        if (!isNaN(price) && price > 0) {
          priceLines.push({ price, index });
        }
        return;
      }

      // Handle "¥" followed by "53.03" on next line
      if (line === "¥" && lines[index + 1]) {
        const nextLinePrice = parseFloat(lines[index + 1]);
        if (!isNaN(nextLinePrice) && nextLinePrice > 0) {
          priceLines.push({ price: nextLinePrice, index: index + 1 });
        }
      }
    });

    return priceLines;
  }

  static assignPrices(
    lines: string[], 
    priceLines: PriceLine[]
  ): { finalPrice: number; originalPrice: number } {
    let finalPrice = 0;
    let originalPrice = 0;

    // First pass: Look for explicit price indicators
    lines.forEach((line, index) => {
      if (PRICE_PATTERNS.finalPrice.includes(line)) {
        const price = this.parseExplicitPrice(lines, index);
        if (price > 0) finalPrice = price;
      } else if (PRICE_PATTERNS.originalPrice.includes(line)) {
        const price = this.parseExplicitPrice(lines, index);
        if (price > 0) originalPrice = price;
      }
    });

    // Second pass: Infer from direct prices if needed
    if (finalPrice === 0 && originalPrice === 0 && priceLines.length > 0) {
      // No explicit indicators - use position-based inference
      if (priceLines.length >= 2) {
        finalPrice = priceLines[0].price;
        originalPrice = priceLines[1].price;
      } else {
        finalPrice = priceLines[0].price;
      }
    } else if (finalPrice === 0 && originalPrice > 0) {
      // Have original price, need final price
      const differentPrice = priceLines.find(p => Math.abs(p.price - originalPrice) > 0.01);
      finalPrice = differentPrice?.price || priceLines[0]?.price || 0;
    } else if (originalPrice === 0 && finalPrice > 0 && priceLines.length > 1) {
      // Have final price, need original price
      const differentPrice = priceLines.find(p => Math.abs(p.price - finalPrice) > 0.01);
      originalPrice = differentPrice?.price || 0;
    }

    return { finalPrice, originalPrice };
  }
}

class DiscountParser {
  static parseDiscounts(lines: string[]): DiscountItem[] {
    const discounts: DiscountItem[] = [];
    const processedLines = new Set<number>();
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

    return this.mergeDuplicateDiscounts(discounts);
  }

  static mergeDuplicateDiscounts(discounts: DiscountItem[]): DiscountItem[] {
    const merged: DiscountItem[] = [];
    const seen = new Set<string>();

    discounts.forEach(discount => {
      // Create a key to identify potentially duplicate discounts
      let key = '';
      
        if ((discount.discountType === "立減" || discount.discountType === "首購") && typeof discount.discountValue === 'number') {
        // For fixed amount discounts (including first purchase gifts), use the amount as key
        key = `固定減免-${discount.discountValue}`;
      } else if (discount.discountType === "滿減" && typeof discount.discountValue === 'string') {
        // For threshold discounts, extract the reduction amount
        const match = discount.discountValue.match(/满(\d+)减(\d+)/);
        if (match) {
          const reduction = parseInt(match[2]);
          // Use reduction amount as key to match with fixed amount discounts of same amount
          key = `固定減免-${reduction}`;
        }
      } else if (discount.discountType === "滿件折" && typeof discount.discountValue === 'string') {
        // For quantity-based discounts, extract the discount rate
        const match = discount.discountValue.match(/满(\d+)件([\d.]+)折/);
        if (match) {
          const quantity = parseInt(match[1]);
          const rate = parseFloat(match[2]);
          key = `${discount.discountType}-${quantity}-${rate}`;
        }
      }
      
      // If we haven't seen this discount before, add it
      if (!seen.has(key) || key === '') {
        merged.push(discount);
        if (key !== '') seen.add(key);
      } else {
        // If we've seen this discount before, prefer the more descriptive format
        const existingIndex = merged.findIndex(existing => {
          // Check for matching amounts between different discount types
          if (typeof existing.discountValue === 'number' && typeof discount.discountValue === 'number') {
            return existing.discountValue === discount.discountValue;
          }
          if (existing.discountType === "立減" && discount.discountType === "滿減" && typeof discount.discountValue === 'string') {
            const match = discount.discountValue.match(/满(\d+)减(\d+)/);
            return existing.discountValue === parseInt(match?.[2] || '0');
          }
          if (existing.discountType === "首購" && discount.discountType === "滿減" && typeof discount.discountValue === 'string') {
            const match = discount.discountValue.match(/满(\d+)减(\d+)/);
            return existing.discountValue === parseInt(match?.[2] || '0');
          }
          return false;
        });
        
        if (existingIndex >= 0) {
          // Prefer more descriptive formats: 滿減 > 首購 > 立減
          const existing = merged[existingIndex];
          if (discount.discountType === "滿減") {
            // Always prefer "滿減" as it's most descriptive
            merged[existingIndex] = discount;
          } else if (discount.discountType === "首購" && existing.discountType === "立減") {
            // Prefer "首購" over "立減" as it's more specific
            merged[existingIndex] = discount;
          }
          // Otherwise keep the existing one
        }
      }
    });

    return merged;
  }

  static parseGovernmentSubsidy(lines: string[], finalPrice: number, originalPrice: number): DiscountItem[] {
    const subsidies: DiscountItem[] = [];
    
    lines.forEach(line => {
      if (line.includes("政府补贴") || (line.includes("补贴") && !line.includes("百亿"))) {
        const match = line.match(/补贴¥?([\d.]+)/);
        if (match) {
          const subsidyAmount = parseFloat(match[1]);
          
          if (originalPrice > 0 && finalPrice > 0) {
            // Calculate the discount percentage correctly: (finalPrice / originalPrice) * 10 = X折
            // For example: 125.1 / 139 = 0.9, so it's 9折 (90% of original price, 10% off)
            const discountPercent = Math.round((finalPrice / originalPrice) * 100) / 10;
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
  }
}

class MetadataParser {
  static parseEndTime(lines: string[]): string {
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
  }

  static parseSoldCount(lines: string[]): string {
    return lines.find(line => line.includes("已售")) || "";
  }
}

class CalculationEngine {
  static calculateSavings(originalPrice: number, finalPrice: number): { savings: number; percentage: number } {
    if (originalPrice <= 0 || finalPrice <= 0) return { savings: 0, percentage: 0 };
    
    const savings = originalPrice - finalPrice;
    const percentage = Math.round((savings / originalPrice) * 100 * 10) / 10;
    
    return { savings, percentage };
  }

  static generateCalculationFormula(result: ParsedDiscount): string {
    let calculatedPrice = result.originalPrice;
    const fixedDiscounts: number[] = [];
    const percentageDiscounts: number[] = [];
    const formulaParts: string[] = [];
    let optimizationSuggestion = '';
    
    // Categorize discounts
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
          if (minQuantity <= 1) {
            percentageDiscounts.push(discountRate);
          }
        }
      } else if (discount.discountType === "每滿減") {
        const value = discount.discountValue as string;
        const itemMatch = value.match(/每满(\d+)件减(\d+)/);
        const amountMatch = value.match(/每满(\d+)减(\d+)/);
        
        if (itemMatch) {
          const minQuantity = parseInt(itemMatch[1]);
          const reduction = parseInt(itemMatch[2]);
          if (minQuantity <= 1) {
            fixedDiscounts.push(reduction);
          }
        } else if (amountMatch) {
          const threshold = parseInt(amountMatch[1]);
          const reduction = parseInt(amountMatch[2]);
          if (result.originalPrice >= threshold) {
            const times = Math.floor(result.originalPrice / threshold);
            const totalReduction = times * reduction;
            fixedDiscounts.push(totalReduction);
            
            // Generate optimization suggestion
            optimizationSuggestion = this.generateOptimizationSuggestion(
              result, threshold, reduction
            );
          }
        }
      }
    });
    
    // Apply percentage discounts first
    if (percentageDiscounts.length > 0) {
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
  }

  private static generateOptimizationSuggestion(
    result: ParsedDiscount, 
    threshold: number, 
    reduction: number
  ): string {
    const currentUnitPrice = result.finalPrice;
    const quantity2OriginalPrice = result.originalPrice * 2;
    
    let quantity2Price = quantity2OriginalPrice;
    
    // Apply other fixed discounts (multiply by 2 for per-item discounts)
    result.discounts.forEach((otherDiscount) => {
      if (otherDiscount.discountType === "立減" || otherDiscount.discountType === "首購" || otherDiscount.discountType === "紅包") {
        if (typeof otherDiscount.discountValue === 'number') {
          quantity2Price -= otherDiscount.discountValue * 2;
        }
      }
    });
    
    // Apply the threshold discount for quantity 2
    const quantity2Times = Math.floor(quantity2OriginalPrice / threshold);
    const quantity2ThresholdReduction = quantity2Times * reduction;
    quantity2Price -= quantity2ThresholdReduction;
    
    const quantity2UnitPrice = quantity2Price / 2;
    
    if (quantity2UnitPrice < currentUnitPrice) {
      return `💡 优化建议: 买2件单价更低 (${quantity2UnitPrice.toFixed(2)}元/件 vs ${currentUnitPrice}元/件)`;
    }
    
    return '';
  }
}

class ValidationEngine {
  static validateParsedData(result: ParsedDiscount): string[] {
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
  }
}

// ===== MAIN PARSER ENGINE =====
class MainParserEngine {
  static parseDiscountText(text: string): { results: ParsedDiscount[]; warnings: string[] } {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    const results: ParsedDiscount[] = [];
    const warnings: string[] = [];

    // Extract price information
    const priceLines = PriceParser.extractDirectPrices(lines);
    const { finalPrice, originalPrice } = PriceParser.assignPrices(lines, priceLines);

    // Parse discounts
    const discounts = DiscountParser.parseDiscounts(lines);
    const govSubsidies = DiscountParser.parseGovernmentSubsidy(lines, finalPrice, originalPrice);
    discounts.push(...govSubsidies);

    // Parse metadata
    const endTime = MetadataParser.parseEndTime(lines);
    const soldCount = MetadataParser.parseSoldCount(lines);

    // Calculate savings
    const { savings, percentage } = CalculationEngine.calculateSavings(originalPrice, finalPrice);

    // Create result if we have meaningful data
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
      const resultWarnings = ValidationEngine.validateParsedData(result);
      warnings.push(...resultWarnings);

      results.push(result);
    }

    return { results, warnings };
  }
}

// ===== UTILITY FUNCTIONS =====
const isCalculationAccurate = (result: ParsedDiscount): boolean => {
  let calculatedPrice = result.originalPrice;
  const fixedDiscounts: number[] = [];
  const percentageDiscounts: number[] = [];
  
  // Categorize discounts (same logic as in CalculationEngine)
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
        if (minQuantity <= 1) {
          percentageDiscounts.push(discountRate);
        }
      }
    } else if (discount.discountType === "每滿減") {
      const value = discount.discountValue as string;
      const itemMatch = value.match(/每满(\d+)件减(\d+)/);
      const amountMatch = value.match(/每满(\d+)减(\d+)/);
      
      if (itemMatch) {
        const minQuantity = parseInt(itemMatch[1]);
        const reduction = parseInt(itemMatch[2]);
        if (minQuantity <= 1) {
          fixedDiscounts.push(reduction);
        }
      } else if (amountMatch) {
        const threshold = parseInt(amountMatch[1]);
        const reduction = parseInt(amountMatch[2]);
        if (result.originalPrice >= threshold) {
          const times = Math.floor(result.originalPrice / threshold);
          const totalReduction = times * reduction;
          fixedDiscounts.push(totalReduction);
        }
      }
    }
  });
  
  // Apply percentage discounts first
  if (percentageDiscounts.length > 0) {
    let totalPercentage = 1;
    percentageDiscounts.forEach(rate => {
      totalPercentage *= (rate / 10);
    });
    calculatedPrice = result.originalPrice * totalPercentage;
  }
  
  // Then subtract fixed discounts
  fixedDiscounts.forEach(discount => {
    calculatedPrice -= discount;
  });
  
  // Check if calculated price matches final price (within 0.01 tolerance)
  return Math.abs(calculatedPrice - result.finalPrice) < 0.01;
};

// ===== REACT COMPONENT =====
const DiscountParserComponent: React.FC<DiscountParserProps> = ({ form, onParsedDiscounts }) => {
  const [inputText, setInputText] = useState("");
  const [parsedResults, setParsedResults] = useState<ParsedDiscount[]>([]);
  const [parseWarnings, setParseWarnings] = useState<string[]>([]);

  const handleParse = () => {
    if (!inputText.trim()) {
      message.warning("請輸入要解析的優惠資訊");
      return;
    }

    try {
      const { results, warnings } = MainParserEngine.parseDiscountText(inputText);
      setParsedResults(results);
      setParseWarnings(warnings);
      
      if (results.length > 0) {
        const firstResult = results[0];
        
        // Check if calculation matches final price
        const calculationAccurate = isCalculationAccurate(firstResult);
        
        if (calculationAccurate) {
          message.success("成功解析優惠資訊");
        } else {
          message.warning("解析完成，但計算結果與實際價格不符，請檢查數據");
        }
        
        // Apply the first result to the form
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
          placeholder="請貼上商品的優惠資訊"
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
                        {CalculationEngine.generateCalculationFormula(result)}
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

export default DiscountParserComponent;

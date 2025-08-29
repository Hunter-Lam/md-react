import type { Product, ProductInput } from '../types';
import type { CategoryType } from '../constants';

// Product template interface for better type safety
interface ProductTemplate {
  title: string;
  brand: string;
  type: CategoryType;
  url: string;
  specification: string;
  remark: string;
}

// Generate mock historical data
const generateMockData = (): Product[] => {
  const products: Product[] = [];
  let id = 1;

  // Define different products with price history
  const productTemplates: ProductTemplate[] = [
    // Electronics
    {
      title: "iPhone 15 Pro",
      brand: "Apple",
      type: "電器",
      url: "https://apple.com/iphone-15-pro",
      specification: "256GB, Natural Titanium",
      remark: "Latest flagship model"
    },
    {
      title: "MacBook Pro 14",
      brand: "Apple",
      type: "電器", 
      url: "https://apple.com/macbook-pro-14",
      specification: "M3 Pro, 18GB RAM, 512GB SSD",
      remark: "Professional laptop"
    },
    {
      title: "Galaxy S24 Ultra",
      brand: "Samsung",
      type: "電器",
      url: "https://samsung.com/galaxy-s24-ultra", 
      specification: "512GB, Titanium Black",
      remark: "Android flagship"
    },
    {
      title: "iPad Air 5",
      brand: "Apple",
      type: "電器",
      url: "https://apple.com/ipad-air",
      specification: "M1 Chip, 256GB, Space Gray",
      remark: "Versatile tablet"
    },
    // Clothing
    {
      title: "Nike Air Max 270",
      brand: "Nike",
      type: "服裝",
      url: "https://nike.com/air-max-270",
      specification: "Size 42, Black/White",
      remark: "Popular running shoes"
    },
    {
      title: "Uniqlo Heattech T-Shirt",
      brand: "Uniqlo",
      type: "服裝",
      url: "https://uniqlo.com/heattech-tshirt",
      specification: "Size L, Navy Blue",
      remark: "Thermal underwear"
    },
    // Home Appliances
    {
      title: "Dyson V15 Detect",
      brand: "Dyson",
      type: "家電",
      url: "https://dyson.com/v15-detect",
      specification: "Cordless Vacuum, Yellow",
      remark: "Advanced cleaning technology"
    },
    {
      title: "KitchenAid Stand Mixer",
      brand: "KitchenAid",
      type: "家電",
      url: "https://kitchenaid.com/stand-mixer",
      specification: "5.5 Quart, Empire Red",
      remark: "Professional baking mixer"
    },
    // Books
    {
      title: "Atomic Habits",
      brand: "Random House",
      type: "書籍",
      url: "https://randomhouse.com/atomic-habits",
      specification: "Hardcover, 320 pages",
      remark: "Self-improvement bestseller"
    },
    {
      title: "Programming TypeScript",
      brand: "O'Reilly Media",
      type: "書籍",
      url: "https://oreilly.com/programming-typescript",
      specification: "Paperback, 324 pages",
      remark: "Technical programming guide"
    },
    // Food
    {
      title: "Organic Green Tea",
      brand: "Twinings",
      type: "食品",
      url: "https://twinings.com/green-tea",
      specification: "20 Tea Bags, 40g",
      remark: "Premium organic tea"
    },
    {
      title: "Dark Chocolate 85%",
      brand: "Lindt",
      type: "食品",
      url: "https://lindt.com/dark-chocolate",
      specification: "100g, Excellence Bar",
      remark: "Premium Swiss chocolate"
    }
  ];

  // Generate price history for each product over the last 6 months
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);

  productTemplates.forEach((template, templateIndex) => {
    // Base price for each product
    const basePrices = [
      12999, 7999, 16999, 11999, 13999, 1899, 2299, 4999, // Electronics
      899, 1299, 299, 1999, // Clothing
      799, 3999, 2499, 1299, // Home Appliances
      199, 299, 399, // Books
      89, 199, 79, 899 // Food
    ];
    const basePrice = basePrices[templateIndex] || 999; // Default price if index exceeds array
    
    // Generate 8-15 price points over 6 months for each product
    const numPoints = Math.floor(Math.random() * 8) + 8;
    
    for (let i = 0; i < numPoints; i++) {
      const daysOffset = Math.floor((i / numPoints) * 180) + Math.floor(Math.random() * 10);
      const date = new Date(startDate);
      date.setDate(date.getDate() + daysOffset);
      
      // Add some price variation (±15% from base price)
      const priceVariation = (Math.random() - 0.5) * 0.3; // ±15%
      const price = Math.round(basePrice * (1 + priceVariation));
      
      products.push({
        id: id++,
        ...template,
        price: price,
        date: date.toISOString().split('T')[0],
        created_at: date.toISOString()
      });
    }
  });

  // Sort by date
  return products.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Mock database for development
let mockProducts: Product[] = generateMockData();
let nextId = mockProducts.length + 1;

export const mockTauriApi = {
  invoke: async (command: string, args?: any): Promise<any> => {
    switch (command) {
      case 'save_product':
        const product: ProductInput = args.product;
        const newProduct: Product = {
          ...product,
          id: nextId++,
          created_at: new Date().toISOString(),
        };
        mockProducts.unshift(newProduct);
        return newProduct;

      case 'get_products':
        return [...mockProducts];

      case 'delete_product':
        const id = args.id;
        mockProducts = mockProducts.filter(p => p.id !== id);
        return;

      default:
        throw new Error(`Unknown command: ${command}`);
    }
  }
};

// Check if we're in Tauri environment
export const isTauriEnvironment = () => {
  if (typeof window === 'undefined') return false;
  
  // Check for multiple Tauri indicators
  const windowAny = window as any;
  return !!(
    windowAny.__TAURI__ ||
    windowAny.__TAURI_INTERNALS__ ||
    windowAny.__TAURI_METADATA__ ||
    (windowAny.navigator && windowAny.navigator.userAgent && windowAny.navigator.userAgent.includes('Tauri'))
  );
};

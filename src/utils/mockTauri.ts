import { Product, ProductInput } from '../types';

// Generate mock historical data
const generateMockData = (): Product[] => {
  const products: Product[] = [];
  let id = 1;

  // Define different products with price history
  const productTemplates = [
    {
      title: "iPhone 15 Pro",
      brand: "Apple",
      type: "電器",
      url: "https://apple.com/iphone-15-pro",
      specification: "256GB, Natural Titanium",
      remark: "Latest flagship model"
    },
    {
      title: "iPhone 14",
      brand: "Apple", 
      type: "電器",
      url: "https://apple.com/iphone-14",
      specification: "128GB, Blue",
      remark: "Previous generation"
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
      title: "Surface Laptop 5",
      brand: "Microsoft",
      type: "電器",
      url: "https://microsoft.com/surface-laptop-5",
      specification: "Intel i7, 16GB RAM, 512GB SSD",
      remark: "Windows laptop"
    },
    {
      title: "AirPods Pro 2",
      brand: "Apple",
      type: "電器",
      url: "https://apple.com/airpods-pro",
      specification: "USB-C, Active Noise Cancellation",
      remark: "Premium earbuds"
    },
    {
      title: "Sony WH-1000XM5",
      brand: "Sony",
      type: "電器",
      url: "https://sony.com/wh-1000xm5",
      specification: "Wireless, Noise Canceling",
      remark: "Over-ear headphones"
    },
    {
      title: "iPad Air 5",
      brand: "Apple",
      type: "電器",
      url: "https://apple.com/ipad-air",
      specification: "M1 Chip, 256GB, Space Gray",
      remark: "Versatile tablet"
    }
  ];

  // Generate price history for each product over the last 6 months
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);

  productTemplates.forEach((template, templateIndex) => {
    // Base price for each product
    const basePrices = [12999, 7999, 16999, 11999, 13999, 1899, 2299, 4999];
    const basePrice = basePrices[templateIndex];
    
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
  return typeof window !== 'undefined' && '__TAURI__' in window;
};

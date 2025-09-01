import { Product, ProductInput } from '../types';

// Mock database for development
let mockProducts: Product[] = [];
let nextId = 1;

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

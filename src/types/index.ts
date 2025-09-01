export interface Product {
  id?: number;
  url: string;
  title: string;
  brand: string;
  type: string;
  price: number;
  specification?: string;
  date: string;
  remark?: string;
  created_at?: string;
}

export interface ProductInput {
  url: string;
  title: string;
  brand: string;
  type: string;
  price: number;
  specification?: string;
  date: string;
  remark?: string;
}

export interface DiscountItem {
  discountOwner: string;
  discountType: string;
  discountValue: any;
}

export interface FormData {
  source: {
    type: string;
    address: string;
  };
  title: string;
  brand: string;
  type: string;
  price: number;
  discount: DiscountItem[];
  specification: string;
  date: any;
  remark: string;
}

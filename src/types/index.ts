export interface Product {
  url: string;
  title: string;
  brand: string;
  type: string;
  price: number;
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

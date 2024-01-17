export interface Discount {
  uuid: string;
  id: number;
  name: string;
  disc_amount: number;
  disc_percentage: number;
  max_discount_price: number;
  expired_date: string | null;
  outlet_id: number;
}

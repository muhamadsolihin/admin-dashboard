export interface Review {
  id: number;
  uuid: string;
  name: string;
  outlet_id: number;
  product_image: string;
  product_uuid: string;
  files: { name: string; url: string }[];
  review: string;
  star: number;
  trx_id: string;
  unix_time: number;
  user_customer_id: number;
}

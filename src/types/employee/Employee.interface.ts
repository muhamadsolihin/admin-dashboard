export interface Employee {
    uuid: string;
    signature_id: number | null;
    name: string | null;
    image: string | null;
    user_type: number | null;
    is_active: boolean;
  }
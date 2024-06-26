export default interface Register {
  uuid: string,
  signature_id: string,
  user_name: string,
  outlet_name: string,
  image: string,
  user_type_name: string,
  access_token: string,
  outlet_uuid: string,
  is_active_recap_cash: boolean,
  auth_use: number,
  verified: boolean,
  is_waiting_verified: boolean,
  village_id: number,
  village_name: string,
  outlet_type: number,
  outlet_category: number,
  outlet_description: string,
  address: string,
  pin?: number,
  pin_confirmation?: number,
}

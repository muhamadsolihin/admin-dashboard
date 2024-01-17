export interface UserProfile {
  uuid:                 string;
  signature_id:         string;
  external_id:          string;
  user_name:            string;
  user_id:              number;
  outlet_name:          string;
  outlet_owner_name:    string;
  outlet_description:   string;
  image:                string;
  user_type:            number;
  user_active:          number;
  user_type_name:       string;
  user_village_name:    string;
  user_village_id:      number;
  address:              string;
  phone:                string;
  is_account_phone:     number;
  account_phone:        string;
  account_email:        string;
  email:                string;
  outlet_category:      number;
  outlet_category_name: string;
  outlet_type:          number;
  outlet_active:        number;
  outlet_type_name:     string;
  outlet_village_id:    number;
  outlet_village_name:  string;
  outlet_uuid:          string;
  outlet_id:            number;
  outlet_is_center:     number;
  is_active_recap_cash: number;
  auth_use:             number;
  verified:             number;
  is_waiting_verified:  number;
  active_online_order:  number;
  url_online_order:     string;
  latitude:             string;
  longitude:            string;
  balance_xendit:       number;
  subscription:         Subscription;
}

export interface Subscription {
  id:           number;
  name:         string;
  expired_date: number;
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ServiceCategory {
  id: string;
  name: string;
  display_order: number;
  created_at: string;
}

export interface Service {
  id: string;
  category_id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price_cents: number;
  is_addon: boolean;
  display_order: number;
  created_at: string;
}

export interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  customer_id: string;
  service_id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes: string;
  created_at: string;
  updated_at: string;
}

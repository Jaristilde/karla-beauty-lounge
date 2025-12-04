import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if credentials are properly configured (must be valid URLs)
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return url.startsWith('https://');
  } catch {
    return false;
  }
};

export const isSupabaseConfigured = isValidUrl(supabaseUrl) && supabaseAnonKey.length > 10;

// Create a mock client that does nothing when Supabase is not configured
const createMockClient = () => {
  const mockResponse = { data: null, error: { message: 'Supabase not configured' } };
  const mockBuilder = {
    select: () => mockBuilder,
    insert: () => mockBuilder,
    update: () => mockBuilder,
    delete: () => mockBuilder,
    eq: () => mockBuilder,
    order: () => mockBuilder,
    single: () => Promise.resolve(mockResponse),
    then: (resolve: (value: unknown) => void) => resolve(mockResponse),
  };
  return {
    from: () => mockBuilder,
    auth: {
      signIn: () => Promise.resolve(mockResponse),
      signOut: () => Promise.resolve(mockResponse),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  } as unknown as SupabaseClient;
};

// Only create real client if credentials exist
export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

if (!isSupabaseConfigured) {
  console.warn(
    'Missing Supabase environment variables. Database features will be disabled. Create a .env.local file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for full functionality.'
  );
}

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

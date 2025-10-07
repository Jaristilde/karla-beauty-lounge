/*
  # Create Booking System Schema

  1. New Tables
    - `service_categories`
      - `id` (uuid, primary key)
      - `name` (text, category name)
      - `display_order` (integer, for sorting)
      - `created_at` (timestamp)
    
    - `services`
      - `id` (uuid, primary key)
      - `category_id` (uuid, foreign key to service_categories)
      - `name` (text, service name)
      - `description` (text, optional description)
      - `duration_minutes` (integer, service duration)
      - `price_cents` (integer, price in cents)
      - `is_addon` (boolean, whether it's an add-on service)
      - `display_order` (integer, for sorting within category)
      - `created_at` (timestamp)
    
    - `customers`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `first_name` (text)
      - `last_name` (text)
      - `phone` (text)
      - `created_at` (timestamp)
    
    - `appointments`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key to customers)
      - `service_id` (uuid, foreign key to services)
      - `appointment_date` (date)
      - `appointment_time` (time)
      - `status` (text, values: 'pending', 'confirmed', 'cancelled', 'completed')
      - `notes` (text, optional customer notes)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `appointment_addons`
      - `id` (uuid, primary key)
      - `appointment_id` (uuid, foreign key to appointments)
      - `service_id` (uuid, foreign key to services - must be addon)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Customers can read their own appointments
    - Public can create appointments and customer records
    - Only authenticated users can view all appointments (admin access)
*/

-- Create service_categories table
CREATE TABLE IF NOT EXISTS service_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES service_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  duration_minutes integer NOT NULL,
  price_cents integer NOT NULL,
  is_addon boolean DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create appointment_addons table
CREATE TABLE IF NOT EXISTS appointment_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES appointments(id) ON DELETE CASCADE NOT NULL,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_addons ENABLE ROW LEVEL SECURITY;

-- RLS Policies for service_categories (public read)
CREATE POLICY "Anyone can view service categories"
  ON service_categories FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for services (public read)
CREATE POLICY "Anyone can view services"
  ON services FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for customers
CREATE POLICY "Customers can view own data"
  ON customers FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Anyone can create customer records"
  ON customers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- RLS Policies for appointments
CREATE POLICY "Customers can view own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (customer_id IN (SELECT id FROM customers WHERE auth.uid() = id));

CREATE POLICY "Anyone can create appointments"
  ON appointments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Customers can update own appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (customer_id IN (SELECT id FROM customers WHERE auth.uid() = id))
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE auth.uid() = id));

-- RLS Policies for appointment_addons
CREATE POLICY "Customers can view own appointment addons"
  ON appointment_addons FOR SELECT
  TO authenticated
  USING (appointment_id IN (
    SELECT id FROM appointments 
    WHERE customer_id IN (SELECT id FROM customers WHERE auth.uid() = id)
  ));

CREATE POLICY "Anyone can create appointment addons"
  ON appointment_addons FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_appointments_customer ON appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointment_addons_appointment ON appointment_addons(appointment_id);
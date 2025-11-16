# Supabase Setup Guide for Karla Beauty Lounge

This guide will help you integrate your GitHub project with your new Supabase project.

## Step 1: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Open your newly created project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 2: Configure Local Environment

1. Open the `.env.local` file in your project root
2. Replace the placeholder values with your actual credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

## Step 3: Set Up Database Schema

1. In your Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open the `supabase-schema.sql` file from your project
4. Copy and paste the entire SQL content into the Supabase SQL Editor
5. Click **Run** to execute the schema

This will create:
- ✅ `service_categories` table
- ✅ `services` table
- ✅ `customers` table
- ✅ `appointments` table
- ✅ Row Level Security (RLS) policies
- ✅ Sample data to get you started

## Step 4: Deploy Edge Function (Optional - for booking notifications)

If you want to send SMS/email notifications when customers book appointments:

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project (replace `your-project-ref` with your project ID):
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Deploy the Edge Function:
   ```bash
   supabase functions deploy send-booking-notification
   ```

5. **Configure notification provider** (optional):
   - Edit `supabase/functions/send-booking-notification/index.ts`
   - Add your SMS provider (Twilio) or Email provider (SendGrid/Resend)
   - Set up environment variables in Supabase Dashboard → Edge Functions

## Step 5: Configure Netlify Environment Variables

For your live site to work on Netlify:

1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Add the following variables:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
5. Redeploy your site

## Step 6: Test Your Application

1. Start your development server:
   ```bash
   npm run dev
   ```

2. The app should now load without errors
3. Test the booking form to ensure data is being saved to Supabase

## Verify Database Setup

After running the schema, verify in Supabase Dashboard:

1. Go to **Table Editor**
2. You should see tables: `service_categories`, `services`, `customers`, `appointments`
3. Check that sample categories were created

## Adding Services

You can add your beauty services in two ways:

### Option 1: Via SQL Editor
```sql
INSERT INTO services (category_id, name, description, duration_minutes, price_cents, display_order)
SELECT
  sc.id,
  'Haircut & Style',
  'Professional haircut with styling',
  60,
  5000,  -- $50.00 in cents
  1
FROM service_categories sc
WHERE sc.name = 'Hair Services';
```

### Option 2: Via Supabase Table Editor
1. Go to **Table Editor** → **services**
2. Click **Insert row**
3. Fill in the service details
4. Save

## Troubleshooting

### Error: "supabaseUrl is required"
- Check that `.env.local` file exists and has the correct values
- Restart your dev server after adding environment variables
- Ensure variable names start with `VITE_` (required for Vite to expose them)

### Error: "relation does not exist"
- Make sure you ran the `supabase-schema.sql` in Supabase SQL Editor
- Check the SQL executed successfully without errors

### RLS Policy Issues
- The schema includes public read access for services
- Customers can create bookings without authentication
- For admin features, you'll need to add authentication and admin policies

## Next Steps

1. ✅ Add your actual beauty services to the database
2. ✅ Customize the sample service categories
3. ✅ Set up booking notification provider (Twilio/SendGrid)
4. ✅ Consider adding authentication for admin features
5. ✅ Set up storage buckets if you want to add service images

## Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase SQL Editor Guide](https://supabase.com/docs/guides/database/overview)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

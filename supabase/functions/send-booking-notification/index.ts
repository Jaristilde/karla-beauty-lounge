// Supabase Edge Function for sending booking notifications
// This function sends SMS/email notifications when a booking is made

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const bookingInfo = await req.json();

    console.log('Received booking notification request:', bookingInfo);

    // TODO: Add your SMS/Email notification logic here
    // Examples:
    // - Twilio for SMS
    // - SendGrid/Resend for Email
    // - Discord/Slack webhooks

    // For now, just log the booking
    console.log('Booking details:', {
      service: bookingInfo.service,
      date: bookingInfo.date,
      time: bookingInfo.time,
      customer: `${bookingInfo.firstName} ${bookingInfo.lastName}`,
      phone: bookingInfo.phone,
      email: bookingInfo.email,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Notification logged (configure SMS/Email provider to send actual notifications)'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error processing booking notification:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.1";

// Allowed origins for CORS - restrict to your application domains
const ALLOWED_ORIGINS = [
  'https://k-and-a-travel-timeline.lovable.app',
  'https://id-preview--f10ebce9-33fd-4fb0-b50c-16669c546bcd.lovable.app'
];

// Add localhost for development
if (Deno.env.get('ENVIRONMENT') !== 'production') {
  ALLOWED_ORIGINS.push('http://localhost:5173', 'http://localhost:3000');
}

function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Credentials': 'true',
  };
}

// Rate limiting configuration
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MINUTES = 15;
const ATTEMPT_WINDOW_MINUTES = 10;
const SESSION_DURATION_HOURS = 24;

// Timing-safe string comparison to prevent timing attacks
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Still do a comparison to maintain constant time
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ (b.charCodeAt(i % b.length) || 0);
    }
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role for database access
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    // Check rate limiting
    const { data: rateLimitData } = await supabase
      .from('rate_limit_attempts')
      .select('*')
      .eq('ip_address', clientIP)
      .maybeSingle();

    if (rateLimitData) {
      // Check if still blocked
      if (rateLimitData.blocked_until && new Date(rateLimitData.blocked_until) > new Date()) {
        const remainingSeconds = Math.ceil((new Date(rateLimitData.blocked_until).getTime() - Date.now()) / 1000);
        console.log(`Rate limited IP ${clientIP}, blocked for ${remainingSeconds} more seconds`);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Too many attempts. Please try again in ${Math.ceil(remainingSeconds / 60)} minutes.`,
            rateLimited: true
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if within attempt window and exceeded max attempts
      const windowStart = new Date(Date.now() - ATTEMPT_WINDOW_MINUTES * 60 * 1000);
      if (new Date(rateLimitData.first_attempt_at) > windowStart && 
          rateLimitData.attempt_count >= MAX_ATTEMPTS) {
        // Block the IP
        const blockedUntil = new Date(Date.now() + BLOCK_DURATION_MINUTES * 60 * 1000);
        await supabase
          .from('rate_limit_attempts')
          .update({ blocked_until: blockedUntil.toISOString() })
          .eq('ip_address', clientIP);

        console.log(`Blocking IP ${clientIP} until ${blockedUntil.toISOString()}`);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Too many attempts. Please try again in ${BLOCK_DURATION_MINUTES} minutes.`,
            rateLimited: true
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const { password } = await req.json();

    // Validate input
    if (!password || typeof password !== 'string') {
      console.log("Invalid password input received");
      return new Response(
        JSON.stringify({ success: false, error: 'Password is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the site password from environment variables
    const sitePassword = Deno.env.get('SITE_PASSWORD');
    
    if (!sitePassword) {
      console.error("SITE_PASSWORD environment variable is not set");
      return new Response(
        JSON.stringify({ success: false, error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Timing-safe password comparison to prevent timing attacks
    const isValid = timingSafeEqual(password, sitePassword);
    
    console.log(`Password verification attempt from ${clientIP}: ${isValid ? 'successful' : 'failed'}`);

    if (isValid) {
      // Reset rate limiting on successful login
      await supabase
        .from('rate_limit_attempts')
        .delete()
        .eq('ip_address', clientIP);

      // Generate session token and store in database
      const sessionToken = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000);
      
      const { error: insertError } = await supabase
        .from('site_sessions')
        .insert({
          token: sessionToken,
          ip_address: clientIP,
          expires_at: expiresAt.toISOString()
        });

      if (insertError) {
        console.error("Failed to create session:", insertError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create session' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Set httpOnly cookie for secure session storage
      const cookieOptions = [
        `site_session=${sessionToken}`,
        'HttpOnly',
        'Secure',
        'SameSite=Lax',
        `Path=/`,
        `Max-Age=${SESSION_DURATION_HOURS * 60 * 60}`,
      ].join('; ');
      
      return new Response(
        JSON.stringify({ success: true }),
        { 
          status: 200, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Set-Cookie': cookieOptions
          } 
        }
      );
    } else {
      // Record failed attempt for rate limiting
      if (rateLimitData) {
        const windowStart = new Date(Date.now() - ATTEMPT_WINDOW_MINUTES * 60 * 1000);
        const shouldReset = new Date(rateLimitData.first_attempt_at) < windowStart;
        
        await supabase
          .from('rate_limit_attempts')
          .update({
            attempt_count: shouldReset ? 1 : rateLimitData.attempt_count + 1,
            first_attempt_at: shouldReset ? new Date().toISOString() : rateLimitData.first_attempt_at,
            last_attempt_at: new Date().toISOString(),
            blocked_until: null
          })
          .eq('ip_address', clientIP);
      } else {
        await supabase
          .from('rate_limit_attempts')
          .insert({
            ip_address: clientIP,
            attempt_count: 1,
            first_attempt_at: new Date().toISOString(),
            last_attempt_at: new Date().toISOString()
          });
      }

      const attemptsRemaining = rateLimitData 
        ? Math.max(0, MAX_ATTEMPTS - rateLimitData.attempt_count - 1)
        : MAX_ATTEMPTS - 1;

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Incorrect password',
          attemptsRemaining
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error("Error in verify-password function:", error);
    return new Response(
      JSON.stringify({ success: false, error: 'An error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

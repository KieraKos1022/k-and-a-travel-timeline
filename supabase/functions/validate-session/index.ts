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
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, cookie',
    'Access-Control-Allow-Credentials': 'true',
  };
}

// Parse cookies from request
function parseCookies(cookieHeader: string | null): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  
  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.trim().split('=');
    if (name) {
      cookies[name] = rest.join('=');
    }
  });
  return cookies;
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Try to get session token from httpOnly cookie first, then from request body (fallback)
    const cookieHeader = req.headers.get('cookie');
    const cookies = parseCookies(cookieHeader);
    let sessionToken = cookies['site_session'];

    // Fallback to request body for backwards compatibility
    if (!sessionToken) {
      try {
        const body = await req.json();
        sessionToken = body.sessionToken;
      } catch {
        // No body provided
      }
    }

    // Validate input
    if (!sessionToken || typeof sessionToken !== 'string') {
      return new Response(
        JSON.stringify({ valid: false, error: 'Session token is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Basic UUID format validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(sessionToken)) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Invalid session token format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with service role for database access
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Look up the session in the database
    const { data: session, error: queryError } = await supabase
      .from('site_sessions')
      .select('*')
      .eq('token', sessionToken)
      .maybeSingle();

    if (queryError) {
      console.error("Error querying session:", queryError);
      return new Response(
        JSON.stringify({ valid: false, error: 'Failed to validate session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if session exists and hasn't expired
    if (!session) {
      console.log("Session not found");
      return new Response(
        JSON.stringify({ valid: false, error: 'Session not found' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (new Date(session.expires_at) < new Date()) {
      console.log("Session expired");
      // Clean up expired session
      await supabase
        .from('site_sessions')
        .delete()
        .eq('token', sessionToken);

      return new Response(
        JSON.stringify({ valid: false, error: 'Session expired' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Session validated successfully");
    return new Response(
      JSON.stringify({ valid: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in validate-session function:", error);
    return new Response(
      JSON.stringify({ valid: false, error: 'An error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

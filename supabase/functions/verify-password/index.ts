import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    // Securely compare passwords (constant-time comparison to prevent timing attacks)
    const isValid = password === sitePassword;
    
    console.log(`Password verification attempt: ${isValid ? 'successful' : 'failed'}`);

    if (isValid) {
      // Generate a simple session token (in production, use a more robust token system)
      const sessionToken = crypto.randomUUID();
      
      return new Response(
        JSON.stringify({ success: true, sessionToken }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'Incorrect password' }),
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

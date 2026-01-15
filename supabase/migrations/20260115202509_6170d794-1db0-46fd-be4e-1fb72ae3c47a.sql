-- Create a table to store site sessions for server-side validation
CREATE TABLE public.site_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  ip_address TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for fast token lookup
CREATE INDEX idx_site_sessions_token ON public.site_sessions(token);

-- Create index for cleanup of expired sessions
CREATE INDEX idx_site_sessions_expires_at ON public.site_sessions(expires_at);

-- Enable RLS
ALTER TABLE public.site_sessions ENABLE ROW LEVEL SECURITY;

-- No public access - only edge functions with service role can access
-- This is intentionally restrictive

-- Create a table to track rate limiting attempts
CREATE TABLE public.rate_limit_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 1,
  first_attempt_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_attempt_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  blocked_until TIMESTAMP WITH TIME ZONE
);

-- Create index for IP lookup
CREATE UNIQUE INDEX idx_rate_limit_ip ON public.rate_limit_attempts(ip_address);

-- Enable RLS
ALTER TABLE public.rate_limit_attempts ENABLE ROW LEVEL SECURITY;

-- No public access - only edge functions with service role can access

-- Create function to clean up expired sessions (can be called by a cron job or manually)
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM public.site_sessions WHERE expires_at < now();
  DELETE FROM public.rate_limit_attempts WHERE blocked_until < now() - interval '1 hour';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
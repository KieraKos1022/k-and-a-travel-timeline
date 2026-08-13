REVOKE EXECUTE ON FUNCTION public.cleanup_expired_sessions() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_expired_sessions() TO service_role;

REVOKE ALL ON TABLE public.rate_limit_attempts FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.site_sessions FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.rate_limit_attempts TO service_role;
GRANT ALL ON TABLE public.site_sessions TO service_role;
import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PasswordProtection } from "@/components/PasswordProtection";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      const sessionToken = localStorage.getItem('site_session_token');
      
      if (!sessionToken) {
        setIsValidating(false);
        return;
      }

      try {
        // Validate session with server
        const { data, error } = await supabase.functions.invoke('validate-session', {
          body: { sessionToken }
        });

        if (error || !data?.valid) {
          // Invalid session - remove it
          localStorage.removeItem('site_session_token');
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (err) {
        // On error, clear the session for safety
        localStorage.removeItem('site_session_token');
        setIsAuthenticated(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateSession();
  }, []);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  // Show loading state while validating session
  if (isValidating) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <PasswordProtection onAuthenticated={handleAuthenticated} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

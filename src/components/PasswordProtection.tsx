import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface PasswordProtectionProps {
  onAuthenticated: () => void;
}

export const PasswordProtection: React.FC<PasswordProtectionProps> = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate input on client side first
      if (!password.trim()) {
        setError('Please enter a password');
        setIsLoading(false);
        return;
      }

      // Call the edge function for server-side validation
      const { data, error: fnError } = await supabase.functions.invoke('verify-password', {
        body: { password: password.trim() }
      });

      if (fnError) {
        if (import.meta.env.DEV) {
          console.error('Edge function error:', fnError);
        }
        setError('An error occurred. Please try again.');
        setPassword('');
        setIsLoading(false);
        return;
      }

      if (data?.success && data?.sessionToken) {
        // Store the server-validated session token
        localStorage.setItem('site_session_token', data.sessionToken);
        onAuthenticated();
      } else if (data?.rateLimited) {
        setError(data?.error || 'Too many attempts. Please try again later.');
        setPassword('');
      } else {
        const attemptsMsg = data?.attemptsRemaining !== undefined 
          ? ` (${data.attemptsRemaining} attempts remaining)`
          : '';
        setError((data?.error || 'Incorrect password') + attemptsMsg);
        setPassword('');
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Verification error:', err);
      }
      setError('An error occurred. Please try again.');
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Access Required</CardTitle>
          <CardDescription>
            Enter the password to view the travel timeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                autoFocus
                disabled={isLoading}
              />
              {error && (
                <p className="text-destructive text-sm mt-2">{error}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Access Site'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

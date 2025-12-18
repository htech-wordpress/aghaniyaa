import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Lock, AlertCircle } from 'lucide-react';
import { checkAdminPassword, setAdminAuthenticated, initAdminPassword } from '@/lib/storage';
import { signInWithGoogle, checkAuthConfiguration } from '@/lib/firebase';

export function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    initAdminPassword();

    // Diagnose Firebase Auth configuration and show helpful message
    (async () => {
      const cfg = await checkAuthConfiguration();
      if (!cfg.ok) {
        setError('Firebase Auth configuration issue: ' + (cfg.message || 'See console for details'));
        console.warn('Auth configuration check failed:', cfg);
      }
    })();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (checkAdminPassword(password)) {
      setAdminAuthenticated(true);
      navigate('/admin/dashboard');
    } else {
      setError('Invalid password. Please try again.');
      setPassword('');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        // Backwards compatibility: set local session flag too
        setAdminAuthenticated(true);
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Google sign-in failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Enter your password to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                <AlertCircle className="h-4 w-4" />
                <div>
                  <div>{error}</div>
                  <div className="text-xs text-gray-500 mt-1">See console for troubleshooting steps: ensure Web App is registered, Google provider is enabled, and localhost is listed under Authorized domains in Firebase Authentication settings.</div>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg">
              Login
            </Button>
          </form>

          <div className="mt-4 text-center">
            <div className="my-3">
              <Button variant="outline" onClick={handleGoogleSignIn} className="w-full">
                Sign in with Google
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Default password: admin123</p>
              <p className="text-xs mt-1">(Change it in admin settings)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


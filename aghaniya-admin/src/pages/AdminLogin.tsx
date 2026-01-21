import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, AlertCircle, RefreshCw } from 'lucide-react';
import { signInWithGoogle, isSuperUser, isAdminUser, getFirestoreInstance } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export function AdminLogin() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user && user.email) {
        // Check if user is SuperAdmin first
        const superUser = await isSuperUser(user);
        if (superUser) {
          navigate('/superadmin');
          return;
        }

        // Check if user is in adminConfig/access
        const admin = await isAdminUser(user);
        if (admin) {
          navigate('/dashboard');
          return;
        }

        // Check if user is in adminUsers collection
        const firestore = getFirestoreInstance();
        if (firestore) {
          const adminUsersRef = collection(firestore, 'adminUsers');
          const adminQuery = query(
            adminUsersRef,
            where('email', '==', user.email),
            where('status', '==', 'active')
          );
          const adminSnapshot = await getDocs(adminQuery);

          if (!adminSnapshot.empty) {
            // Admin user found, redirect to dashboard
            navigate('/dashboard');
            return;
          }

          // Check if user is an agent in agents collection
          const agentsRef = collection(firestore, 'agents');
          const q = query(
            agentsRef,
            where('email', '==', user.email),
            where('status', '==', 'active')
          );
          const snapshot = await getDocs(q);

          if (!snapshot.empty) {
            const agentDoc = snapshot.docs[0];
            const agentData = agentDoc.data();

            // Redirect based on agent role
            if (agentData.role === 'admin') {
              navigate('/dashboard');
            } else if (agentData.role === 'manager') {
              navigate('/dashboard');
            } else if (agentData.role === 'agent') {
              navigate('/my-leads');
            } else {
              navigate('/my-leads'); // Default for agents
            }
            return;
          }
        }

        // If not found in any collection, deny access
        setError('Access denied. Your account is not authorized to access this panel.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
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
          <CardDescription>Sign in with Google to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <Button
              onClick={handleLogin}
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign in with Google
                </>
              )}
            </Button>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              <p>Only authorized administrators can access this area.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

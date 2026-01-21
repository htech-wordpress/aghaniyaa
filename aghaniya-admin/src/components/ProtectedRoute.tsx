import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthChange, isAdminUser, isSuperUser, getFirestoreInstance } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { RefreshCw } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (!user) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      // Check if user is SuperAdmin
      const superUser = await isSuperUser(user);
      if (superUser) {
        setAuthorized(true);
        setLoading(false);
        return;
      }

      // Check if user is in old admin system
      const isAd = await isAdminUser(user);
      if (isAd) {
        setAuthorized(true);
        setLoading(false);
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
          setAuthorized(true);
          setLoading(false);
          return;
        }

        // Check if user is in agents collection
        const agentsRef = collection(firestore, 'agents');
        const agentQuery = query(
          agentsRef,
          where('email', '==', user.email),
          where('status', '==', 'active')
        );
        const agentSnapshot = await getDocs(agentQuery);

        if (!agentSnapshot.empty) {
          setAuthorized(true);
          setLoading(false);
          return;
        }
      }

      // Not authorized
      setAuthorized(false);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-500">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

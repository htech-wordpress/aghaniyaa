import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthChange, isAdminUser, isSuperUser, getDatabaseInstance } from '@/lib/firebase';
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
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
      const db = getDatabaseInstance();
      if (db && user.email) {
        const adminUsersRef = ref(db, 'adminUsers');
        const adminQuery = query(
          adminUsersRef,
          orderByChild('email'),
          equalTo(user.email)
        );
        const adminSnapshot = await get(adminQuery);

        let validAdmin = false;
        adminSnapshot.forEach((childSnap) => {
          if (childSnap.val().status === 'active') {
            validAdmin = true;
          }
        });

        if (validAdmin) {
          setAuthorized(true);
          setLoading(false);
          return;
        }

        // Check if user is in agents collection
        const agentsRef = ref(db, 'agents');
        const agentQuery = query(
          agentsRef,
          orderByChild('email'),
          equalTo(user.email)
        );
        const agentSnapshot = await get(agentQuery);

        let validAgent = false;
        agentSnapshot.forEach((childSnap) => {
          if (childSnap.val().status === 'active') {
            validAgent = true;
          }
        });

        if (validAgent) {
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

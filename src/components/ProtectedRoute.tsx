import { Navigate } from 'react-router-dom';
import { isAdminAuthenticated } from '@/lib/storage';
import { getFirebaseAuth, onAuthChange, isAdminUser } from '@/lib/firebase';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState<boolean>(false);

  useEffect(() => {
    // Legacy local session check
    if (isAdminAuthenticated()) {
      setAuthed(true);
      setChecking(false);
      return;
    }

    const auth = getFirebaseAuth();
    if (!auth) {
      setAuthed(false);
      setChecking(false);
      return;
    }

    let cancelled = false;
    const unsub = onAuthChange(async (user) => {
      if (!user) {
        if (!cancelled) {
          setAuthed(false);
          setChecking(false);
        }
        return;
      }

      try {
        const isAdmin = await isAdminUser(user);
        if (!cancelled) {
          setAuthed(!!isAdmin);
          setChecking(false);
        }
      } catch (e) {
        console.warn('Error checking admin user', e);
        if (!cancelled) {
          setAuthed(false);
          setChecking(false);
        }
      }
    });

    return () => {
      cancelled = true;
      unsub && unsub();
    };
  }, []);

  if (checking) return null;

  if (!authed) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}


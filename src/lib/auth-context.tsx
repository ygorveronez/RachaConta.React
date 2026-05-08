import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { obterPerfil } from '@/api/perfil';
import type { PerfilDto } from '@/types/dto';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  perfil: PerfilDto | null;
  loading: boolean;
  refreshPerfil: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [perfil, setPerfil] = useState<PerfilDto | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPerfil = useCallback(async (uid: string) => {
    try {
      const p = await obterPerfil(uid);
      setPerfil(p);
    } catch {
      setPerfil(null);
    }
  }, []);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        loadPerfil(data.session.user.id).finally(() => active && setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) loadPerfil(newSession.user.id);
      else setPerfil(null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [loadPerfil]);

  const refreshPerfil = useCallback(async () => {
    if (user) await loadPerfil(user.id);
  }, [user, loadPerfil]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setPerfil(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, perfil, loading, refreshPerfil, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>');
  return ctx;
}

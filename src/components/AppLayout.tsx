import { ReactNode, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bell, History, Home as HomeIcon, User } from 'lucide-react';
import { Logo } from './Logo';
import { Avatar } from './Avatar';
import { useAuth } from '@/lib/auth-context';
import { contarNaoLidas } from '@/api/notificacoes';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { perfil, user } = useAuth();
  const navigate = useNavigate();
  const [naoLidas, setNaoLidas] = useState<number>(0);

  useEffect(() => {
    if (!user) return;
    contarNaoLidas().then(setNaoLidas).catch(() => setNaoLidas(0));
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-ink-100">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <Link to="/app" className="flex items-center gap-2">
            <Logo size={32} withWordmark />
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/app/notificacoes')}
              className="relative p-2 rounded-full hover:bg-ink-100 text-ink-700"
              aria-label="Notificações"
            >
              <Bell className="w-5 h-5" />
              {naoLidas > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-danger-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {naoLidas > 9 ? '9+' : naoLidas}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate('/app/perfil')}
              className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
              aria-label="Perfil"
            >
              <Avatar nome={perfil?.nome_completo} url={perfil?.avatar_url} size={36} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-6 pb-28">
        {children}
      </main>

      {/* Bottom nav (mobile) — espelha BottomNavBar.kt */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-ink-100 md:hidden">
        <div className="mx-auto max-w-5xl grid grid-cols-3">
          {[
            { to: '/app', label: 'Início', icon: HomeIcon, end: true },
            { to: '/app/historico', label: 'Histórico', icon: History },
            { to: '/app/perfil', label: 'Perfil', icon: User },
          ].map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 py-2 text-xs font-medium ${
                  isActive ? 'text-brand-600' : 'text-ink-500'
                }`
              }
            >
              <it.icon className="w-5 h-5" />
              {it.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}

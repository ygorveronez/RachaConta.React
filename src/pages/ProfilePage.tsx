import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, KeyRound, LogOut, UserPen } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { listarEventos } from '@/api/eventos';
import { Avatar } from '@/components/Avatar';

export default function ProfilePage() {
  const { perfil, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, ativos: 0 });

  useEffect(() => {
    listarEventos()
      .then((evs) =>
        setStats({
          total: evs.length,
          ativos: evs.filter((e) => !e.arquivado).length,
        })
      )
      .catch(() => undefined);
  }, []);

  async function handleSignOut() {
    if (!confirm('Sair da conta?')) return;
    await signOut();
    navigate('/entrar', { replace: true });
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="card p-6 flex items-center gap-4 mb-6">
        <Avatar nome={perfil?.nome_completo} url={perfil?.avatar_url} size={72} />
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl font-bold text-ink-900 line-clamp-1">
            {perfil?.nome_completo ?? '—'}
          </h1>
          <p className="text-ink-500 line-clamp-1">@{perfil?.nome_usuario ?? '—'}</p>
          <p className="text-sm text-ink-500 line-clamp-1">{perfil?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="card p-4">
          <p className="text-xs uppercase tracking-wide text-ink-500">Eventos</p>
          <p className="font-display text-2xl font-bold text-brand-600">{stats.total}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase tracking-wide text-ink-500">Ativos</p>
          <p className="font-display text-2xl font-bold text-lime-600">{stats.ativos}</p>
        </div>
      </div>

      <div className="card divide-y divide-ink-100">
        <Link to="/app/perfil/editar" className="flex items-center gap-4 p-4 hover:bg-ink-50">
          <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
            <UserPen className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-ink-900">Editar perfil</p>
            <p className="text-sm text-ink-500">Nome e nome de usuário</p>
          </div>
          <ChevronRight className="w-5 h-5 text-ink-400" />
        </Link>
        <Link to="/app/perfil/senha" className="flex items-center gap-4 p-4 hover:bg-ink-50">
          <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-ink-900">Trocar senha</p>
            <p className="text-sm text-ink-500">Atualize a senha do seu acesso</p>
          </div>
          <ChevronRight className="w-5 h-5 text-ink-400" />
        </Link>
        <button onClick={handleSignOut} className="w-full flex items-center gap-4 p-4 hover:bg-ink-50 text-left">
          <div className="w-10 h-10 rounded-xl bg-danger-100 text-danger-600 flex items-center justify-center">
            <LogOut className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-ink-900">Sair</p>
            <p className="text-sm text-ink-500">Encerrar a sessão atual</p>
          </div>
          <ChevronRight className="w-5 h-5 text-ink-400" />
        </button>
      </div>
    </div>
  );
}

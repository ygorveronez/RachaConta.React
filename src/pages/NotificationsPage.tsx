import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import {
  apagarLidas,
  listarNotificacoes,
  marcarComoLida,
  marcarTodasComoLidas,
} from '@/api/notificacoes';
import type { NotificacaoDto } from '@/types/dto';
import { formatDate } from '@/lib/format';
import { Avatar } from '@/components/Avatar';

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificacaoDto[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    setLoading(true);
    try {
      const r = await listarNotificacoes();
      setItems(r);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function clicarItem(n: NotificacaoDto) {
    if (!n.lida) {
      await marcarComoLida(n.id);
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, lida: true } : x)));
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Notificações</h1>
          <p className="text-ink-600">Tudo o que rolou nos seus eventos.</p>
        </div>
        <div className="flex gap-2">
          <button
            className="btn-ghost"
            onClick={async () => {
              await marcarTodasComoLidas();
              await carregar();
            }}
          >
            <CheckCheck className="w-4 h-4" /> Marcar todas
          </button>
          <button
            className="btn-ghost"
            onClick={async () => {
              if (!confirm('Apagar todas as notificações lidas?')) return;
              await apagarLidas();
              await carregar();
            }}
          >
            <Trash2 className="w-4 h-4" /> Apagar lidas
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-4 h-20 animate-pulse-soft" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="card p-10 text-center">
          <Bell className="mx-auto w-12 h-12 text-ink-300" />
          <p className="mt-4 text-ink-600">Tudo tranquilo por aqui. Nenhuma notificação.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((n) => {
            const inner = (
              <div
                onClick={() => clicarItem(n)}
                className={`card p-4 flex items-start gap-3 ${
                  !n.lida ? 'border-brand-200 bg-brand-50/50' : ''
                } cursor-pointer hover:shadow-soft transition`}
              >
                {n.perfis ? (
                  <Avatar nome={n.perfis.nome_completo} url={n.perfis.avatar_url} size={40} />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">
                    <Bell className="w-5 h-5" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold text-ink-900 ${!n.lida ? '' : 'opacity-80'}`}>{n.titulo}</p>
                    {!n.lida && <span className="w-2 h-2 rounded-full bg-brand-500" />}
                  </div>
                  <p className="text-sm text-ink-600 mt-0.5">{n.mensagem}</p>
                  <p className="text-xs text-ink-400 mt-1">{formatDate(n.criado_em, "dd 'de' MMM 'às' HH:mm")}</p>
                </div>
              </div>
            );
            return n.evento_id ? (
              <Link key={n.id} to={`/app/eventos/${n.evento_id}`} className="block">
                {inner}
              </Link>
            ) : (
              <div key={n.id}>{inner}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}

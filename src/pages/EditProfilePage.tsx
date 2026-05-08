import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { atualizarPerfil } from '@/api/perfil';
import { useAuth } from '@/lib/auth-context';

const USERNAME_RX = /^[a-zA-Z0-9_]+$/;

export default function EditProfilePage() {
  const { user, perfil, refreshPerfil } = useAuth();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [usuario, setUsuario] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (perfil) {
      setNome(perfil.nome_completo ?? '');
      setUsuario(perfil.nome_usuario ?? '');
    }
  }, [perfil]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError(null);
    if (!nome.trim()) return setError('Informe o nome');
    if (usuario.length < 3) return setError('Username precisa ter pelo menos 3 caracteres');
    if (!USERNAME_RX.test(usuario)) return setError('Username só pode ter letras, números e _');
    setLoading(true);
    try {
      await atualizarPerfil({
        userId: user.id,
        nomeCompleto: nome.trim(),
        nomeUsuario: usuario.trim(),
      });
      await refreshPerfil();
      navigate(-1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-ink-700 hover:text-ink-900 text-sm font-medium mb-6">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>
      <h1 className="font-display text-3xl font-bold mb-2">Editar perfil</h1>
      <p className="text-ink-600 mb-6">Como você prefere ser visto pela galera.</p>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div>
          <label className="label">Nome completo</label>
          <input className="input" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>
        <div>
          <label className="label">Nome de usuário</label>
          <input
            className="input"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value.toLowerCase())}
            required
          />
        </div>
        {error && (
          <div className="rounded-xl bg-danger-100 text-danger-600 px-4 py-3 text-sm">{error}</div>
        )}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Salvando…' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}

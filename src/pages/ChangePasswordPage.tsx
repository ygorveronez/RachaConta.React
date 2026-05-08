import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { atualizarSenha } from '@/api/auth';

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [novaSenha, setNova] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (novaSenha.length < 6) return setError('Mínimo 6 caracteres');
    if (novaSenha !== confirmar) return setError('As senhas não conferem');
    setLoading(true);
    try {
      await atualizarSenha(novaSenha);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-ink-700 hover:text-ink-900 text-sm font-medium mb-6">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>
      <h1 className="font-display text-3xl font-bold mb-2">Trocar senha</h1>
      <p className="text-ink-600 mb-6">Sua sessão atual é o suficiente — não precisa digitar a senha antiga.</p>

      {done ? (
        <div className="card p-8 text-center">
          <CheckCircle2 className="mx-auto w-12 h-12 text-lime-500" />
          <p className="mt-4 font-semibold text-ink-900">Senha trocada com sucesso!</p>
          <button className="btn-primary mt-6" onClick={() => navigate('/app/perfil')}>
            Voltar para o perfil
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card p-6 space-y-5">
          <div>
            <label className="label">Nova senha</label>
            <input type="password" className="input" value={novaSenha} onChange={(e) => setNova(e.target.value)} required />
          </div>
          <div>
            <label className="label">Confirmar nova senha</label>
            <input type="password" className="input" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} required />
          </div>
          {error && (
            <div className="rounded-xl bg-danger-100 text-danger-600 px-4 py-3 text-sm">{error}</div>
          )}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Salvando…' : 'Trocar senha'}
          </button>
        </form>
      )}
    </div>
  );
}

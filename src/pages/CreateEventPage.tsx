import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { criarEvento } from '@/api/eventos';

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!nome.trim()) return setError('Dê um nome pro rolê');
    setLoading(true);
    try {
      const eventoId = await criarEvento({
        nome: nome.trim(),
        descricao: descricao.trim() || null,
        dataEvento: data || null,
      });
      navigate(`/app/eventos/${eventoId}`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar evento');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-ink-700 hover:text-ink-900 text-sm font-medium mb-6">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>
      <h1 className="font-display text-3xl font-bold mb-2">Novo evento</h1>
      <p className="text-ink-600 mb-8">Viagem? Jantar? República? Dá um nome e a gente cuida do resto.</p>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div>
          <label className="label">Nome *</label>
          <input
            className="input"
            placeholder="Viagem Chapada, Aniversário da Bia, República 2026…"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div>
          <label className="label">Descrição (opcional)</label>
          <textarea
            className="input min-h-[88px] resize-none"
            placeholder="Algum detalhe que ajude a galera a lembrar?"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Data (opcional)</label>
          <input
            type="date"
            className="input"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>

        {error && (
          <div className="rounded-xl bg-danger-100 text-danger-600 px-4 py-3 text-sm">{error}</div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full text-base py-4">
          {loading ? 'Criando…' : 'Criar evento'}
        </button>
      </form>
    </div>
  );
}

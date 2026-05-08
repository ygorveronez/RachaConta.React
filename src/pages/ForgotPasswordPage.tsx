import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import {
  enviarCodigoRecuperacao,
  atualizarSenha,
  verificarCodigoRecuperacao,
  signOut,
} from '@/api/auth';
import { Logo } from '@/components/Logo';

type Step = 'EMAIL' | 'CODE_AND_PASSWORD' | 'DONE';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('EMAIL');
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function enviarCodigo(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await enviarCodigoRecuperacao(email.trim());
      setStep('CODE_AND_PASSWORD');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar código');
    } finally {
      setLoading(false);
    }
  }

  async function confirmar_(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (codigo.length < 4) return setError('Código inválido');
    if (novaSenha.length < 6) return setError('Senha precisa ter pelo menos 6 caracteres');
    if (novaSenha !== confirmar) return setError('As senhas não conferem');
    setLoading(true);
    try {
      await verificarCodigoRecuperacao(email.trim(), codigo.trim());
      await atualizarSenha(novaSenha);
      await signOut(); // força novo login com a senha nova
      setStep('DONE');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Código inválido ou expirado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-50 p-6">
      <div className="w-full max-w-md">
        <Link to="/entrar" className="flex items-center gap-2 text-ink-700 hover:text-ink-900 text-sm font-medium mb-6">
          <ArrowLeft className="w-4 h-4" /> Voltar para login
        </Link>
        <div className="card p-8">
          <Logo size={40} withWordmark />

          {step === 'EMAIL' && (
            <>
              <h2 className="mt-6 font-display text-2xl font-bold">Recuperar senha</h2>
              <p className="text-ink-600 mt-1">
                Digite o e-mail da sua conta. A gente te manda um código de 6 dígitos.
              </p>
              <form className="mt-6 space-y-4" onSubmit={enviarCodigo}>
                <div>
                  <label className="label">E-mail</label>
                  <input
                    type="email"
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <div className="rounded-xl bg-danger-100 text-danger-600 px-4 py-3 text-sm">{error}</div>
                )}
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? 'Enviando…' : 'Enviar código'}
                </button>
              </form>
            </>
          )}

          {step === 'CODE_AND_PASSWORD' && (
            <>
              <h2 className="mt-6 font-display text-2xl font-bold">Quase lá</h2>
              <p className="text-ink-600 mt-1">
                Cole o código que chegou no e-mail <span className="font-semibold">{email}</span> e escolha
                uma senha nova.
              </p>
              <form className="mt-6 space-y-4" onSubmit={confirmar_}>
                <div>
                  <label className="label">Código de 6 dígitos</label>
                  <input
                    className="input tracking-[0.5em] text-center font-mono text-lg"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    inputMode="numeric"
                    maxLength={6}
                    required
                  />
                </div>
                <div>
                  <label className="label">Nova senha</label>
                  <input
                    type="password"
                    className="input"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="label">Confirmar nova senha</label>
                  <input
                    type="password"
                    className="input"
                    value={confirmar}
                    onChange={(e) => setConfirmar(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <div className="rounded-xl bg-danger-100 text-danger-600 px-4 py-3 text-sm">{error}</div>
                )}
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? 'Salvando…' : 'Salvar nova senha'}
                </button>
              </form>
            </>
          )}

          {step === 'DONE' && (
            <div className="mt-6 text-center">
              <CheckCircle2 className="mx-auto w-14 h-14 text-lime-500" />
              <h2 className="mt-4 font-display text-2xl font-bold">Senha redefinida!</h2>
              <p className="text-ink-600 mt-2">
                Pronto. Agora é só entrar com sua senha nova.
              </p>
              <button onClick={() => navigate('/entrar')} className="btn-primary w-full mt-6">
                Ir para o login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

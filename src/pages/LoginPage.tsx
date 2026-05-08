import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { signIn } from '@/api/auth';
import { Logo } from '@/components/Logo';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/app';

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(emailOrUsername.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-brand-600 to-brand-800 text-white">
        <Link to="/" className="flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Voltar para o site
        </Link>
        <div>
          <span className="inline-flex items-center gap-3">
            <span className="inline-flex items-center justify-center bg-white rounded-2xl p-2 shadow-soft">
              <Logo size={40} />
            </span>
            <span className="text-2xl font-extrabold tracking-tight text-white">RachaConta</span>
          </span>
          <h1 className="mt-8 text-4xl font-bold leading-tight">
            Bom te ver de volta. <br />
            <span className="text-lime-400">A turma já tá esperando.</span>
          </h1>
          <p className="mt-4 text-brand-100 max-w-md">
            Entre e veja quem te deve, quem você deve e qual rolê está te esperando.
          </p>
        </div>
        <p className="text-sm text-brand-100/80">
          Ainda sem conta?{' '}
          <Link to="/cadastro" className="underline font-semibold text-lime-400">
            Crie em 30 segundos.
          </Link>
        </p>
      </div>

      <div className="flex items-center justify-center p-6 md:p-10 bg-ink-50">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-8">
            <Logo size={40} withWordmark />
          </div>
          <h2 className="text-3xl font-bold text-ink-900">Entrar</h2>
          <p className="text-ink-600 mt-1">Use seu e-mail ou nome de usuário.</p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="label">E-mail ou usuário</label>
              <input
                type="text"
                className="input"
                placeholder="ex: ygor@email.com  ou  ygor93"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div>
              <label className="label">Senha</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="input pr-12"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink-500 hover:text-ink-800"
                  aria-label={showPwd ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-danger-100 text-danger-600 px-4 py-3 text-sm">{error}</div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full text-base py-4">
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <Link to="/recuperar-senha" className="link">
              Esqueci minha senha
            </Link>
            <Link to="/cadastro" className="link">
              Criar conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

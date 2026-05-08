import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { signUp } from '@/api/auth';
import { Logo } from '@/components/Logo';

const USERNAME_RX = /^[a-zA-Z0-9_]+$/;
const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUpPage() {
  const navigate = useNavigate();
  const [nomeCompleto, setNome] = useState('');
  const [nomeUsuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!nomeCompleto.trim()) return setError('Informe seu nome completo');
    if (nomeUsuario.length < 3) return setError('Username precisa ter pelo menos 3 caracteres');
    if (!USERNAME_RX.test(nomeUsuario)) return setError('Username só pode ter letras, números e _');
    if (!EMAIL_RX.test(email)) return setError('E-mail inválido');
    if (senha.length < 6) return setError('Senha precisa ter pelo menos 6 caracteres');
    if (senha !== confirmar) return setError('As senhas não conferem');

    setLoading(true);
    try {
      await signUp({
        email: email.trim(),
        password: senha,
        nomeCompleto: nomeCompleto.trim(),
        nomeUsuario: nomeUsuario.trim(),
      });
      navigate('/app', { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro no cadastro';
      // Mensagem amigável quando autoconfirm está desligado.
      if (msg.toLowerCase().includes('verifique seu e-mail')) {
        setInfo(msg);
      } else {
        setError(msg);
      }
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
            Bem-vindo ao <span className="text-lime-400">grupo onde dinheiro</span> não vira treta.
          </h1>
          <p className="mt-4 text-brand-100 max-w-md">
            Em 30 segundos sua conta tá pronta. Crie um evento, convide a galera e nunca mais saia
            do bar fazendo conta de cabeça.
          </p>
        </div>
        <p className="text-sm text-brand-100/80">
          Já tem conta?{' '}
          <Link to="/entrar" className="underline font-semibold text-lime-400">
            Entrar agora.
          </Link>
        </p>
      </div>

      <div className="flex items-center justify-center p-6 md:p-10 bg-ink-50">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-8">
            <Logo size={40} withWordmark />
          </div>
          <h2 className="text-3xl font-bold text-ink-900">Criar conta grátis</h2>
          <p className="text-ink-600 mt-1">Sem cartão. Sem letrinha. Sem complicação.</p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="label">Nome completo</label>
              <input
                className="input"
                value={nomeCompleto}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Como te chamam"
                required
              />
            </div>
            <div>
              <label className="label">Nome de usuário</label>
              <input
                className="input"
                value={nomeUsuario}
                onChange={(e) => setUsuario(e.target.value.toLowerCase())}
                placeholder="ygor93"
                required
              />
              <p className="text-xs text-ink-500 mt-1">Letras, números e _ . Mínimo 3 caracteres.</p>
            </div>
            <div>
              <label className="label">E-mail</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="label">Senha</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="input pr-12"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  autoComplete="new-password"
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
            <div>
              <label className="label">Confirmar senha</label>
              <input
                type={showPwd ? 'text' : 'password'}
                className="input"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-danger-100 text-danger-600 px-4 py-3 text-sm">{error}</div>
            )}
            {info && (
              <div className="rounded-xl bg-lime-100 text-brand-700 px-4 py-3 text-sm">{info}</div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full text-base py-4">
              {loading ? 'Criando conta…' : 'Criar conta grátis'}
            </button>
          </form>

          <p className="mt-6 text-sm text-ink-600">
            Ao criar conta você concorda em usar com responsabilidade e não brigar com seus amigos por R$ 1,50.
          </p>
        </div>
      </div>
    </div>
  );
}

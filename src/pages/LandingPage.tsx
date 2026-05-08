import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  Coffee,
  Heart,
  PartyPopper,
  Plane,
  Sparkles,
  Star,
  Users,
  Wallet,
  Zap,
  ShieldCheck,
  MessageCircleHeart,
  Smartphone,
} from 'lucide-react';
import { Logo } from '@/components/Logo';

/**
 * Landing page com técnicas de PNL aplicadas:
 *  - Pacing & leading (concorda com a dor → guia para a solução)
 *  - Comandos embutidos suaves ("imagine voltar...", "sinta a leveza...")
 *  - Ancoragem positiva (cores, palavras de prazer; cores quentes nos benefícios)
 *  - Contraste (antes/depois)
 *  - Prova social (depoimentos, estatísticas)
 *  - Reciprocidade ("100% grátis para usar")
 *  - Compromisso pequeno (CTA "criar conta grátis em 30 segundos")
 *  - Storytelling ("o jantar que quase virou briga")
 *  - Pressuposição ("quando você terminar a próxima viagem...")
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ink-50">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-ink-100">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-2">
          <Logo size={32} className="sm:hidden" />
          <Logo size={36} withWordmark className="hidden sm:inline-flex" />
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-700">
            <a href="#dor" className="hover:text-brand-600">Por que existe</a>
            <a href="#como-funciona" className="hover:text-brand-600">Como funciona</a>
            <a href="#provas" className="hover:text-brand-600">Quem já usa</a>
            <a href="#perguntas" className="hover:text-brand-600">FAQ</a>
          </nav>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link to="/entrar" className="btn-ghost px-3 py-2 sm:px-5 sm:py-3 whitespace-nowrap">Entrar</Link>
            <Link to="/cadastro" className="btn-primary px-3 py-2 sm:px-5 sm:py-3 whitespace-nowrap">
              <span className="sm:hidden">Cadastrar</span>
              <span className="hidden sm:inline">Criar conta grátis</span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO — Pacing (validação da dor) → Leading (oferta da solução) */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-90"
          style={{
            background:
              'radial-gradient(800px 400px at 80% -10%, rgba(181,230,47,0.20), transparent 60%), radial-gradient(900px 500px at -10% 0%, rgba(30,39,204,0.18), transparent 50%), linear-gradient(180deg, #FFFFFF 0%, #F0F1FF 100%)',
          }}
        />
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-20 md:pt-20 md:pb-28 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <span className="chip-lime mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Feito por brasileiros, pra rolês brasileiros
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold text-ink-900 leading-[1.05]">
              Pare de fazer <span className="text-brand-600">conta no grupo</span> e voltar
              da viagem com <span className="underline decoration-lime-500 decoration-[6px] underline-offset-4">cara feia</span>.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-ink-700 max-w-xl">
              Você divide o rolê. A gente divide a conta. <span className="font-semibold text-ink-900">Sem planilha,
              sem grupo do "ah, depois eu te pago" e sem aquele clima estranho na volta.</span>
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/cadastro" className="btn-primary text-base px-6 py-4">
                Criar minha conta grátis
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#como-funciona" className="btn-secondary text-base px-6 py-4">
                Ver como funciona
              </a>
            </div>
            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-ink-700">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-lime-600" /> 100% gratuito pra usar</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-lime-600" /> Cadastro em 30 segundos</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-lime-600" /> Roda no seu navegador, sem instalar</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-lime-600" /> Cálculo do acerto em 1 clique</li>
            </ul>
          </div>
          <div className="relative">
            <FloatingPhone />
          </div>
        </div>
      </section>

      {/* SEÇÃO DOR — Pacing (espelha a realidade do leitor) */}
      <section id="dor" className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-ink-900">
              Você já viveu isso, né?
            </h2>
            <p className="mt-4 text-lg text-ink-600 max-w-2xl mx-auto">
              A gente sabe — porque também já viveu. Veja se essas cenas te lembram alguém:
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'O jantar que terminou em briga',
                text:
                  'Cada um pediu uma coisa, alguém abriu uma garrafa "pra todo mundo", o garçom dividiu por 8 e o silêncio ficou esquisito até o Uber chegar.',
                icon: <PartyPopper className="w-6 h-6" />,
              },
              {
                title: 'A planilha que ninguém olhou',
                text:
                  'Você gastou 40 minutos preenchendo o Excel da viagem. Mandou no grupo. Três pessoas reagiram com "👍". Ninguém pagou.',
                icon: <Wallet className="w-6 h-6" />,
              },
              {
                title: 'O "depois eu te acerto"',
                text:
                  'Já são quatro meses. Você lembra. Ele também lembra. Ninguém fala. Vocês continuam sendo amigos meio de leve.',
                icon: <MessageCircleHeart className="w-6 h-6" />,
              },
            ].map((c) => (
              <div key={c.title} className="card p-6">
                <div className="w-11 h-11 rounded-xl bg-danger-100 text-danger-600 flex items-center justify-center mb-4">
                  {c.icon}
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{c.title}</h3>
                <p className="text-ink-600 leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-12 text-center text-ink-700 max-w-3xl mx-auto text-lg">
            <span className="font-semibold text-ink-900">Imagine voltar do próximo rolê</span> sem precisar pensar em
            quem deve quanto. Sem planilha. Sem cobrar ninguém. Só os boas memórias.
          </p>
        </div>
      </section>

      {/* SEÇÃO COMO FUNCIONA — Leading + pressuposição */}
      <section id="como-funciona" className="py-16 md:py-24 bg-ink-50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-14">
            <span className="chip-brand mb-4 inline-flex">
              <Zap className="w-3.5 h-3.5" /> Em 3 passos
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-ink-900">
              Tão simples que você vai usar <em className="text-brand-600 not-italic">já</em> na próxima saída.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Crie um evento',
                text: 'Viagem? Jantar? República? Em 5 segundos você cria um espaço pra rachar.',
                icon: <Plane className="w-6 h-6" />,
              },
              {
                step: '02',
                title: 'Adicione despesas',
                text: 'Cada um lança o que pagou. Divide igual ou no valor exato — você escolhe.',
                icon: <Calculator className="w-6 h-6" />,
              },
              {
                step: '03',
                title: 'Veja o acerto pronto',
                text: 'O RachaConta calcula o número mínimo de transferências. Você só copia o Pix.',
                icon: <CheckCircle2 className="w-6 h-6" />,
              },
            ].map((s) => (
              <div key={s.step} className="relative card p-7 hover:shadow-soft transition">
                <span className="absolute -top-3 -left-3 w-12 h-12 rounded-2xl bg-brand-500 text-white font-display text-xl font-bold flex items-center justify-center shadow-soft">
                  {s.step}
                </span>
                <div className="w-11 h-11 rounded-xl bg-lime-100 text-brand-700 flex items-center justify-center mb-4">
                  {s.icon}
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-ink-600 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 text-center">
            <Link to="/cadastro" className="btn-primary text-base px-7 py-4">
              Quero testar agora
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SEÇÃO BENEFÍCIOS — Ancoragem positiva */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink-900 mb-6">
              O que muda na sua vida quando você usa o RachaConta:
            </h2>
            <div className="space-y-5">
              {[
                {
                  icon: <Heart className="w-5 h-5" />,
                  title: 'Suas amizades intactas',
                  text: 'O dinheiro deixa de ser assunto desconfortável. Cada um vê quanto deve, paga, pronto.',
                },
                {
                  icon: <Zap className="w-5 h-5" />,
                  title: 'Tempo de volta',
                  text: 'Adeus 40 minutos no Excel. O acerto sai em segundos.',
                },
                {
                  icon: <Coffee className="w-5 h-5" />,
                  title: 'Tranquilidade no rolê',
                  text: 'Anote a despesa na hora. Esquece. Curte. A conta espera.',
                },
                {
                  icon: <ShieldCheck className="w-5 h-5" />,
                  title: 'Transparência total',
                  text: 'Todo mundo vê o mesmo cálculo. Ninguém precisa "confiar na palavra".',
                },
              ].map((b) => (
                <div key={b.title} className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
                    {b.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink-900 text-lg">{b.title}</h3>
                    <p className="text-ink-600">{b.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-8 bg-gradient-to-br from-brand-500 to-brand-700 text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-lime-500/30 blur-2xl" />
            <span className="chip-lime inline-flex mb-4 !bg-lime-400 !text-brand-700">Antes & Depois</span>
            <div className="space-y-5">
              <div>
                <p className="text-xs uppercase tracking-wide text-brand-100">Antes</p>
                <p className="text-lg font-medium line-through opacity-80">
                  "Galera, fiz uma planilha. Cada um confere e me avisa se tá certo, ok?"
                </p>
              </div>
              <div className="border-t border-white/20" />
              <div>
                <p className="text-xs uppercase tracking-wide text-lime-400">Depois</p>
                <p className="text-2xl font-display font-semibold leading-snug">
                  "Manda Pix de R$ 87,40 pra mim que tá fechado. 🍻"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO PROVA SOCIAL — Cialdini */}
      <section id="provas" className="py-16 md:py-24 bg-ink-50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            {[
              { v: '+1.200', l: 'rolês divididos' },
              { v: 'R$ 380k', l: 'em despesas rachadas' },
              { v: '4,9', l: 'estrelas dos amigos' },
              { v: '0', l: 'brigas no Pix' },
            ].map((s) => (
              <div key={s.l} className="card p-6 text-center">
                <p className="font-display text-3xl md:text-4xl font-bold text-brand-600">{s.v}</p>
                <p className="text-sm text-ink-600 mt-1">{s.l}</p>
              </div>
            ))}
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-ink-900 mb-12">
            Quem já usa não consegue mais fazer um rolê sem.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                nome: 'Letícia, 27',
                role: 'Voltou do Chile sem dor de cabeça',
                quote:
                  'Éramos 6, com 18 despesas misturadas. No fim da viagem o RachaConta cuspiu 4 Pix e tava resolvido. Salvou minha sanidade.',
              },
              {
                nome: 'Marcos, 31',
                role: 'República em SP',
                quote:
                  'A gente brigava todo mês com a divisão da feira e do mercado. Faz 8 meses que não tem mais discussão na cozinha.',
              },
              {
                nome: 'Bia, 24',
                role: 'Aniversário em Floripa',
                quote:
                  'Cada um pagou uma coisa diferente no churrasco. Em 30 segundos eu vi quem me devia o quê. Genial.',
              },
            ].map((d) => (
              <div key={d.nome} className="card p-6">
                <div className="flex items-center gap-1 text-lime-600 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-ink-700 leading-relaxed">"{d.quote}"</p>
                <div className="mt-4 pt-4 border-t border-ink-100">
                  <p className="font-semibold text-ink-900">{d.nome}</p>
                  <p className="text-sm text-ink-500">{d.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO USO — Diversidade de cenários (escassez de uso ruim) */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-ink-900 mb-12">
            Pensa em <em className="text-brand-600 not-italic">qualquer</em> rolê. A gente cuida da conta.
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Plane className="w-6 h-6" />, l: 'Viagens em grupo' },
              { icon: <Users className="w-6 h-6" />, l: 'República' },
              { icon: <PartyPopper className="w-6 h-6" />, l: 'Festa de aniversário' },
              { icon: <Coffee className="w-6 h-6" />, l: 'Café da empresa' },
              { icon: <Wallet className="w-6 h-6" />, l: 'Casamento dos amigos' },
              { icon: <Smartphone className="w-6 h-6" />, l: 'Assinaturas rachadas' },
              { icon: <Heart className="w-6 h-6" />, l: 'Presente coletivo' },
              { icon: <Calculator className="w-6 h-6" />, l: 'Churrasco de domingo' },
            ].map((u) => (
              <div
                key={u.l}
                className="card p-5 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-soft transition"
              >
                <div className="w-12 h-12 rounded-2xl bg-lime-100 text-brand-700 flex items-center justify-center mb-3">
                  {u.icon}
                </div>
                <p className="font-medium text-ink-800">{u.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — quebra de objeções */}
      <section id="perguntas" className="py-16 md:py-24 bg-ink-50">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-ink-900 mb-12">
            Antes que você pergunte…
          </h2>
          <div className="space-y-3">
            {[
              {
                q: 'O RachaConta é grátis mesmo?',
                a: 'É. Esse projeto nasceu como um TCC e a gente decidiu manter aberto pra galera usar à vontade.',
              },
              {
                q: 'Preciso instalar alguma coisa?',
                a: 'Não. Aqui você usa direto no navegador. Tem também um app Android nativo se preferir.',
              },
              {
                q: 'E se um dos meus amigos não tem conta?',
                a: 'Sem problema. Você pode adicionar como participante externo, ele entra depois e o histórico migra automático.',
              },
              {
                q: 'Como funciona a divisão "manual"?',
                a: 'Quando alguém comeu mais ou bebeu mais, você define o valor de cada um na mão. A gente confere se a soma bate com o total.',
              },
              {
                q: 'Os meus dados ficam seguros?',
                a: 'Sim. Usamos Supabase com Row Level Security: ninguém vê o que não pode ver, nem se quiser.',
              },
            ].map((f) => (
              <details
                key={f.q}
                className="group card p-5 open:shadow-soft cursor-pointer"
              >
                <summary className="flex justify-between items-center font-semibold text-ink-900 list-none">
                  {f.q}
                  <span className="ml-4 text-brand-500 transition group-open:rotate-45 text-2xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-ink-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL — comando direto */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-brand-600 to-brand-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage:
            'radial-gradient(600px 300px at 80% 0%, rgba(181,230,47,0.6), transparent 60%), radial-gradient(700px 350px at 0% 100%, rgba(255,255,255,0.15), transparent 60%)',
        }} />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">
            Da próxima vez que rolar um <span className="text-lime-400">churrasco</span>, uma <span className="text-lime-400">viagem</span> ou um <span className="text-lime-400">jantar</span>…
          </h2>
          <p className="mt-6 text-xl text-brand-100">
            …você já vai estar com a conta dividida antes mesmo do Uber chegar.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/cadastro" className="btn-lime text-base px-8 py-4">
              Criar conta grátis em 30 segundos
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/entrar" className="btn-secondary text-base px-8 py-4 !bg-white/10 !text-white !border-white/30 hover:!bg-white/20">
              Já tenho conta
            </Link>
          </div>
          <p className="mt-6 text-sm text-brand-100/80">
            Sem cartão de crédito. Sem letra miúda. Sem grupo do "depois eu te pago".
          </p>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="py-8 bg-ink-900 text-ink-400 text-sm">
        <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <span className="inline-flex items-center gap-2">
            <span className="inline-flex items-center justify-center bg-white rounded-xl p-1.5">
              <Logo size={24} />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-white">RachaConta</span>
          </span>
          <p>© {new Date().getFullYear()} RachaConta — feito com 💚 e contas certinhas.</p>
        </div>
      </footer>
    </div>
  );
}

function FloatingPhone() {
  return (
    <div className="relative mx-auto max-w-sm">
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-lime-500/30 blur-3xl" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-brand-500/30 blur-3xl" />
      <div className="relative card p-5 rounded-3xl border-ink-200 shadow-soft animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Logo size={28} />
            <p className="font-display font-semibold text-ink-900">Viagem Chapada</p>
          </div>
          <span className="chip-lime">Ativo</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="rounded-xl bg-lime-100 px-4 py-3">
            <p className="text-xs text-brand-700">Você recebe</p>
            <p className="font-display font-bold text-xl text-brand-700">R$ 184,30</p>
          </div>
          <div className="rounded-xl bg-ink-100 px-4 py-3">
            <p className="text-xs text-ink-600">Você deve</p>
            <p className="font-display font-bold text-xl text-ink-800">R$ 0,00</p>
          </div>
        </div>

        <p className="text-xs uppercase tracking-wide text-ink-500 font-semibold mb-2">Despesas</p>
        <ul className="space-y-3">
          {[
            { i: <Plane className="w-4 h-4" />, t: 'Hospedagem (3 diárias)', v: 720, who: 'Bia pagou' },
            { i: <Coffee className="w-4 h-4" />, t: 'Almoço quinta', v: 138.5, who: 'Você pagou' },
            { i: <PartyPopper className="w-4 h-4" />, t: 'Bar sexta', v: 245, who: 'Marcos pagou' },
          ].map((d) => (
            <li key={d.t} className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
                {d.i}
              </span>
              <div className="flex-1">
                <p className="font-medium text-ink-900">{d.t}</p>
                <p className="text-xs text-ink-500">{d.who}</p>
              </div>
              <p className="font-semibold text-ink-900">
                {d.v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </li>
          ))}
        </ul>

        <button className="mt-5 btn-primary w-full">Ver acerto final</button>
      </div>
    </div>
  );
}

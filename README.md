# RachaConta — Web

Versão web do **RachaConta** (app Android nativo localizado em [`../RachaConta`](../RachaConta)).
Mesmo backend (Supabase), mesma identidade visual, mesmas funcionalidades, com uma **Landing
Page de venda** voltada a aquisição na rota `/`.

## Stack

- **Vite + React 18 + TypeScript**
- **Tailwind CSS** (paleta Royal Blue + Lime espelhada de [`Color.kt`](../RachaConta/app/src/main/java/com/example/rachaconta02/ui/theme/Color.kt))
- **react-router-dom v6** (rotas SPA)
- **@supabase/supabase-js v2** (mesma instância do app Android)
- **lucide-react** (ícones, paralelo aos Material Icons)
- **date-fns + ptBR** (formatação)
- **Fonte**: Inter (única, sem serif decorativa). Logo usa o PNG original do app.

## Como rodar localmente

Pré-requisitos: **Node.js 18+** e npm (ou pnpm/yarn).

```bash
cd RachaConta.React
npm install
npm run dev
```

A aplicação sobe em http://localhost:5173.

> O `vite.config.ts` está configurado com `open: true`, então o navegador abre sozinho.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe o servidor de desenvolvimento com HMR |
| `npm run build` | Type-check + bundle de produção em `dist/` |
| `npm run preview` | Servidor estático servindo o build |
| `npm run lint` | Apenas type-check (sem emitir) |

## Estrutura

```
src/
├── api/                  # Camada de chamadas Supabase (espelha os repositories Kotlin)
│   ├── auth.ts           # signUp, signIn, OTP, profile lookup
│   ├── eventos.ts        # criar/listar/arquivar/participantes
│   ├── despesas.ts       # CRUD + RPCs (resumo financeiro, acerto)
│   ├── perfil.ts         # leitura/atualização de perfis
│   └── notificacoes.ts   # listar, marcar como lida, contar
├── components/
│   ├── AppLayout.tsx     # Header + bottom nav (mobile) — análogo ao MainActivity
│   ├── Avatar.tsx        # Avatar com cores da paleta
│   ├── Logo.tsx          # SVG do logo (Royal Blue + Lime)
│   └── ProtectedRoute.tsx
├── lib/
│   ├── supabase.ts       # Cliente Supabase (mesma URL/anon key do Android)
│   ├── auth-context.tsx  # Provider com user/perfil/session
│   └── format.ts         # formatBRL, formatDate, initials, avatarColor
├── pages/
│   ├── LandingPage.tsx   # Landing pública com técnicas de PNL
│   ├── LoginPage.tsx
│   ├── SignUpPage.tsx
│   ├── ForgotPasswordPage.tsx     # OTP de 6 dígitos (não usa link)
│   ├── HomePage.tsx
│   ├── HistoryPage.tsx
│   ├── CreateEventPage.tsx
│   ├── EventDetailsPage.tsx       # 3 abas: despesas, participantes, resumo
│   ├── AddExpensePage.tsx         # também serve como Edit
│   ├── InviteParticipantsPage.tsx # busca + adicionar externo por e-mail
│   ├── SettlementPage.tsx         # acerto final (RPC calcular_acerto_contas)
│   ├── NotificationsPage.tsx
│   ├── ProfilePage.tsx
│   ├── EditProfilePage.tsx
│   └── ChangePasswordPage.tsx
├── types/dto.ts          # DTOs em snake_case (idênticos ao schema Postgres)
├── App.tsx               # Routing
├── main.tsx
└── index.css             # Tailwind layer + tokens de design
```

## Mapeamento de telas (web ↔ Android)

| Web | Android |
|---|---|
| `/` | (não existe — landing é nova) |
| `/entrar` | `LoginScreen` |
| `/cadastro` | `SignUpScreen` |
| `/recuperar-senha` | `ForgotPasswordScreen` |
| `/app` | `HomeScreen` |
| `/app/historico` | `HistoryScreen` |
| `/app/notificacoes` | `NotificationsScreen` |
| `/app/eventos/novo` | `CreateEventScreen` |
| `/app/eventos/:id` | `EventDetailsScreen` |
| `/app/eventos/:id/despesa[/:expenseId]` | `AddExpenseScreen` / `EditExpenseScreen` |
| `/app/eventos/:id/convidar` | `InviteParticipantsScreen` |
| `/app/eventos/:id/acerto` | `FinalSettlementScreen` |
| `/app/perfil` | `ProfileScreen` |
| `/app/perfil/editar` | `EditProfileScreen` |
| `/app/perfil/senha` | `ChangePasswordScreen` |

## Backend

Usa a **mesma instância Supabase** do Android (URL e `anon key` no [`src/lib/supabase.ts`](src/lib/supabase.ts)).
A segurança continua apoiada nas RLS policies — o cliente nunca filtra por `usuario_id` à mão.

RPCs consumidas (idênticas ao app Android):
- `verificar_username`, `obter_email_por_username`, `criar_ou_migrar_perfil`
- `criar_evento_com_admin`, `arquivar_evento`, `buscar_usuarios`, `adicionar_participante_externo`
- `criar_despesa_com_divisoes`, `atualizar_despesa_com_divisoes`, `deletar_despesa`
- `resumo_financeiro_evento`, `calcular_acerto_contas`
- `contar_notificacoes_nao_lidas`, `marcar_todas_notificacoes_lidas`

## Identidade visual

- **Primary**: `#1E27CC` (Royal Blue) — mesmo `BrandBlue500` do Android.
- **Accent**: `#B5E62F` (Lime Green) — mesmo `Green500`.
- **Fonte única**: Inter — clean, neutra, sem serif decorativa.
- **Logo**: PNGs originais copiados do app Android (`public/rachaconta-logo.png` e `public/rachaconta-icon.png`).
- **Body font**: Inter.

A paleta inteira está em [`tailwind.config.js`](tailwind.config.js) e é uma cópia 1:1 da paleta Material 3 do app.

# Amor Odonto — Frontend

Interface do sistema de agendamento da clínica (paciente, profissional e admin). Stack: React + Vite + Tailwind + React Router + Axios.

Consome a API em [`../backend`](../backend). Contrato completo no Swagger do backend: http://localhost:3000/api/docs.

## Setup

1. Suba o backend (`cd ../backend && npm run dev`) — por padrão em `http://localhost:3000`.
2. `npm install`
3. `cp .env.example .env` e, se necessário, ajuste `VITE_API_URL` (padrão `http://localhost:3000/api`).
4. `npm run dev` → http://localhost:5173

### Usuários para testar

| Papel | Como obter |
|---|---|
| `client` | Tela **Criar conta** (`POST /api/auth/register`) |
| `admin` | No backend: `npm run seed:admin -- admin@exemplo.com senha123 "Admin"` |
| `professional` | Um admin busca o usuário (`GET /api/users?search=`) e o promove em **Equipe** (admin), que usa `PATCH /api/users/:id/role` |

## Identidade visual

- Cor primária: verde-pinho (`pine-600` #1F4D45); acento em ocre (`ochre-500` #B8863B), usado com moderação em confirmações/destaques
- Tipografia: Fraunces (serif) para títulos, Inter para interface e formulários
- Fundo: papel quente (`canvas` #F5F1EA)
- Telas de login/registro usam layout split-screen (identidade à esquerda, formulário à direita) para fugir do card centralizado genérico

## Estrutura

- `src/api/axios.js` — instância do axios: injeta o token em cada requisição e, em `401` com token, limpa a sessão (`setUnauthorizedHandler`)
- `src/api/{auth,products,availability,appointments,blocks,users}.js` — serviços por recurso: funções finas sobre `api` que devolvem `res.data` (ex.: `listProducts`, `getAvailability`, `createAppointment`, `cancelAppointment`, `setBlockActive`, `updateUserRole`, `listUsers`, `updateProfile`). Páginas chamam esses serviços, nunca montam URLs
- `src/api/errors.js` — `getApiError(err)` normaliza os erros da API (`{ message }` ou `{ message, errors: [{ field, message }] }`) em `{ message, fieldErrors, status }`
- `src/context/AuthContext.jsx` — estado de autenticação; token só no `localStorage`, `user` = `{ _id, name, email, role }`; expõe `login`, `register`, `logout`, `updateProfile` (PATCH `/auth/me` + atualiza o `user`), `user`, `loading`
- `src/context/ToastContext.jsx` — `useToast()` → `toast.success(msg)` / `toast.error(msg)` (somem em ~4 s; região `aria-live`)
- `src/hooks/useAsync.js` — `useAsync(fn, deps)` → `{ data, loading, error, reload }`; `error` já passa por `getApiError` e respostas obsoletas são descartadas
- `src/hooks/useProfessionals.js` — admin: `{ professionals, nameById }` a partir de `GET /users?role=professional` (selects e nomes dos bloqueios, cujo `professional` vem só como ID)
- `src/utils/roles.js` — `ROLES` (`client`, `professional`, `admin`), `ROLE_LABELS`, `homePathFor(role)` e `navItemsFor(role)` (navegação do layout por papel + "Meu perfil")
- `src/utils/dates.js` — datas sempre exibidas no fuso da clínica (`America/Sao_Paulo`), qualquer que seja o fuso do navegador: `formatDate`, `formatTime`, `formatDateTime`, `formatWeekdayDate`, `formatTimeRange`, `toISO`; dias como chave `YYYY-MM-DD` (`clinicDayKey`, `startOfClinicDay`, `endOfClinicDay` exclusivo, `endOfClinicDayInclusive`, `addDays`); `clinicDateTime(dayKey, 'HH:mm')` e `clinicTimeKey(date)` para inputs `date`/`time`; `availabilityRange(dayKey, days)` (limitado a 90 dias) e `groupByClinicDay`
- `src/utils/currency.js` — `formatCurrency` (BRL), `parseCurrency` ("1.234,50" → 1234.5; `NaN` se inválido) e `formatDuration` ("1 h 15 min")
- `src/utils/appointments.js` — `APPOINTMENT_STATUS` + rótulos pt-BR, `WEEKDAYS` (0 = domingo, igual a `daysOfWeek` dos bloqueios) e `splitAppointments(list)` → `{ upcoming, past, cancelled }` (próximas em ordem crescente; anteriores e canceladas decrescente)
- `src/utils/blocks.js` — `BLOCK_TYPE`, `WEEKDAYS_FROM_MONDAY`, `formatWeekdays` ("Seg a Sex"), `describeBlock` (título + vigência) e `isBlockEnded`
- `src/components/layout/ProtectedRoute.jsx` — bloqueia rota por papel; papel sem acesso é mandado para a própria home
- `src/components/layout/AuthLayout.jsx` — layout compartilhado das telas de auth
- `src/components/layout/AppLayout.jsx` — layout das áreas logadas: cabeçalho com marca, navegação por papel (rolável no mobile), nome/papel e "Sair"; páginas entram pelo `<Outlet />`. Em `App.jsx`, cada papel é um grupo de rotas aninhadas sob `ProtectedRoute` + `AppLayout`
- `src/components/ui/` — `Button` (variantes `primary`/`secondary`/`ghost`/`danger`, prop `loading`), `PageHeader`, `LoadingState`, `EmptyState`, `ErrorState` (com "Tentar novamente"), `Spinner`, `Badge` (tons `pine`/`danger`/`ochre`/`neutral`) e `Tabs` (abas acessíveis com contagem opcional)
- `src/components/booking/` — etapas do agendamento: `StepIndicator`, `ProductStep`, `ProfessionalStep`, `SlotStep` (janela de 7 dias, abas por dia, grade de horários), `AppointmentSummary`, `OptionCard`
- `src/components/appointments/` — usados nas três agendas: `AppointmentList` (abas Próximas / Anteriores / Canceladas, cancelamento só nas próximas, atualização local sem recarregar; `peopleFor(appointment)` → `[{ label, person }]`), `AppointmentCard` (resumo + detalhe expansível com contato de cada pessoa) e `CancelAppointmentForm` (cancelamento inline em duas etapas, motivo opcional)
- `src/components/blocks/` — `BlockForm` (cria/edita bloqueio único ou recorrente; tipo travado na edição; no admin, "Aplica-se a" clínica inteira ou profissional) e `BlockCard`
- `src/components/admin/ProductForm.jsx` — cria/edita procedimento (nome, duração, preço em BRL, profissionais vinculados)
- `src/components/form/Field.jsx` — campo com label, dica e erro; `as="select"` / `as="textarea"`
- `src/pages/Login.jsx`, `Register.jsx` — autenticação (registro omite telefone vazio e valida senha ≥ 6)
- `src/pages/client/BookAppointment.jsx` (`/`, client) — assistente de agendamento em uma página (procedimento → profissional → dia/horário → confirmação); trocar uma escolha limpa as seguintes; procedimento com um só profissional pula a etapa; `409` avisa e volta para os horários, que são recarregados
- `src/pages/client/MyAppointments.jsx` (`/consultas`, client) — uma chamada a `GET /appointments` separada nas abas Próximas / Anteriores / Canceladas; só as próximas podem ser canceladas, e a consulta cancelada muda de aba sem recarregar a lista
- `src/pages/professional/ProfessionalAgenda.jsx` (`/profissional`) — consultas do profissional logado, com o paciente em cada cartão
- `src/pages/BlocksPage.jsx` (`/profissional/bloqueios` e `/admin/bloqueios` com `isAdmin`) — abas Ativos / Inativos, criar, editar, desativar/reativar
- `src/pages/admin/AdminAppointments.jsx` (`/admin`) — todos os agendamentos, filtro por profissional (`?professional=`) + abas de status
- `src/pages/admin/AdminProducts.jsx` (`/admin/procedimentos`) — lista com inativos, criar/editar inline, desativar/reativar
- `src/pages/admin/AdminTeam.jsx` (`/admin/equipe`) — busca (debounce) + abas por papel; promover a profissional e rebaixar a paciente (com confirmação). Admins não têm ação
- `src/pages/Profile.jsx` (`/perfil`, todos) — dados (nome, telefone; envia só o que mudou, telefone vazio → `null`) e troca de senha (senha atual errada aparece no campo)

## Mapa de telas × endpoints

| Área | Tela | Endpoints |
|---|---|---|
| Paciente | Agendar consulta ✓ | `GET /products`, `GET /availability`, `POST /appointments` |
| Paciente | Minhas consultas ✓ | `GET /appointments`, `PATCH /appointments/:id/cancel` |
| Profissional | Minha agenda ✓ | `GET /appointments`, `PATCH /appointments/:id/cancel` |
| Profissional | Meus bloqueios ✓ | `GET/POST /blocks`, `GET/PATCH /blocks/:id` |
| Admin | Procedimentos ✓ | `GET/POST /products`, `GET/PATCH /products/:id` |
| Admin | Bloqueios (clínica e profissionais) ✓ | `GET/POST /blocks`, `PATCH /blocks/:id` |
| Admin | Agendamentos ✓ | `GET /appointments?professional=`, `PATCH /appointments/:id/cancel` |
| Admin | Equipe ✓ | `GET /users?role=&search=`, `PATCH /users/:id/role` |
| Todos | Meu perfil ✓ | `GET /auth/me`, `PATCH /auth/me` |


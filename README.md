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
| `professional` | Um admin promove um `client` via `PATCH /api/users/:id/role` (hoje só pelo Swagger — ainda não há tela) |

## Identidade visual

- Cor primária: verde-pinho (`pine-600` #1F4D45); acento em ocre (`ochre-500` #B8863B), usado com moderação em confirmações/destaques
- Tipografia: Fraunces (serif) para títulos, Inter para interface e formulários
- Fundo: papel quente (`canvas` #F5F1EA)
- Telas de login/registro usam layout split-screen (identidade à esquerda, formulário à direita) para fugir do card centralizado genérico

## Estrutura

- `src/api/axios.js` — instância do axios: injeta o token em cada requisição e, em `401` com token, limpa a sessão (`setUnauthorizedHandler`)
- `src/api/{auth,products,availability,appointments,blocks,users}.js` — serviços por recurso: funções finas sobre `api` que devolvem `res.data` (ex.: `listProducts`, `getAvailability`, `createAppointment`, `cancelAppointment`, `setBlockActive`, `updateUserRole`). Páginas chamam esses serviços, nunca montam URLs
- `src/api/errors.js` — `getApiError(err)` normaliza os erros da API (`{ message }` ou `{ message, errors: [{ field, message }] }`) em `{ message, fieldErrors }`
- `src/context/AuthContext.jsx` — estado de autenticação; token só no `localStorage`, `user` = `{ _id, name, email, role }`; expõe `login`, `register`, `logout`, `user`, `loading`
- `src/utils/roles.js` — `ROLES` (`client`, `professional`, `admin`) e `homePathFor(role)`
- `src/utils/dates.js` — datas sempre exibidas no fuso da clínica (`America/Sao_Paulo`), qualquer que seja o fuso do navegador: `formatDate`, `formatTime`, `formatDateTime`, `formatWeekdayDate`, `formatTimeRange`, `toISO`; dias como chave `YYYY-MM-DD` (`clinicDayKey`, `startOfClinicDay`, `endOfClinicDay` exclusivo, `addDays`); `availabilityRange(dayKey, days)` (limitado a 90 dias) e `groupByClinicDay`
- `src/utils/currency.js` — `formatCurrency` (BRL) e `formatDuration` ("1 h 15 min")
- `src/utils/appointments.js` — `APPOINTMENT_STATUS` + rótulos pt-BR e `WEEKDAYS` (0 = domingo, igual a `daysOfWeek` dos bloqueios)
- `src/components/layout/ProtectedRoute.jsx` — bloqueia rota por papel; papel sem acesso é mandado para a própria home
- `src/components/layout/AuthLayout.jsx` — layout compartilhado das telas de auth
- `src/components/form/Field.jsx` — input com label, dica e erro de campo
- `src/pages/Login.jsx`, `Register.jsx` — autenticação (registro omite telefone vazio e valida senha ≥ 6)
- `src/pages/Home.jsx` (`/`, client), `ProfessionalHome.jsx` (`/profissional`), `AdminHome.jsx` (`/admin`) — placeholders das áreas logadas

## Mapa de telas × endpoints

| Área | Tela (planejada) | Endpoints |
|---|---|---|
| Paciente | Agendar consulta | `GET /products`, `GET /availability`, `POST /appointments` |
| Paciente | Minhas consultas | `GET /appointments`, `GET /appointments/:id`, `PATCH /appointments/:id/cancel` |
| Profissional | Minha agenda | `GET /appointments`, `PATCH /appointments/:id/cancel` |
| Profissional | Meus bloqueios | `GET/POST /blocks`, `GET/PATCH /blocks/:id` |
| Admin | Procedimentos | `GET/POST /products`, `GET/PATCH /products/:id` |
| Admin | Bloqueios (clínica e profissionais) | `GET/POST /blocks`, `PATCH /blocks/:id` |
| Admin | Agendamentos | `GET /appointments?professional=&status=`, `PATCH /appointments/:id/cancel` |
| Admin | Equipe | `PATCH /users/:id/role` |


# 🛒 AI-BAZAR / MASMARKET

Социальный AI-маркетплейс в стиле Ozon/Wildberries. Категории: **Дом / Работа / Учёба / Хобби**. Фиксированная цена, демо прямо на сайте («Запустить демо»), отзывы, локализация рус/СНГ.

> 📖 Главный контекст проекта, архитектурные решения и журнал — в [`project_log.md`](./project_log.md). AI-агенту: **читать его первым**.

---

## 🏗 Стек

| Слой         | Технология                                                  |
|--------------|-------------------------------------------------------------|
| Framework    | Next.js 15 + React 19 + TypeScript                          |
| Стили        | Tailwind CSS 3 + shadcn/ui (Radix) + кастомные easing-кривые из скила `emil-design-eng` |
| CMS + БД     | PayloadCMS 2 + MongoDB (`@payloadcms/db-mongodb@1.7.5`)     |
| Сервер       | Custom Express + Next.js + tRPC                             |
| Платежи      | Stripe + webhooks                                           |
| Email        | Resend + React Email                                        |
| Стейт        | Zustand (корзина), TanStack Query (server-state)            |
| Формы        | React Hook Form + Zod                                       |

> ⚠️ Используется **custom Express server** (`src/server.ts`) — деплой на Vercel **не подойдёт**. Подходит: Render / Railway / Fly.io / VPS.

---

## 🚀 Локальный старт

### 1. Установить зависимости

```bash
npm install --legacy-peer-deps
```

`--legacy-peer-deps` обязателен — в шаблоне есть конфликты peer-зависимостей.

### 2. Заполнить `.env`

Скопируй `.env.example` → `.env` и подставь:
- `MONGODB_URL` — connection-string MongoDB (Atlas free tier или локальная)
- `PAYLOAD_SECRET` — `openssl rand -hex 32`
- `RESEND_API_KEY` — ключ Resend (для email верификации)
- `STRIPE_SECRET_KEY` — ключ Stripe (test mode на старте)

### 3. Запустить dev-сервер

```bash
npm run dev
```

Открыть [http://localhost:3000](http://localhost:3000). Админка PayloadCMS — [http://localhost:3000/sell](http://localhost:3000/sell).

---

## ☁️ Деплой на GitHub + Render + MongoDB Atlas (бесплатная связка)

1. **MongoDB Atlas** → создать free M0 cluster, получить connection-string.
2. **GitHub** → запушить репозиторий (`git push origin main`).
3. **Render** → New → Web Service → выбрать репо.
   - Build command: `npm install --legacy-peer-deps && npm run build`
   - Start command: `npm run start`
   - Environment: `Node 22`
   - Добавить ENV-переменные (см. `.env.example`).
4. **Cloudflare** (опционально, для защиты от DDoS):
   - Подключить домен → DNS proxy включён (оранжевая туча)
   - WAF → включить "Bot Fight Mode" + Rate-limiting на `/api/*`

---

## 🔐 Безопасность (см. задачу 10 в [project_log.md](./project_log.md))

- **Input validation** — все API-роуты используют Zod
- **Rate limiting** — PayloadCMS built-in (`rateLimit: { max: 2000 }`) + custom на `/api/auth`
- **CORS** — белый список доменов в `src/payload.config.ts`
- **Секреты** — только в env-переменных, никогда не на фронт
- **CSP + security headers** — в middleware (см. `src/middleware.ts`)
- **Auth** — PayloadCMS built-in (httpOnly cookies, session rotation)

---

## 🎨 Дизайн-токены (Ozon-style)

| Токен              | Цвет        | HSL                |
|--------------------|-------------|--------------------|
| `--primary`        | Синий Ozon  | `219 100% 50%` (#005BFF) |
| `--accent`         | Малиновый   | `348 100% 50%` (#FF0032) |
| `--secondary` / `--muted` | Серый | `0 0% 96%` (#F5F5F5) |

Easing-кривые (`--ease-out`, `--ease-in-out`, `--ease-drawer`) — из скила [`emil-design-eng/SKILL.md`](./emil-design-eng/SKILL.md).

---

## 📂 Структура

```
src/
  app/                Next.js App Router (страницы, layout, globals.css)
  collections/        PayloadCMS-коллекции: Users, Products, Orders, Media
  components/         UI-компоненты (NavBar, ProductListing, Cart, ui/*)
  config/index.ts     ⭐ Категории Дом/Работа/Учёба/Хобби
  hooks/useCart.ts    Zustand-стор корзины
  lib/                Утилиты, Stripe, валидаторы
  trpc/               tRPC-роутеры
  payload.config.ts   Конфигурация PayloadCMS
  server.ts           Custom Express server
```

---

## 📋 Roadmap

См. [`project_log.md`](./project_log.md) → раздел «План задач».

- [x] 1. Анализ шаблона
- [x] 2. Перенос шаблона в корень MASMARKET
- [x] 3. Дизайн-токены Ozon + кириллица + emil easing
- [x] 5. Категории Дом/Работа/Учёба/Хобби
- [ ] 4. Header AI-BAZAR (логотип, поиск, выбор города)
- [ ] 6. ProductCard в стиле Авито
- [ ] 7. Emil-анимации на карточке
- [ ] 8. Страница товара
- [ ] 9. Синхронизация PayloadCMS-коллекции `Products` с новыми категориями
- [ ] 10. Security pass (Zod, rate-limit, CORS, env)
- [ ] 11. Авторизация и личный кабинет
- [ ] 12. Отзывы и рейтинг
- [ ] 13. Деплой (Render + Atlas + Cloudflare)

---

*Журнал изменений ведётся в [`project_log.md`](./project_log.md). Не дублировать здесь.*

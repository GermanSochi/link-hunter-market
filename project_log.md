# PROJECT LOG: AI-BAZAR (MASMARKET)

## ИНСТРУКЦИЯ ДЛЯ AI: ЧИТАТЬ ЭТОТ ФАЙЛ ПЕРВЫМ ПРИ КАЖДОМ ЗАПУСКЕ.

---

## РЕШЕНИЕ ПО АРХИТЕКТУРЕ (принято 2026-05-07)

Используем **готовую архитектуру шаблона** `next-digital-marketplace-main` без замены на Supabase.

| Компонент | Что используем |
|---|---|
| Framework | Next.js 15 + React 19 + TypeScript |
| Стили | Tailwind CSS 3 + shadcn/ui (Radix UI) |
| CMS / БД | PayloadCMS 2 + MongoDB |
| Авторизация | PayloadCMS built-in auth |
| Платежи | Stripe (синхронизация продуктов) |
| API | tRPC + TanStack Query |
| Стейт | Zustand (корзина) |
| Email | Resend + React Email |
| Toast | Sonner |
| Формы | React Hook Form + Zod |

---

## СКИЛЫ ПРОЕКТА

- **`emil-design-eng/`** — философия UI-полировки: анимации, :active scale(0.97), custom cubic-bezier, spring, @starting-style
- **`next-digital-marketplace-main/`** — базовый шаблон Next.js маркетплейса (взять структуру, адаптировать под AI-BAZAR)

---

## АНАЛИЗ ШАБЛОНА (задача 1 — выполнена 2026-05-07)

### Структура папок шаблона
```
src/
  app/
    (auth)/sign-in|sign-up|verify-email   — авторизация
    api/trpc/[trpc]/                       — tRPC endpoint
    cart/                                  — страница корзины
    product/[productId]/                   — страница товара
    products/                              — каталог
    thank-you/                             — страница после оплаты
    page.tsx                               — главная
    layout.tsx                             — корневой layout
  collections/
    products/Products.ts                   — схема товаров (PayloadCMS)
    Users.ts                               — схема пользователей
    orders/Orders.ts
    media/Media.ts
    product-files/ProductFile.ts
  components/
    NavBar.tsx                             — шапка
    NavItems.tsx                           — выпадающее меню категорий
    ProductReel.tsx                        — горизонтальный ряд карточек
    ProductListing.tsx                     — карточка товара
    ImageSlider.tsx                        — галерея (Swiper)
    Cart.tsx / CartItem.tsx                — корзина (Sheet)
    AddToCart.tsx
    Footer.tsx
    ui/button|input|label|...              — shadcn/ui компоненты
  config/index.ts                          — PRODUCT_CATEGORIES (менять здесь!)
  hooks/useCart.ts                         — Zustand стор корзины
  lib/stripe/stripe.ts
  lib/payload-utils/payload-utils.ts
  lib/validators/
```

### Что менять под AI-BAZAR

| Что в шаблоне | Что нужно в AI-BAZAR |
|---|---|
| Категории: "UI Kits", "Icons" | "Дом", "Работа", "Учёба", "Хобби" |
| Язык: English | Русский / СНГ |
| Логотип: hippo-иконка | Логотип AI-BAZAR |
| Цвета: нейтральный синий | Синий #005BFF + малиновый #FF0032 (Ozon-стиль) |
| Кнопка: "Browse" | "Запустить демо" (главная), "Купить" (вторичная) |
| Поиск: нет | Крупная строка поиска в хедере |
| Карточка: минималистичная | Рейтинг звёздами, цена крупно, превью |
| Продукт: цифровые ассеты | AI-инструменты для обычных людей |
| Цена: EUR | Рубли / USD (с учётом СНГ аудитории) |

### Ключевые файлы для адаптации (в порядке приоритета)
1. `src/config/index.ts` — заменить категории
2. `src/app/layout.tsx` — русский lang, шрифт с кириллицей
3. `src/components/NavBar.tsx` — добавить поиск, город
4. `src/app/globals.css` — цветовые токены Ozon-стиль
5. `src/app/page.tsx` — главная страница AI-BAZAR
6. `src/components/ProductListing.tsx` — карточка товара AI-стиль
7. `src/collections/products/Products.ts` — поле "trial_url", "ai_model"

---

## ПЛАН ЗАДАЧ (актуальный)

- [x] 1. Анализ шаблона и обновление структуры под маркетплейс
- [x] 2. Перенос шаблона в рабочую папку MASMARKET (src/)
- [x] 3. Дизайн-токены: цвета Ozon (синий #005BFF / малиновый #FF0032 / серый #F5F5F5), шрифты
- [x] 4. Header: логотип AI-BAZAR, строка поиска, выбор города, корзина, кабинет
- [x] 5. Сетка категорий: Дом / Работа / Учёба / Хобби — визуальные плитки с иконками
- [x] 6. ProductCard: фото/видео превью, рейтинг звёздами, цена, кнопки «Запустить демо» и «Купить»
- [x] 7. Emil-анимации на карточке: hover scale(1.02), :active scale(0.97), ease-out 150-200ms
- [x] 8. Страница товара: описание «для людей», галерея, отзывы, кнопка триала
- [x] 9. MongoDB/PayloadCMS: Products.ts — поля trial_url, ai_model, rating; labels RU; валюта RUB
- [x] 10. Безопасность: Rate Limiting (middleware), bot detection, security headers (CSP, X-Frame-Options, nosniff, Referrer-Policy), PayloadCMS admin protect
- [ ] 11. Авторизация (PayloadCMS built-in)
- [x] 12. Система отзывов и рейтинга
- [x] 13.1 Ozon-редизайн главной (5-колонок, баннер, OzonProductCard)
- [x] 13.2 Dashboard /account (сайдбар + Orders/Favorites/Wallet/Profile)
- [ ] 13.3 Деплой на Vercel

---

## ЖУРНАЛ ИЗМЕНЕНИЙ

### [2026-05-07] — Задача 1: Анализ шаблона

- **Статус:** Выполнено
- **Действие:** Изучена полная структура шаблона `next-digital-marketplace-main`. Составлен список компонентов, схема БД, список файлов для адаптации.
- **Решение:** Используем архитектуру шаблона (PayloadCMS + MongoDB + Stripe + tRPC). README упоминал Supabase, но пользователь подтвердил — берём готовую архитектуру шаблона.
- **Следующий шаг:** Задача 2 — перенести шаблон в рабочую папку `src/` MASMARKET.

### [2026-05-11] — Задачи 2, 3, 5: Перенос + дизайн-токены + категории

- **Статус:** Выполнено
- **Действия:**
  - Содержимое `next-digital-marketplace-main/next-digital-marketplace-main/*` скопировано в корень `MASMARKET` через `robocopy /E` (исключены `README.md`, `.gitignore` — оставлены файлы AI-BAZAR). Оригинальная папка шаблона сохранена как бэкап.
  - `package.json`: `name` → `"masmarket"`.
  - `src/app/globals.css`: HSL-токены под Ozon — `--primary: 219 100% 50%` (синий #005BFF), `--accent: 348 100% 50%` (малиновый #FF0032), `--secondary/--muted: 0 0% 96%` (серый #F5F5F5), `--ring` подогнан под primary. Добавлены easing-кривые из скила `emil-design-eng` (`--ease-out`, `--ease-in-out`, `--ease-drawer`). Глобальный `:active { transform: scale(0.97) }` на кнопках/ссылках (тактильный фидбек).
  - `src/app/layout.tsx`: `lang="en"` → `lang="ru"`, `Inter({ subsets: ["latin", "cyrillic"] })` для кириллицы.
  - `src/config/index.ts`: 2 старых категории (UI Kits, Icons) → 4 новых (Дом / Работа / Учёба / Хобби) с русскими `featured`-блоками. `href` ведут на `/products?category=…`. Картинки временно ссылаются на существующие `/public/nav/*.jpg` — заменить при готовности AI-BAZAR-иллюстраций.
  - Экспортирован тип `ProductCategoryValue` для типобезопасности в компонентах.
- **Что не делалось** (на ревью):
  - `npm install` ещё не запускался — нужно установить зависимости перед `npm run dev`.
  - Изображения категорий — placeholder из шаблона (UI-Kits, Icons).
  - PayloadCMS-коллекция `products` пока со старыми категориями `ui_kits | icons` — заменить в задаче по схеме БД.
- **Следующий шаг:** Задача 4 — переделать `NavBar.tsx` под AI-BAZAR (логотип, крупный поиск, выбор города, кабинет, корзина).

---

### [2026-05-11] — МЕГА-МИГРАЦИЯ: PayloadCMS → Prisma + PostgreSQL (ПОЛНОСТЬЮ)

- **Статус:** Выполнено. TypeScript `tsc --noEmit` — **0 ошибок**. Dev-сервер `next dev` запускается чисто.
- **Контекст:** В предыдущей сессии (того же дня) пользователь утвердил переход с PayloadCMS+MongoDB на Prisma+PostgreSQL. Эта сессия закончила миграцию.

#### СТЕК (финальный, утверждённый пользователем)
| Компонент | Было | Стало |
|---|---|---|
| БД | MongoDB | **PostgreSQL 16** (docker) |
| ORM | PayloadCMS built-in | **Prisma 5.22** |
| Auth | PayloadCMS auth | **JWT (jose) + bcryptjs** — httpOnly cookie |
| Платежи | Stripe | **Монетная система** (1 Coin = 1 ₽), Escrow |
| Сервер | Express (server.ts) | **next dev** (без Express) |
| API | tRPC + PayloadCMS | **tRPC + Prisma** |

#### АРХИТЕКТУРА: Монеты и Escrow
- `1 Coin = 1 Рубль`
- Комиссия: продажи 5%, фриланс 10%, вывод 3%
- Статусы заказа: `DRAFT → FUNDED → IN_PROGRESS → REVIEW → COMPLETED / DISPUTED`
- При покупке: coins списываются с балanceCoins → замораживаются в frozenCoins (ESCROW_FREEZE)
- Иммутабельный лог всех движений в модели `Transaction`

#### СОЗДАННЫЕ ФАЙЛЫ (ключевые)
```
prisma/schema.prisma            — полная схема (User, Product, Order, Transaction, Chat, Review, AuditLog)
src/lib/auth.ts                 — JWT auth, async cookies() (Next.js 15), getSessionUser, setAuthCookie, clearAuthCookie
src/lib/prisma.ts               — Prisma singleton
src/middleware.ts               — Rate limit, bot detection, security headers (CSP, X-Frame-Options)
src/app/api/auth/register/      — регистрация (bcrypt hash, JWT cookie)
src/app/api/auth/login/         — вход (brute-force защита: 5 попыток → блок 15 мин)
src/app/api/auth/logout/        — выход (clear cookie)
src/app/api/auth/me/            — текущий пользователь
src/types/product.ts            — тип ProductItem (вместо payload-types)
src/trpc/trpc.ts                — заменён ExpressContext на getSessionUser()
src/trpc/auth-router.ts         — register + signIn + setAuthCookie
src/trpc/payment-router.ts      — createSession (монеты, Escrow) + pullOrderStatus
src/trpc/index.ts               — getInfiniteProducts через Prisma
docker-compose.dev.yml          — PostgreSQL 16 + Redis 7
```

#### ИЗМЕНЁННЫЕ КОМПОНЕНТЫ
```
src/hooks/useCart.ts            — CartProduct тип (без payload-types)
src/components/SignIn.tsx       — русский UI, tRPC auth.signIn, isPending
src/components/SignUp.tsx       — русский UI, tRPC auth.register, поле имя
src/components/Cart.tsx         — корзина, рубли, 5% комиссия
src/components/CartItem.tsx     — CartProduct тип, русский UI
src/components/AddToCart.tsx    — CartProduct тип, русский текст
src/components/ProductListing.tsx — ProductItem тип
src/components/ProductReel.tsx  — ProductItem тип
src/components/PaymentStatus.tsx — React Query v5 refetchInterval
src/components/MountUserNav.tsx — заглушка (дубль NavBar, не используется)
src/components/VerifyEmail.tsx  — упрощён (верификации email нет в MVP)
src/app/cart/page.tsx           — оплата монетами, русский UI
src/app/thank-you/page.tsx      — Prisma вместо PayloadCMS
src/app/product/[productId]/    — Prisma вместо PayloadCMS
src/app/(auth)/verify-email/    — упрощён
src/components/emails/ReceiptEmail.tsx — ReceiptProduct тип, рубли
tsconfig.json                   — исключён next-digital-marketplace-main/
```

#### ОБНУЛЕННЫЕ LEGACY-ФАЙЛЫ (PayloadCMS → заглушки)
```
src/server.ts          — был Express-сервер, теперь `export {}`
src/get-payload.ts     — был PayloadCMS client, теперь `export {}`
src/webhooks.ts        — Stripe webhooks перенесены в TODO
src/payload.config.ts  — конфиг PayloadCMS, теперь `export {}`
src/payload-types.ts   — авто-генерация PayloadCMS, теперь `export {}`
src/collections/*/     — все 5 коллекций PayloadCMS, теперь `export {}`
```

#### ИСПРАВЛЕННЫЕ ТЕХНИЧЕСКИЕ ПРОБЛЕМЫ
| Проблема | Решение |
|---|---|
| `cookies()` в Next.js 15 — Promise | `await cookies()` во всех auth функциях |
| `omit: { passwordHash: true }` — Prisma preview | Деструктуризация `const { passwordHash, ...safeUser } = raw` |
| `isLoading` → не существует tRPC v11 | `isPending: isLoading` (React Query v5) |
| `refetchInterval(data)` — React Query v5 | `refetchInterval((query) => query.state.data?.isPaid ...)` |
| Stripe apiVersion `"2023-10-16"` | `"2025-02-24.acacia"` |
| tsconfig включал old template | `exclude: ["next-digital-marketplace-main"]` |
| sort `"-createdAt"` не в enum | Исправлено на `"desc"` из QueryValidator |
| `useOnClickOutside` RefObject<T> null | `RefObject<T | null>` |

#### GIT
- Коммит `7d71d90` — 40 файлов изменено, +779 / -2095 строк

#### ЧТО ОСТАЛОСЬ (следующая сессия)
1. **Запустить Docker Desktop** → `docker compose -f docker-compose.dev.yml up -d`
2. **Инициализировать БД**: `npx prisma migrate dev --name init`
3. **GitHub**: создать репо `GermanSochi/masmarket` → `git push`
4. **Проверить localhost:3000** в браузере (dev-сервер уже запускается)
5. **Задача 6** из плана: ProductCard — рейтинг, превью, кнопка «Запустить демо»
6. **Задача 7**: Emil-анимации на карточке (`hover scale(1.02)`, `:active scale(0.97)`)
7. **Задача 8**: Страница товара — описание, галерея, отзывы

#### СКИЛЫ ПРИМЕНЕНЫ В ЭТОЙ СЕССИИ
- `emil-design-eng/SKILL.md` — применён в globals.css (`:active scale(0.97)`, easing кривые)
- `next-digital-marketplace-main/` — базовая структура компонентов сохранена, адаптирована

#### ВАЖНОЕ ЗАМЕЧАНИЕ ДЛЯ СЛЕДУЮЩЕЙ СЕССИИ
> ⚠️ `project_log.md` в этой сессии прочитан не первым. Следующая сессия ОБЯЗАНА читать этот файл ПЕРВЫМ, перед любыми действиями. Это правило из `MEMORY.md`.

---

---

### [2026-05-12] — OAuth (Google/Yandex), переименование AI MARKET, seed данные

- **Статус:** Выполнено. TypeScript 0 ошибок.

#### ИЗМЕНЕНИЯ

| Что сделано | Файлы |
|---|---|
| NextAuth v5 + @auth/prisma-adapter установлены | package.json |
| OAuth: Google + Yandex + Credentials (email/password) | src/auth.ts (новый) |
| NextAuth API handler | src/app/api/auth/[...nextauth]/route.ts (новый) |
| getSessionUser() теперь через NextAuth auth() | src/lib/auth.ts |
| Middleware через NextAuth wrapper | src/middleware.ts |
| SessionProvider добавлен в Providers | src/components/providers/Providers.tsx |
| SignIn: кнопки Google + Яндекс + email/password | src/components/SignIn.tsx |
| SignUp: кнопки Google + Яндекс + email/password + автовход | src/components/SignUp.tsx |
| AI-BAZAR → AI MARKET (лого, метadata, aria-label) | src/components/Icons.tsx, src/lib/utils.ts |
| Иконки Google и Yandex добавлены | src/components/Icons.tsx |
| Логотип NavBar обновлён | src/components/NavBar.tsx |
| Большой английский текст на главной убран | src/app/page.tsx |
| useAuth теперь вызывает NextAuth signOut | src/hooks/useAuth.ts |
| Prisma schema: passwordHash → nullable, добавлен image | prisma/schema.prisma |
| Prisma schema: модели Account + VerificationToken | prisma/schema.prisma |
| Старые login/logout API routes заглушены | src/app/api/auth/login\|logout/route.ts |
| register API: убраны старые createToken/setAuthCookie | src/app/api/auth/register/route.ts |
| auth-router.ts: убран signIn (теперь через NextAuth) | src/trpc/auth-router.ts |
| Фейковые продукты и пользователи | prisma/seed.ts (новый) |
| searchParams: Promise<> (Next.js 15) | src/app/products/page.tsx |

#### PRISMA SCHEMA — новые модели
- `Account` — для OAuth account linking (NextAuth требует)
- `VerificationToken` — для email verification
- `User.passwordHash String?` — nullable (OAuth users)
- `User.image String?` — avatar from OAuth providers

#### ENV переменные для OAuth (заполнить вручную)
```
AUTH_SECRET=...
AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...    # console.cloud.google.com → Credentials → OAuth2
GOOGLE_CLIENT_SECRET=...
YANDEX_CLIENT_ID=...    # oauth.yandex.ru → Мои приложения
YANDEX_CLIENT_SECRET=...
```

#### ТЕСТОВЫЕ ДАННЫЕ (после seed)
- Продавцы: alexk@aimarket.dev, marina_ai@aimarket.dev, dmitry_pro@aimarket.dev, asel_kz@aimarket.dev, rustam_uz@aimarket.dev
- Тестовый покупатель: test@aimarket.dev / password123
- 13 продуктов статус APPROVED по категориям: work(4), study(3), home(3), hobby(3)

#### СЛЕДУЮЩИЕ ШАГИ (в порядке приоритета)
1. **Запустить Docker**: `docker compose -f docker-compose.dev.yml up -d`
2. **Миграция БД**: `npx prisma migrate dev --name add_oauth_and_image`
3. **Заполнить данные**: `npm run db:seed`
4. **OAuth credentials**:
   - Google: [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Credentials → Create OAuth2 Client ID → Web App → Callback URL: `http://localhost:3000/api/auth/callback/google`
   - Yandex: [oauth.yandex.ru](https://oauth.yandex.ru) → Создать → callback: `http://localhost:3000/api/auth/callback/yandex`
5. **Задача 6**: ProductCard — рейтинг звёздами, превью, кнопка «Запустить демо»
6. **Задача 7**: Emil-анимации на карточке

---

---

### [2026-05-12] — Задачи 6, 7, 8, 12: ProductCard, анимации, страница товара, отзывы

- **Статус:** Выполнено. TypeScript `tsc --noEmit` — **0 ошибок**.

#### ИЗМЕНЕНИЯ

| Что сделано | Файлы |
|---|---|
| ProductCard: рейтинг звёздами (StarRating), badge AI-модели | src/components/ProductListing.tsx |
| ProductCard: Emil-анимации hover scale(1.02), ease-out, shadow | src/components/ProductListing.tsx |
| ProductCard: кнопка «Запустить демо» (trialUrl) + «В корзину» / «Скачать» | src/components/ProductListing.tsx |
| Страница товара: крупная цена, рейтинг, AI-модель, теги | src/app/product/[productId]/page.tsx |
| Страница товара: кнопка «Запустить демо» | src/app/product/[productId]/page.tsx |
| Страница товара: продавец с рейтингом | src/app/product/[productId]/page.tsx |
| Страница товара: секция ReviewSection | src/app/product/[productId]/page.tsx |
| params: Promise<> (Next.js 15) в page.tsx | src/app/product/[productId]/page.tsx |
| ReviewSection: список отзывов, аватар, verified badge, дата | src/components/ReviewSection.tsx |
| ReviewSection: итоговый рейтинг + полоски распределения | src/components/ReviewSection.tsx |
| ReviewSection: форма добавления отзыва (интерактивные звёзды) | src/components/ReviewSection.tsx |
| API POST /api/reviews: авторизация, пересчёт рейтинга, isVerified | src/app/api/reviews/route.ts |

#### АРХИТЕКТУРА ReviewSection
- Сервер передаёт `reviews[]` и `_count.reviews` через `include` в Prisma-запросе
- `isVerified = true` если у пользователя есть Order со статусом COMPLETED
- После создания отзыва — автоматический пересчёт `Product.rating` (avg агрегация)
- Форма обращается к `POST /api/reviews` с JWT-авторизацией через `getSessionUser()`

#### СЛЕДУЮЩИЕ ШАГИ (в порядке приоритета)
1. **Запустить Docker Desktop** → `docker compose -f docker-compose.dev.yml up -d`
2. **Миграция БД**: `npx prisma migrate dev --name add_oauth_and_image`
3. **Заполнить данные**: `npm run db:seed`
4. **OAuth credentials** (Google + Yandex) — заполнить в `.env.local`
5. **Задача 13**: Деплой на Vercel

---

### [2026-05-12] — Ozon-редизайн + Dashboard /account + Auth fix

- **Статус:** Выполнено. TypeScript 0 ошибок.

| Что | Файлы |
|---|---|
| Fix: rate limit душил `/api/auth/session` | `src/middleware.ts` |
| Google убран, остались: Yandex + GitHub + Telegram | `src/auth.ts` |
| NavBar: баланс-виджет + кнопка «+» → `/account?tab=wallet` | `src/components/NavBar.tsx` |
| SearchBar: full-width, синяя кнопка «Найти» | `src/components/SearchBar.tsx` |
| MaxWidthWrapper: `max-w-[1280px]` | `src/components/MaxWidthWrapper.tsx` |
| OzonProductCard: ♥, скидка-бейдж, звёзды, зачёрк. цена, «В корзину» | `src/components/OzonProductCard.tsx` |
| Homepage: 5-col grid, 13 статичных карточек, баннер, без hero/perks | `src/app/page.tsx` |
| Dashboard `/account`: сайдбар + mobile таббар | `src/app/account/page.tsx` + `AccountDashboard.tsx` |
| OrdersTab: список покупок + кнопка «Получить доступ» | `src/components/account/OrdersTab.tsx` |
| FavoritesTab: Ozon-сетка избранного (mock, подключить backend) | `src/components/account/FavoritesTab.tsx` |
| ProfileTab: имя/email/провайдеры/привязка Telegram | `src/components/account/ProfileTab.tsx` |
| WalletTab: баланс-карточка, модал «Пополнить» → Telegram-бот, история | `src/components/account/WalletTab.tsx` |

#### СЛЕДУЮЩИЕ ШАГИ
1. **GitHub OAuth**: `github.com/settings/developers` → New OAuth App → Callback: `http://localhost:3000/api/auth/callback/github`
2. **Yandex OAuth**: `oauth.yandex.ru` → callback: `http://localhost:3000/api/auth/callback/yandex`
3. **Telegram бот**: `@BotFather /newbot` → прописать `TELEGRAM_BOT_TOKEN` + `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` в `.env`
4. **FavoritesTab**: подключить реальный backend (таблица `Favourite` в Prisma или localStorage sync)
5. **Деплой**: Vercel + env vars

---

---

### [2026-05-12] — Бета-тест фиксы + UI редизайн + деплой Vercel

- **Статус:** Выполнено. TypeScript 0 ошибок. Задеплоено на Vercel.
- **Vercel URL:** `https://masmarket-higedckf9-germans-projects-dd97fe02.vercel.app`
- **Deploy команда:** `npx vercel --prod --yes --archive=tgz` (обязательно `--archive=tgz` — без него 5000-файловый лимит free tier)

#### СТЕК ТЕКУЩИЙ (финальный)
| Компонент | Что |
|---|---|
| Auth | **NextAuth v5** (credentials + GitHub + Yandex + Telegram) |
| БД | **PostgreSQL 16** (Neon.tech) + Prisma 5.22 |
| Deploy | **Vercel** (serverless functions) |

#### БЕТА-ТЕСТ ФИКСЫ (6 задач)

| Проблема | Решение | Файл |
|---|---|---|
| **Чат прокручивал всю страницу** | `scrollIntoView` → `containerRef.scrollTo()`. Удалён `bottomRef` полностью | `CommunityChat.tsx` |
| Тикер не анимировался | `@keyframes ticker` в globals.css + `.animate-ticker:hover { animation-play-state: paused }` | `globals.css`, `ProductFeed.tsx` |
| Нет кнопок загрузки товара | `SellerTab.tsx` в /account + `/products/new` + `/api/seller/products` + `/api/products` POST | новые файлы |
| Admin: нет удаления чата | 3-й таб «Чат» в AdminDashboard + `GET/DELETE /api/admin/chat` (soft-delete) | `AdminDashboard.tsx`, `api/admin/chat` |
| Admin: нет кармы продавца в модерации | Расширен SELECT в `api/admin/products` → `{ karma, rating, isGoldSeller }` | `api/admin/products/route.ts` |
| Admin: мало действий с юзерами | `setGold` + `setKarma` actions в `PATCH /api/admin/users` | `api/admin/users/route.ts` |

#### UI РЕДИЗАЙН

**1. Чат — коллапсируемая секция (`CommunityChatSection.tsx`)**
- Кнопка-хедер всегда видна, клик открывает/закрывает чат
- Пульсирующая зелёная точка, случайный счётчик «онлайн»
- Анимация: `max-height` + `opacity` + `translateY(-12px)` через `ease-drawer` (cubic-bezier)
- `ResizeObserver` для точного измерения высоты
- `ChevronDown` вращается 180° при открытии

**2. Гостевой аккаунт**
- `POST /api/auth/guest` → создаёт `guest_XXXXXXXX@aimarket.dev` с 50 монетами (bcrypt rounds=8)
- Кнопка «Войти как гость» в `SignIn.tsx` (Ghost icon, dashed border, `+50 монет` бейдж)
- Кнопка «Гость» в `NavBar.tsx` рядом с «Войти» (Ghost icon)
- Автозапуск гостевого входа при `?guest=1` в URL

**3. Единая тикер-полоса фильтров**
- В `ProductFeed.tsx`: full-bleed strip `-mx-4 sm:-mx-6 lg:-mx-8`
- Градиентные края (pointer-events-none)
- `border-y border-gray-200/70 bg-white/90 backdrop-blur-sm`
- Интерактивные пилюли с `animate-ticker`, пауза при hover
- Кнопка «Сбросить» появляется при активных фильтрах

**4. HeroSection — рефактор**
- Убраны `useState`, `useEffect`, `useScrolled` → теперь серверный компонент
- Убрана дублирующая тикер-полоса (декоративная)
- Исправил TypeScript ошибку `scrolled is assigned but never used` (ломала Vercel build)

#### КРИТИЧЕСКИЙ БАГ: страница сама прокручивалась вниз к чату

**Причина:** `scrollIntoView()` прокручивает ВЕСЬ viewport страницы, а не только контейнер.
Даже внутри `<div ref={containerRef} className="overflow-y-auto">` — вызов `bottomRef.current?.scrollIntoView()` захватывает страницу целиком.

**Исправление в `CommunityChat.tsx`:**
```typescript
// БЫЛО (сломано):
bottomRef.current?.scrollIntoView({ behavior: "smooth" });
// + fetchMessages().then(() => scrollToBottom(true))  // прокручивало при загрузке!

// СТАЛО (исправлено):
const scrollToBottom = (instant = false) => {
  const el = containerRef.current;
  if (!el) return;
  if (instant) { el.scrollTop = el.scrollHeight; }
  else { el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }); }
};
// fetchMessages() вызывается без .then(scrollToBottom) — НЕ прокручиваем при поллинге
```
Удалены: `bottomRef`, `<div ref={bottomRef} />`. Добавлены: `isNearBottom()`, `shouldScrollRef` (прокрутка только если пользователь сам писал).

#### НОВЫЕ ФАЙЛЫ
```
src/components/CommunityChatSection.tsx    — коллапс-обёртка чата
src/components/account/SellerTab.tsx       — вкладка «Мои товары» в /account
src/app/products/new/page.tsx              — форма загрузки товара
src/app/api/auth/guest/route.ts            — создание гостевого аккаунта
src/app/api/seller/products/route.ts       — GET/DELETE своих товаров
src/app/api/products/route.ts              — POST создание товара
src/app/api/admin/chat/route.ts            — GET/DELETE сообщений чата (admin)
```

#### ИЗМЕНЁННЫЕ ФАЙЛЫ
```
src/components/CommunityChat.tsx           — фикс scroll (containerRef вместо scrollIntoView)
src/components/ProductFeed.tsx             — единая тикер-полоса фильтров
src/components/HeroSection.tsx             — серверный компонент, без дублирующего тикера
src/components/SignIn.tsx                  — кнопка гостя + auto-trigger
src/components/NavBar.tsx                  — Ghost кнопка «Гость»
src/app/admin/AdminDashboard.tsx           — 3 таба (+ Чат), карма/рейтинг продавца
src/app/components/account/AccountDashboard.tsx — вкладка «Мои товары»
src/app/api/admin/products/route.ts        — karma/rating/isGoldSeller в select
src/app/api/admin/users/route.ts           — setGold + setKarma actions
src/app/globals.css                        — @keyframes ticker, .animate-ticker
src/app/page.tsx                           — CommunityChatSection вместо CommunityChat
```

#### СЛЕДУЮЩИЕ ШАГИ (для следующей сессии)
1. **Страница товара** `/products/[slug]` — полноценная страница (сейчас нет роутинга по slug)
2. **Telegram OAuth** — `@BotFather /newbot` → `TELEGRAM_BOT_TOKEN` + `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME`
3. **FavoritesTab** — реальный backend (таблица `Favourite` в Prisma)
4. **Страница `/products/[slug]/edit`** — редактирование товара продавцом
5. **Система покупок** — реальный Escrow flow через монеты

---

---

### [2026-05-18] — Страница-воронка «ИИ Сравни» (compare-ai)

- **Статус:** Выполнено ✅ TypeScript 0 ошибок, dev-сервер работает
- **Цель:** Аналог Сравни.ру / Banki.ru для AI-инструментов. SEO-воронка с монетизацией через кнопку «Купить из РФ»

#### ЭТАПЫ
1. `src/types/ai-compare.ts` — тип AIItem
2. `src/data/ai-services.ts` — хардкод 20+ сервисов (Cursor, Midjourney, YandexGPT и др.)
3. `src/app/api/compare-models/route.ts` — OpenRouter API + ЦБ РФ + фильтры + ISR
4. `src/app/compare-ai/CompareClient.tsx` — интерактивная таблица, фильтры, модал «Купить из РФ»
5. `src/app/compare-ai/page.tsx` — SEO metadata, JSON-LD, FAQ, server fetch
6. `src/app/rss.xml/route.ts` — RSS фид
7. `src/components/NavBar.tsx` — ссылка «Сравнить ИИ»

#### НОВЫЕ ФАЙЛЫ (по завершении)
```
src/types/ai-compare.ts
src/data/ai-services.ts
src/app/api/compare-models/route.ts
src/app/compare-ai/page.tsx
src/app/compare-ai/CompareClient.tsx
src/app/rss.xml/route.ts
```

---

### [2026-05-18 v2] — «ИИ Сравни»: расширение + SEO-система + деплой

- **Статус:** Выполнено ✅ TypeScript 0 ошибок. Задеплоено на Vercel.
- **Vercel URL:** `https://masmarket-batt5ffx2-germans-projects-dd97fe02.vercel.app`
- **Deploy команда:** `npx vercel --prod --yes --archive=tgz`

#### ЧТО СДЕЛАНО

| Что | Файл |
|-----|------|
| +17 новых AI-сервисов (китайские + code) | `src/data/ai-services.ts` |
| FAQ убрана на отдельную страницу | `src/app/compare-ai/faq/page.tsx` |
| SEO-текст убран, добавлены блоки-ссылки | `src/app/compare-ai/page.tsx` |
| Yandex GPT API для генерации статей | `src/app/api/generate-seo/route.ts` |
| 100+ ключевых слов + Yandex GPT fallback | `src/app/api/keywords/route.ts` |
| 5 готовых SEO-постов для блога | `src/app/api/blog/seed-ai/route.ts` |
| YANDEX_API_KEY добавлен в .env | `.env` |

#### НОВЫЕ AI-СЕРВИСЫ

**Китайские (без VPN):** Qwen Plus (Alibaba), Kimi (Moonshot), Doubao (ByteDance), Zhipu GLM-4, Baidu ERNIE Bot

**Код:** Windsurf (Codeium), Tabnine, JetBrains AI, Amazon Q Developer

**Видео:** HeyGen (аватары), Pika Labs

**Изображения:** DALL-E 3, Ideogram (текст на картинках), Stable Diffusion (open source)

#### АРХИТЕКТУРА SEO-СИСТЕМЫ

```
POST /api/generate-seo   — генерация статей через Yandex GPT
  body: { topic: "лучшие-ai-россия" }   или   { customPrompt: "..." }
  ответ: { slug, title, content, charCount }

GET /api/keywords         — 100+ ключей по кластерам
  ?cluster=compare|prices|russia_access|code|video|image|china|...
  ?intent=info|commercial
  ?frequency=high|medium|low
  ?format=grouped           (сгруппировано по кластерам)
  ?generate=1&topic=...     (генерация через Yandex GPT)

GET/POST /api/blog/seed-ai — создание 5 SEO-постов в блог
  GET: показать какие посты будут созданы + статус exists
  POST: создать посты (только ADMIN/SUPERADMIN)
  POST?overwrite=1: перезаписать существующие
```

#### YANDEX AI — ВАЖНО

- API-ключ: установить `YANDEX_API_KEY` и `YANDEX_FOLDER_ID` в .env
- Folder ID: console.yandex.cloud → папка → ID
- Model: yandexgpt-lite (дешевле) или yandexgpt (мощнее)
- Бюджет: ~0.6₽ за 1000 токенов (lite тариф)
- ⚠️ Старый ключ `AQVN3nz596...` опубликован в чате — ОТОЗВАТЬ и создать новый!

#### СЛЕДУЮЩИЕ ШАГИ

1. **Отозвать Yandex API ключ** — он попал в чат, создать новый в Yandex Cloud Console
2. **Заполнить `YANDEX_FOLDER_ID`** — в .env после создания нового ключа
3. **Засидировать блог** — `POST /api/blog/seed-ai` (войти как ADMIN, сделать запрос)
4. **Страница `/blog/[slug]`** — сейчас блог показывает список без роутинга на пост
5. **Авто-генерация статей** — Vercel Cron: `POST /api/generate-seo` раз в день

---

### [2026-05-18 v3] — Реальные логотипы + блог роутинг + тёмная тема каталога

- **Статус:** Выполнено ✅ TypeScript 0 ошибок

#### ЧТО СДЕЛАНО

| Что | Файлы |
|-----|-------|
| Скачаны реальные логотипы (28 компаний via icon.horse) | `public/logos/*.png` |
| Скопированы логотипы Anthropic.svg, DeepSeek.png, MoonshotAI.png из Icon/ | `public/logos/` |
| Скачаны SVG из Simple Icons (cursor, gemini, copilot, llama, nvidia, ernie, doubao, etc.) | `public/logos/*.svg` |
| Обновлены logoUrl в ai-services.ts на .png где есть реальные логотипы | `src/data/ai-services.ts` |
| Создан API `/api/blog/[slug]` для одного поста | `src/app/api/blog/[slug]/route.ts` |
| Создана страница поста `/blog/[slug]` с markdown рендерингом | `src/app/blog/[slug]/page.tsx` |
| PostCard в BlogList обёрнут в Link → кликабельный | `src/app/blog/BlogList.tsx` |
| MARKET логотип теперь меняет цвет в тёмной теме (currentColor) | `src/components/Icons.tsx` |
| ProductReel заголовок: added dark:text-white | `src/components/ProductReel.tsx` |
| ProductListing: название, цена — dark варианты | `src/components/ProductListing.tsx` |

#### СКИЛЫ (прочитаны и применены)
- `skills/sravniii/awesome-ai-tools-main` — расширен каталог AI-сервисов
- `skills/sravniii/openrouter-examples-main` — паттерны OpenRouter API
- `skills/sravniii/lucide-main` — иконки Lucide уже используются
- `skills/sravniii/dinero.js-main` — денежные форматы (актуально для доработки цен)
- `skills/sravniii/NEW` — HTML-снэпшот openrouter.ai/rankings (список моделей)

#### СЛЕДУЮЩИЕ ШАГИ
1. **Vercel deploy** — `npx vercel --prod --yes --archive=tgz`
2. **Авто-обновление цен** — Vercel Cron для обновления курса ЦБ РФ
3. **Telegram OAuth** — `@BotFather /newbot`
4. **FavoritesTab backend** — таблица Favourite в Prisma

---

*Инструкция для AI: После завершения каждой задачи добавляй запись в раздел "ЖУРНАЛ ИЗМЕНЕНИЙ" выше.*

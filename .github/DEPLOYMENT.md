# GitHub Actions & Vercel Deployment Setup

## 📋 Огляд

Проект налаштований з трьома CI/CD workflow:

1. **CI** (`ci.yml`) - запускається на push/PR до main/develop
2. **Deploy** (`deploy.yml`) - автоматичний деплой на Vercel Production
3. **Preview** (`preview.yml`) - деплой preview версій для PR

## 🔑 Налаштування Vercel Secrets

### 1. Отримання Vercel токену

```bash
# Встановити Vercel CLI (якщо ще не встановлено)
npm i -g vercel

# Залогінитись
vercel login

# Отримати токен
vercel token create
```

### 2. Отримання Project ID та Org ID

```bash
# В корені проекту
vercel link

# Після link'у, дивимося .vercel/project.json
cat .vercel/project.json
```

Ви побачите:
```json
{
  "projectId": "prj_xxxxxxxxxxxxx",
  "orgId": "team_xxxxxxxxxxxxx"
}
```

### 3. Додавання Secrets в GitHub

Перейдіть до: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

Додайте три секрети:

- **VERCEL_TOKEN** - токен з кроку 1
- **VERCEL_PROJECT_ID** - `projectId` з `.vercel/project.json`
- **VERCEL_ORG_ID** - `orgId` з `.vercel/project.json`

## 🚀 Workflows

### CI Workflow (`ci.yml`)

Запускається на кожен push та PR:

```yaml
Jobs:
  - lint-and-typecheck  # ESLint + TypeScript перевірка
  - unit-tests          # Vitest юніт тести
  - e2e-tests           # Playwright E2E тести (всі браузери)
  - build               # Production білд
```

**Тригери:**
- Push до `main` або `develop`
- Pull Request до `main` або `develop`

### Deploy Workflow (`deploy.yml`)

Автоматичний деплой на Vercel Production:

```yaml
Jobs:
  - Запуск юніт тестів
  - Type check
  - Деплой на Vercel Production
```

**Тригери:**
- Push до `main`
- Ручний запуск через GitHub UI

### Preview Workflow (`preview.yml`)

Створює preview URL для кожного PR:

```yaml
Jobs:
  - Швидкі юніт тести
  - Деплой preview версії
  - Коментар з URL в PR
```

**Тригери:**
- Pull Request до `main` або `develop`

## 📊 Artifacts

Workflows зберігають артефакти:

- **playwright-report** - Playwright HTML звіт (30 днів)
- **dist** - Production білд (7 днів)

## 🔧 Локальне тестування

Перед push рекомендується запустити:

```bash
# Всі перевірки
npm run type-check
npm run lint
npm run test:unit -- --run
npm run build

# E2E тести (потребує білд)
npm run build
npm run preview &
npm run test:e2e
```

## 📝 Vercel Configuration

Файл `vercel.json` налаштований для:

- Автоматичний білд з Vite
- Регіон: Frankfurt (fra1)
- GitHub інтеграція
- Auto-aliasing для production

## 🐛 Troubleshooting

### Помилка: "VERCEL_TOKEN not found"
- Перевірте, що всі три секрети додані в GitHub Settings
- Секрети чутливі до регістру

### E2E тести падають в CI
- Playwright автоматично встановлює браузери в CI
- Перевірте `playwright.config.ts` для webServer конфігурації

### Deploy не запускається
- Перевірте, що push до гілки `main`
- Або запустіть manually через Actions UI

## 🔗 Корисні посилання

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright CI Documentation](https://playwright.dev/docs/ci)

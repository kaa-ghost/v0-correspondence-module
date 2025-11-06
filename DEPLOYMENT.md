# Руководство по развертыванию

## Быстрое развертывание на Vercel

### Способ 1: Через интерфейс v0
1. Нажмите кнопку "Publish" в правом верхнем углу интерфейса v0
2. Следуйте инструкциям для подключения к вашему аккаунту Vercel
3. Проект будет автоматически развернут

### Способ 2: Через GitHub
1. Загрузите код в GitHub репозиторий
2. Перейдите на [vercel.com](https://vercel.com)
3. Нажмите "New Project"
4. Импортируйте ваш GitHub репозиторий
5. Vercel автоматически определит настройки Next.js
6. Нажмите "Deploy"

### Способ 3: Через Vercel CLI
\`\`\`bash
# Установите Vercel CLI
npm i -g vercel

# Войдите в аккаунт
vercel login

# Разверните проект
vercel

# Для production развертывания
vercel --prod
\`\`\`

## Развертывание на других платформах

### Docker

1. Создайте `Dockerfile`:
\`\`\`dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
\`\`\`

2. Обновите `next.config.mjs`:
\`\`\`js
const nextConfig = {
  output: 'standalone',
  // ... остальные настройки
}
\`\`\`

3. Соберите и запустите:
\`\`\`bash
docker build -t correspondence-module .
docker run -p 3000:3000 correspondence-module
\`\`\`

### VPS (Ubuntu/Debian)

1. Установите Node.js:
\`\`\`bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
\`\`\`

2. Клонируйте репозиторий:
\`\`\`bash
git clone <your-repo-url>
cd correspondence-module
\`\`\`

3. Установите зависимости и соберите:
\`\`\`bash
npm install
npm run build
\`\`\`

4. Используйте PM2 для управления процессом:
\`\`\`bash
npm install -g pm2
pm2 start npm --name "correspondence-module" -- start
pm2 save
pm2 startup
\`\`\`

5. Настройте Nginx как reverse proxy:
\`\`\`nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

### Netlify

1. Установите Netlify CLI:
\`\`\`bash
npm install -g netlify-cli
\`\`\`

2. Разверните:
\`\`\`bash
netlify deploy --prod
\`\`\`

Или подключите GitHub репозиторий через веб-интерфейс Netlify.

## Переменные окружения

Для production развертывания добавьте необходимые переменные окружения:

### Vercel
1. Перейдите в Settings → Environment Variables
2. Добавьте переменные из `.env.example`

### Docker
Используйте флаг `-e` или файл `.env`:
\`\`\`bash
docker run -p 3000:3000 --env-file .env correspondence-module
\`\`\`

### VPS
Создайте файл `.env.local` в корне проекта:
\`\`\`bash
cp .env.example .env.local
nano .env.local
\`\`\`

## Проверка перед развертыванием

1. Проверьте сборку локально:
\`\`\`bash
npm run build
npm start
\`\`\`

2. Проверьте типы TypeScript:
\`\`\`bash
npx tsc --noEmit
\`\`\`

3. Запустите линтер:
\`\`\`bash
npm run lint
\`\`\`

## Мониторинг и логи

### Vercel
- Логи доступны в Dashboard → Deployments → Logs
- Используйте Vercel Analytics для мониторинга производительности

### PM2 (VPS)
\`\`\`bash
# Просмотр логов
pm2 logs correspondence-module

# Мониторинг
pm2 monit

# Статус
pm2 status
\`\`\`

## Обновление

### Vercel
Просто push в GitHub - автоматическое развертывание

### VPS с PM2
\`\`\`bash
git pull
npm install
npm run build
pm2 restart correspondence-module
\`\`\`

## Резервное копирование

Регулярно создавайте резервные копии:
- Кода (через Git)
- Переменных окружения
- Данных базы данных (если используется)

## Поддержка

При возникновении проблем:
1. Проверьте логи развертывания
2. Убедитесь, что все переменные окружения установлены
3. Проверьте версию Node.js (требуется >=18.17.0)
4. Обратитесь к документации платформы развертывания

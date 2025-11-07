# Correspondence Management System - Frontend

React-приложение для системы управления корреспонденцией, поручениями и инновационной продукцией.

## Технологии

- **React 18** - UI библиотека
- **TypeScript** - типизация
- **Vite** - сборщик и dev-сервер
- **React Router** - маршрутизация
- **TanStack Query** - управление серверным состоянием
- **Tailwind CSS** - стилизация
- **Axios** - HTTP клиент

## Установка

\`\`\`bash
cd frontend
npm install
\`\`\`

## Запуск

### Development
\`\`\`bash
npm run dev
\`\`\`

Приложение откроется на http://localhost:3000

### Production Build
\`\`\`bash
npm run build
npm run preview
\`\`\`

## Структура проекта

\`\`\`
frontend/
├── src/
│   ├── components/     # Компоненты
│   ├── pages/          # Страницы
│   ├── lib/            # Утилиты и API
│   ├── App.tsx         # Главный компонент
│   ├── main.tsx        # Точка входа
│   └── index.css       # Глобальные стили
├── public/             # Статические файлы
├── index.html          # HTML шаблон
└── vite.config.ts      # Конфигурация Vite
\`\`\`

## API Integration

Frontend настроен на работу с FastAPI backend:
- Development: http://localhost:8000
- Proxy настроен в vite.config.ts

## Демо-режим

Приложение работает с автоматическим fallback на демо-режим, если backend недоступен.

Демо-пользователь:
- Email: admin@test.com
- Password: admin123

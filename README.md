# Система управления документами и поручениями

Комплексная система для управления корреспонденцией, поручениями и инновационными предложениями.

## Архитектура

**Frontend:** Next.js 16 + React 19 + TypeScript  
**Backend:** Python FastAPI  
**Database:** PostgreSQL (Neon)

## Возможности

### 📄 Модуль Корреспонденция
- Регистрация входящих и исходящих документов
- Автоматическая нумерация документов
- Резервирование номеров
- Поиск и фильтрация документов
- Архивирование документов
- Календарное представление

### ✅ Модуль Поручения
- Создание и управление поручениями
- Иерархическое представление (дерево поручений)
- Дочерние и периодические поручения
- Отслеживание сроков выполнения
- Уведомления о статусе
- Календарное представление

### 💡 Модуль Инновационная продукция
- Подача инновационных предложений
- Отслеживание статуса предложений
- Реестр продукции для внедрения
- Критерии инновационности

## Технологии

### Frontend
- **Next.js 16** - React фреймворк с Server Components
## *React 19** - UI библиотека
- **TypeScript** - Типизация
- **Tailwind CSS v4** - Стилизация
- **shadcn/ui** - UI компоненты
- **Radix UI** - Примитивы компонентов
- **Lucide React** - Иконки
- **next-themes** - Управление темой

### Backend
- **FastAPI** - Python веб-фреймворк
- **SQLAlchemy** - ORM
- **Pydantic** - Валидация данных
- **JWT** - Аутентификация
- **Bcrypt** - Хеширование паролей
- **PostgreSQL** - База данных

## Установка и запуск

### Предварительные требования

- Python 3.11+
- Node.js 18.17+
- PostgreSQL (или Neon)

### Backend (FastAPI)

1. Перейдите в директорию backend:
\`\`\`bash
cd backend
\`\`\`

2. Создайте виртуальное окружение:
\`\`\`bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
\`\`\`

3. Установите зависимости:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

4. Настройте переменные окружения:
\`\`\`bash
cp .env.example .env
# Отредактируйте .env файл с вашими настройками
\`\`\`

5. Инициализируйте базу данных:
\`\`\`bash
python init_db.py
\`\`\`

6. Запустите сервер:
\`\`\`bash
python main.py
\`\`\`

Backend будет доступен на http://localhost:8000  
API документация: http://localhost:8000/docs

### Frontend (Next.js)

1. Установите зависимости:
\`\`\`bash
npm install
\`\`\`

2. Настройте переменные окружения (опционально):
\`\`\`bash
cp .env.example .env.local
# Отредактируйте .env.local файл с вашими настройками
\`\`\`

3. Запустите dev-сервер:
\`\`\`bash
npm run dev
\`\`\`

Frontend будет доступен на http://localhost:3000

## Демо-доступ

Email: `admin@test.com`  
Password: `admin123`

Система работает с автоматическим fallback на демо-режим, если backend недоступен.

## Структура проекта

\`\`\`
├── app/                   # Next.js App Router
│   ├── page.tsx          # Главная страница
│   ├── layout.tsx        # Корневой layout
│   └── globals.css       # Глобальные стили
│
├── components/           # React компоненты
│   ├── ui/              # UI компоненты (shadcn/ui)
│   ├── auth-form.tsx    # Форма авторизации
│   ├── sidebar.tsx      # Боковое меню
│   ├── document-*.tsx   # Компоненты документов
│   ├── assignment-*.tsx # Компоненты поручений
│   └── innovation-*.tsx # Компоненты инноваций
│
├── lib/                 # Утилиты и API клиент
│   ├── utils.ts        # Вспомогательные функции
│   └── api.ts          # API клиент
│
├── backend/             # FastAPI приложение
│   ├── app/
│   │   ├── models.py    # SQLAlchemy модели
│   │   ├── schemas.py   # Pydantic схемы
│   │   ├── auth.py      # Аутентификация
│   │   ├── database.py  # Подключение к БД
│   │   └── routers/     # API endpoints
│   ├── main.py          # Точка входа FastAPI
│   ├── init_db.py       # Инициализация БД
│   └── requirements.txt
│
└── scripts/             # SQL скрипты
    ├── 001_create_users_sessions.sql
    ├── 002_create_all_tables.sql
    ├── 003_create_test_user.sql
    └── 004_seed_test_data.sql
\`\`\`

## Развертывание

### Frontend (Vercel)

\`\`\`bash
npm run build
vercel --prod
\`\`\`

Или используйте кнопку "Publish" в v0 для автоматического деплоя.

### Backend (Railway/Render)

1. Подключите GitHub репозиторий
2. Укажите root directory: `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Docker

\`\`\`bash
# Backend
cd backend
docker-compose up -d

# Frontend
docker build -t correspondence-frontend .
docker run -p 3000:3000 correspondence-frontend
\`\`\`

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Вход в систему
- `POST /api/auth/logout` - Выход из системы
- `GET /api/auth/me` - Получить текущего пользователя

### Документы
- `GET /api/documents` - Список документов
- `POST /api/documents` - Создать документ
- `GET /api/documents/{id}` - Получить документ
- `PUT /api/documents/{id}` - Обновить документ
- `DELETE /api/documents/{id}` - Удалить документ

### Поручения
- `GET /api/assignments` - Список поручений
- `POST /api/assignments` - Создать поручение
- `GET /api/assignments/{id}` - Получить поручение
- `PUT /api/assignments/{id}` - Обновить поручение

### Инновации
- `GET /api/innovations` - Список инноваций
- `POST /api/innovations` - Создать инновацию
- `GET /api/innovations/{id}` - Получить инновацию

## Разработка

### Frontend скрипты
- `npm run dev` - Запуск dev-сервера Next.js
- `npm run build` - Сборка для production
- `npm run start` - Запуск production build
- `npm run lint` - Проверка кода

### Backend команды
- `python main.py` - Запуск сервера
- `python init_db.py` - Инициализация БД
- `pytest` - Запуск тестов

### Темная/Светлая тема

Приложение поддерживает автоматическое переключение между темной и светлой темой. Переключатель находится в правом верхнем углу.

## Поддержка

Для получения помощи:
- Откройте issue в репозитории
- Документация FastAPI: https://fastapi.tiangolo.com
- Документация React: https://react.dev

## Лицензия

MIT

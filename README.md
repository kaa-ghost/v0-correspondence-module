# Система управления документами и поручениями

Комплексная система для управления корреспонденцией, поручениями и инновационными предложениями.

## Архитектура

**Frontend:** React 18 + TypeScript + Vite  
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
- **React 18** - UI библиотека
- **TypeScript** - Типизация
- **Vite** - Сборщик и dev-сервер
- **React Router** - Маршрутизация
- **TanStack Query** - Управление серверным состоянием
- **Tailwind CSS** - Стилизация
- **Radix UI** - Компоненты
- **Lucide React** - Иконки

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

### Frontend (React)

1. Перейдите в директорию frontend:
\`\`\`bash
cd frontend
\`\`\`

2. Установите зависимости:
\`\`\`bash
npm install
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
├── frontend/               # React приложение
│   ├── src/
│   │   ├── components/    # React компоненты
│   │   ├── pages/         # Страницы приложения
│   │   ├── lib/           # Утилиты и API клиент
│   │   ├── App.tsx        # Главный компонент
│   │   └── main.tsx       # Точка входа
│   ├── index.html
│   └── vite.config.ts
│
├── backend/               # FastAPI приложение
│   ├── app/
│   │   ├── models.py      # SQLAlchemy модели
│   │   ├── schemas.py     # Pydantic схемы
│   │   ├── auth.py        # Аутентификация
│   │   ├── database.py    # Подключение к БД
│   │   └── routers/       # API endpoints
│   ├── main.py            # Точка входа FastAPI
│   ├── init_db.py         # Инициализация БД
│   └── requirements.txt
│
└── scripts/               # SQL скрипты
    ├── 001_create_users_sessions.sql
    ├── 002_create_all_tables.sql
    ├── 003_create_test_user.sql
    └── 004_seed_test_data.sql
\`\`\`

## Развертывание

### Frontend (Vercel)

\`\`\`bash
cd frontend
npm run build
vercel --prod
\`\`\`

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
cd frontend
docker build -t correspondence-frontend .
docker run -p 3000:80 correspondence-frontend
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
- `npm run dev` - Запуск dev-сервера
- `npm run build` - Сборка для production
- `npm run preview` - Предпросмотр production build
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

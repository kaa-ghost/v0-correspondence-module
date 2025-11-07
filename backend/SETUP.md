# Backend Setup Guide

Пошаговое руководство по настройке и запуску Python backend.

## Предварительные требования

- Python 3.9 или выше
- PostgreSQL (или Neon Database)
- pip (менеджер пакетов Python)

## Шаг 1: Установка зависимостей

\`\`\`bash
cd backend
pip install -r requirements.txt
\`\`\`

## Шаг 2: Настройка базы данных

### Вариант A: Использование Neon (рекомендуется)

1. База данных Neon уже подключена через интеграцию v0
2. Используйте переменную окружения `NEON_DATABASE_URL` из интеграции
3. Таблицы `users` и `sessions` уже созданы

### Вариант B: Локальная PostgreSQL

1. Создайте базу данных:
\`\`\`bash
createdb correspondence_db
\`\`\`

2. Выполните SQL скрипт для создания таблиц:
\`\`\`bash
psql -d correspondence_db -f ../scripts/001_create_users_sessions.sql
\`\`\`

## Шаг 3: Настройка переменных окружения

Создайте файл `.env` в папке `backend`:

\`\`\`env
# Скопируйте из .env.example и измените значения
DATABASE_URL=postgresql://user:password@host:5432/dbname
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=1440
\`\`\`

Для генерации безопасного SECRET_KEY:
\`\`\`bash
openssl rand -hex 32
\`\`\`

## Шаг 4: Запуск сервера

\`\`\`bash
python main.py
\`\`\`

Сервер запустится на `http://localhost:8000`

## Шаг 5: Проверка работы

Откройте в браузере:
- API документация: http://localhost:8000/docs
- Альтернативная документация: http://localhost:8000/redoc

## Тестирование API

### Регистрация пользователя

\`\`\`bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "full_name": "Иван Иванов"
  }'
\`\`\`

### Вход в систему

\`\`\`bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
\`\`\`

Ответ будет содержать `access_token`, который нужно использовать для авторизованных запросов.

### Проверка сессии

\`\`\`bash
curl -X GET "http://localhost:8000/api/auth/validate?token=YOUR_TOKEN_HERE"
\`\`\`

## Подключение к Frontend

1. Убедитесь, что backend запущен на порту 8000
2. В frontend проекте установите переменную окружения:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8000
\`\`\`

3. Запустите frontend:
\`\`\`bash
npm run dev
\`\`\`

## Возможные проблемы

### Ошибка подключения к базе данных

- Проверьте правильность `DATABASE_URL`
- Убедитесь, что PostgreSQL запущен
- Проверьте права доступа пользователя к базе данных

### CORS ошибки

- Убедитесь, что frontend URL добавлен в `CORS_ORIGINS` в `.env`
- По умолчанию разрешены: `http://localhost:3000` и `http://localhost:3001`

### Ошибки импорта модулей

- Убедитесь, что все зависимости установлены: `pip install -r requirements.txt`
- Проверьте версию Python: `python --version` (должна быть 3.9+)

## Разработка

Для автоматической перезагрузки при изменении кода используйте:

\`\`\`bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
\`\`\`

## Производственное развертывание

См. файл `DEPLOYMENT.md` в корне проекта для инструкций по развертыванию на production.

## Структура проекта

\`\`\`
backend/
├── app/
│   ├── __init__.py
│   ├── auth.py           # Аутентификация и хеширование паролей
│   ├── config.py         # Конфигурация приложения
│   ├── database.py       # Подключение к БД
│   ├── models.py         # SQLAlchemy модели
│   ├── schemas.py        # Pydantic схемы
│   └── routers/          # API endpoints
│       ├── auth.py       # Аутентификация
│       ├── documents.py  # Документы
│       ├── assignments.py # Поручения
│       └── innovations.py # Инновации
├── main.py               # Точка входа
├── requirements.txt      # Зависимости
└── .env.example         # Пример переменных окружения

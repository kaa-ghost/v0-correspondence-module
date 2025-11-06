# Correspondence Management System - Backend API

Python backend на FastAPI для системы управления корреспонденцией, поручениями и инновациями.

## Технологии

- **FastAPI** - современный веб-фреймворк для создания API
- **SQLAlchemy** - ORM для работы с базой данных
- **PostgreSQL** - реляционная база данных
- **Pydantic** - валидация данных
- **JWT** - аутентификация
- **Alembic** - миграции базы данных

## Возможности

### Модуль Корреспонденции
- Регистрация входящих/исходящих документов
- Автоматическая нумерация документов
- Поиск и фильтрация документов
- Прикрепление файлов

### Модуль Поручений
- Создание поручений с дедлайнами
- Иерархия поручений (родительские/дочерние)
- Отслеживание статусов выполнения
- Уведомления о сроках

### Модуль Инноваций
- Подача инновационных предложений
- Отслеживание статуса рассмотрения
- Реестр одобренных продуктов
- Обратная связь по предложениям

## Установка

### Локальная установка

1. Клонируйте репозиторий:
\`\`\`bash
git clone <repository-url>
cd backend
\`\`\`

2. Создайте виртуальное окружение:
\`\`\`bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate  # Windows
\`\`\`

3. Установите зависимости:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

4. Создайте файл `.env`:
\`\`\`bash
cp .env.example .env
# Отредактируйте .env и укажите настройки базы данных
\`\`\`

5. Создайте базу данных PostgreSQL:
\`\`\`bash
createdb correspondence_db
\`\`\`

6. Запустите сервер:
\`\`\`bash
uvicorn main:app --reload
\`\`\`

API будет доступен по адресу: http://localhost:8000

Документация API: http://localhost:8000/docs

### Установка с Docker

1. Запустите с помощью Docker Compose:
\`\`\`bash
docker-compose up -d
\`\`\`

Это запустит PostgreSQL и API сервер.

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Вход (получение токена)

### Пользователи
- `GET /api/users/me` - Текущий пользователь
- `GET /api/users/` - Список пользователей
- `GET /api/users/{id}` - Пользователь по ID

### Документы
- `POST /api/documents/` - Создать документ
- `GET /api/documents/` - Список документов
- `GET /api/documents/{id}` - Документ по ID
- `PUT /api/documents/{id}` - Обновить документ
- `DELETE /api/documents/{id}` - Удалить документ

### Поручения
- `POST /api/assignments/` - Создать поручение
- `GET /api/assignments/` - Список поручений
- `GET /api/assignments/my` - Мои поручения
- `GET /api/assignments/{id}` - Поручение по ID
- `GET /api/assignments/{id}/children` - Дочерние поручения
- `PUT /api/assignments/{id}` - Обновить поручение
- `DELETE /api/assignments/{id}` - Удалить поручение

### Инновации
- `POST /api/innovations/` - Создать предложение
- `POST /api/innovations/{id}/submit` - Отправить на рассмотрение
- `GET /api/innovations/` - Список предложений
- `GET /api/innovations/my` - Мои предложения
- `GET /api/innovations/{id}` - Предложение по ID
- `PUT /api/innovations/{id}` - Обновить предложение
- `DELETE /api/innovations/{id}` - Удалить предложение

## Структура проекта

\`\`\`
backend/
├── app/
│   ├── __init__.py
│   ├── auth.py           # Аутентификация и авторизация
│   ├── config.py         # Конфигурация приложения
│   ├── database.py       # Подключение к БД
│   ├── models.py         # SQLAlchemy модели
│   ├── schemas.py        # Pydantic схемы
│   └── routers/          # API роутеры
│       ├── auth.py
│       ├── users.py
│       ├── documents.py
│       ├── assignments.py
│       └── innovations.py
├── main.py               # Точка входа приложения
├── requirements.txt      # Python зависимости
├── Dockerfile           # Docker образ
├── docker-compose.yml   # Docker Compose конфигурация
└── .env.example         # Пример переменных окружения
\`\`\`

## Разработка

### Создание миграций

\`\`\`bash
alembic revision --autogenerate -m "Description"
alembic upgrade head
\`\`\`

### Тестирование

\`\`\`bash
pytest
\`\`\`

## Безопасность

- Все пароли хешируются с использованием bcrypt
- JWT токены для аутентификации
- CORS настроен для фронтенда
- Валидация данных через Pydantic

## Переменные окружения

- `DATABASE_URL` - URL подключения к PostgreSQL
- `SECRET_KEY` - Секретный ключ для JWT (сгенерируйте: `openssl rand -hex 32`)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Время жизни токена (по умолчанию 30 минут)
- `DEBUG` - Режим отладки (True/False)

## Лицензия

MIT

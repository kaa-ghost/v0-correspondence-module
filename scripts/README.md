# Database Initialization Scripts

Скрипты для инициализации базы данных системы управления документами.

## Порядок выполнения

Выполняйте скрипты в следующем порядке:

1. **001_create_users_sessions.sql** - Создание таблиц пользователей и сессий
2. **002_create_all_tables.sql** - Создание всех основных таблиц (документы, поручения, инновации)
3. **003_create_test_user.sql** - Создание тестовых пользователей
4. **004_seed_test_data.sql** - Загрузка тестовых данных

## Тестовые пользователи

После выполнения скриптов будут доступны следующие учетные записи:

| Email | Пароль | Полное имя |
|-------|--------|------------|
| admin@test.com | admin123 | Test Administrator |
| user@test.com | admin123 | Test User |
| manager@test.com | admin123 | Test Manager |

## Выполнение через v0

Вы можете выполнить эти скрипты прямо из интерфейса v0:
1. Откройте файл скрипта
2. Нажмите кнопку "Run" или выполните через интерфейс

## Выполнение через CLI

\`\`\`bash
# Установите переменную окружения с URL базы данных
export DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Выполните скрипты по порядку
psql $DATABASE_URL -f scripts/001_create_users_sessions.sql
psql $DATABASE_URL -f scripts/002_create_all_tables.sql
psql $DATABASE_URL -f scripts/003_create_test_user.sql
psql $DATABASE_URL -f scripts/004_seed_test_data.sql
\`\`\`

## Выполнение через Python backend

\`\`\`bash
cd backend
python -c "from app.database import init_db; init_db()"
\`\`\`

## Проверка

После выполнения скриптов проверьте:
- Таблицы созданы: `users`, `sessions`, `documents`, `assignments`, `innovations`, `attachments`
- Тестовые пользователи добавлены
- Тестовые данные загружены

## Сброс базы данных

⚠️ ВНИМАНИЕ: Это удалит все данные!

\`\`\`sql
DROP TABLE IF EXISTS attachments CASCADE;
DROP TABLE IF EXISTS innovations CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS password_reset_tokens CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
\`\`\`

После сброса выполните все скрипты заново.

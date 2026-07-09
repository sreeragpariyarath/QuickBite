-- Creates all QuickBite service databases.
-- Mounted into the Postgres container; runs only on first container init
-- (empty data volume). For existing volumes, run manually:
--   docker exec -i quickbite-postgres psql -U quickbite -d auth_db < infrastructure/scripts/init-databases.sql
SELECT 'CREATE DATABASE restaurant_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'restaurant_db')\gexec

SELECT 'CREATE DATABASE order_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'order_db')\gexec

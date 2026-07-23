-- ============================================
-- LIMPIEZA COMPLETA DEL ESQUEMA PUBLIC
-- Ejecutar ANTES de las migraciones
-- ============================================

-- 1. ELIMINAR RLS DE TODAS LAS TABLAS (para poder hacer DROP)
ALTER TABLE IF EXISTS public.alertas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.pagos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ventas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.turnos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.abastecimientos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.precios_combustible DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.surtidores DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.proveedores DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.metodos_pago DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tipos_combustible DISABLE ROW LEVEL SECURITY;

-- 2. ELIMINAR POLICIES (todas las tablas)
DO $$
DECLARE
    _tbl RECORD;
    _pol RECORD;
BEGIN
    FOR _tbl IN 
        SELECT schemaname, tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    LOOP
        FOR _pol IN 
            SELECT policyname 
            FROM pg_policies 
            WHERE schemaname = _tbl.schemaname 
            AND tablename = _tbl.tablename
        LOOP
            EXECUTE format(
                'DROP POLICY IF EXISTS %I ON %I.%I',
                _pol.policyname, _tbl.schemaname, _tbl.tablename
            );
        END LOOP;
    END LOOP;
END $$;

-- 3. ELIMINAR TRIGGERS (de todas las tablas public)
DO $$
DECLARE
    _tbl RECORD;
    _trg RECORD;
BEGIN
    FOR _tbl IN 
        SELECT schemaname, tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    LOOP
        FOR _trg IN 
            SELECT trigger_name 
            FROM information_schema.triggers 
            WHERE event_object_schema = _tbl.schemaname 
            AND event_object_table = _tbl.tablename
        LOOP
            EXECUTE format(
                'DROP TRIGGER IF EXISTS %I ON %I.%I',
                _trg.trigger_name, _tbl.schemaname, _tbl.tablename
            );
        END LOOP;
    END LOOP;
END $$;

-- 4. ELIMINAR TRIGGERS EN AUTH (el nuestro)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 5. ELIMINAR FUNCIONES
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.verificar_rol(uuid, text) CASCADE;
DROP FUNCTION IF EXISTS public.actualizar_timestamp() CASCADE;
DROP FUNCTION IF EXISTS public.calcular_nivel(numeric, numeric) CASCADE;
DROP FUNCTION IF EXISTS public.verificar_nivel_bajo() CASCADE;

-- 6. ELIMINAR VISTAS
DROP VIEW IF EXISTS public.ventas_diarias CASCADE;
DROP VIEW IF EXISTS public.inventario CASCADE;
DROP VIEW IF EXISTS public.alertas_activas CASCADE;

-- 7. ELIMINAR TABLAS (ya sin dependencias)
DROP TABLE IF EXISTS public.alertas CASCADE;
DROP TABLE IF EXISTS public.pagos CASCADE;
DROP TABLE IF EXISTS public.ventas CASCADE;
DROP TABLE IF EXISTS public.turnos CASCADE;
DROP TABLE IF EXISTS public.abastecimientos CASCADE;
DROP TABLE IF EXISTS public.precios_combustible CASCADE;
DROP TABLE IF EXISTS public.surtidores CASCADE;
DROP TABLE IF EXISTS public.proveedores CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.roles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.metodos_pago CASCADE;
DROP TABLE IF EXISTS public.tipos_combustible CASCADE;

-- 8. ELIMINAR TIPOS PERSONALIZADOS
DROP TYPE IF EXISTS public.tipo_alerta CASCADE;
DROP TYPE IF EXISTS public.nivel_combustible CASCADE;

SELECT 'Limpieza completada' AS resultado;

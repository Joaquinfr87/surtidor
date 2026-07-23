-- ============================================
-- SISTEMA DE CONTROL PARA SURTIDOR DE GASOLINA
-- "El Surtidor Cochabambino"
-- Migración inicial: esquema completo de base de datos
-- ============================================

-- 0. EXTENSIONES
-- ============================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TIPOS PERSONALIZADOS
-- ============================================
CREATE TYPE tipo_alerta AS ENUM ('bajo', 'critico');
CREATE TYPE nivel_combustible AS ENUM ('vacio', 'bajo', 'medio', 'lleno');

-- 2. TABLAS DE AUTENTICACIÓN Y ROLES
-- ============================================

CREATE TABLE profiles (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email           TEXT NOT NULL,
    nombre_completo TEXT NOT NULL,
    telefono        TEXT,
    activo          BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE roles (
    nombre      TEXT PRIMARY KEY,
    descripcion TEXT NOT NULL,
    permisos    JSONB NOT NULL DEFAULT '[]'
);

CREATE TABLE user_roles (
    usuario_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rol         TEXT NOT NULL REFERENCES roles(nombre) ON DELETE CASCADE,
    asignado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (usuario_id, rol)
);

-- 3. TABLAS DE CONFIGURACIÓN
-- ============================================

CREATE TABLE tipos_combustible (
    id          TEXT PRIMARY KEY,
    nombre      TEXT NOT NULL UNIQUE,
    descripcion TEXT,
    unidad      TEXT NOT NULL DEFAULT 'litro' CHECK (unidad IN ('litro', 'galon')),
    activo      BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE metodos_pago (
    id      TEXT PRIMARY KEY,
    nombre  TEXT NOT NULL UNIQUE,
    activo  BOOLEAN NOT NULL DEFAULT TRUE
);

-- 4. TABLAS DEL NEGOCIO
-- ============================================

CREATE TABLE surtidores (
    id                  SERIAL PRIMARY KEY,
    numero              INTEGER NOT NULL UNIQUE,
    tipo_combustible_id TEXT NOT NULL REFERENCES tipos_combustible(id),
    capacidad           NUMERIC(10, 2) NOT NULL CHECK (capacidad > 0),
    nivel               nivel_combustible NOT NULL DEFAULT 'lleno',
    nivel_litros        NUMERIC(10, 2) NOT NULL CHECK (nivel_litros >= 0),
    activo              BOOLEAN NOT NULL DEFAULT TRUE,
    creado_por          UUID REFERENCES profiles(id),
    creado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE precios_combustible (
    id                    SERIAL PRIMARY KEY,
    tipo_combustible_id   TEXT NOT NULL REFERENCES tipos_combustible(id),
    precio_por_litro      NUMERIC(10, 2) NOT NULL CHECK (precio_por_litro > 0),
    fecha_inicio          DATE NOT NULL,
    fecha_fin             DATE,
    actualizado_por       UUID REFERENCES profiles(id),
    creado_en             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE turnos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operador_id     UUID NOT NULL REFERENCES profiles(id),
    supervisor_id   UUID REFERENCES profiles(id),
    inicio          TIMESTAMPTZ NOT NULL,
    fin             TIMESTAMPTZ,
    ventas_total    NUMERIC(10, 2) DEFAULT 0,
    litros_total    NUMERIC(10, 2) DEFAULT 0,
    cerrado         BOOLEAN NOT NULL DEFAULT FALSE,
    notas           TEXT,
    creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ventas (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    surtidor_id           INTEGER NOT NULL REFERENCES surtidores(id) ON DELETE RESTRICT,
    tipo_combustible_id   TEXT NOT NULL REFERENCES tipos_combustible(id),
    litros                NUMERIC(10, 2) NOT NULL CHECK (litros > 0),
    precio_unitario       NUMERIC(10, 2) NOT NULL CHECK (precio_unitario > 0),
    subtotal              NUMERIC(10, 2) NOT NULL CHECK (subtotal > 0),
    impuesto              NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (impuesto >= 0),
    total                 NUMERIC(10, 2) NOT NULL CHECK (total > 0),
    registrado_por        UUID NOT NULL REFERENCES profiles(id),
    turno_id              UUID REFERENCES turnos(id),
    notas                 TEXT,
    anulada               BOOLEAN NOT NULL DEFAULT FALSE,
    fecha                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    creado_en             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE pagos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venta_id        UUID NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
    metodo_pago_id  TEXT NOT NULL REFERENCES metodos_pago(id),
    monto           NUMERIC(10, 2) NOT NULL CHECK (monto > 0),
    referencia      TEXT,
    creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE alertas (
    id              SERIAL PRIMARY KEY,
    surtidor_id     INTEGER NOT NULL REFERENCES surtidores(id) ON DELETE CASCADE,
    tipo            tipo_alerta NOT NULL,
    nivel           nivel_combustible NOT NULL,
    activa          BOOLEAN NOT NULL DEFAULT TRUE,
    resuelto_por    UUID REFERENCES profiles(id),
    creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resuelta_en     TIMESTAMPTZ
);

CREATE TABLE proveedores (
    id          SERIAL PRIMARY KEY,
    nombre      TEXT NOT NULL,
    nit         TEXT UNIQUE,
    contacto    TEXT,
    telefono    TEXT,
    email       TEXT,
    direccion   TEXT,
    activo      BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE abastecimientos (
    id                    SERIAL PRIMARY KEY,
    surtidor_id           INTEGER NOT NULL REFERENCES surtidores(id) ON DELETE RESTRICT,
    proveedor_id          INTEGER NOT NULL REFERENCES proveedores(id) ON DELETE RESTRICT,
    tipo_combustible_id   TEXT NOT NULL REFERENCES tipos_combustible(id),
    litros                NUMERIC(10, 2) NOT NULL CHECK (litros > 0),
    precio_por_litro      NUMERIC(10, 2) NOT NULL CHECK (precio_por_litro > 0),
    costo_total           NUMERIC(10, 2) NOT NULL CHECK (costo_total > 0),
    factura               TEXT,
    registrado_por        UUID NOT NULL REFERENCES profiles(id),
    fecha                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    creado_en             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. DATOS INICIALES
-- ============================================

INSERT INTO roles (nombre, descripcion, permisos) VALUES
    ('admin',      'Acceso completo al sistema',                                '["surtidores:*","ventas:*","alertas:*","reportes:*","usuarios:*","config:*"]'),
    ('supervisor', 'Gestión operativa, alertas y reportes',                     '["surtidores:read","ventas:read","alertas:*","reportes:*","turnos:*"]'),
    ('operador',   'Registro de ventas y operación de surtidores',              '["surtidores:read","ventas:create","ventas:read","alertas:read","turnos:read"]'),
    ('auditor',    'Consulta de reportes e historial (solo lectura)',           '["ventas:read","reportes:*","alertas:read","surtidores:read"]');

INSERT INTO tipos_combustible (id, nombre, descripcion) VALUES
    ('gasolina_regular', 'Gasolina Regular', 'Gasolina de 85 octanos'),
    ('gasolina_premium', 'Gasolina Premium', 'Gasolina de 95 octanos'),
    ('diesel',           'Diésel',           'Diésel premium');

INSERT INTO metodos_pago (id, nombre) VALUES
    ('efectivo',       'Efectivo'),
    ('tarjeta',        'Tarjeta de Débito/Crédito'),
    ('transferencia',  'Transferencia Bancaria'),
    ('credito',        'Crédito');

-- 6. FUNCIONES
-- ============================================

CREATE OR REPLACE FUNCTION crear_profile_al_registrarse()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, nombre_completo)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'nombre_completo', 'Usuario')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION verificar_rol(rol_requerido TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_roles
        WHERE usuario_id = auth.uid() AND rol = rol_requerido
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION actualizar_nivel_por_venta()
RETURNS TRIGGER AS $$
DECLARE
    v_capacidad NUMERIC;
    v_nivel_actual_litros NUMERIC;
    v_nuevo_nivel_litros NUMERIC;
    v_porcentaje NUMERIC;
BEGIN
    SELECT capacidad, nivel_litros
    INTO v_capacidad, v_nivel_actual_litros
    FROM surtidores WHERE id = NEW.surtidor_id;

    v_nuevo_nivel_litros := GREATEST(0, v_nivel_actual_litros - NEW.litros);
    v_porcentaje := (v_nuevo_nivel_litros / v_capacidad) * 100;

    UPDATE surtidores
    SET nivel_litros = v_nuevo_nivel_litros,
        nivel = CASE
            WHEN v_porcentaje <= 0  THEN 'vacio'::nivel_combustible
            WHEN v_porcentaje <= 25 THEN 'bajo'::nivel_combustible
            WHEN v_porcentaje <= 50 THEN 'medio'::nivel_combustible
            ELSE 'lleno'::nivel_combustible
        END
    WHERE id = NEW.surtidor_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generar_alerta_nivel()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.nivel IN ('medio', 'lleno') THEN
        UPDATE alertas
        SET activa = FALSE, resuelta_en = NOW()
        WHERE surtidor_id = NEW.id AND activa = TRUE;
        RETURN NEW;
    END IF;

    IF EXISTS (
        SELECT 1 FROM alertas
        WHERE surtidor_id = NEW.id AND activa = TRUE AND tipo = CASE
            WHEN NEW.nivel = 'vacio' THEN 'critico'::tipo_alerta
            WHEN NEW.nivel = 'bajo' THEN 'bajo'::tipo_alerta
        END
    ) THEN
        RETURN NEW;
    END IF;

    INSERT INTO alertas (surtidor_id, tipo, nivel)
    VALUES (
        NEW.id,
        CASE
            WHEN NEW.nivel = 'vacio' THEN 'critico'::tipo_alerta
            WHEN NEW.nivel = 'bajo' THEN 'bajo'::tipo_alerta
        END,
        NEW.nivel
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION actualizar_nivel_por_abastecimiento()
RETURNS TRIGGER AS $$
DECLARE
    v_capacidad NUMERIC;
    v_nivel_actual NUMERIC;
    v_nuevo_nivel NUMERIC;
    v_porcentaje NUMERIC;
BEGIN
    SELECT capacidad, nivel_litros
    INTO v_capacidad, v_nivel_actual
    FROM surtidores WHERE id = NEW.surtidor_id;

    v_nuevo_nivel := LEAST(v_capacidad, v_nivel_actual + NEW.litros);
    v_porcentaje := (v_nuevo_nivel / v_capacidad) * 100;

    UPDATE surtidores
    SET nivel_litros = v_nuevo_nivel,
        nivel = CASE
            WHEN v_porcentaje <= 0  THEN 'vacio'::nivel_combustible
            WHEN v_porcentaje <= 25 THEN 'bajo'::nivel_combustible
            WHEN v_porcentaje <= 50 THEN 'medio'::nivel_combustible
            ELSE 'lleno'::nivel_combustible
        END
    WHERE id = NEW.surtidor_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. TRIGGERS
-- ============================================

DROP TRIGGER IF EXISTS trigger_crear_profile ON auth.users;
CREATE TRIGGER trigger_crear_profile
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION crear_profile_al_registrarse();

DROP TRIGGER IF EXISTS trigger_actualizar_profile ON profiles;
CREATE TRIGGER trigger_actualizar_profile
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();

DROP TRIGGER IF EXISTS trigger_actualizar_surtidor ON surtidores;
CREATE TRIGGER trigger_actualizar_surtidor
    BEFORE UPDATE ON surtidores
    FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();

DROP TRIGGER IF EXISTS trigger_venta_actualiza_nivel ON ventas;
CREATE TRIGGER trigger_venta_actualiza_nivel
    AFTER INSERT ON ventas
    FOR EACH ROW
    WHEN (NEW.anulada = FALSE)
    EXECUTE FUNCTION actualizar_nivel_por_venta();

DROP TRIGGER IF EXISTS trigger_control_nivel ON surtidores;
CREATE TRIGGER trigger_control_nivel
    AFTER UPDATE OF nivel ON surtidores
    FOR EACH ROW
    WHEN (OLD.nivel IS DISTINCT FROM NEW.nivel AND NEW.nivel IN ('vacio', 'bajo'))
    EXECUTE FUNCTION generar_alerta_nivel();

DROP TRIGGER IF EXISTS trigger_abastecimiento_actualiza_nivel ON abastecimientos;
CREATE TRIGGER trigger_abastecimiento_actualiza_nivel
    AFTER INSERT ON abastecimientos
    FOR EACH ROW EXECUTE FUNCTION actualizar_nivel_por_abastecimiento();

-- 8. VISTAS
-- ============================================

CREATE VIEW reporte_ventas_diarias AS
SELECT
    DATE(v.fecha) AS dia,
    tc.nombre AS combustible,
    COUNT(v.id) AS total_ventas,
    SUM(v.litros) AS total_litros,
    SUM(v.subtotal) AS total_subtotal,
    SUM(v.impuesto) AS total_impuesto,
    SUM(v.total) AS total_ingresos
FROM ventas v
JOIN tipos_combustible tc ON tc.id = v.tipo_combustible_id
WHERE v.anulada = FALSE
GROUP BY DATE(v.fecha), tc.nombre
ORDER BY dia DESC, tc.nombre;

CREATE VIEW reporte_inventario_actual AS
SELECT
    s.numero AS surtidor,
    tc.nombre AS combustible,
    s.capacidad,
    s.nivel_litros,
    ROUND((s.nivel_litros / s.capacidad) * 100, 1) AS porcentaje,
    s.nivel,
    CASE
        WHEN s.nivel IN ('vacio', 'bajo') THEN '⚠️ Atención'
        ELSE '✅ Normal'
    END AS estado
FROM surtidores s
JOIN tipos_combustible tc ON tc.id = s.tipo_combustible_id
WHERE s.activo = TRUE
ORDER BY s.numero;

CREATE VIEW reporte_alertas_activas AS
SELECT
    a.id,
    s.numero AS surtidor,
    tc.nombre AS combustible,
    a.tipo,
    a.nivel,
    a.creado_en,
    EXTRACT(EPOCH FROM (NOW() - a.creado_en)) / 3600 AS horas_activa
FROM alertas a
JOIN surtidores s ON s.id = a.surtidor_id
JOIN tipos_combustible tc ON tc.id = s.tipo_combustible_id
WHERE a.activa = TRUE
ORDER BY a.creado_en DESC;

-- 9. ÍNDICES
-- ============================================

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_activo ON profiles(activo);
CREATE INDEX idx_user_roles_usuario ON user_roles(usuario_id);
CREATE INDEX idx_user_roles_rol ON user_roles(rol);
CREATE INDEX idx_surtidores_combustible ON surtidores(tipo_combustible_id);
CREATE INDEX idx_surtidores_nivel ON surtidores(nivel);
CREATE INDEX idx_surtidores_activo ON surtidores(activo);
CREATE INDEX idx_precios_vigentes ON precios_combustible(tipo_combustible_id, fecha_inicio, fecha_fin);
CREATE INDEX idx_ventas_fecha ON ventas(fecha DESC);
CREATE INDEX idx_ventas_surtidor ON ventas(surtidor_id);
CREATE INDEX idx_ventas_combustible ON ventas(tipo_combustible_id);
CREATE INDEX idx_ventas_registrado_por ON ventas(registrado_por);
CREATE INDEX idx_ventas_turno ON ventas(turno_id);
CREATE INDEX idx_pagos_venta ON pagos(venta_id);
CREATE INDEX idx_alertas_activas ON alertas(activa) WHERE activa = TRUE;
CREATE INDEX idx_alertas_surtidor ON alertas(surtidor_id);
CREATE INDEX idx_abastecimientos_fecha ON abastecimientos(fecha DESC);
CREATE INDEX idx_abastecimientos_surtidor ON abastecimientos(surtidor_id);
CREATE INDEX idx_turnos_operador ON turnos(operador_id);
CREATE INDEX idx_turnos_fecha ON turnos(inicio DESC);
CREATE INDEX idx_turnos_cerrados ON turnos(cerrado) WHERE cerrado = FALSE;

-- 10. RLS (Row Level Security)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE surtidores ENABLE ROW LEVEL SECURITY;
ALTER TABLE tipos_combustible ENABLE ROW LEVEL SECURITY;
ALTER TABLE precios_combustible ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE metodos_pago ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE abastecimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE turnos ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Usuarios ven su propio perfil"
    ON profiles FOR SELECT
    USING (id = auth.uid() OR verificar_rol('admin'));
CREATE POLICY "Admin puede editar perfiles"
    ON profiles FOR UPDATE
    USING (verificar_rol('admin')) WITH CHECK (verificar_rol('admin'));

-- USER_ROLES
CREATE POLICY "Admin gestiona roles"
    ON user_roles FOR ALL
    USING (verificar_rol('admin')) WITH CHECK (verificar_rol('admin'));
CREATE POLICY "Usuarios ven sus roles"
    ON user_roles FOR SELECT
    USING (usuario_id = auth.uid());

-- SURTIDORES
CREATE POLICY "Lectura de surtidores"
    ON surtidores FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Admin gestiona surtidores"
    ON surtidores FOR INSERT TO authenticated WITH CHECK (verificar_rol('admin'));
CREATE POLICY "Admin edita surtidores"
    ON surtidores FOR UPDATE TO authenticated
    USING (verificar_rol('admin')) WITH CHECK (verificar_rol('admin'));
CREATE POLICY "Admin elimina surtidores"
    ON surtidores FOR DELETE TO authenticated USING (verificar_rol('admin'));

-- VENTAS
CREATE POLICY "Lectura de ventas"
    ON ventas FOR SELECT TO authenticated
    USING (registrado_por = auth.uid() OR verificar_rol('admin')
        OR verificar_rol('supervisor') OR verificar_rol('auditor'));
CREATE POLICY "Operadores crean ventas"
    ON ventas FOR INSERT TO authenticated
    WITH CHECK (verificar_rol('operador') OR verificar_rol('admin'));
CREATE POLICY "Admin y supervisor anulan ventas"
    ON ventas FOR UPDATE TO authenticated
    USING (verificar_rol('admin') OR verificar_rol('supervisor'))
    WITH CHECK (verificar_rol('admin') OR verificar_rol('supervisor'));

-- ALERTAS
CREATE POLICY "Lectura de alertas"
    ON alertas FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Admin y supervisor resuelven alertas"
    ON alertas FOR UPDATE TO authenticated
    USING (verificar_rol('admin') OR verificar_rol('supervisor'))
    WITH CHECK (verificar_rol('admin') OR verificar_rol('supervisor'));

-- TURNOS
CREATE POLICY "Lectura de turnos"
    ON turnos FOR SELECT TO authenticated
    USING (operador_id = auth.uid() OR supervisor_id = auth.uid()
        OR verificar_rol('admin') OR verificar_rol('supervisor'));
CREATE POLICY "Operadores crean turnos"
    ON turnos FOR INSERT TO authenticated
    WITH CHECK (verificar_rol('operador') OR verificar_rol('admin'));
CREATE POLICY "Admin y supervisor cierran turnos"
    ON turnos FOR UPDATE TO authenticated
    USING (verificar_rol('admin') OR verificar_rol('supervisor'))
    WITH CHECK (verificar_rol('admin') OR verificar_rol('supervisor'));

-- PROVEEDORES Y ABASTECIMIENTOS
CREATE POLICY "Lectura de proveedores"
    ON proveedores FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Admin gestiona proveedores"
    ON proveedores FOR ALL TO authenticated
    USING (verificar_rol('admin')) WITH CHECK (verificar_rol('admin'));
CREATE POLICY "Lectura de abastecimientos"
    ON abastecimientos FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Admin gestiona abastecimientos"
    ON abastecimientos FOR ALL TO authenticated
    USING (verificar_rol('admin')) WITH CHECK (verificar_rol('admin'));

-- CONFIGURACIÓN
CREATE POLICY "Lectura de configuración"
    ON tipos_combustible FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Admin gestiona configuración"
    ON tipos_combustible FOR ALL TO authenticated
    USING (verificar_rol('admin')) WITH CHECK (verificar_rol('admin'));

-- ============================================
-- FIN DE LA MIGRACIÓN
-- ============================================

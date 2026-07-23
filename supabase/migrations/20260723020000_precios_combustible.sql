-- ============================================
-- Precios de combustible actualizados - Julio 2026
-- ============================================

-- Cerrar precios anteriores (si hay precios sin fecha_fin)
UPDATE precios_combustible
SET fecha_fin = '2026-06-30'
WHERE fecha_fin IS NULL;

-- Insertar nuevos precios vigentes desde Julio 2026
INSERT INTO precios_combustible (tipo_combustible_id, precio_por_litro, fecha_inicio, fecha_fin, actualizado_por) VALUES
    ('gasolina_regular', 3.80, '2026-07-01', '2026-09-30', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('gasolina_premium', 4.60, '2026-07-01', '2026-09-30', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('diesel',           4.10, '2026-07-01', '2026-09-30', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');

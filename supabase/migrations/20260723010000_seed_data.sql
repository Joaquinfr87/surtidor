-- ============================================
-- Datos de prueba - El Surtidor Cochabambino
-- ============================================

-- 1. USUARIO ADMIN (auth.users + auth.identities + profiles)
-- ============================================

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, confirmation_token, confirmation_sent_at,
  recovery_token, recovery_sent_at,
  email_change_token_new, email_change, email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  phone, phone_change, phone_change_token, phone_change_sent_at,
  email_change_token_current, reauthentication_token, reauthentication_sent_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'authenticated',
  'authenticated',
  'admin@surtidor.com',
  crypt('admin123', gen_salt('bf', 10)),
  now(),
  '', NULL,
  '', NULL,
  '', '', NULL,
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"sub":"a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11","email":"admin@surtidor.com","email_verified":true,"phone_verified":false}'::jsonb,
  now(),
  now(),
  '', '', '', NULL,
  '', '', NULL
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
  id, user_id, identity_data, provider, provider_id,
  last_sign_in_at, created_at, updated_at
)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  '{"sub":"a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11","email":"admin@surtidor.com","email_verified":true,"phone_verified":false}'::jsonb,
  'email',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  now(),
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, email, nombre_completo, telefono, activo)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'admin@surtidor.com',
  'Carlos Mendoza',
  '70123456',
  true
)
ON CONFLICT (id) DO NOTHING;

-- 2. ROLES DEL USUARIO
-- ============================================

INSERT INTO user_roles (usuario_id, rol) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin')
ON CONFLICT (usuario_id, rol) DO NOTHING;

-- 3. PRECIOS DE COMBUSTIBLE
-- ============================================

INSERT INTO precios_combustible (tipo_combustible_id, precio_por_litro, fecha_inicio, fecha_fin, actualizado_por) VALUES
    ('gasolina_regular', 3.50, '2026-01-01', '2026-03-31', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('gasolina_regular', 3.70, '2026-04-01', NULL,         'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('gasolina_premium', 4.20, '2026-01-01', '2026-03-31', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('gasolina_premium', 4.50, '2026-04-01', NULL,         'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('diesel',           3.80, '2026-01-01', '2026-03-31', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('diesel',           4.00, '2026-04-01', NULL,         'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');

-- 4. SURTIDORES (12)
-- ============================================

INSERT INTO surtidores (numero, tipo_combustible_id, capacidad, nivel, nivel_litros, activo, creado_por) VALUES
    (1,  'gasolina_regular', 8000.00, 'lleno',  7200.00, true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    (2,  'gasolina_regular', 8000.00, 'medio',  4500.00, true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    (3,  'gasolina_regular', 8000.00, 'bajo',   1800.00, true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    (4,  'gasolina_regular', 8000.00, 'lleno',  7800.00, true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    (5,  'gasolina_premium', 8000.00, 'lleno',  7500.00, true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    (6,  'gasolina_premium', 8000.00, 'medio',  4000.00, true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    (7,  'gasolina_premium', 8000.00, 'lleno',  6800.00, true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    (8,  'gasolina_premium', 8000.00, 'bajo',   1500.00, true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    (9,  'diesel',           10000.00, 'lleno', 9000.00, true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    (10, 'diesel',           10000.00, 'medio', 5500.00, true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    (11, 'diesel',           10000.00, 'vacio',  500.00, true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    (12, 'diesel',           10000.00, 'lleno', 9500.00, true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');

-- 5. PROVEEDORES
-- ============================================

INSERT INTO proveedores (nombre, nit, contacto, telefono, email, direccion) VALUES
    ('YPFB Transportes',      '1023456789', 'Roberto Sanchez',    '26123456', 'contacto@ypfb.bo',       'Zona Industrial, Cochabamba'),
    ('Petrobras Bolivia',     '1034567890', 'Claudia Ramos',      '26134567', 'ventas@petrobras.bo',    'Av. Ballivian, Cochabamba'),
    ('EPA Bolivia',           '1045678901', 'Fernando Gutierrez', '26145678', 'info@epabolivia.bo',     'Zona Futuro, Cochabamba'),
    ('Estacion El Colorado',  '1056789012', 'Miguel Rojas',       '26156789', 'elcolorado@email.com',   'C. Spain, Cochabamba'),
    ('Distribuidora Orinoca', '1067890123', 'Sandra Vega',        '26167890', 'orinoca.distrib@bo',     'Av. San Martin, Cochabamba');

-- 6. ABASTECIMIENTOS (20)
-- ============================================

INSERT INTO abastecimientos (surtidor_id, proveedor_id, tipo_combustible_id, litros, precio_por_litro, costo_total, factura, registrado_por, fecha) VALUES
    (1,  1, 'gasolina_regular', 5000.00, 3.20, 16000.00, 'FAC-001201', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-01 08:00:00-04'),
    (2,  1, 'gasolina_regular', 4500.00, 3.20, 14400.00, 'FAC-001202', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-01 08:30:00-04'),
    (5,  2, 'gasolina_premium', 4000.00, 3.90, 15600.00, 'FAC-001203', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-02 09:00:00-04'),
    (6,  2, 'gasolina_premium', 3500.00, 3.90, 13650.00, 'FAC-001204', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-02 09:30:00-04'),
    (9,  3, 'diesel',           6000.00, 3.50, 21000.00, 'FAC-001205', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-03 07:00:00-04'),
    (10, 3, 'diesel',           5000.00, 3.50, 17500.00, 'FAC-001206', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-03 07:30:00-04'),
    (3,  1, 'gasolina_regular', 4000.00, 3.20, 12800.00, 'FAC-001207', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-05 10:00:00-04'),
    (7,  2, 'gasolina_premium', 3800.00, 3.90, 14820.00, 'FAC-001208', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-05 10:30:00-04'),
    (11, 4, 'diesel',           7000.00, 3.50, 24500.00, 'FAC-001209', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-08 08:00:00-04'),
    (1,  1, 'gasolina_regular', 4800.00, 3.40, 16320.00, 'FAC-001210', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-10 09:00:00-04'),
    (5,  2, 'gasolina_premium', 4200.00, 4.10, 17220.00, 'FAC-001211', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-10 09:30:00-04'),
    (9,  3, 'diesel',           5500.00, 3.70, 20350.00, 'FAC-001212', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-12 07:00:00-04'),
    (2,  1, 'gasolina_regular', 3900.00, 3.40, 13260.00, 'FAC-001213', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-15 08:00:00-04'),
    (6,  2, 'gasolina_premium', 3600.00, 4.10, 14760.00, 'FAC-001214', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-15 08:30:00-04'),
    (10, 3, 'diesel',           4800.00, 3.70, 17760.00, 'FAC-001215', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-18 09:00:00-04'),
    (4,  1, 'gasolina_regular', 4200.00, 3.40, 14280.00, 'FAC-001216', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-20 10:00:00-04'),
    (8,  2, 'gasolina_premium', 3200.00, 4.10, 13120.00, 'FAC-001217', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-20 10:30:00-04'),
    (12, 4, 'diesel',           6500.00, 3.70, 24050.00, 'FAC-001218', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-21 08:00:00-04'),
    (1,  5, 'gasolina_regular', 5200.00, 3.40, 17680.00, 'FAC-001219', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-22 09:00:00-04'),
    (9,  5, 'diesel',           5800.00, 3.70, 21460.00, 'FAC-001220', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-22 09:30:00-04');

-- 7. TURNOS (17)
-- ============================================

INSERT INTO turnos (operador_id, supervisor_id, inicio, fin, ventas_total, litros_total, cerrado, notas) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-03 06:00:00-04', '2026-07-03 14:00:00-04', 12500.00, 3200.00, true, 'Turno normal'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-03 14:00:00-04', '2026-07-03 22:00:00-04', 9800.00,  2600.00, true, 'Poca afluencia'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-04 06:00:00-04', '2026-07-04 14:00:00-04', 14200.00, 3800.00, true, 'Buen dia'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-05 06:00:00-04', '2026-07-05 14:00:00-04', 11800.00, 3100.00, true, 'Normal'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-05 14:00:00-04', '2026-07-05 22:00:00-04', 8900.00,  2400.00, true, 'Fin de semana tranquilo'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-07 06:00:00-04', '2026-07-07 14:00:00-04', 13100.00, 3400.00, true, 'Lunes buen inicio'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-08 06:00:00-04', '2026-07-08 14:00:00-04', 15000.00, 4000.00, true, 'Alta demanda'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-09 06:00:00-04', '2026-07-09 14:00:00-04', 11200.00, 2900.00, true, 'Normal'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-10 06:00:00-04', '2026-07-10 14:00:00-04', 12800.00, 3300.00, true, 'Normal'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-11 06:00:00-04', '2026-07-11 14:00:00-04', 10500.00, 2700.00, true, 'Lluvia poca afluencia'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-14 06:00:00-04', '2026-07-14 14:00:00-04', 13500.00, 3500.00, true, 'Buen lunes'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-15 06:00:00-04', '2026-07-15 14:00:00-04', 12200.00, 3200.00, true, 'Normal'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-16 06:00:00-04', '2026-07-16 14:00:00-04', 11500.00, 3000.00, true, 'Normal'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-17 06:00:00-04', '2026-07-17 14:00:00-04', 14800.00, 3900.00, true, 'Muy buen dia'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-18 06:00:00-04', '2026-07-18 14:00:00-04', 13800.00, 3600.00, true, 'Viernes bueno'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-21 06:00:00-04', '2026-07-21 14:00:00-04', 12900.00, 3400.00, true, 'Lunes normal'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-07-22 06:00:00-04', NULL, NULL, NULL, false, 'Turno en curso');

-- 8. VENTAS (50) - columnas: surtidor_id, tipo_combustible_id, litros, precio_unitario, subtotal, impuesto, total, registrado_por, turno_id, notas, anulada, fecha
-- ============================================

INSERT INTO ventas (surtidor_id, tipo_combustible_id, litros, precio_unitario, subtotal, impuesto, total, registrado_por, turno_id, notas, anulada, fecha) VALUES
    (1,  'gasolina_regular', 45.50, 3.70, 168.35, 18.52, 186.87, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Turno normal' AND inicio='2026-07-03 06:00:00-04'), NULL, false, '2026-07-03 06:20:00-04'),
    (5,  'gasolina_premium', 30.00, 4.50, 135.00, 14.85, 149.85, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Turno normal' AND inicio='2026-07-03 06:00:00-04'), NULL, false, '2026-07-03 06:45:00-04'),
    (9,  'diesel',           60.00, 4.00, 240.00, 26.40, 266.40, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Turno normal' AND inicio='2026-07-03 06:00:00-04'), NULL, false, '2026-07-03 07:10:00-04'),
    (2,  'gasolina_regular', 40.00, 3.70, 148.00, 16.28, 164.28, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Turno normal' AND inicio='2026-07-03 06:00:00-04'), NULL, false, '2026-07-03 07:30:00-04'),
    (6,  'gasolina_premium', 50.00, 4.50, 225.00, 24.75, 249.75, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Poca afluencia' AND inicio='2026-07-03 14:00:00-04'), NULL, false, '2026-07-03 14:15:00-04'),
    (10, 'diesel',           45.00, 4.00, 180.00, 19.80, 199.80, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Poca afluencia' AND inicio='2026-07-03 14:00:00-04'), NULL, false, '2026-07-03 15:00:00-04'),
    (1,  'gasolina_regular', 38.50, 3.70, 142.45, 15.67, 158.12, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Buen dia' AND inicio='2026-07-04 06:00:00-04'), NULL, false, '2026-07-04 06:30:00-04'),
    (7,  'gasolina_premium', 42.00, 4.50, 189.00, 20.79, 209.79, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Buen dia' AND inicio='2026-07-04 06:00:00-04'), NULL, false, '2026-07-04 07:00:00-04'),
    (9,  'diesel',           55.00, 4.00, 220.00, 24.20, 244.20, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Buen dia' AND inicio='2026-07-04 06:00:00-04'), NULL, false, '2026-07-04 07:30:00-04'),
    (3,  'gasolina_regular', 52.00, 3.70, 192.40, 21.16, 213.56, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Normal' AND inicio='2026-07-05 06:00:00-04'), NULL, false, '2026-07-05 06:45:00-04'),
    (5,  'gasolina_premium', 35.00, 4.50, 157.50, 17.33, 174.83, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Normal' AND inicio='2026-07-05 06:00:00-04'), NULL, false, '2026-07-05 07:15:00-04'),
    (11, 'diesel',           70.00, 4.00, 280.00, 30.80, 310.80, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Fin de semana tranquilo' AND inicio='2026-07-05 14:00:00-04'), NULL, false, '2026-07-05 14:30:00-04'),
    (2,  'gasolina_regular', 33.00, 3.70, 122.10, 13.43, 135.53, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Fin de semana tranquilo' AND inicio='2026-07-05 14:00:00-04'), NULL, false, '2026-07-05 15:00:00-04'),
    (8,  'gasolina_premium', 48.00, 4.50, 216.00, 23.76, 239.76, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Fin de semana tranquilo' AND inicio='2026-07-05 14:00:00-04'), NULL, false, '2026-07-05 15:30:00-04'),
    (1,  'gasolina_regular', 60.00, 3.70, 222.00, 24.42, 246.42, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Lunes buen inicio' AND inicio='2026-07-07 06:00:00-04'), NULL, false, '2026-07-07 06:20:00-04'),
    (6,  'gasolina_premium', 40.00, 4.50, 180.00, 19.80, 199.80, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Lunes buen inicio' AND inicio='2026-07-07 06:00:00-04'), NULL, false, '2026-07-07 07:00:00-04'),
    (10, 'diesel',           65.00, 4.00, 260.00, 28.60, 288.60, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Alta demanda' AND inicio='2026-07-08 06:00:00-04'), NULL, false, '2026-07-08 06:30:00-04'),
    (4,  'gasolina_regular', 47.00, 3.70, 173.90, 19.13, 193.03, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Alta demanda' AND inicio='2026-07-08 06:00:00-04'), NULL, false, '2026-07-08 07:00:00-04'),
    (7,  'gasolina_premium', 38.00, 4.50, 171.00, 18.81, 189.81, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Alta demanda' AND inicio='2026-07-08 06:00:00-04'), NULL, false, '2026-07-08 07:30:00-04'),
    (9,  'diesel',           50.00, 4.00, 200.00, 22.00, 222.00, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Alta demanda' AND inicio='2026-07-08 06:00:00-04'), NULL, false, '2026-07-08 08:00:00-04'),
    (1,  'gasolina_regular', 55.00, 3.70, 203.50, 22.39, 225.89, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Normal' AND inicio='2026-07-09 06:00:00-04'), NULL, false, '2026-07-09 06:45:00-04'),
    (5,  'gasolina_premium', 43.00, 4.50, 193.50, 21.29, 214.79, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Normal' AND inicio='2026-07-09 06:00:00-04'), NULL, false, '2026-07-09 07:15:00-04'),
    (11, 'diesel',           80.00, 4.00, 320.00, 35.20, 355.20, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Normal' AND inicio='2026-07-10 06:00:00-04'), NULL, false, '2026-07-10 06:30:00-04'),
    (2,  'gasolina_regular', 36.00, 3.70, 133.20, 14.65, 147.85, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Normal' AND inicio='2026-07-10 06:00:00-04'), NULL, false, '2026-07-10 07:00:00-04'),
    (8,  'gasolina_premium', 52.00, 4.50, 234.00, 25.74, 259.74, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Lluvia poca afluencia' AND inicio='2026-07-11 06:00:00-04'), NULL, false, '2026-07-11 06:45:00-04'),
    (3,  'gasolina_regular', 41.00, 3.70, 151.70, 16.69, 168.39, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Lluvia poca afluencia' AND inicio='2026-07-11 06:00:00-04'), NULL, false, '2026-07-11 07:15:00-04'),
    (12, 'diesel',           75.00, 4.00, 300.00, 33.00, 333.00, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Buen lunes' AND inicio='2026-07-14 06:00:00-04'), NULL, false, '2026-07-14 06:30:00-04'),
    (4,  'gasolina_regular', 49.00, 3.70, 181.30, 19.94, 201.24, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Buen lunes' AND inicio='2026-07-14 06:00:00-04'), NULL, false, '2026-07-14 07:00:00-04'),
    (6,  'gasolina_premium', 37.00, 4.50, 166.50, 18.32, 184.82, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Buen lunes' AND inicio='2026-07-14 06:00:00-04'), NULL, false, '2026-07-14 07:30:00-04'),
    (1,  'gasolina_regular', 58.00, 3.70, 214.60, 23.61, 238.21, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Normal' AND inicio='2026-07-15 06:00:00-04'), NULL, false, '2026-07-15 06:45:00-04'),
    (9,  'diesel',           62.00, 4.00, 248.00, 27.28, 275.28, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Normal' AND inicio='2026-07-15 06:00:00-04'), NULL, false, '2026-07-15 07:15:00-04'),
    (7,  'gasolina_premium', 45.00, 4.50, 202.50, 22.28, 224.78, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Normal' AND inicio='2026-07-16 06:00:00-04'), NULL, false, '2026-07-16 06:30:00-04'),
    (3,  'gasolina_regular', 44.00, 3.70, 162.80, 17.91, 180.71, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Normal' AND inicio='2026-07-16 06:00:00-04'), NULL, false, '2026-07-16 07:00:00-04'),
    (10, 'diesel',           56.00, 4.00, 224.00, 24.64, 248.64, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Muy buen dia' AND inicio='2026-07-17 06:00:00-04'), NULL, false, '2026-07-17 06:45:00-04'),
    (5,  'gasolina_premium', 40.00, 4.50, 180.00, 19.80, 199.80, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Muy buen dia' AND inicio='2026-07-17 06:00:00-04'), NULL, false, '2026-07-17 07:15:00-04'),
    (2,  'gasolina_regular', 37.00, 3.70, 136.90, 15.06, 151.96, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Muy buen dia' AND inicio='2026-07-17 06:00:00-04'), NULL, false, '2026-07-17 07:45:00-04'),
    (1,  'gasolina_regular', 50.00, 3.70, 185.00, 20.35, 205.35, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Viernes bueno' AND inicio='2026-07-18 06:00:00-04'), NULL, false, '2026-07-18 06:30:00-04'),
    (6,  'gasolina_premium', 33.00, 4.50, 148.50, 16.34, 164.84, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Viernes bueno' AND inicio='2026-07-18 06:00:00-04'), NULL, false, '2026-07-18 07:00:00-04'),
    (12, 'diesel',           68.00, 4.00, 272.00, 29.92, 301.92, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Viernes bueno' AND inicio='2026-07-18 06:00:00-04'), NULL, false, '2026-07-18 07:30:00-04'),
    (4,  'gasolina_regular', 46.00, 3.70, 170.20, 18.72, 188.92, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Lunes normal' AND inicio='2026-07-21 06:00:00-04'), NULL, false, '2026-07-21 06:45:00-04'),
    (8,  'gasolina_premium', 41.00, 4.50, 184.50, 20.30, 204.80, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Lunes normal' AND inicio='2026-07-21 06:00:00-04'), NULL, false, '2026-07-21 07:15:00-04'),
    (9,  'diesel',           53.00, 4.00, 212.00, 23.32, 235.32, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Lunes normal' AND inicio='2026-07-21 06:00:00-04'), NULL, false, '2026-07-21 07:45:00-04'),
    (1,  'gasolina_regular', 42.00, 3.70, 155.40, 17.09, 172.49, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Turno en curso' AND inicio='2026-07-22 06:00:00-04'), NULL, false, '2026-07-22 06:30:00-04'),
    (5,  'gasolina_premium', 39.00, 4.50, 175.50, 19.31, 194.81, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Turno en curso' AND inicio='2026-07-22 06:00:00-04'), NULL, false, '2026-07-22 07:00:00-04'),
    (11, 'diesel',           60.00, 4.00, 240.00, 26.40, 266.40, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Turno en curso' AND inicio='2026-07-22 06:00:00-04'), NULL, false, '2026-07-22 07:30:00-04'),
    (3,  'gasolina_regular', 35.00, 3.70, 129.50, 14.25, 143.75, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Turno en curso' AND inicio='2026-07-22 06:00:00-04'), NULL, false, '2026-07-22 08:00:00-04'),
    (10, 'diesel',           47.00, 4.00, 188.00, 20.68, 208.68, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Turno en curso' AND inicio='2026-07-22 06:00:00-04'), NULL, false, '2026-07-22 08:30:00-04'),
    (2,  'gasolina_regular', 28.00, 3.70, 103.60, 11.40, 115.00, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Turno normal' AND inicio='2026-07-03 06:00:00-04'), NULL, false, '2026-07-03 13:00:00-04'),
    (7,  'gasolina_premium', 25.00, 4.50, 112.50, 12.38, 124.88, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Buen dia' AND inicio='2026-07-04 06:00:00-04'), NULL, false, '2026-07-04 12:30:00-04'),
    (12, 'diesel',           40.00, 4.00, 160.00, 17.60, 177.60, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM turnos WHERE notas='Alta demanda' AND inicio='2026-07-08 06:00:00-04'), NULL, false, '2026-07-08 12:00:00-04');

-- 9. PAGOS (5) - columnas: venta_id, metodo_pago_id, monto, referencia
-- ============================================

INSERT INTO pagos (venta_id, metodo_pago_id, monto, referencia) VALUES
    ((SELECT id FROM ventas WHERE fecha='2026-07-03 06:20:00-04' AND surtidor_id=1), 'efectivo',  186.87, 'PAGO-001'),
    ((SELECT id FROM ventas WHERE fecha='2026-07-03 06:45:00-04' AND surtidor_id=5), 'tarjeta',   149.85, 'PAGO-002'),
    ((SELECT id FROM ventas WHERE fecha='2026-07-03 07:10:00-04' AND surtidor_id=9), 'efectivo',  266.40, 'PAGO-003'),
    ((SELECT id FROM ventas WHERE fecha='2026-07-07 06:20:00-04' AND surtidor_id=1), 'tarjeta',   246.42, 'PAGO-004'),
    ((SELECT id FROM ventas WHERE fecha='2026-07-08 06:30:00-04' AND surtidor_id=10), 'efectivo', 288.60, 'PAGO-005');

-- 10. ALERTAS (7) - columnas: surtidor_id, tipo (tipo_alerta), nivel (nivel_combustible), activa
-- ============================================

INSERT INTO alertas (surtidor_id, tipo, nivel, activa) VALUES
    (3,  'bajo',    'bajo',    true),
    (8,  'bajo',    'bajo',    true),
    (11, 'critico', 'vacio',   true),
    (2,  'bajo',    'medio',   true),
    (10, 'bajo',    'medio',   true),
    (1,  'bajo',    'bajo',    true),
    (7,  'bajo',    'bajo',    true);

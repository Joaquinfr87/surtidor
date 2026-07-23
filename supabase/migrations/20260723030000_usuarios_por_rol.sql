-- ============================================
-- Usuarios de prueba para cada rol
-- ============================================

-- 1. SUPERVISOR
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
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
  'authenticated',
  'authenticated',
  'supervisor@surtidor.com',
  crypt('super123', gen_salt('bf', 10)),
  now(),
  '', NULL,
  '', NULL,
  '', '', NULL,
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"sub":"b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12","email":"supervisor@surtidor.com","email_verified":true,"phone_verified":false}'::jsonb,
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
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
  '{"sub":"b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12","email":"supervisor@surtidor.com","email_verified":true,"phone_verified":false}'::jsonb,
  'email',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
  now(),
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, email, nombre_completo, telefono, activo)
VALUES (
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
  'supervisor@surtidor.com',
  'Maria Lopez',
  '71234567',
  true
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_roles (usuario_id, rol) VALUES
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'supervisor')
ON CONFLICT (usuario_id, rol) DO NOTHING;

-- 2. OPERADOR
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
  'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
  'authenticated',
  'authenticated',
  'operador@surtidor.com',
  crypt('oper123', gen_salt('bf', 10)),
  now(),
  '', NULL,
  '', NULL,
  '', '', NULL,
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"sub":"c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13","email":"operador@surtidor.com","email_verified":true,"phone_verified":false}'::jsonb,
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
  'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
  'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
  '{"sub":"c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13","email":"operador@surtidor.com","email_verified":true,"phone_verified":false}'::jsonb,
  'email',
  'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
  now(),
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, email, nombre_completo, telefono, activo)
VALUES (
  'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
  'operador@surtidor.com',
  'Juan Garcia',
  '72345678',
  true
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_roles (usuario_id, rol) VALUES
    ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'operador')
ON CONFLICT (usuario_id, rol) DO NOTHING;

-- 3. AUDITOR
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
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
  'authenticated',
  'authenticated',
  'auditor@surtidor.com',
  crypt('audi123', gen_salt('bf', 10)),
  now(),
  '', NULL,
  '', NULL,
  '', '', NULL,
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"sub":"d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14","email":"auditor@surtidor.com","email_verified":true,"phone_verified":false}'::jsonb,
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
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
  '{"sub":"d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14","email":"auditor@surtidor.com","email_verified":true,"phone_verified":false}'::jsonb,
  'email',
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
  now(),
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, email, nombre_completo, telefono, activo)
VALUES (
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
  'auditor@surtidor.com',
  'Ana Rodriguez',
  '73456789',
  true
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_roles (usuario_id, rol) VALUES
    ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'auditor')
ON CONFLICT (usuario_id, rol) DO NOTHING;

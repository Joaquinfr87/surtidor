-- ============================================
-- Fix: Agregar política SELECT faltante para precios_combustible
-- ============================================

CREATE POLICY "Lectura de precios"
    ON precios_combustible FOR SELECT TO authenticated
    USING (TRUE);

CREATE POLICY "Admin gestiona precios"
    ON precios_combustible FOR ALL TO authenticated
    USING (verificar_rol('admin')) WITH CHECK (verificar_rol('admin'));

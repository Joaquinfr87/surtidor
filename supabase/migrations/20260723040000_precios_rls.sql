-- ============================================
-- Políticas RLS para precios_combustible
-- ============================================

-- Lectura: todos los autenticados pueden ver precios
CREATE POLICY "Lectura de precios"
    ON precios_combustible FOR SELECT TO authenticated USING (TRUE);

-- Escritura: solo admin puede gestionar precios
CREATE POLICY "Admin gestiona precios"
    ON precios_combustible FOR ALL TO authenticated
    USING (verificar_rol('admin')) WITH CHECK (verificar_rol('admin'));

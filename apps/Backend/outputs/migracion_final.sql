-- 1. tareas: agregar asignado_a
ALTER TABLE tareas ADD COLUMN IF NOT EXISTS asignado_a UUID REFERENCES personas(id);

-- 2. subtareas: agregar created_by
ALTER TABLE subtareas ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES personas(id);

-- 3. pedidos_materiales: agregar aprobado_por y fecha_aprobacion
ALTER TABLE pedidos_materiales
  ADD COLUMN IF NOT EXISTS aprobado_por UUID REFERENCES personas(id),
  ADD COLUMN IF NOT EXISTS fecha_aprobacion TIMESTAMP;

-- 4. gastos: agregar usuario_id y pedido_id
ALTER TABLE gastos
  ADD COLUMN IF NOT EXISTS usuario_id UUID REFERENCES personas(id),
  ADD COLUMN IF NOT EXISTS pedido_id UUID REFERENCES pedidos_materiales(id);

-- 5. mensajes: agregar estado de procesamiento
ALTER TABLE mensajes
  ADD COLUMN IF NOT EXISTS estado_procesamiento VARCHAR(30) DEFAULT 'pendiente',
  ADD COLUMN IF NOT EXISTS error_detalle TEXT;

-- 6. alertas: agregar usuario_id destinatario
ALTER TABLE alertas ADD COLUMN IF NOT EXISTS usuario_id UUID REFERENCES personas(id);

-- 7. TABLA NUEVA: pedidos_items (detalle de cada pedido)
CREATE TABLE IF NOT EXISTS pedidos_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID REFERENCES pedidos_materiales(id) ON DELETE CASCADE,
  material_id UUID REFERENCES materiales(id),
  cantidad NUMERIC(10,2),
  precio_unitario NUMERIC(10,2)
);

-- 8. TABLA NUEVA: movimientos_stock (trazabilidad de materiales)
CREATE TABLE IF NOT EXISTS movimientos_stock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID REFERENCES materiales(id) ON DELETE CASCADE,
  obra_id UUID REFERENCES obras(id),
  usuario_id UUID REFERENCES personas(id),
  tarea_id UUID REFERENCES tareas(id),
  tipo VARCHAR(20) NOT NULL, -- 'entrada' o 'salida'
  cantidad NUMERIC(10,2),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  observacion TEXT
);

-- 9. Índices adicionales
CREATE INDEX IF NOT EXISTS idx_subtareas_tarea ON subtareas(tarea_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_obra ON pedidos_materiales(obra_id);
CREATE INDEX IF NOT EXISTS idx_alertas_obra ON alertas(obra_id);
CREATE INDEX IF NOT EXISTS idx_gastos_obra ON gastos(obra_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_material ON movimientos_stock(material_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_estado ON mensajes(estado_procesamiento);


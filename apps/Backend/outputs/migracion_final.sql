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

-- 10. tareas: agregar creada_por (requerido por POST /bot/tareas)
ALTER TABLE tareas ADD COLUMN IF NOT EXISTS creada_por UUID REFERENCES personas(id);

-- 11. movimientos_stock: la FK de usuario_id apuntaba a auth.users (resto de la migración
-- perfiles/obreros → personas que no se había completado en esta tabla). La redirigimos a personas.
ALTER TABLE movimientos_stock DROP CONSTRAINT IF EXISTS movimientos_stock_usuario_id_fkey;
ALTER TABLE movimientos_stock ADD CONSTRAINT movimientos_stock_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES personas(id);

-- 12. Reestructuración tareas/rubros: subtareas se elimina (drop hecho fuera de este log),
-- rubros absorbe el ítem programable (fechas, prioridad, asignado, costo, estado) que antes
-- tenía tareas — 1 fila por rubro/obra, nombre sigue sirviendo de título. tareas se simplifica
-- a reporte granular, sucesora directa de subtareas (rubro_id opcional en vez de tarea_id).
-- 12a. rubros: absorbe las columnas de "tareas"
ALTER TABLE rubros
  ADD COLUMN IF NOT EXISTS descripcion TEXT,
  ADD COLUMN IF NOT EXISTS estado VARCHAR(30) DEFAULT 'pendiente',
  ADD COLUMN IF NOT EXISTS prioridad VARCHAR(20),
  ADD COLUMN IF NOT EXISTS fecha_inicio DATE,
  ADD COLUMN IF NOT EXISTS fecha_limite DATE,
  ADD COLUMN IF NOT EXISTS porcentaje_avance INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS costo_estimado NUMERIC,
  ADD COLUMN IF NOT EXISTS asignado_a UUID REFERENCES personas(id),
  ADD COLUMN IF NOT EXISTS creada_por UUID REFERENCES personas(id),
  ADD COLUMN IF NOT EXISTS completada_por UUID REFERENCES personas(id),
  ADD COLUMN IF NOT EXISTS fecha_completada TIMESTAMP;

-- 12b. tareas: se simplifica a reporte granular (sucesora de subtareas)
ALTER TABLE tareas RENAME COLUMN creada_por TO usuario_id;
ALTER TABLE tareas RENAME CONSTRAINT tareas_creada_por_fkey TO tareas_usuario_id_fkey;
ALTER TABLE tareas ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES personas(id);
ALTER TABLE tareas ALTER COLUMN obra_id SET NOT NULL;
ALTER TABLE tareas DROP COLUMN IF EXISTS estado;
ALTER TABLE tareas DROP COLUMN IF EXISTS prioridad;
ALTER TABLE tareas DROP COLUMN IF EXISTS fecha_inicio;
ALTER TABLE tareas DROP COLUMN IF EXISTS fecha_limite;
ALTER TABLE tareas DROP COLUMN IF EXISTS porcentaje_avance;
ALTER TABLE tareas DROP COLUMN IF EXISTS costo_estimado;
ALTER TABLE tareas DROP COLUMN IF EXISTS asignado_a;
ALTER TABLE tareas DROP COLUMN IF EXISTS completada_por;
ALTER TABLE tareas DROP COLUMN IF EXISTS fecha_completada;
ALTER TABLE tareas DROP COLUMN IF EXISTS updated_at;

-- 12c. movimientos_stock: tarea_id -> rubro_id (consumo de material se ata al rubro)
ALTER TABLE movimientos_stock DROP CONSTRAINT IF EXISTS movimientos_stock_tarea_id_fkey;
ALTER TABLE movimientos_stock RENAME COLUMN tarea_id TO rubro_id;
ALTER TABLE movimientos_stock ADD CONSTRAINT movimientos_stock_rubro_id_fkey
  FOREIGN KEY (rubro_id) REFERENCES rubros(id);

-- 12d. Índices
CREATE INDEX IF NOT EXISTS idx_tareas_obra ON tareas(obra_id);
CREATE INDEX IF NOT EXISTS idx_tareas_rubro ON tareas(rubro_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_rubro ON movimientos_stock(rubro_id);

-- 13. rubros: agregar updated_at (requerido por PATCH /bot/tareas/:id/completar)
ALTER TABLE rubros ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 14. Ajustes de schema en tabla gastos (requerido por POST /bot/gastos)
ALTER TABLE gastos
  ADD COLUMN IF NOT EXISTS moneda VARCHAR(10) DEFAULT 'ARS',
  ADD COLUMN IF NOT EXISTS origen VARCHAR(20) DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS revisado BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 15. Crear tabla comprobantes_facturas (+ factura_items): detalle de gastos originados en imagen.
-- Una sola tabla con tipo_documento + columnas nullable (comprobante y factura son mutuamente
-- excluyentes según vision.service.ts). Tipado real (DATE/NUMERIC), no passthrough de strings del OCR
-- — el backend parsea fecha (DD/MM/YYYY) y montos (formato argentino) antes de insertar.
CREATE TABLE IF NOT EXISTS comprobantes_facturas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gasto_id UUID REFERENCES gastos(id) ON DELETE CASCADE,
  tipo_documento VARCHAR(20) NOT NULL, -- 'comprobante' o 'factura'
  obra_id UUID REFERENCES obras(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  imagen_url TEXT, -- opcional, si se decide guardar la foto original en storage
  -- comprobante (ComprobanteData)
  tipo VARCHAR(50),
  fecha DATE,
  monto NUMERIC(12,2),
  moneda VARCHAR(10),
  origen TEXT,
  destino TEXT,
  numero_operacion VARCHAR(100),
  entidad VARCHAR(255),
  -- factura (FacturaData)
  tipo_factura VARCHAR(1),
  numero VARCHAR(50),
  fecha_vencimiento DATE,
  emisor TEXT,
  cuit_emisor VARCHAR(20),
  receptor TEXT,
  cuit_receptor VARCHAR(20),
  subtotal NUMERIC(12,2),
  iva NUMERIC(12,2),
  total NUMERIC(12,2)
);

CREATE TABLE IF NOT EXISTS factura_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  factura_id UUID REFERENCES comprobantes_facturas(id) ON DELETE CASCADE,
  descripcion TEXT,
  cantidad NUMERIC,
  precio_unitario NUMERIC(12,2),
  subtotal NUMERIC(12,2)
);

CREATE INDEX IF NOT EXISTS idx_comprobantes_facturas_gasto ON comprobantes_facturas(gasto_id);
CREATE INDEX IF NOT EXISTS idx_comprobantes_facturas_obra ON comprobantes_facturas(obra_id);
CREATE INDEX IF NOT EXISTS idx_factura_items_factura ON factura_items(factura_id);

-- 16. Ajustes de schema en tabla gastos (ticket dedicado, refina lo de los ítems 14/15):
-- moneda/origen NOT NULL, categoria (texto libre) -> rubro_id (FK a rubros, decidido con el
-- equipo: reusa el mismo catálogo/pipeline que tareas.rubro_id), revisado default false
-- (antes true — el flag es específicamente para gastos extraídos por OCR/IA, no para carga manual;
-- crearGasto ahora setea revisado=true explícito al insertar), updated_at, e índice compuesto
-- (obra_id, fecha) en vez de solo obra_id, ya que reportes de gastos casi siempre filtran por fecha.
ALTER TABLE gastos ALTER COLUMN moneda SET NOT NULL;
ALTER TABLE gastos DROP COLUMN IF EXISTS categoria;
ALTER TABLE gastos ADD COLUMN IF NOT EXISTS rubro_id UUID REFERENCES rubros(id);
ALTER TABLE gastos ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE gastos ALTER COLUMN origen SET NOT NULL;
ALTER TABLE gastos ALTER COLUMN revisado SET DEFAULT false;
ALTER TABLE gastos ALTER COLUMN revisado SET NOT NULL;
DROP INDEX IF EXISTS idx_gastos_obra;
CREATE INDEX IF NOT EXISTS idx_gastos_obra_fecha ON gastos(obra_id, fecha);

-- 17. obras: toggle para desactivar aprobación manual de pedidos (requerido por
-- POST /bot/pedidoDeCompra y PATCH /pedidos/:id/aprobar|rechazar).
ALTER TABLE obras ADD COLUMN IF NOT EXISTS aprobacion_automatica BOOLEAN NOT NULL DEFAULT false;

-- 18. Re-aplicar la reestructuración tareas/rubros del ítem 12: un merge con una rama
-- paralela había revertido el schema en la base compartida (estado/prioridad/fechas/asignado
-- de vuelta en tareas, tareas.usuario_id perdido) sin que el código se enterara. Los valores que
-- había en esas columnas al momento de revertir eran todos default (ninguna fila real tenía datos
-- propios), así que no se perdió información al volver a mover todo a rubros. De paso, se sacaron
-- dos FKs rotas que la otra rama había dejado apuntando a miembros_obra en vez de personas, y un
-- trigger (trg_tareas_updated_at) que dependía de tareas.updated_at.
ALTER TABLE rubros
  ADD COLUMN IF NOT EXISTS estado VARCHAR(30) DEFAULT 'pendiente',
  ADD COLUMN IF NOT EXISTS prioridad VARCHAR(20),
  ADD COLUMN IF NOT EXISTS fecha_inicio DATE,
  ADD COLUMN IF NOT EXISTS fecha_limite DATE,
  ADD COLUMN IF NOT EXISTS asignado_a UUID REFERENCES personas(id),
  ADD COLUMN IF NOT EXISTS creada_por UUID REFERENCES personas(id),
  ADD COLUMN IF NOT EXISTS completada_por UUID REFERENCES personas(id),
  ADD COLUMN IF NOT EXISTS fecha_completada TIMESTAMP;

DROP TRIGGER IF EXISTS trg_tareas_updated_at ON tareas;
ALTER TABLE tareas DROP CONSTRAINT IF EXISTS fk_tareas_created_by;
ALTER TABLE tareas DROP CONSTRAINT IF EXISTS tareas_asignado_a_fkey;
ALTER TABLE tareas DROP CONSTRAINT IF EXISTS tareas_completada_por_fkey;
ALTER TABLE tareas DROP COLUMN IF EXISTS estado;
ALTER TABLE tareas DROP COLUMN IF EXISTS prioridad;
ALTER TABLE tareas DROP COLUMN IF EXISTS asignado_a;
ALTER TABLE tareas DROP COLUMN IF EXISTS completada_por;
ALTER TABLE tareas DROP COLUMN IF EXISTS fecha_completada;
ALTER TABLE tareas DROP COLUMN IF EXISTS fecha_limite;
ALTER TABLE tareas DROP COLUMN IF EXISTS fecha_inicio;
ALTER TABLE tareas DROP COLUMN IF EXISTS updated_at;
ALTER TABLE tareas DROP COLUMN IF EXISTS porcentaje_avance;

ALTER TABLE tareas ADD COLUMN IF NOT EXISTS usuario_id UUID REFERENCES personas(id);
UPDATE tareas SET usuario_id = created_by WHERE usuario_id IS NULL;


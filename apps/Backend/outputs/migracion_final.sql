-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.obras (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre character varying NOT NULL,
  direccion text,
  descripcion text,
  fecha_inicio date,
  fecha_fin_estimada date,
  estado character varying DEFAULT 'activa'::character varying,
  presupuesto_total numeric,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  code character varying,
  type character varying,
  city character varying,
  province character varying,
  zip character varying,
  country character varying DEFAULT 'ar'::character varying,
  progress integer DEFAULT 0,
  starred boolean DEFAULT false,
  last_activity timestamp without time zone,
  last_activity_who text,
  aprobacion_automatica boolean NOT NULL DEFAULT false,
  CONSTRAINT obras_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tareas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  obra_id uuid NOT NULL,
  titulo character varying NOT NULL,
  descripcion text,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  rubro_id uuid,
  created_by uuid,
  usuario_id uuid,
  estado character varying NOT NULL DEFAULT 'pendiente'::character varying CHECK (estado::text = ANY (ARRAY['pendiente'::character varying, 'en_progreso'::character varying, 'completada'::character varying, 'cancelada'::character varying]::text[])),
  prioridad character varying CHECK (prioridad::text = ANY (ARRAY['baja'::character varying, 'media'::character varying, 'alta'::character varying, 'urgente'::character varying]::text[])),
  fecha_inicio date,
  fecha_limite date,
  fecha_completada timestamp without time zone,
  asignado_a uuid,
  completada_por uuid,
  costo_estimado numeric,
  CONSTRAINT tareas_pkey PRIMARY KEY (id),
  CONSTRAINT tareas_obra_id_fkey FOREIGN KEY (obra_id) REFERENCES public.obras(id),
  CONSTRAINT tareas_rubro_id_fkey FOREIGN KEY (rubro_id) REFERENCES public.rubros(id),
  CONSTRAINT tareas_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.personas(id),
  CONSTRAINT tareas_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.personas(id),
  CONSTRAINT tareas_asignado_a_fkey FOREIGN KEY (asignado_a) REFERENCES public.miembros_obra(id),
  CONSTRAINT tareas_completada_por_fkey FOREIGN KEY (completada_por) REFERENCES public.miembros_obra(id)
);
CREATE TABLE public.materiales (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  obra_id uuid,
  nombre character varying NOT NULL,
  categoria character varying,
  unidad character varying,
  stock_actual numeric,
  stock_minimo numeric,
  costo_unitario numeric,
  CONSTRAINT materiales_pkey PRIMARY KEY (id),
  CONSTRAINT materiales_obra_id_fkey FOREIGN KEY (obra_id) REFERENCES public.obras(id)
);
CREATE TABLE public.movimientos_stock (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  material_id uuid,
  obra_id uuid,
  usuario_id uuid,
  rubro_id uuid,
  tipo character varying NOT NULL,
  cantidad numeric,
  fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  observacion text,
  CONSTRAINT movimientos_stock_pkey PRIMARY KEY (id),
  CONSTRAINT movimientos_stock_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materiales(id),
  CONSTRAINT movimientos_stock_obra_id_fkey FOREIGN KEY (obra_id) REFERENCES public.obras(id),
  CONSTRAINT movimientos_stock_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.personas(id),
  CONSTRAINT movimientos_stock_rubro_id_fkey FOREIGN KEY (rubro_id) REFERENCES public.rubros(id)
);
CREATE TABLE public.proveedores (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre character varying,
  telefono character varying,
  email character varying,
  CONSTRAINT proveedores_pkey PRIMARY KEY (id)
);
CREATE TABLE public.materiales_proveedores (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  material_id uuid,
  proveedor_id uuid,
  CONSTRAINT materiales_proveedores_pkey PRIMARY KEY (id),
  CONSTRAINT materiales_proveedores_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materiales(id),
  CONSTRAINT materiales_proveedores_proveedor_id_fkey FOREIGN KEY (proveedor_id) REFERENCES public.proveedores(id)
);
CREATE TABLE public.pedidos_materiales (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  obra_id uuid,
  proveedor_id uuid,
  fecha_aprobacion timestamp without time zone,
  estado character varying DEFAULT 'pendiente'::character varying,
  aprobado boolean DEFAULT false,
  fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  aprobado_por uuid,
  CONSTRAINT pedidos_materiales_pkey PRIMARY KEY (id),
  CONSTRAINT pedidos_materiales_obra_id_fkey FOREIGN KEY (obra_id) REFERENCES public.obras(id),
  CONSTRAINT pedidos_materiales_proveedor_id_fkey FOREIGN KEY (proveedor_id) REFERENCES public.proveedores(id),
  CONSTRAINT pedidos_materiales_aprobado_por_fkey FOREIGN KEY (aprobado_por) REFERENCES public.personas(id)
);
CREATE TABLE public.pedidos_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  pedido_id uuid,
  material_id uuid,
  cantidad numeric,
  precio_unitario numeric,
  CONSTRAINT pedidos_items_pkey PRIMARY KEY (id),
  CONSTRAINT pedidos_items_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedidos_materiales(id),
  CONSTRAINT pedidos_items_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materiales(id)
);
CREATE TABLE public.gastos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  obra_id uuid,
  pedido_id uuid,
  descripcion text,
  monto numeric,
  fecha date DEFAULT CURRENT_DATE,
  usuario_id uuid,
  moneda character varying NOT NULL DEFAULT 'ARS'::character varying,
  origen character varying NOT NULL DEFAULT 'manual'::character varying,
  revisado boolean NOT NULL DEFAULT false,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  rubro_id uuid,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT gastos_pkey PRIMARY KEY (id),
  CONSTRAINT gastos_obra_id_fkey FOREIGN KEY (obra_id) REFERENCES public.obras(id),
  CONSTRAINT gastos_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedidos_materiales(id),
  CONSTRAINT gastos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.personas(id),
  CONSTRAINT gastos_rubro_id_fkey FOREIGN KEY (rubro_id) REFERENCES public.rubros(id)
);
CREATE TABLE public.mensajes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  obra_id uuid,
  tipo character varying,
  contenido text,
  procesado boolean DEFAULT false,
  estado_procesamiento character varying DEFAULT 'pendiente'::character varying,
  error_detalle text,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  usuario_id uuid,
  CONSTRAINT mensajes_pkey PRIMARY KEY (id),
  CONSTRAINT mensajes_obra_id_fkey FOREIGN KEY (obra_id) REFERENCES public.obras(id),
  CONSTRAINT mensajes_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.personas(id)
);
CREATE TABLE public.alertas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  obra_id uuid,
  tipo character varying,
  mensaje text,
  prioridad character varying,
  resuelta boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  titulo character varying,
  subtitulo text,
  severity character varying DEFAULT 'attention'::character varying,
  resolved_at timestamp without time zone,
  usuario_id uuid,
  CONSTRAINT alertas_pkey PRIMARY KEY (id),
  CONSTRAINT alertas_obra_id_fkey FOREIGN KEY (obra_id) REFERENCES public.obras(id),
  CONSTRAINT alertas_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.personas(id)
);
CREATE TABLE public.reportes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  obra_id uuid,
  titulo character varying,
  contenido text,
  fecha_generacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT reportes_pkey PRIMARY KEY (id),
  CONSTRAINT reportes_obra_id_fkey FOREIGN KEY (obra_id) REFERENCES public.obras(id)
);
CREATE TABLE public.rubros (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  obra_id uuid,
  nombre character varying NOT NULL,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  color character varying,
  orden integer DEFAULT 0,
  descripcion text,
  porcentaje_avance integer DEFAULT 0,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT rubros_pkey PRIMARY KEY (id),
  CONSTRAINT rubros_obra_id_fkey FOREIGN KEY (obra_id) REFERENCES public.obras(id)
);
CREATE TABLE public.presupuesto_rubros (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  rubro_id uuid,
  cap integer DEFAULT 0,
  spent integer DEFAULT 0,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT presupuesto_rubros_pkey PRIMARY KEY (id),
  CONSTRAINT presupuesto_rubros_rubro_id_fkey FOREIGN KEY (rubro_id) REFERENCES public.rubros(id)
);
CREATE TABLE public.presupuestos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  obra_id uuid UNIQUE,
  total integer DEFAULT 0,
  ejecutado integer DEFAULT 0,
  comprometido integer DEFAULT 0,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT presupuestos_pkey PRIMARY KEY (id),
  CONSTRAINT presupuestos_obra_id_fkey FOREIGN KEY (obra_id) REFERENCES public.obras(id)
);
CREATE TABLE public.actividad (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  obra_id uuid,
  accion text NOT NULL,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  tipo character varying,
  texto text,
  entidad_tipo character varying,
  entidad_id uuid,
  usuario_id uuid,
  CONSTRAINT actividad_pkey PRIMARY KEY (id),
  CONSTRAINT actividad_obra_id_fkey FOREIGN KEY (obra_id) REFERENCES public.obras(id),
  CONSTRAINT actividad_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.personas(id)
);
CREATE TABLE public.archivos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  obra_id uuid,
  rubro_id uuid,
  name character varying NOT NULL,
  kind character varying NOT NULL,
  size integer,
  url text,
  uploaded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT archivos_pkey PRIMARY KEY (id),
  CONSTRAINT archivos_obra_id_fkey FOREIGN KEY (obra_id) REFERENCES public.obras(id),
  CONSTRAINT archivos_rubro_id_fkey FOREIGN KEY (rubro_id) REFERENCES public.rubros(id)
);
CREATE TABLE public.potential_clients (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  email text NOT NULL,
  nombre text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT potential_clients_pkey PRIMARY KEY (id)
);
CREATE TABLE public.personas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  auth_user_id uuid UNIQUE,
  nombre character varying NOT NULL,
  telefono character varying UNIQUE,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT personas_pkey PRIMARY KEY (id),
  CONSTRAINT personas_auth_user_id_fkey FOREIGN KEY (auth_user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.miembros_obra (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  persona_id uuid NOT NULL,
  obra_id uuid NOT NULL,
  rol character varying,
  joined_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT miembros_obra_pkey PRIMARY KEY (id),
  CONSTRAINT miembros_obra_persona_id_fkey FOREIGN KEY (persona_id) REFERENCES public.personas(id),
  CONSTRAINT miembros_obra_obra_id_fkey FOREIGN KEY (obra_id) REFERENCES public.obras(id)
);
CREATE TABLE public.comprobantes_facturas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  gasto_id uuid,
  tipo_documento character varying NOT NULL,
  obra_id uuid,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  imagen_url text,
  tipo character varying,
  fecha date,
  monto numeric,
  moneda character varying,
  origen text,
  destino text,
  numero_operacion character varying,
  entidad character varying,
  tipo_factura character varying,
  numero character varying,
  fecha_vencimiento date,
  emisor text,
  cuit_emisor character varying,
  receptor text,
  cuit_receptor character varying,
  subtotal numeric,
  iva numeric,
  total numeric,
  CONSTRAINT comprobantes_facturas_pkey PRIMARY KEY (id),
  CONSTRAINT comprobantes_facturas_gasto_id_fkey FOREIGN KEY (gasto_id) REFERENCES public.gastos(id),
  CONSTRAINT comprobantes_facturas_obra_id_fkey FOREIGN KEY (obra_id) REFERENCES public.obras(id)
);
CREATE TABLE public.factura_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  factura_id uuid,
  descripcion text,
  cantidad numeric,
  precio_unitario numeric,
  subtotal numeric,
  CONSTRAINT factura_items_pkey PRIMARY KEY (id),
  CONSTRAINT factura_items_factura_id_fkey FOREIGN KEY (factura_id) REFERENCES public.comprobantes_facturas(id)
);
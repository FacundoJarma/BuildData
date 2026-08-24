-- Migración: soporte real de cronograma
-- Ejecutar manualmente contra la base (Supabase / PostgreSQL).

BEGIN;

-- 1. Avance por tarea (0-100)
ALTER TABLE public.tareas
  ADD COLUMN porcentaje_avance integer NOT NULL DEFAULT 0;
ALTER TABLE public.tareas
  ADD CONSTRAINT tareas_porcentaje_avance_range CHECK (porcentaje_avance BETWEEN 0 AND 100);

-- 2. fecha_inicio nunca null: backfill con la fecha de creación y constraint
UPDATE public.tareas SET fecha_inicio = created_at::date WHERE fecha_inicio IS NULL;
ALTER TABLE public.tareas ALTER COLUMN fecha_inicio SET NOT NULL;

-- 3. Dependencias entre tareas (tabla puente; el API la expone como array de ids)
CREATE TABLE public.tareas_dependencias (
  tarea_id   uuid NOT NULL REFERENCES public.tareas(id) ON DELETE CASCADE,
  depende_de uuid NOT NULL REFERENCES public.tareas(id) ON DELETE CASCADE,
  PRIMARY KEY (tarea_id, depende_de),
  CONSTRAINT tareas_dependencias_distinct CHECK (tarea_id <> depende_de)
);
CREATE INDEX tareas_dependencias_depende_de_idx ON public.tareas_dependencias(depende_de);

COMMIT;

-- Limpieza opcional (fase posterior, no ejecutar ahora):
-- rubros.porcentaje_avance quedó obsoleta: el avance del rubro se calcula
-- como AVG(tareas.porcentaje_avance) en el backend. Solo borrarla cuando se
-- confirme que nada más la lee:
-- ALTER TABLE public.rubros DROP COLUMN porcentaje_avance;

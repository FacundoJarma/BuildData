import { pool } from "../db.js";
import { resolvePersonaIdByTelefono, resolvePersonaIdByNombre } from "../services/personaService.js";

// ============================================================
// CONTRATO DE API CON FACU (bot de WhatsApp)
// Facu llama a estos endpoints después de procesar el mensaje.
// Nunca escribe SQL directo — siempre pasa por acá.
// ============================================================


// POST /bot/mensaje
// Facu manda el mensaje crudo. Nosotros lo guardamos con estado 'pendiente'.
// Facu después lo procesa y llama a los endpoints específicos según el tipo.
export async function recibirMensaje(req, res) {
  const { obra_id, telefono, tipo, contenido } = req.body;
  if (!telefono) return res.status(400).json({ error: "telefono es requerido" });

  const usuario_id = await resolvePersonaIdByTelefono(telefono);
  if (!usuario_id) return res.status(404).json({ error: "Persona no encontrada para el teléfono proporcionado" });

  try {
    const result = await pool.query(
      `INSERT INTO mensajes (obra_id, usuario_id, tipo, contenido, estado_procesamiento)
       VALUES ($1, $2, $3, $4, 'pendiente')
       RETURNING *`,
      [obra_id, usuario_id, tipo, contenido]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error guardando mensaje" });
  }
}


// POST /bot/tareas
// Facu detectó que el mensaje describe una tarea a crear → crea la tarea directamente.
export async function crearTareaDesdeBot(req, res) {
  const { obra_id, telefono, titulo, descripcion, asignado_a, prioridad, fecha_inicio, fecha_limite, costo_estimado } = req.body;
  if (!telefono) return res.status(400).json({ error: "telefono es requerido" });
  if (!titulo) return res.status(400).json({ error: "titulo es requerido" });

  const creada_por = await resolvePersonaIdByTelefono(telefono);
  if (!creada_por) return res.status(404).json({ error: "Persona no encontrada para el teléfono proporcionado" });

  let asignado_a_id = null;
  if (asignado_a) {
    asignado_a_id = await resolvePersonaIdByNombre(asignado_a);
    if (!asignado_a_id) return res.status(404).json({ error: `Persona "${asignado_a}" no encontrada` });
  }

  try {
    const result = await pool.query(
      `INSERT INTO tareas (obra_id, titulo, descripcion, creada_por, asignado_a, prioridad, fecha_inicio, fecha_limite, costo_estimado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [obra_id, titulo, descripcion, creada_por, asignado_a_id, prioridad, fecha_inicio, fecha_limite, costo_estimado]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando tarea desde bot" });
  }
}


// POST /bot/pedidoDeCompra
// Facu detectó que se pidió material → crea el pedido listo para que el admin apruebe.
// Body esperado: { obra_id, proveedor_id, telefono, mensaje_id, items: [{material_id, cantidad, precio_unitario}] }
export async function crearPedidoDeCompra(req, res) {
  const { obra_id, proveedor_id, telefono, mensaje_id, items } = req.body;
  if (!telefono) return res.status(400).json({ error: "telefono es requerido" });

  const usuario_id = await resolvePersonaIdByTelefono(telefono);
  if (!usuario_id) return res.status(404).json({ error: "Persona no encontrada para el teléfono proporcionado" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Crear el pedido
    const pedido = await client.query(
      `INSERT INTO pedidos_materiales (obra_id, proveedor_id, estado, aprobado)
       VALUES ($1, $2, 'pendiente', false)
       RETURNING *`,
      [obra_id, proveedor_id]
    );
    const pedido_id = pedido.rows[0].id;

    // Insertar los ítems del pedido
    for (const item of items) {
      await client.query(
        `INSERT INTO pedidos_items (pedido_id, material_id, cantidad, precio_unitario)
         VALUES ($1, $2, $3, $4)`,
        [pedido_id, item.material_id, item.cantidad, item.precio_unitario]
      );
    }

    // Crear alerta para que el admin apruebe
    await client.query(
      `INSERT INTO alertas (obra_id, tipo, mensaje, prioridad, usuario_id)
       VALUES ($1, 'pedido_pendiente', 'Nuevo pedido de compra requiere aprobación', 'alta', $2)`,
      [obra_id, usuario_id]
    );

    // Marcar mensaje como procesado
    await client.query(
      `UPDATE mensajes SET estado_procesamiento = 'procesado' WHERE id = $1`,
      [mensaje_id]
    );

    await client.query("COMMIT");
    res.status(201).json(pedido.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ error: "Error creando pedido de compra" });
  } finally {
    client.release();
  }
}


// POST /bot/retraso
// Facu detectó que algo se atrasó → actualiza la tarea y desplaza la fecha límite.
// Body esperado: { tarea_id, dias_retraso, mensaje_id, obra_id, telefono }
export async function registrarRetraso(req, res) {
  const { tarea_id, dias_retraso, mensaje_id, obra_id, telefono } = req.body;
  if (!telefono) return res.status(400).json({ error: "telefono es requerido" });

  const usuario_id = await resolvePersonaIdByTelefono(telefono);
  if (!usuario_id) return res.status(404).json({ error: "Persona no encontrada para el teléfono proporcionado" });

  try {

    const tarea = await pool.query(
      `UPDATE tareas
       SET fecha_limite = fecha_limite + ($1 || ' days')::interval,
           estado = 'retrasada'
       WHERE id = $2
       RETURNING *`,
      [dias_retraso, tarea_id]
    );

    // VALIDACIÓN
    if (tarea.rows.length === 0) {
      return res.status(404).json({
        error: "Tarea no encontrada"
      });
    }

    await pool.query(
      `INSERT INTO alertas (obra_id, tipo, mensaje, prioridad, usuario_id)
       VALUES ($1, 'retraso', $2, 'alta', $3)`,
      [
        obra_id,
        `La tarea "${tarea.rows[0].titulo}" se atrasó ${dias_retraso} días`,
        usuario_id,
      ]
    );

    await pool.query(
      `UPDATE mensajes
       SET estado_procesamiento = 'procesado'
       WHERE id = $1`,
      [mensaje_id]
    );

    res.json({
      tarea: tarea.rows[0],
      mensaje: `Fecha límite desplazada ${dias_retraso} días`,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error registrando retraso"
    });
  }
}


// POST /bot/stock
// Facu detectó uso de materiales → descuenta del stock y registra movimiento.
// Body esperado: { obra_id, telefono, mensaje_id, movimientos: [{material_id, cantidad, tarea_id}] }
export async function actualizarStock(req, res) {
  const { obra_id, telefono, mensaje_id, movimientos } = req.body;
  if (!telefono) return res.status(400).json({ error: "telefono es requerido" });

  const usuario_id = await resolvePersonaIdByTelefono(telefono);
  if (!usuario_id) return res.status(404).json({ error: "Persona no encontrada para el teléfono proporcionado" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const mov of movimientos) {
      // Descontar stock
      await client.query(
        `UPDATE materiales SET stock_actual = stock_actual - $1 WHERE id = $2`,
        [mov.cantidad, mov.material_id]
      );

      // Registrar movimiento
      await client.query(
        `INSERT INTO movimientos_stock (material_id, obra_id, usuario_id, tarea_id, tipo, cantidad)
         VALUES ($1, $2, $3, $4, 'salida', $5)`,
        [mov.material_id, obra_id, usuario_id, mov.tarea_id, mov.cantidad]
      );

      // Verificar si el stock quedó por debajo del mínimo → alerta
      const material = await client.query(
        `SELECT nombre, stock_actual, stock_minimo FROM materiales WHERE id = $1`,
        [mov.material_id]
      );
      const m = material.rows[0];
      if (m.stock_actual <= m.stock_minimo) {
        await client.query(
          `INSERT INTO alertas (obra_id, tipo, mensaje, prioridad)
           VALUES ($1, 'stock_bajo', $2, 'media')`,
          [obra_id, `Stock bajo de ${m.nombre}: quedan ${m.stock_actual} unidades`]
        );
      }
    }

    await client.query(
      `UPDATE mensajes SET estado_procesamiento = 'procesado' WHERE id = $1`,
      [mensaje_id]
    );

    await client.query("COMMIT");
    res.json({ ok: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ error: "Error actualizando stock" });
  } finally {
    client.release();
  }
}
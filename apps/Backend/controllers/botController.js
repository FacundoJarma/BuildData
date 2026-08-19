import { pool } from "../db.js";

// ============================================================
// CONTRATO DE API CON FACU (bot de WhatsApp)
// Facu llama a estos endpoints después de procesar el mensaje.
// Nunca escribe SQL directo — siempre pasa por acá.
// ============================================================


// POST /bot/mensaje
// Facu manda el mensaje crudo. Nosotros lo guardamos con estado 'pendiente'.
// Facu después lo procesa y llama a los endpoints específicos según el tipo.
export async function recibirMensaje(req, res) {
  const { obra_id, usuario_id, tipo, contenido } = req.body;
  // tipo puede ser: 'texto', 'audio', 'foto'
  try {
    const result = await pool.query(
      `INSERT INTO mensajes (obra_id, usuario_id, tipo, contenido, estado_procesamiento)
       VALUES ($1, $2, $3, $4, 'pendiente')
       RETURNING *`,
      [obra_id, usuario_id, tipo, contenido]
    );

    // Se llama en cada interacción del bot → es el punto único para trackear actividad
    // de la obra (usado por alertasController.verificarInactividad) y cerrar cualquier
    // alerta de inactividad abierta, ya que la obra volvió a tener movimiento.
    await pool.query(
      `UPDATE obras SET
        last_activity = CURRENT_TIMESTAMP,
        last_activity_who = COALESCE((SELECT nombre FROM personas WHERE id = $1), last_activity_who)
       WHERE id = $2`,
      [usuario_id, obra_id]
    );
    await pool.query(
      `UPDATE alertas SET resuelta = true WHERE obra_id = $1 AND tipo = 'inactividad' AND resuelta = false`,
      [obra_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error guardando mensaje" });
  }
}


// POST /bot/pedidoDeCompra
// Facu detectó que se pidió material → crea el pedido. Si la obra tiene aprobacion_automatica
// activada, el pedido queda aprobado y listo para comprar; si no (default), queda pendiente
// para que el admin lo apruebe desde el panel (PATCH /pedidos/:id/aprobar|rechazar).
// Body esperado: { obra_id, proveedor_id, usuario_id, mensaje_id, items: [{material_id, cantidad, precio_unitario}] }
export async function crearPedidoDeCompra(req, res) {
  const { obra_id, proveedor_id, usuario_id, mensaje_id, items } = req.body;

  const client = await pool.connect();
  try {
    const obra = await client.query(`SELECT aprobacion_automatica FROM obras WHERE id = $1`, [obra_id]);
    const autoApprove = obra.rows[0]?.aprobacion_automatica || false;

    await client.query("BEGIN");

    // Crear el pedido
    const pedido = await client.query(
      `INSERT INTO pedidos_materiales (obra_id, proveedor_id, estado, aprobado, fecha_aprobacion)
       VALUES ($1, $2, $3, $4, CASE WHEN $4 THEN CURRENT_TIMESTAMP ELSE NULL END)
       RETURNING *`,
      [obra_id, proveedor_id, autoApprove ? "aprobado" : "pendiente", autoApprove]
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

    // Alerta: informativa si se aprobó solo, de acción si necesita que alguien decida
    if (autoApprove) {
      await client.query(
        `INSERT INTO alertas (obra_id, tipo, mensaje, prioridad, usuario_id)
         VALUES ($1, 'pedido_aprobado_automaticamente', 'Pedido de compra creado y aprobado automáticamente', 'media', $2)`,
        [obra_id, usuario_id]
      );
    } else {
      await client.query(
        `INSERT INTO alertas (obra_id, tipo, mensaje, prioridad, usuario_id)
         VALUES ($1, 'pedido_pendiente', 'Nuevo pedido de compra requiere aprobación', 'alta', $2)`,
        [obra_id, usuario_id]
      );
    }

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
// Facu detectó que algo se atrasó → actualiza el rubro (ítem programable) y desplaza la fecha límite.
// Body esperado: { tarea_id, dias_retraso, mensaje_id, obra_id, usuario_id }
// (el campo se sigue llamando tarea_id por compatibilidad con el contrato existente,
// pero desde la reestructuración tareas/rubros identifica un rubro, no un reporte granular)
export async function registrarRetraso(req, res) {
  const { tarea_id, dias_retraso, mensaje_id, obra_id, usuario_id } = req.body;

  try {

    const rubro = await pool.query(
      `UPDATE rubros
       SET fecha_limite = fecha_limite + ($1 || ' days')::interval,
           estado = 'retrasada'
       WHERE id = $2
       RETURNING *`,
      [dias_retraso, tarea_id]
    );

    // VALIDACIÓN
    if (rubro.rows.length === 0) {
      return res.status(404).json({
        error: "Rubro no encontrado"
      });
    }

    await pool.query(
      `INSERT INTO alertas (obra_id, tipo, mensaje, prioridad, usuario_id)
       VALUES ($1, 'retraso', $2, 'alta', $3)`,
      [
        obra_id,
        `El rubro "${rubro.rows[0].nombre}" se atrasó ${dias_retraso} días`,
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
      rubro: rubro.rows[0],
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
// Body esperado: { obra_id, usuario_id, mensaje_id, movimientos: [{material_id, cantidad, rubro_id}] }
export async function actualizarStock(req, res) {
  const { obra_id, usuario_id, mensaje_id, movimientos } = req.body;

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
        `INSERT INTO movimientos_stock (material_id, obra_id, usuario_id, rubro_id, tipo, cantidad)
         VALUES ($1, $2, $3, $4, 'salida', $5)`,
        [mov.material_id, obra_id, usuario_id, mov.rubro_id, mov.cantidad]
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
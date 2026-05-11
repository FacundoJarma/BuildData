import { pool } from "Backend/db.js";

async function testDB() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Conexión exitosa");
    console.log(result.rows);
  } catch (error) {
    console.error("Error de conexión:", error);
  }
}

testDB();
import express from "express";
import dotenv from "dotenv";
import { pool } from "./db.js";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

app.get("/obras", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM obras");

    res.json(result.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error obteniendo obras"
    });
  }
});

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
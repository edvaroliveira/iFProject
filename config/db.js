// /backend/config/db.js

const { Pool } = require("pg");

// Configurações de conexão PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "bfii",
  password: process.env.DB_PASSWORD || "postgres",
  port: process.env.DB_PORT || 5432,
});

pool.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados PostgreSQL", err);
  } else {
    console.log("Conectado ao banco de dados PostgreSQL");
  }
});

module.exports = pool;

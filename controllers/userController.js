// /backend/controllers/userController.js

const bcrypt = require("bcryptjs");
const db = require("../config/db");

exports.findAll = (req, res) => {
  const query = "SELECT id, username FROM users";

  db.query(query, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao buscar usuários.", error: err });
    }
    res.status(200).json(results);
  });
};

exports.create = (req, res) => {
  const { username, password, role } = req.body;

  // Verifique se todos os campos obrigatórios foram preenchidos
  if (!username || !password || !role) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }

  // Hash da senha
  const hashedPassword = bcrypt.hashSync(password, 8);

  const query = `
    INSERT INTO users (username, password, role, created_at, updated_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `;

  db.query(query, [username, hashedPassword, role], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao criar usuário.", error: err });
    }
    res.status(201).json({ message: "Usuário criado com sucesso!" });
  });
};

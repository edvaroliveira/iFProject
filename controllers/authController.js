// /backend/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const db = require("../config/db");

exports.register = (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  User.create({ username, password: hashedPassword, role }, (err, result) => {
    if (err) return res.status(500).send("Error registering user.");
    res.status(201).send("User registered.");
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Usuário e senha são obrigatórios." });
  }

  const query = "SELECT * FROM users WHERE username = ?";

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error("Erro ao buscar usuário:", err);
      return res.status(500).json({ message: "Erro ao buscar usuário." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const user = results[0];

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Senha inválida." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, iat: Math.floor(Date.now() / 1000) },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "8h" } // Expires in 8 hours
    );
    console.log(token);

    // Decodificação do token para inspeção
    const decodedToken = jwt.decode(token);
    console.log("Token decodificado:", decodedToken);

    res.status(200).json({ accessToken: token, role: user.role });
  });
};

const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Buscar todos os usuários
exports.findAll = (req, res) => {
  User.findAll((err, users) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao buscar usuários.", error: err });
    }
    res.status(200).json(users); // Retorna os usuários sem senha
  });
};

// Criar um novo usuário
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

  // Criar o usuário usando o Model
  User.create({ username, password: hashedPassword, role }, (err, user) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao criar usuário.", error: err });
    }
    res.status(201).json({ message: "Usuário criado com sucesso!", user });
  });
};

// Buscar um usuário pelo nome de usuário
exports.findByUsername = (req, res) => {
  const { username } = req.params;

  User.findByUsername(username, (err, user) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao buscar usuário.", error: err });
    }
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    res.status(200).json(user); // Retorna o usuário encontrado
  });
};

const db = require("../config/db");

const User = {
  // Criar um novo usuário no banco de dados
  create: (userData, callback) => {
    const query = `
      INSERT INTO users (username, password, role, created_at, updated_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`;
    db.query(
      query,
      [userData.username, userData.password, userData.role],
      (err, result) => {
        if (err) {
          return callback(err);
        }
        return callback(null, result.rows[0]); // Retorna o usuário criado
      }
    );
  },

  // Buscar todos os usuários (sem retornar a senha)
  findAll: (callback) => {
    const query = "SELECT id, username, role FROM users";
    db.query(query, (err, result) => {
      if (err) {
        return callback(err);
      }
      return callback(null, result.rows); // Retorna todos os usuários
    });
  },

  // Buscar usuário pelo nome de usuário
  findByUsername: (username, callback) => {
    const query = `SELECT * FROM users WHERE username = $1`;
    db.query(query, [username], (err, result) => {
      if (err) {
        return callback(err);
      }

      if (result.rows.length === 0) {
        return callback(null, null); // Usuário não encontrado
      }

      return callback(null, result.rows[0]); // Retorna o usuário encontrado
    });
  },
};

module.exports = User;

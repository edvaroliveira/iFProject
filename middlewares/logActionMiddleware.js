// /backend/middlewares/logActionMiddleware.js
const db = require("../config/db");

const logAction = (req, res, next) => {
  if (!req.user) {
    return next(); // Se não houver usuário autenticado, simplesmente passa para o próximo middleware
  }

  const userId = req.user.id;
  const action = `${req.method} ${req.originalUrl}`; // Captura o método HTTP e a rota acessada

  const query = "INSERT INTO actions_log (user_id, action) VALUES ($1, $2)";

  db.query(query, [userId, action], (err) => {
    if (err) {
      console.error("Erro ao registrar ação do usuário:", err);
    }
    next(); // Continua para o próximo middleware ou rota
  });
};

module.exports = logAction;

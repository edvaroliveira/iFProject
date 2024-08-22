// /backend/middlewares/roleMiddleware.js

const authorize = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res
        .status(403)
        .json({ message: "Acesso negado. Privilégios insuficientes." });
    }
    next();
  };
};

module.exports = authorize;

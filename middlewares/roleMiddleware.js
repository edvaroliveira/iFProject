// /backend/middlewares/roleMiddleware.js
// const authorize = (role) => {
//   return (req, res, next) => {
//     if (req.userRole !== role) return res.status(403).send("Access forbidden.");
//     next();
//   };
// };

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

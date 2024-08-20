// // /backend/middlewares/authMiddleware.js

// const jwt = require("jsonwebtoken");

// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   console.log("Token recebido:", token);

//   if (!token) {
//     console.log("Token não recebido");
//     return res.sendStatus(403); // Se não houver token, retorna 403 Forbidden
//   }

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     if (err) {
//       console.log("Token inválido", err);
//       return res.sendStatus(403); // Se o token for inválido ou expirado, retorna 403 Forbidden
//     }
//     req.user = user;
//     next();
//   });
// };

// module.exports = verifyToken;

// /backend/middlewares/authMiddleware.js

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("Token recebido:", token);

  if (!token) {
    return res.status(403).json({ message: "Token não fornecido" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido ou expirado" });
    }
    req.user = user;
    next();
  });
};

module.exports = verifyToken;

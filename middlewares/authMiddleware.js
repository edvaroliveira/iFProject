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
      console.error("Erro de verificação do token:", err); // Loga o erro para depuração
      return res
        .status(403)
        .json({ message: "Token inválido ou expirado", error: err.message });
    }
    req.user = user;
    next();
  });
};

module.exports = verifyToken;

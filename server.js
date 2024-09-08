// /backend/server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const itemRoutes = require("./routes/itemRoutes");
const userRoutes = require("./routes/userRoutes");

const verifyToken = require("./middlewares/authMiddleware"); // Middleware de autenticação
const logAction = require("./middlewares/logActionMiddleware"); // Middleware de log de ações

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRoutes);

// Middleware para proteger as rotas e registrar ações após autenticação
app.use(verifyToken); // Aplica o middleware de autenticação em todas as rotas abaixo

// Aplica o middleware de log de ações em todas as rotas protegidas
app.use(logAction);

app.use("/projects", projectRoutes);
app.use("/items", itemRoutes);
app.use("/users", userRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

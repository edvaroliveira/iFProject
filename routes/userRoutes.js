// /backend/routes/userRoutes.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

router.use(verifyToken);

// Rota para listar todos os usuários (acesso restrito a admin)
router.get("/all", authorize("admin"), userController.findAll);

// Rota para criar um novo usuário (acesso restrito a admin)
router.post("/create", authorize("admin"), userController.create);

module.exports = router;

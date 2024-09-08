// /backend/routes/itemRoutes.js

const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
console.log(itemController);

const verifyToken = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

// Middleware para verificar o token em todas as rotas
router.use(verifyToken);

// Rotas para gerenciar itens de projetos
router.post("/", authorize("admin"), itemController.create); // Verifica se itemController.create está definido
router.post(
  "/:projectId/add-items",
  authorize("admin"),
  itemController.addItemsToProject
);

router.get("/by-project/:projectId", itemController.findAllByProject);

router.put("/:id", authorize("admin"), itemController.update); // Verifica se itemController.update está definido
router.delete("/:id", authorize("admin"), itemController.delete); // Verifica se itemController.delete está definido
router.get("/project/:projectId", itemController.findAllByProject); // Verifica se itemController.findAllByProject está definido

module.exports = router;

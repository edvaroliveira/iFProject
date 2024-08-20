const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
console.log(projectController);

const verifyToken = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

router.use(verifyToken);

router.post("/", authorize("admin"), projectController.create);
router.put("/:id", authorize("admin"), projectController.update);
router.delete("/:id", authorize("admin"), projectController.delete);
router.get("/", projectController.findAll);
// console.log("antes");
router.get("/with-items", projectController.findAllWithItems);
// console.log("depois");
router.get("/:id", projectController.findById);

module.exports = router;

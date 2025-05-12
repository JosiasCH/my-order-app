const express = require("express");
const router = express.Router();
const controller = require("../controllers/productsController");

router.get("/", controller.getAllProducts);
router.post("/", controller.createProduct);
router.put("/:id", controller.updateProduct);
router.delete("/:id", controller.deleteProduct);

module.exports = router;

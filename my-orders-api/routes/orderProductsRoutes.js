const express = require("express");
const router = express.Router();
const controller = require("../controllers/orderProductsController");

router.get("/:orderId", controller.getProductsByOrderId);
router.post("/", controller.addProductToOrder);
router.put("/:id", controller.updateProductInOrder);
router.delete("/:id", controller.deleteProductFromOrder);

module.exports = router;

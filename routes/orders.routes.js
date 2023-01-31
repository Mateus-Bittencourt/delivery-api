import express from "express";
import OrderController from "../controllers/order.controller.js";

const router = express.Router();

router.get("/soma-pedidos-cliente", OrderController.getOrderSumByCustomer);
router.get("/soma-pedidos-produto", OrderController.getOrderSumByProduct);
router.get("/top-vendidos", OrderController.getTopSellingProducts);
router.post("/", OrderController.createOrder);
router.put("/", OrderController.updateOrder);
router.patch("/:id", OrderController.updateOrderStatus);
router.delete("/:id", OrderController.deleteOrder);
router.get("/:id", OrderController.getOrder);

router.use((err, req, res, next) => {
  console.log(`${req.method} ${req.baseUrl} - ${err.message}`);
  res.status(400).send({ error: err.message });
});

export default router;

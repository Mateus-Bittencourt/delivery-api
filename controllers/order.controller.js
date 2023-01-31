import OrderRepository from "../repositories/order.repository.js";

const createOrder = async (req, res, next) => {
  try {
    let order = req.body;
    if (!order.cliente || !order.produto || !order.valor) {
      throw new Error("Cliente, produto e valor são obrigatórios");
    }

    order = await OrderRepository.insertOrder(order);
    res.status(201).send(order);
    console.log(`POST /order - ${JSON.stringify(order)}`);
  } catch (err) {
    next(err);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    let order = req.body;
    if (!order.cliente || !order.produto || !order.valor) {
      throw new Error("Cliente, produto e valor são obrigatórios");
    }

    order = await OrderRepository.updateOrder(order);
    res.status(200).send(order);
    console.log(`PUT /order - ${JSON.stringify(order)}`);
  } catch (err) {
    next(err);
  }
};

export default {
  createOrder,
  updateOrder,
};

import OrderRepository from "../repositories/order.repository.js";

const createOrder = async (req, res, next) => {
  try {
    let order = req.body;
    if (!order.cliente || !order.produto || !order.valor) {
      throw new Error("Cliente, produto e valor são obrigatórios");
    }

    order = await OrderRepository.insertOrder(order);
    res.status(201).send(order);
    console.log(`POST /pedidos - ${JSON.stringify(order)}`);
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
    console.log(`PUT /pedidos - ${JSON.stringify(order)}`);
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    if (!req.body.entregue) {
      throw new Error("Entregue é obrigatório");
    }

    const order = await OrderRepository.getOrder(req.params.id);
    if (!order) {
      throw new Error("Order not found");
    }

    order.entregue = req.body.entregue;
    await OrderRepository.updateOrder(order);
    res.status(200).send(order);
    console.log(`PATCH /pedidos - ${JSON.stringify(order)}`);
  } catch (err) {
    next(err);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    if (!req.params.id) {
      throw new Error("Id is required");
    }

    await OrderRepository.deleteOrder(req.params.id);
    res.status(204).end();
    console.log(`DELETE /pedidos - ${req.params.id}`);
  } catch (err) {
    next(err);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const order = await OrderRepository.getOrder(req.params.id);
    if (!order) {
      throw new Error("Order not found");
    }
    res.status(200).send(order);
    console.log(`GET /pedidos - ${JSON.stringify(order)}`);
  } catch (err) {
    next(err);
  }
};

const getOrderSumByCustomer = async (req, res, next) => {
  try {
    const customer = lowerCase(req.body.cliente);
    const orders = await OrderRepository.getOrders();
    const sum = orders.reduce((acc, order) => {
      if(!order.cliente) return acc;
      if (lowerCase(order.cliente) === customer && order.entregue) {
        return acc + order.valor;
      }
      return acc;
    }, 0);
    res.status(200).send({
      "Cliente": customer,
      Soma: sum
     });
    console.log(`GET /pedidos/sum - ${JSON.stringify(sum)}`);
  } catch (err) {
    next(err);
  }
};

const getOrderSumByProduct = async (req, res, next) => {
  try {
    const product = lowerCase(req.body.produto);
    const orders = await OrderRepository.getOrders();
    const sum = orders.reduce((acc, order) => {
      if(!order.produto) return acc;
      if (lowerCase(order.produto) === product && order.entregue) {
        return acc + order.valor;
      }
      return acc;
    }, 0);
    res.status(200).send({
      "Produto": product,
      Soma: sum
     });
    console.log(`GET /pedidos/sum - ${JSON.stringify(sum)}`);
  } catch (err) {
    next(err);
  }
};

const getTopSellingProducts = async (req, res, next) => {
  try {
    const orders = await OrderRepository.getOrders();
    const products = orders.reduce((acc, order) => {
      if(!order.produto) return acc;
      if (order.entregue) {
        acc[order.produto] = acc[order.produto] ? acc[order.produto] + 1 : 1;
      }
      return acc;
    }, {});
    const topProducts = Object.keys(products).sort((a, b) => products[b] - products[a]).slice(0, 5);
    res.status(200).send(topProducts);
    console.log(`GET /pedidos/top-products - ${JSON.stringify(topProducts)}`);

  } catch (error) {
    next(error);
  }
};

export default {
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getOrder,
  getOrderSumByCustomer,
  getOrderSumByProduct,
  getTopSellingProducts
};

const lowerCase = name => name.split(" ").map(c => c.toLowerCase()).join(" ");

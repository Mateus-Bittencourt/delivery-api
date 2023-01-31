import { promises as fs } from "fs";

const { readFile, writeFile } = fs;

const getOrders = async () => {
  const data = JSON.parse(await readFile(global.fileName));
  return data.pedidos;
};

const getOrder = async (id) => {
  const orders = await getOrders();
  const order = orders.find((order) => order.id === parseInt(id));
  if(order){
    return order;
  }
  throw new Error("Order not found");
};

const insertOrder = async (order) => {
  const data = JSON.parse(await readFile(global.fileName));
  order = { id: data.nextId++, ...order, entregue: false, timestamp: new Date() };
  data.pedidos.push(order);

  await writeFile(global.fileName, JSON.stringify(data, null, 2));

  return order;
};

const deleteOrder = async (id) => {
  const data = JSON.parse(await readFile(global.fileName));
  data.pedidos = data.pedidos.filter((order) => order.id !== parseInt(id));

  await writeFile(global.fileName, JSON.stringify(data, null, 2));
};

const updateOrder = async (order) => {
  const data = JSON.parse(await readFile(global.fileName));
  const index = data.pedidos.findIndex((o) => o.id === order.id);

  if (index === -1) {
    throw new Error("Order not found");
  }

  data.pedidos[index].cliente = order.cliente;
  data.pedidos[index].produto = order.produto;
  data.pedidos[index].valor = order.valor;
  data.pedidos[index].entregue = order.entregue;
  await writeFile(global.fileName, JSON.stringify(data, null, 2));

  return data.pedidos[index];
};

export default {
  getOrders,
  getOrder,
  insertOrder,
  deleteOrder,
  updateOrder,
}

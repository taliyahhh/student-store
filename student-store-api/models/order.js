// node.js -> backend connection with Prisma

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// WEBSITE ROUTES

// read (GET)
exports.getAll = async (req, res) => {
  const orders = await prisma.order.findMany({ include: { items: true } });
  console.log("ORDERS", orders);
  res.json(orders);
};

exports.getById = async (req, res) => {
  const id = Number(req.params.id);

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true }, // fetch items associated with order?
  });
  if (!order)
    return res.status(404).json({ error: "Order could not be fetched" });

  res.json(order);
};
// calculate order total through items
exports.calculate = async (req, res) => {
  const id = Number(req.params.id);

  const items = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  let total = 0;
  items.items.forEach(item => {
    console.log(item);
    total += item.price * item.quantity;
    // console.log(total)
  });
  items.total = total;
  console.log(items.total);

  // let total = 0;
  // const findItemPrice = (price, quantity) => price * quantity;
  // // Update the order to adjust total to correct total

  // items.forEach((item) => {
  //   console.log(item);
  //   // total += findItemPrice(item, item.quantity);
  //   // console.log("this is one item's total: " + total);
  // });

  // product.total = total;
  // res.json(total);
  // console.log(total);
  if (!items)
    return res.status(404).json({ error: "Order item could not be fetched" });
  res.json(items);
};

// create (POST)
exports.create = async (req, res) => {
  const { customer, total, status } = req.body;
  const newOrder = await prisma.order.create({
    data: { customer, total, status },
  });
  res.status(201).json(newOrder);
};

// add item to order endpoint
exports.createItem = async (req, res) => {
  const orderId = Number(req.params.id);
  const { productId, quantity } = req.body;

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  const addItem = await prisma.orderItem.create({
    data: { orderId, productId, quantity, price: product.price },
  });
  res.status(201).json(addItem);
};

// update (PUT)
exports.update = async (req, res) => {
  const id = Number(req.params.id);
  const { customer, total, status } = req.body;
  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { customer, total, status },
  });
  res.json(updatedOrder);
};

// delete (DELETE)
exports.remove = async (req, res) => {
  const id = Number(req.params.id);
  const deletedOrder = await prisma.order.delete({ where: { id } });
  res.status(204).end();
};

// node.js -> backend connection with Prisma

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// WEBSITE ROUTES

// read (GET)
exports.getAll = async (req, res) => {
  const orders = await prisma.order.findMany();
  res.json(orders);
};
exports.getById = async (req, res) => {
  const id = Number(req.params.id);
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order)
    return res.status(404).json({ error: "Order could not be fetched" });
};

// create (POST)
exports.create = async (req, res) => {
  const { customer, total, status } = req.body;
  const newOrder = await prisma.order.create({
    data: { customer, total, status },
  });
  res.status(201).json(newOrder);
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

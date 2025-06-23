// node.js -> backend connection with Prisma

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// read (GET)
exports.getAll = async (req, res) => {
  const orderItems = await prisma.orderItem.findMany();
  res.json(orderItems);
};
exports.getById = async (req, res) => {
  const id = Number(req.params.id);
  const orderItem = await prisma.orderItem.findUnique({ where: { id } });
  if (!orderItem)
    return res.status(404).json({ error: "Order Item could not be fetched" });

};

// where do i update order item model?

// create (POST)
exports.create = async (req, res) => {
  const { orderId, productId, quantity, price } = req.body;
  const newOrderItem = await prisma.orderItem.create({
    data: { orderId, productId, quantity, price },
  });
  res.status(201).json(newOrderItem);
};

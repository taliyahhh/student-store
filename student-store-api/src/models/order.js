// node.js -> backend connection with Prisma
const prisma = require("../db/db.js");

// WEBSITE ROUTES

// read (GET)
exports.getAll = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({ include: { items: true } });
    console.log("ORDERS", orders);
    res.json(orders);
  } catch (error) {
    console.log(error.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true }, // fetch items associated with order?
    });
  } catch (error) {
    return res.status(404).json({ error: "Order could not be fetched" });
  }
};
// calculate order total through items
exports.calculate = async (req, res) => {
  const id = Number(req.params.id);

  const items = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  let total = 0;
  items.items.forEach((item) => {
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
  try {
    const { customer, total, status, items } = req.body;
    console.log(req.body);

    // create order
    const newOrder = await prisma.order.create({
      data: { customer, total, status },
    });

    // adding items to order (array of objects with productId and quantity)
    for (const [productIdString, quantity] of Object.entries(items)) {
      // get item id
      const productId = Number(productIdString);

      // get access to other product variables
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      // add each item to the items Object
      if (product) {
        await prisma.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId,
            quantity,
            price: product.price,
          },
        });
      }
    }

    const orderWithItems = await prisma.order.findUnique({
      where: { id: newOrder.id },
      include: { items: true },
    });

    console.log(orderWithItems);
    res.json(orderWithItems);
  } catch (error) {
    console.log(error.message);
  }
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

// update item amount?
// exports.updateItem = async(req, res) => {
//   const orderId = Number(req.params.id);
//   const { productId, quantity } = req.body;

//   const product = await prisma.product.findUnique({
//     where: { id: productId },
//   });
//   if(order.)
// }

// delete (DELETE)
exports.remove = async (req, res) => {
  const id = Number(req.params.id);
  const deletedOrder = await prisma.order.delete({ where: { id } });
  res.status(204).end();
};

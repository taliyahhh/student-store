// node.js -> backend connection with Prisma

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// module.exports = prisma;

// WEBSITE ROUTES

// read (GET)

// /products -> get all products -> milestone 2 (using potential query parmams)
exports.getAll = async (req, res) => {
  const { category, sort } = req.query;

  const filters = {};

  // query can be filtered by /products?category=whateverCategory
  if (category) {
    filters.category = category;
  }

  let sorting;
  // query can be filtered by sorting based on price or name
  if (sort === "name" || sort === "price") {
    sorting = { [sort]: "asc" };
  }

  try {
    const products = await prisma.product.findMany({
      where: filters,
      orderBy: sorting,
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch products" });
  }
};
// /products/:id -> get one product
exports.getById = async (req, res) => {
  const id = Number(req.params.id);
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return res.status(404).json({ error: "Not found!" });
  res.json(product);
};
// /products -> accept query parameters
exports.get = async (req, res) => {};

// create (POST)
exports.create = async (req, res) => {
  const { name, description, price, image_url, category } = req.body;
  const newProduct = await prisma.product.create({
    data: { name, description, price, image_url, category },
  });
  res.status(201).json(newProduct); // 201 indicates product has been created i.e. request fullfilled!
};

// update (PUT)
exports.update = async (req, res) => {
  // /products/:id updates single product
  const id = Number(req.params.id);
  const { name, description, price, image_url, category } = req.body;
  const updatedProduct = await prisma.product.update({
    where: { id },
    data: { name, description, price, image_url, category },
  });
  res.json(updatedProduct);
};

// delete (DELETE)
exports.remove = async (req, res) => {
  const id = Number(req.params.id); // deletes single product
  await prisma.product.delete({ where: { id } });
  res.status(204).end(); // 204 indicates no content with that product i.e. deleted
};

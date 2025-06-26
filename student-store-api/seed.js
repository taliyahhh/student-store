const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

// Utility to sanitize strings
function sanitizeString(str) {
  return typeof str === "string" ? str.replace(/\u0000/g, "") : str;
}

// Utility to sanitize all strings in an object recursively
function sanitizeObject(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      typeof value === "string"
        ? sanitizeString(value)
        : Array.isArray(value)
        ? value.map((item) =>
            typeof item === "object"
              ? sanitizeObject(item)
              : sanitizeString(item)
          )
        : typeof value === "object" && value !== null
        ? sanitizeObject(value)
        : value,
    ])
  );
}

async function seed() {
  try {
    console.log("🌱 Seeding database...\n");

    // Clear existing data (in order due to relations)
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();

    // Load JSON data
    const productsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "./data/products.json"), "utf8")
    );

    const ordersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "./data/orders.json"), "utf8")
    );

    // Seed products
    for (const product of productsData.products) {
      const sanitizedProduct = sanitizeObject(product);

      await prisma.product.create({
        data: {
          name: sanitizedProduct.name,
          description: sanitizedProduct.description,
          price: sanitizedProduct.price,
          image_url: sanitizedProduct.image_url,
          category: sanitizedProduct.category,
        },
      });
    }

    // Seed orders and items
    for (const order of ordersData.orders) {
      const sanitizedOrder = sanitizeObject(order);

      const createdOrder = await prisma.order.create({
        data: {
          customer: sanitizedOrder.customer_id,
          totalPrice: sanitizedOrder.total_price,
          status: sanitizedOrder.status,
          createdAt: new Date(sanitizedOrder.created_at),
          orderItems: {
            create: sanitizedOrder.items.map((item) => ({
              productId: item.product_id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      console.log(`✅ Created order #${createdOrder.id}`);
    }

    console.log("\n🎉 Seeding complete!");
  } catch (err) {
    console.error("❌ Error seeding:", err);
  } finally {
    await prisma.$disconnect();
  }
}

seed();

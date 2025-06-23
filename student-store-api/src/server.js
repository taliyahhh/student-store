const express = require("express");
const app = express();
const productRoutes = require("./routes/productRoutes.js");

// connect API endpoint routes to another file
app.use(express.json());
app.use("/products", productRoutes);

// listen on a local port
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

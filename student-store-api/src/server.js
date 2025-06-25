const express = require("express");
const app = express();
const morgan = require("morgan");
const productRoutes = require("./routes/productRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");

// import CORS middleware
const cors = require("cors");

app.use(cors());
app.use(morgan("dev"));
// connect API endpoint routes to another file
app.use(express.json());
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

// listen on a local port
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

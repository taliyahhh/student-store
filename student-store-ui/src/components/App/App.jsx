import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import SubNavbar from "../SubNavbar/SubNavbar";
import Sidebar from "../Sidebar/Sidebar";
import Home from "../Home/Home";
import ProductDetail from "../ProductDetail/ProductDetail";
import NotFound from "../NotFound/NotFound";
import {
  removeFromCart,
  addToCart,
  getQuantityOfItemInCart,
  getTotalItemsInCart,
} from "../../utils/cart";
import {
  calculateItemSubtotal,
  calculateOrderSubtotal,
  calculateTaxesAndFees,
  calculateTotal,
} from "../../utils/calculations";
import { formatDate, formatPrice, formatPriceNoSign } from "../../utils/format";
import "./App.css";

function App() {
  // State variables
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [userInfo, setUserInfo] = useState({ name: "", dorm_number: "" });
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);

  // Toggles sidebar
  const toggleSidebar = () => setSidebarOpen((isOpen) => !isOpen);

  // Functions to change state (used for lifting state)
  const handleOnRemoveFromCart = (item) => setCart(removeFromCart(cart, item));
  const handleOnAddToCart = (item) => setCart(addToCart(cart, item));
  const handleGetItemQuantity = (item) => getQuantityOfItemInCart(cart, item);
  const handleGetTotalCartItems = () => getTotalItemsInCart(cart);

  const handleOnSearchInputChange = (event) => {
    setSearchInputValue(event.target.value);
  };
  const handleOnCheckout = async () => {
    //handle success/error responses
    try {
      // set isCheckingOut to true
      setIsCheckingOut(true);

      // console.log(cart);
      // console.log(products);
      setOrder();

      // calculate total
      let orderSubtotal = 0;

      Object.entries(cart).map(([productId, quantity]) => {
        const product = products.find((p) => p.id.toString() === productId);
        if (product) {
          const itemSubtotal = calculateItemSubtotal(
            `${product.price}`,
            `${quantity}`
          );
          orderSubtotal += itemSubtotal;
        } else {
          console.log(`Product with ID ${productId} not found.`);
        }
      });
      const orderTotal = parseFloat(
        formatPriceNoSign(calculateTotal(orderSubtotal))
      );

      console.log(orderTotal);

      // make POST request to /orders
      axios
        .post("http://localhost:3000/orders", {
          customer: userInfo.name,
          total: orderTotal, // use utils total to calculate? or is there a function
          status: "complete",
          items: cart, // fix this?////
        })
        .then((response) => {
          console.log(response.data);
        });
      // reset cart
      // cart.forEach((item) => {
      //   item.removeFromCart();
      // });
      setCart({});
    } catch (error) {
      setError(console.error("Error handling checkout: ", error));
    }
  };

  useEffect(() => {
    const fetchList = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/products/");
        console.log(data);
        setProducts(data);
      } catch (err) {
        console.error("Error fetching list: ", err);
      }
    };
    fetchList();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Sidebar
          cart={cart}
          error={error}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          isOpen={sidebarOpen}
          products={products}
          toggleSidebar={toggleSidebar}
          isCheckingOut={isCheckingOut}
          addToCart={handleOnAddToCart}
          removeFromCart={handleOnRemoveFromCart}
          getQuantityOfItemInCart={handleGetItemQuantity}
          getTotalItemsInCart={handleGetTotalCartItems}
          handleOnCheckout={handleOnCheckout}
          order={order}
          setOrder={setOrder}
        />
        <main>
          <SubNavbar
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchInputValue={searchInputValue}
            handleOnSearchInputChange={handleOnSearchInputChange}
          />
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  error={error}
                  products={products}
                  isFetching={isFetching}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  addToCart={handleOnAddToCart}
                  searchInputValue={searchInputValue}
                  removeFromCart={handleOnRemoveFromCart}
                  getQuantityOfItemInCart={handleGetItemQuantity}
                />
              }
            />
            <Route
              path="/:productId"
              element={
                <ProductDetail
                  cart={cart}
                  error={error}
                  products={products}
                  addToCart={handleOnAddToCart}
                  removeFromCart={handleOnRemoveFromCart}
                  getQuantityOfItemInCart={handleGetItemQuantity}
                />
              }
            />
            <Route
              path="*"
              element={
                <NotFound
                  error={error}
                  products={products}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;

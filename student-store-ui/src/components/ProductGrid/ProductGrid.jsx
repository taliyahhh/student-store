import ProductCard from "../ProductCard/ProductCard";
import "./ProductGrid.css";
import { useEffect } from "react";
import axios from 'axios';

function ProductGrid({
  addToCart,
  removeFromCart,
  getQuantityOfItemInCart,
  products = [],
}) {

  return (
    <div id="Buy" className="ProductGrid">
      <div className="content">
        <div className="grid">
          {!products?.length ? (
            <div className="card">
              <p>No products available</p>
            </div>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantity={getQuantityOfItemInCart(product)}
                addToCart={() => addToCart(product)}
                removeFromCart={() => removeFromCart(product)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductGrid;

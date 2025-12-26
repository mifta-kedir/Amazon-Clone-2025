// Importing React and hooks to manage component state and lifecycle
import React, { useEffect, useState } from "react";

// Importing axios for making HTTP requests
import axios from "axios";

// Importing child component to render individual product details
import ProductCard from "./ProductCard";

// Importing CSS module for scoped styling
import "./product.css";

// Importing Loader component to show loading spinner while data is fetched
import Loader from "../loader/Loader";

function Product() {
  // State to hold the fetched products data
  const [products, setProducts] = useState();

  // State to track loading status; initially true (loading)
  const [loading, setLoading] = useState(true);

  // useEffect runs once on component mount to fetch product data from API
  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products") // Fetch products from Fake Store API
      .then((res) => {
        // On success, store product data into state
        setProducts(res.data);
        console.log(res.data); // Log the fetched data for debugging
        setLoading(false); // Stop loading after data is fetched
      })
      .catch((err) => {
        // Log any errors encountered during fetch
        console.log(err);
        setLoading(false); // Stop loading even if fetch fails
      });
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <>
      {/* Conditionally render Loader while loading, otherwise show product list */}
      {loading ? (
        <Loader />
      ) : (
        <section className="products_container">
          {/* Render ProductCard for each product if products data is available */}
          {products &&
            products.map((singleProduct) => (
              <ProductCard
                product={singleProduct}
                key={singleProduct.id}
                renderAdd={true} // Prop to control add button rendering inside ProductCard
              />
            ))}
        </section>
      )}
    </>
  );
}

// Exporting Product component to be used in the app
export default Product;

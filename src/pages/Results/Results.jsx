import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import "./Results.css";
import LayOut from "../../Components/layout/Layout.jsx";
import ProductCard from "../../Components/product/ProductCard.jsx";
import Loader from "../../Components/loader/Loader.jsx";
import { productUrl } from "../../Api/endPoints";


function Results() {
  const { categoryName } = useParams(); // Get category from URL
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true); // Show loading while fetching

      try {
        const response = await axios.get(
          `${productUrl}/products/category/${categoryName}`
        );
        setResults(response.data); // Store results
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setLoading(false); // Always reset loading
      }
    };

    fetchCategoryProducts();
  }, [categoryName]);

  return (
    <LayOut>
      <section>
        <h1 style={{ padding: "30px" }}>Results</h1>
        <p style={{ padding: "30px" }}>Category / {categoryName}</p>
        <hr />
        {loading ? (
          <Loader />
        ) : (
          <div className="products_container">
            {results?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                renderDesc={false}
                renderAdd={true}
              />
            ))}
          </div>
        )}
      </section>
    </LayOut>
  );
}

export default Results;

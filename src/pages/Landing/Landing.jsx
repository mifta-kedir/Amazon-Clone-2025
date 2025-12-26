import React from "react";
import Carousel from "../../Components/carousel/Carousel.jsx";
import Category from "../../Components/catagory/Catagory.jsx";
import Product from "../../Components/product/Product.jsx";
import Layout from "../../Components/layout/Layout.jsx";

function Landing() {
  return (
    <Layout>
      <Carousel />
      <Category />
      <Product />
    </Layout>
  );
}

export default Landing;

import React from "react";

// Importing categoryImage array which contains data for each category card (e.g., name, image URL)
import { categoryImage } from "./categoryImage.js";

// Importing the reusable component that renders each individual category card
import CatagoryCard from "./CatagoryCard.jsx";

// Importing CSS module for scoped styling of the Categories section
import style from "./catagory.module.css";

// Functional component to display a grid/list of category cards
const Categories = () => {
  return (
    // Wrapper section with a custom class for styling the category layout
    <section className={style.category_container}>
      {/* Mapping through the categoryImage array to render a CatagoryCard for each item */}
      {categoryImage?.map((item) => {
        // Passing each category object as props to CatagoryCard
        return <CatagoryCard data={item} key={item.name} />;
      })}
    </section>
  );
};

// Exporting the component so it can be used in other parts of the app
export default Categories;

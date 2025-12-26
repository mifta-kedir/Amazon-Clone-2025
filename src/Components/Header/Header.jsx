import React from "react";
import { CiLocationOn } from "react-icons/ci";
import { BsSearch } from "react-icons/bs";
import { BiCart } from "react-icons/bi";

import style from "./Header.module.css";
import LowerHeader from "./LowerHeader.jsx";
// Importing Link for client-side routing
import { Link } from "react-router-dom";

// Importing useContext to access global state
import { useContext } from "react";

// Importing global state context
import { DataContext } from "../../Components/DataProvider/DataProvider.jsx";

// Importing Firebase authentication module
import { auth } from "../../utility/Firebase.js";

function Header() {
  // Accessing global state and dispatch method from context
  const { state } = useContext(DataContext);

  // Destructuring user and basket from global state
  const { user, basket } = state;

  // Calculating total number of items in the basket
  const totalItems = basket?.reduce((sum, item) => sum + item.amount, 0);

  //to make first character of user name cappital
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    // Main header wrapper
    <section className={style.fixed_header}>
      <section>
        {/* Top header container */}
        <div className={style.header_container}>
          {/* Left side: Logo and delivery location */}
          <div className={style.logo_container}>
            {/* Amazon logo with home link */}
            <Link to="/">
              <img
                src="https://pngimg.com/uploads/amazon/small/amazon_PNG11.png"
                alt="Amazon logo"
              />
            </Link>

            {/* Delivery icon */}
            <div className={style.delivery}>
              <span>
                <CiLocationOn />
              </span>
              <div>
                <p>Delivered to</p>
                <span>Ethiopia</span>
              </div>
            </div>
          </div>

          {/* Center: Search bar */}
          <div className={style.search}>
            {/* Category dropdown */}
            <select name="" id="">
              <option value="All">All</option>
            </select>

            {/* Text input for search */}
            <input type="text" placeholder="Search products" />

            {/* Search icon */}
            <BsSearch size={35} />
          </div>

          {/* Right side: Language, Auth, Orders, and Cart */}
          <div className={style.order_container}>
            {/* Language selector with flag */}
            <div className={`${style.language} ${style.combined_hover}`}>
              <img
                src="https://uk.usembassy.gov/wp-content/uploads/sites/204/2025/03/US_Flag_Color_72DPI_750x450.jpg"
                alt="USA Flag"
              />
              <select id="lang">
                <option value="EN">English</option>
                <option value="AM">አማርኛ</option>
              </select>
            </div>

            {/* Sign in/out block */}
            <Link to={!user && "/auth"} className={style.account}>
              <div>
                {user ? (
                  <>
                    {/* Greet logged-in user by name */}
                    {/* <p>Hello {user.email?.split("@")[0]}</p> */}
                    <p>Hello, {capitalize(user.email?.split("@")[0])}</p>
                    {/* Sign out button */}
                    <span onClick={() => auth.signOut()}>Sign Out</span>
                  </>
                ) : (
                  <>
                    {/* Sign in prompt for guests */}
                    <p> Sign In</p>
                    <span>Accounts and Lists</span>
                  </>
                )}
              </div>
            </Link>

            {/* Orders section */}
            <Link to="/orders" className={style.orders}>
              <div>
                <p>Returns</p>
                <span>& Orders</span>
              </div>
            </Link>

            {/* Shopping cart with total item count */}
            <Link to={"/cart"} className={style.cart}>
              <BiCart size={25} />
              <span>{totalItems}</span>
            </Link>
          </div>
        </div>

        {/* Lower header for additional navigation or links */}
        <LowerHeader />
      </section>
    </section>
  );
}

export default Header;

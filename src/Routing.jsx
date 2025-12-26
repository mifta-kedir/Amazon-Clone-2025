import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landing/Landing";
import Payment from "./pages/Payment/Payment";
import Orders from "./pages/Order/Order.jsx";
import Cart from "./Pages/Cart/Cart";
import Results from "./Pages/Results/Results";
import ProductDetail from "./Pages/ProductDetail/ProductDetail";
import Auth from "./Pages/Auth/Auth.jsx";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ProtectedRoute } from "./Components/protedtedRoute/ProtectedRoute.jsx";



function Routing() {
  const stripePromise = loadStripe(
    "pk_test_51ShGL5RyEnE6YYAXWmYZG0hGV0yM6oBzz65C4hGHV03YZr52dZsfomln4bW5gwEGDNsGnAC8waen6V7BBEg7Daro001fq8eNVq"
  );
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />

        <Route
          path="/payment"
          element={
            <ProtectedRoute
              message={"You must log in to pay"}
              redirect={"/payment"}
            >
              <Elements stripe={stripePromise}>
                <Payment />
              </Elements>
            </ProtectedRoute>
          }
        />
        <Route
          path="/Orders"
          element={
            <ProtectedRoute
              message={"You must log in to see your orders"}
              redirect={"/Orders"}
            >
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route path="/category/:categoryName" element={<Results />} />
        <Route path="/products/:productID" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default Routing;

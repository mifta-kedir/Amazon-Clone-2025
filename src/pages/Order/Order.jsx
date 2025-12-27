import React, { useContext, useEffect, useState } from "react";
import "./Order.css";
import LayOut from "../../Components/layout/Layout.jsx";
import { db } from "../../Utility/Firebase.js";
import { DataContext } from "../../Components/DataProvider/DataProvider.jsx";
import ProductCard from "../../Components/product/ProductCard.jsx";
import {
  collection,
  doc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

function Orders() {
  // Accessing user and global state from context
  const { state, dispatch } = useContext(DataContext);
  const user = state.user;

  // Local state to store fetched orders
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // If no user is logged in, clear the orders asynchronously to avoid memory leaks
    if (!user) {
      // Clear orders on next tick and return cleanup to cancel if effect re-runs quickly
      const t = setTimeout(() => setOrders([]), 0);
      return () => clearTimeout(t);
    }

    // Reference to the user's "orders" subcollection in Firestore
    const ordersRef = collection(
      doc(collection(db, "user"), user.uid), // Navigate to user's document
      "orders" // Access the "orders" subcollection
    );

    // Query to sort orders by creation date in descending order
    const q = query(ordersRef, orderBy("created", "desc"));

    // Subscribe to real-time updates from Firestore
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log(snapshot);
      // Map snapshot data to an array of orders
      setOrders(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    // Cleanup listener when component unmounts or user changes
    return () => unsubscribe();
  }, [user]);

  return (
    // Wrap the page with common layout
    <LayOut>
      <section className="container">
        <div className="orders__container">
          <h2>Your Orders</h2>

          {/* Show message if no orders found */}
          {orders?.length == 0 && (
            <div style={{ color: "red", padding: "20px", fontWeight: "bold" }}>
              You have no orders yet!
            </div>
          )}

          {/* Display all orders */}
          <div className="order_container">
            {orders?.map((eachOrder, i) => (
              <div key={i}>
                <hr />
                {/* Display order ID */}
                <p>Order Id: {eachOrder?.id}</p>

                {/* Display all items in the order using ProductCard */}
                {eachOrder?.data?.basket?.map((order) => (
                  <ProductCard flex={true} product={order} key={order.id} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </LayOut>
  );
}

export default Orders;

// Import React hooks and components
import { useContext, useState } from "react";
// Import CSS module for scoped styles
import "./Payment.css";
// Layout wrapper for consistent app UI
import LayOut from "../../Components/layout/Layout.jsx";
// Import global state context
import { DataContext } from "../../Components/DataProvider/DataProvider.jsx";

// Reusable card component to display basket items
import ProductCard from "../../Components/product/ProductCard.jsx";
// Stripe hooks and components for secure payment input
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
// Component for formatting currency
import CurrencyFormat from "../../Components/currencyFormat/CurrentFormat.jsx";
// Axios instance for API calls
import { axiosInstance } from "../../Api/Axios.jsx";
// Spinner for loading state
import { ClipLoader } from "react-spinners";
// Firebase Firestore database import
import { db } from "../../Utility/Firebase.js";
// Firestore methods to set order documents
import { doc, setDoc } from "firebase/firestore";
// React Router hook for redirection
import { useNavigate } from "react-router-dom";
// Action types for context dispatch
import { Type } from "../../Utility/action.type.js";

function Payment() {
  // Global state values
  const { state, dispatch } = useContext(DataContext);
  const { user, basket } = state || { user: null, basket: [] };

  // Calculate total items and amount
  const totalItem =
    basket?.reduce((amount, item) => amount + item.amount, 0) || 0;
  const totalAmount =
    basket?.reduce((amount, item) => amount + item.price * item.amount, 0) || 0;
  const total = totalAmount.toFixed(2);
  const amountInCents = Math.round(totalAmount * 100); // Required by Stripe

  // Local component states
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Stripe and form utilities
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  // Handles changes in the card input
  const handleChange = (event) => {
    setError(event?.error?.message || null);
  };

  // Submits payment to backend and processes it
  const submitHandler = async (event) => {
    event.preventDefault();

    // Stripe must be ready
    if (!stripe || !elements) {
      setError("Stripe has not loaded yet. Please try again.");
      return;
    }
    // Get the CardElement input
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card details are invalid. Please try again.");
      return;
    }

    try {
      setProcessing(true);
      // Step 1: Get client secret from backend
      const response = await axiosInstance({
        method: "POST",
        url: `/payment/create?total=${Math.round(total * 100)}`,
      });

      const clientSecret = response.data?.clientSecret;
      console.log(clientSecret);

      if (!clientSecret) {
        setError("Failed to retrieve payment details from server.");
        return;
      }

      // Step 2: Confirm card payment using Stripe
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              email: user?.email || "unknown@example.com",
            },
          },
        });
      if (stripeError) {
        console.error("Stripe error:", stripeError);
        setError(stripeError.message);
        setProcessing(false);
        return;
      }
      console.log(paymentIntent);

      // Step 3: Save order in Firestore if payment is successful
      console.log("User UID:", user?.uid);

      await setDoc(doc(db, "user", user.uid, "orders", paymentIntent.id), {
        basket: basket,
        amount: paymentIntent.amount,
        created: paymentIntent.created,
      });

      console.log("Payment succeeded, navigating...");

      // Step 4: Clear basket and navigate to orders
      dispatch({ type: Type.EMPTY_BASKET });
      setProcessing(false);
      navigate("/Orders", { state: { msg: "You have placed new orders" } });

      // Handle Stripe errors if any
      if (error) {
        setError(error.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        setError(null);
      } else {
        setError("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError("An error occurred during payment. Please try again.");
    }
  };

  return (
    <LayOut>
      {/* Header section */}
      <div className="payment_header">Checkout ({totalItem} items)</div>
      <hr />

      {/* Main payment section */}
      <section className="payment_container">
        {/* Delivery Address Section */}
        <div className="flex">
          <h3>Delivery Address</h3>
          <div>
            <div>{user?.email || "Guest"}</div>
            <div>Street</div>
            <div>Town</div>
          </div>
        </div>

        {/* Review Items Section */}
        <div className="flex">
          <h3>Review Items and Delivery</h3>
          <div>
            {basket?.length ? (
              basket.map((item) => (
                <ProductCard key={item.id} product={item} flex={true} />
              ))
            ) : (
              <p>No items in the basket.</p>
            )}
          </div>
        </div>
        <hr />
        {/* Payment Method Section */}
        <div className="flex">
          <h3>Payment Method</h3>
          <div className="payment_method">
            <div className="payment_details">
              <form onSubmit={submitHandler}>
                {/* Display errors if any */}
                {error && (
                  <small style={{ color: "red", fontWeight: "bold" }}>
                    {error}
                  </small>
                )}

                {/* Stripe Card input */}
                <CardElement onChange={handleChange} />

                {/* Display total and submit button */}
                <div className="payment_price">
                  <div>
                    <span style={{ display: "flex", gap: "10px" }}>
                      <p>Total Order</p> | <CurrencyFormat amount={total} />
                    </span>
                  </div>
                  <button type="submit" disabled={!stripe || !elements}>
                    {processing ? (
                      <div className="loading">
                        <ClipLoader color="black" size={20} />
                        <p>Please wait ...</p>
                      </div>
                    ) : (
                      "Pay Now"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </LayOut>
  );
}
// Export the Payment component
export default Payment;

import { Type } from "./action.type.js";
// Initial global state for the app
export const initialState = {
  basket: [], // Shopping basket starts empty
  user: null, // No authenticated user initially
};

// Reducer function to handle actions and update state accordingly
export const reducer = (state, action) => {
  // console.log(action); // Uncomment for debugging dispatched actions

  switch (action.type) {
    // Add an item to the basket, or increase its amount if already present
    case Type.ADD_TO_BASKET:
      // Check if the item is already in the basket
      // eslint-disable-next-line no-case-declarations
      const existingItem = state.basket.find(
        (item) => item.id === action.item.id
      );

      if (existingItem) {
        // If item exists, increase its amount by 1
        return {
          ...state,
          basket: state.basket.map((item) =>
            item.id === action.item.id
              ? { ...item, amount: item.amount + 1 }
              : item
          ),
        };
      } else {
        // If item does not exist, add it with an initial amount of 1
        return {
          ...state,
          basket: [...state.basket, { ...action.item, amount: 1 }],
        };
      }

    // Remove one quantity of an item from the basket, and remove completely if amount reaches 0
    case Type.REMOVE_FROM_BASKET:
      return {
        ...state,
        basket: state.basket
          .map((item) =>
            item.id === action.id
              ? { ...item, amount: item.amount - 1 } // Decrement amount by 1
              : item
          )
          .filter((item) => item.amount > 0), // Filter out items with amount 0
      };

    // Clear the entire basket, emptying it
    case Type.EMPTY_BASKET:
      return {
        ...state,
        basket: [],
      };

    // Set or update the authenticated user in the global state
    case Type.SET_USER:
      return {
        ...state,
        user: action.user,
      };

    // Default case returns current state unchanged
    default:
      return state;
  }
};

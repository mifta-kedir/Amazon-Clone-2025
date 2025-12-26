// Importing createContext to create a new context
// Importing useReducer hook to manage global state updates
import { createContext, useReducer } from "react";

// Creating a global context to share state across the app
// eslint-disable-next-line react-refresh/only-export-components
export const DataContext = createContext();

// Creating a provider component to wrap around the app's component tree
// Accepts reducer (logic), initialState (default state), and children (nested components)
export const DataProvider = ({ children, reducer, initialState }) => {
  // Initializing the reducer with provided reducer function and initial state
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    // Passing state and dispatch through context to make them available app-wide
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};

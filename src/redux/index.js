import { combineReducers } from "@reduxjs/toolkit";
import invoicesReducer from "./invoicesSlice";
import productsReducer from "./productsSlice";

const rootReducer = combineReducers({
  invoices: invoicesReducer,
  products: productsReducer,
});

export default rootReducer;
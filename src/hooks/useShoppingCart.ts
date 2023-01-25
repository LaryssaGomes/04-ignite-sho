import { useContext } from "react";
import { CartContext } from "./ShoppingCartContext";

export function useShoppingCart() {
  return useContext(CartContext);
}
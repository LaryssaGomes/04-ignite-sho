import { createContext, ReactNode, useState } from "react";

export interface IProduct {
  id: string;
  name: string;
  imageUrl: string;
  price: string;
  numberPrice: number;
  description: string;
  defaultPriceId: string;
}

interface ShoppingCartContextData {
  cartItems: IProduct[];
  cartTotal: number;
  addToCart: (product: IProduct) => void;
  removeCartItem: (productId: string) => void;
  checkIfItemAlreadyExists: (productId: string) => boolean;
}

interface ShoppingCartContextProviderProps {
  children: ReactNode;
}

export const CartContext = createContext({} as ShoppingCartContextData);

export function CartContextProvider({ children }:  ShoppingCartContextProviderProps) {
  const [cartItems, setCartItems] = useState<IProduct[]>([]);

  const cartTotal = cartItems.reduce((total, product) => {
    return total + product.numberPrice;
  }, 0);

  function addToCart(product: IProduct) {
    setCartItems((state) => [...state, product]);
  }

  function removeCartItem(productId: string) {
    setCartItems((state) => state.filter((item) => item.id !== productId));
  }

  function checkIfItemAlreadyExists(productId: string) {
    return cartItems.some((product) => product.id === productId);
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeCartItem,
        cartTotal,
        checkIfItemAlreadyExists,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

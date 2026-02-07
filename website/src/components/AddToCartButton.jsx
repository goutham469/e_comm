import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  incrementOrderCount,
  decrementOrderCount,
  removeFromCart
} from "../redux/slices/cartSlice";
import { API } from "../utils/API";

function AddToCartButton({ product }) {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart );

  // Handle click events to prevent bubbling
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

const isFirstRender = useRef(true);

  useEffect(() =>{
    if (isFirstRender.current)
    {
      isFirstRender.current = false;
      return;
    }

    API.USER.update_cart(cart.cartItems);
  }, [cart.cartItems]);


  // handle add to cart
  async function handleAddToCart(e){
    handleClick(e);
    // dispatch the action on redux
    dispatch( addToCart(product) );
  }
  
  if (product.stock <= 0) return <div className="text-red-500 font-semibold">Out of stock</div>;


  // Find item and its index once
  // console.log(cart);

  const cartItems = cart?.cartItems || [];
  const cartItemIndex = cartItems?.findIndex(
    item => item._id === product._id
  );
  const cartItem = cartItemIndex !== -1 ? cartItems[cartItemIndex] : null;

  // If item already in cart
  if (cartItem) {
    return (
      <div className="flex items-center gap-2 px-2 py-1">
        {cartItem.orderCount === 1 ? (
          <button
            onClick={(e) => { handleClick(e); dispatch(removeFromCart(product)) }}
            className="px-2 rounded-xl bg-green-700 text-white cursor-pointer hover:bg-green-800 transition"
            aria-label="Remove from cart"
          >
            Remove
          </button>
        ) : (
          <button
            onClick={(e) => { handleClick(e); dispatch(decrementOrderCount(product)) }}
            className="px-2 rounded-xl bg-green-700 text-white cursor-pointer hover:bg-green-800 transition"
            aria-label="Decrease quantity"
          >
            -
          </button>
        )}
        
        <span className="font-semibold min-w-[2rem] text-center">
          {cartItem.orderCount}
        </span>
        
        <button
          onClick={(e) => { handleClick(e); dispatch(incrementOrderCount(product)) } }
          className="px-2 rounded-xl bg-green-700 text-white cursor-pointer hover:bg-green-800 transition"
          disabled={cartItem.orderCount >= product.stock}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    );
  }

  // If item NOT in cart
  return (
    <button
      onClick={(e) => { handleAddToCart(e) }}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 active:scale-95 transition cursor-pointer"
    >
      Add to Cart
    </button>
  );
} 

export default AddToCartButton;
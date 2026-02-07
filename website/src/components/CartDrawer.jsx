import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  cart_slice_toggle,
  incrementOrderCount,
  decrementOrderCount,
  removeFromCart,
} from "../redux/slices/cartSlice";
import { ShoppingCart, X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { API } from "../utils/API";
import CartQuantityControls from "./CartQuantityControls";

function CartDrawer() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [ cartUpdateCounter, setCartUpdateCounter ] = useState(0)

  const totalItems = cart?.cartItems.reduce((sum, i) => sum + i.orderCount, 0) || 0;
  const totalBill = cart?.cartItems.reduce((sum, i) => sum + i.orderCount * i.price, 0) || 0;

  const handleClose = () => dispatch(cart_slice_toggle());
    
  async function updateCart()
  {
    const new_cart = cart;

    // await API.USER.update_cart( new_cart.cartItems )
  }

  useEffect(()=>{
    updateCart()
  },[ cartUpdateCounter ])

  return (
    <>
      {/* Overlay with fade animation */}
      {cart?.isOpen && (
        <div
          onClick={handleClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-300"
        />
      )}

      {/* Drawer */}
      <div
        className={`
          fixed z-50 bg-white shadow-2xl
          transform transition-all duration-300 ease-out
          bottom-0 left-0 right-0 h-[90vh] rounded-t-3xl
          md:top-0 md:bottom-0 md:left-auto md:right-0 md:h-full md:w-[28rem] md:rounded-none
          ${cart?.isOpen ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-1 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-600 rounded-xl">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">My Cart</h2>
                  
                </div>
              </div>
              <p className="text-sm text-yellow-800">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Cart Items */}
          {cart?.cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-1 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 text-sm mb-6">Add items to get started</p>
              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-1">
                <div className="space-y-1">
                  {cart.cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl p-2 shadow-md transition-shadow"
                    >
                      <div className="flex gap-4">
                        {/* Product Image Placeholder */}
                        <div className=" bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex-shrink-0 flex items-center justify-center">
                          {
                            <img
                                src={item.thumbnail}
                                className="w-24 h-24 rounded-md"
                            />
                          }
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1 truncate">
                            {item.name}
                          </h3>
                          <p className="text-green-600 font-bold text-lg mb-3">
                            ₹{item.price.toLocaleString('en-IN')}
                          </p>

                          {/* Quantity Controls */}
                          <CartQuantityControls item={item} />
                        </div>

                        {/* Item Subtotal */}
                        <div className="text-right">
                          <p className="text-sm text-gray-500 mb-1">Subtotal</p>
                          <p className="font-bold text-gray-900">
                            ₹{(item.price * item.orderCount).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer with totals and checkout */}
              <div className="border-t bg-gray-50 p-1">
                <div className="space-y-3 mb-1">
                  {/* <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      ₹{totalBill.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div> */}
                  <div className="pt-3 flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-3xl text-gray-900">
                      ₹{totalBill.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-green-600/30"
                >
                  Proceed to Checkout
                </button>

              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default CartDrawer
import { Minus, Plus, Trash2 } from 'lucide-react';
import React from 'react'
import { API } from '../utils/API';

function CartQuantityControls({ item }) {
  return (
    <div className="flex items-center gap-3">
        {item.orderCount === 1 ? (
            <button
                // onClick={() => { dispatch(removeFromCart(index)); setCartUpdateCounter(cartUpdateCounter+1) } }
                onClick={ () => { API.TOOLS.remove_from_cart(item) } }
                className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                aria-label="Remove item"
            >
            <Trash2 className="w-4 h-4" />
            Remove
            </button>
        ) : (
            <button
                // onClick={() => { dispatch(decrementOrderCount(index)); setCartUpdateCounter(cartUpdateCounter+1) }  }
                onClick={ () => { API.TOOLS.decrement_order_count(item) } }
                className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                aria-label="Decrease quantity"
            >
            <Minus className="w-4 h-4 text-gray-700" />
            </button>
        )}

        <span className="min-w-[2rem] text-center font-semibold text-gray-900">
            {item.orderCount}
        </span>

        <button
            // onClick={() => { dispatch(incrementOrderCount(index)); setCartUpdateCounter(cartUpdateCounter+1); } }
            onClick={ () => { API.TOOLS.increment_order_count(item) } }
            className="w-8 h-8 flex items-center justify-center bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            disabled={item.orderCount >= item.stock}
            aria-label="Increase quantity"
        >
            <Plus className="w-4 h-4 text-white" />
        </button>
    </div>
  )
}

export default CartQuantityControls;
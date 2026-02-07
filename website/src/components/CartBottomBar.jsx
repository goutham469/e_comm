import { useDispatch, useSelector } from "react-redux";
import { cart_slice_toggle } from "../redux/slices/cartSlice";
import { ShoppingCart, ArrowRight } from "lucide-react";

function CartBottomBar() {
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart);

    if (cart?.cartItems?.length === 0) return null;

    // console.log(cart)

    const totalItems = cart?.cartItems?.reduce(
        (sum, i) => sum + i.orderCount,
        0
    );

    const totalBill = cart?.cartItems.reduce(
        (sum, i) => sum + i.orderCount * i.price,
        0
    );

    return (
        <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden">
            {/* Gradient fade effect above the bar */}
            <div className="h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            
            <button
                onClick={() => dispatch(cart_slice_toggle())}
                className="
                    w-full bg-gradient-to-r from-green-600 to-green-700 text-white
                    px-6 py-4 flex justify-between items-center
                    shadow-2xl shadow-green-600/40
                    active:scale-[0.99] transition-transform
                    border-t-2 border-green-500
                "
            >
                {/* Left Section - Cart Icon & Items */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <ShoppingCart className="w-6 h-6" />
                        {/* Item Count Badge */}
                        <span className="absolute -top-2 -right-2 bg-white text-green-700 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                            {totalItems}
                        </span>
                    </div>
                    <div className="text-left">
                        <p className="font-semibold text-base">
                            {totalItems} {totalItems === 1 ? 'item' : 'items'}
                        </p>
                        <p className="text-xs text-green-100">
                            Tap to view cart
                        </p>
                    </div>
                </div>

                {/* Right Section - Total & Arrow */}
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-xs text-green-100">Total</p>
                        <p className="font-bold text-xl">
                            ₹{totalBill.toLocaleString('en-IN')}
                        </p>
                    </div>
                    <ArrowRight className="w-5 h-5 animate-pulse" />
                </div>
            </button>
        </div>
    );
}

export default CartBottomBar;
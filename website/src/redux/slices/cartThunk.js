import {
    incrementOrderCount,
    decrementOrderCount,
    addToCart,
    removeFromCart
} from "./cartSlice";

const saveCartToLocal = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
};

export const syncCart = () => async (dispatch, getState) => {
    const cartState = getState().cart;

    // localStorage
    saveCartToLocal(cartState);

    // API
    try {
        await fetch(`${VITE_SERVER_URL}/user/cart`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(cartState)
        });
    } catch (err) {
        console.error("Cart sync failed", err);
    }
};

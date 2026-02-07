import { createSlice } from "@reduxjs/toolkit";

const defaultState = {
    isOpen: false,
    cartItems: []
};

const cartSlice = createSlice({
    name: "cart",
    initialState: defaultState,

    reducers: {
        cart_slice_toggle(state) {
            state.isOpen = !state.isOpen;
        },

        cart_slice_update(_, action) {
            return action.payload;
        },

        incrementOrderCount(state, action) {
            const productId = action.payload._id;

            const item = state.cartItems.find(i => i._id === productId );
            if (item) item.orderCount += 1;
        },

        decrementOrderCount(state, action) {
            const productId = action.payload._id;

            const item = state.cartItems.find(i => i._id === productId );
            if (item && item.orderCount > 1) {
                item.orderCount -= 1;
            }
        },

        addToCart(state, action) {
            const product = action.payload;
            const item = state.cartItems.find(i => i._id === product._id);

            if (item) {
                item.orderCount += 1;
            } else {
                state.cartItems.push({ ...product, orderCount: 1 });
            }

            state.isOpen = true;
        },

        removeFromCart(state, action) {
            const productId = action.payload._id;

            state.cartItems = state.cartItems.filter(
                item => item._id !== productId
            );
        }
    }
});

export const {
    cart_slice_toggle,
    cart_slice_update,
    incrementOrderCount,
    decrementOrderCount,
    addToCart,
    removeFromCart
} = cartSlice.actions;

export default cartSlice.reducer;

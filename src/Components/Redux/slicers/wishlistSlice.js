import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    items: [],
};
const API_URL = process.env.REACT_APP_API_URL;

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        setWishlist: (state, action) => {
            state.items = action.payload; // Set the wishlist items
        },
        addToWishlist: (state, action) => {
            const existingItem = state.items.find((item) => item.productId === action.payload._id
            );
            if (!existingItem) {
                state.items.push(action.payload);
            }
        },
        removeFromWishlist: (state, action) => {
            state.items = state.items.filter((item) => item.productId !== action.payload);
        },
    },
});

export const { setWishlist, addToWishlist, removeFromWishlist } = wishlistSlice.actions;

export const fetchWishlist = (userId) => async (dispatch) => {
    try {
        const response = await axios.get(`${API_URL }/wishlist/${userId}`);
        dispatch(setWishlist(response.data.wishlist));
    } catch (error) {
        console.error("Error fetching wishlist:", error);
    }
};

export const addProductToWishlist = (userId, productId) => async (dispatch) => {
    try {
        const response = await axios.post(`${ API_URL }/wishlist/addToWishlist`, { userId, productId });
        dispatch(setWishlist(response.data.wishlist));
    } catch (error) {
        console.error("Error adding to wishlist:", error);
    }
};

export const removeProductFromWishlist = (userId, productId) => async (dispatch) => {
    try {
        await axios.delete(`${API_URL }/wishlist/removeFromWishlist`, {
            data: { userId, productId },
        });
        const response = await axios.get(`${API_URL }/wishlist/${userId}`);

        dispatch(setWishlist(response.data.wishlist));
    } catch (error) {
        console.error("Error removing from wishlist:", error);
    }
};

export default wishlistSlice.reducer;



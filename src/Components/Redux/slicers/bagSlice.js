import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    bagItems: [],
    totalPrice: 0,
};
const API_URL = process.env.REACT_APP_API_URL;


const bagSlice = createSlice({
    name: "bag",
    initialState,
    reducers: {
        setBag: (state, action) => {
            state.bagItems = action.payload;

        },
        addToBag: (state, action) => {
            const { productId, quantity } = action.payload;
            const existingItem = state.bagItems.find((item) => item.productId._id === productId)
            if (existingItem) {
                existingItem.quantity += quantity;
            }
            else {
                state.bagItems.push({ productId: action.payload.productId, quantity });
            }

        },
        updateBagQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const item = state.bagItems.find(item => item.productId._id === productId);
            if (item) {
                item.quantity = Math.max(1, item.quantity + quantity);
            }
        },

        removeFromBag: (state, action) => {
            state.bagItems = state.bagItems.filter((item) => item.productId._id !== action.payload);

        },
        setTotalPrice: (state, action) => {
            state.totalPrice = action.payload;
        },
        clearBag: (state) => {
            state.bagItems = [];
            state.totalPrice = 0;
        },
    }
})
export const { setBag, addToBag, updateBagQuantity, removeFromBag, setTotalPrice, clearBag } = bagSlice.actions;

//Async Thunks
export const fetchBag = (userId) => async (dispatch) => {
    try {
        const response = await axios.get(`${API_URL}/bag/${userId}`);
        dispatch(setBag(response.data.bag));
    }
    catch (error) {
        console.error("Error fetching bag:", error);
    }
}

export const addToBagAsync = (userId, productId, quantity, size = null) => async (dispatch) => {
    try {
        await axios.post(`${API_URL}/bag/addToBag`, {
            userId, productId, quantity, size
        });
        dispatch(addToBag({ productId, quantity }));
    }
    catch (error) {
        console.log("Error adding product to bag:", error);
    }
}

export const updateBagQuantityAsync = (userId, productId, quantity) => async (dispatch) => {
    try {
        await axios.put(`${API_URL}/bag/updateQuantity`, { userId, productId, quantity });
        dispatch(updateBagQuantity({ productId, quantity }));
    } catch (error) {
        console.log("Error updating quantity:", error);
    }
};

export const removeFromBagAsync = (userId, productId, quantity) => async (dispatch) => {
    try {
        await axios.delete(`${API_URL}/bag/removeFromBag`, { data: { userId, productId } });
        dispatch(removeFromBag(productId, quantity));
    }
    catch (error) {
        console.log("Error removing product from bag", error);
    }
}

export const clearBagAsync = (userId) => async (dispatch) => {
    try {
        await axios.delete(`${API_URL}/bag/clear/${userId}`);
        dispatch(clearBag());
    } catch (error) {
        console.log("Error clearing bag:", error);
        throw error;
    }
}

export default bagSlice.reducer;
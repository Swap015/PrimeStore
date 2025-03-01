import { configureStore } from '@reduxjs/toolkit';
import bagReducer from './slicers/bagSlice';
import wishlistReducer from './slicers/wishlistSlice';


export  const store= configureStore({
    reducer: {
        bag: bagReducer,
        wishlist: wishlistReducer,
    },
});

export default store;


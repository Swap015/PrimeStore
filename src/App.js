import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './Components/Footer';
import Header from './Components/Header';
import Home from './Components/Home';
import MensClothes from './Components/Mens-Clothing/Mens-Clothes';
import WomensClothes from './Components/Womens-Clothing/Womens-Clothes';
import KidsClothes from './Components/Kids-Clothing/Kids-Clothes';
import { Box } from '@mui/material';
import ProductInfo from './Components/Product-pages/Product-Info.jsx';
import BagPage from './Components/Pages/BagPage.jsx';
import Login from './Components/Authentication/Login.jsx';
import Signup from './Components/Authentication/Signup';
import { Bounce, ToastContainer } from 'react-toastify';
import WishlistPage from './Components/Pages/WishlistPage.jsx';
import { useEffect, useState } from 'react';
import axios from 'axios';
import OrderPage from './Components/Pages/OrdersPage.jsx';
import CamerasPage from './Components/Product-pages/Cameras.jsx';
import SearchPage from './Components/Pages/SearchResults-Page.jsx';
import SingleProductInfo from './Components/Product-pages/SingleProductInfo.jsx';
import ProfilePage from './Components/Pages/ProfilePage.jsx';
import { useMediaQuery } from '@mui/material';
import OrderSuccessPage from './Components/Pages/OrderSuccessPage.jsx';
import { fetchWishlist } from './Components/Redux/slicers/wishlistSlice.js';

function App() {
  const [userId, setUserId] = useState(null);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isMediumScreen = useMediaQuery('(min-width:600px) and (max-width:900px)');
  const isLargeScreen = useMediaQuery('(min-width:900px) and (max-width:1200px)');
  const isExtraLargeScreen = useMediaQuery('(min-width:1200px)');
  const API_URL = process.env.REACT_APP_API_URL;


  const getToastStyle = () => {
    if (isSmallScreen) {
      return { color: "black", width: "13rem", fontSize: '0.75rem' };
    } else if (isMediumScreen) {
      return { color: "black", width: "14rem", fontSize: '0.9rem' };
    } else if (isLargeScreen) {
      return { color: "black", width: "15rem", fontSize: '0.95rem' };
    } else if (isExtraLargeScreen) {
      return { color: "black", width: "17rem", fontSize: '1.05rem' };
    }
    return { color: "black", width: "13rem", fontSize: '0.75rem' }; // Default style
  };
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/profile`, {
          withCredentials: true,
        });
        setUserId(response.data.user._id);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
    fetchWishlist(userId);
  }, [userId]);

  return (
    <BrowserRouter>
      <div className="App">
        <ToastContainer
          position="top-right"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          theme="light"
          transition={Bounce}
          toastStyle={getToastStyle()}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <Header />
          <Box
            component="main"
            sx={{
              flex: 1,
            }}
          >
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/mens-clothing' element={<MensClothes />} />
              <Route path='/womens-clothing' element={<WomensClothes />} />
              <Route path='/kids-clothing' element={<KidsClothes />} />
              <Route path='/product/:category/:_id' element={<ProductInfo />} />
              <Route path='/bag' element={<BagPage />} />
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/wishlist' element={<WishlistPage />} />
              <Route path='/order-page' element={<OrderPage />} />
              <Route path='/cameras' element={<CamerasPage />} />
              <Route path='/search' element={<SearchPage />} />
              <Route path='/profile-page' element={<ProfilePage />} />
              <Route path='/productDetails/:_id' element={<SingleProductInfo />} />
              <Route path='/order-success' element={<OrderSuccessPage />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </div>
    </BrowserRouter>
  );
}
export default App;

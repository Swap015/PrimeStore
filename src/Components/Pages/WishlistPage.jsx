import React, { useContext, useEffect, useState } from "react";
import {
    Box, Typography, Container, IconButton, CircularProgress,
    Button,
} from "@mui/material";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { removeProductFromWishlist, fetchWishlist } from "../Redux/slicers/wishlistSlice";
import { Link, useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import AuthContext from '../Authentication/AuthContext';
import { toast } from "react-toastify";


const WishlistPage = () => {
    const wishlistItems = useSelector(state => state.wishlist.items);
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [productDetails, setProductDetails] = useState({});
    const dispatch = useDispatch();
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/profile`, {
                    withCredentials: true,
                });
                const firstName = response.data.user.name.split(" ")[0];
                setUserName(firstName);
                setUserId(response.data.user._id);
                // Fetch wishlist from backend if logged in
                dispatch(fetchWishlist(response.data.user._id)); // Sync Redux with localStorage
            } catch (error) {
                toast.error("Error fetching user info:", { position: "top-center" });
            } finally {
                setIsLoading(false);
            }
        };

        const fetchProductDetails = async () => {
            const details = {};
            for (const item of wishlistItems) {
                try {
                    const response = await axios.get(`${API_URL}/product/${item.productId}`);
                    details[item.productId] = response.data; // Store product details by ID
                } catch (error) {
                    toast.error(`Error fetching details of product`, { position: 'bottom-center' });
                }
            }
            setProductDetails(details);
        };
        fetchUserInfo();
        fetchProductDetails();
    }, [wishlistItems, dispatch]);

    const handleRemove = (prodId) => {
        dispatch(removeProductFromWishlist(userId, prodId)); // Redux action to remove the product

    };
    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (

        <Box sx={{ padding: "20px" }}>
            <Typography variant="h5" gutterBottom sx={{ textAlign: "center", fontWeight: "bold", color: "primary.main", fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem", lg: "1.3rem", xl: "1.4rem" } }}>
                Wishlist({wishlistItems.length})
            </Typography>
            {isAuthenticated &&
                (
                    <Box mx="3rem"  >
                        <Typography variant="h6" sx={{ fontSize: { xs: "1rem", sm: "1.1rem", md: "1.1rem", lg: "1.17rem", xl: "1.2rem" }, display: { xs: "none", sm: "block", md: "block" } }}>
                            Welcome👋, {userName}
                        </Typography>
                    </Box>
                )}
            {!isAuthenticated && (<Box textAlign="center">
                < Typography variant="h6" color="rgb(253, 17, 119)">Please Login to view items in wishlist </Typography>
            </Box>)}
            {isAuthenticated && wishlistItems.length === 0 ? (
                <Box sx={{ justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
                    <Typography variant="h5" color="red" sx={{ textAlign: "center", marginBottom: "1rem" }} >Wishlist is empty🛒 </Typography>
                    <Button size="small"
                        variant="contained"
                        sx={{
                            fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem", lg: "1rem", xl: "1.1rem" },
                            backgroundColor: 'white',
                            color: 'rgb(252, 0, 76)',
                            fontWeight: 'bold',
                            padding: '10px 30px',
                            '&:hover': {
                                backgroundColor: 'rgb(253, 240, 243)',
                            },
                        }}
                        onClick={() => navigate('/')}
                    >
                        Continue Shopping
                    </Button>

                </Box>
            ) : (<Container>
                {wishlistItems.map((item) => {
                    const product = productDetails[item.productId]; // Get product details
                    return (
                        <Box
                            key={item.productId}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "20px",
                                padding: "15px",
                                borderBottom: "1px solid #ccc", // Divider for each item
                                marginBottom: "10px",
                            }}
                        >
                            {product ? (
                                <>
                                    <Link to={`/product/${product.category}/${product._id}`}>
                                        <Box
                                            component="img"
                                            src={product.images[0]}
                                            alt={product.name}
                                            sx={{
                                                width: "80px", // Small image size
                                                height: "80px",
                                                objectFit: "cover",
                                                borderRadius: "8px",
                                                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Slight shadow for aesthetics
                                            }}
                                        />   </Link>
                                    {/* Product details */}
                                    <Box sx={{ flex: 1 }}>
                                        <Link to={`/product/${product.category}/${product._id}`}
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                        >  <Typography variant="h6" sx={{ fontSize: { xs: "1rem", sm: "1.1rem", md: "1.3rem", lg: "1.3rem", xl: "1.4rem" } }}>
                                                {product.name}
                                            </Typography>
                                        </Link>
                                        <Typography variant="h5" sx={{ color: "black", fontSize: { xs: "1.2rem", sm: "1.3rem", md: "1.4rem", lg: "1.5rem", xl: "1.6rem" } }}>
                                            ₹{product.price}
                                        </Typography>
                                    </Box>
                                    {/* Remove Button */}
                                    <IconButton
                                        onClick={() => handleRemove(item.productId)}

                                        color="error"
                                        size="small"
                                        sx={{ alignSelf: "center" }}
                                    >
                                        < DeleteIcon />
                                    </IconButton>
                                </>
                            ) : (
                                <Typography>Loading product details...</Typography>
                            )}
                        </Box>
                    );
                })}
            </Container>)}
        </Box>

    );
};

export default WishlistPage;






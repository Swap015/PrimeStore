import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardMedia, Typography, Grid, Box, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    addProductToWishlist,
    removeProductFromWishlist,
    fetchWishlist,
} from "../Redux/slicers/wishlistSlice";
import { toast } from "react-toastify";

export default function KidsCards() {
    const [products, setProducts] = useState([]);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const API_URL = process.env.REACT_APP_API_URL;
    // Fetch user info and wishlist on component mount
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/profile`, {
                    withCredentials: true,
                });
                setUserId(response.data.user._id);
                dispatch(fetchWishlist(response.data.user._id)); // Fetch wishlist for the user
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchUserInfo();
    }, [dispatch]);

    // Fetch kids' clothing products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_URL}/clothing/kids-clothing`);
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    // Toggle favorite status
    const toggleFavorite = async (productId) => {
        if (!userId) {
            toast.warn("Please log in to add items to your wishlist!", {
                position: "bottom-center",
            });
            return;
        }

        const isFavorite = wishlistItems.some((item) => item.productId === productId);

        if (isFavorite) {
            // Remove from wishlist
            dispatch(removeProductFromWishlist(userId, productId));
            toast.warn("Removed from wishlist 💔", {
                position: "bottom-center",
            });
        } else {
            // Add to wishlist
            dispatch(addProductToWishlist(userId, productId));
            toast.success("Added to Wishlist ❤️", {
                position: "bottom-center",
            });
        }
    };

    // Handle card click to navigate to product details
    const handleCardClick = (category, id) => {
        navigate(`/product/${category}/${id}`);
    };

    return (
        <Box sx={{ flexGrow: 1, padding: "0.4rem", marginTop: "0.5rem" }}>
            <Grid container rowSpacing={{ xs: 2, sm: 2, md: 3, lg: 4 }} columnSpacing={{ xs: 2, sm: 0, md: 0, lg: 0 }}>
                {products.slice(0, 8).map((product) => {
                    const isFavorite = wishlistItems.some((item) => item.productId === product._id);

                    return (
                        <Grid item xs={6} sm={4} md={3} lg={3} xl={3} key={product._id} sx={{ display: "flex", justifyContent: "center" }}>
                            <Card
                                onClick={() => handleCardClick("clothing", product._id)}
                                sx={{
                                    width: { xs: "9rem", sm: "12rem", md: "13rem", lg: "16rem", xl: "12rem" },
                                    height: { xs: "14.5rem", sm: "18rem", md: "18rem", lg: "20.5rem", xl: "18rem" },
                                    position: "relative",
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    "&:hover": {
                                        transform: "scale(1.05)",
                                        boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                                    },
                                }}
                            >
                                {/* Card Media Wrapper */}
                                <Box sx={{ position: "relative" }}>
                                    <CardMedia
                                        component="img"
                                        image={product.images[0]} // Display the first image
                                        alt={product.name}
                                        sx={{
                                            height: { xs: "9rem", sm: "12rem", md: "12rem", lg: "15rem", xl: "12rem" },
                                            width: { xs: "9rem", sm: "12rem", md: "14rem", lg: "16rem", xl: "12rem" },
                                            objectFit: "cover",
                                        }}
                                    />
                                    {/* Favorite Icon Button */}
                                    <IconButton
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent card click event
                                            toggleFavorite(product._id);
                                        }}
                                        sx={{
                                            position: "absolute",
                                            top: 10,
                                            right: 10,
                                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                                            "&:hover": {
                                                backgroundColor: "rgba(255, 255, 255, 1)",
                                            },
                                            zIndex: 2,
                                        }}
                                    >
                                        {isFavorite ? (
                                            <FavoriteIcon sx={{ color: "red" }} />
                                        ) : (
                                            <FavoriteBorderIcon sx={{ color: "black" }} />
                                        )}
                                    </IconButton>
                                </Box>

                                <CardContent>
                                    <Typography variant="h6" component="div" sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem", lg: "1.1rem", xl: "1.2rem" } }}>
                                        {product.name.length > 20 ? `${product.name.slice(0, 20)}...` : product.name}
                                    </Typography>

                                    <Typography
                                        variant="h6"
                                        color="primary"
                                        sx={{ justifyContent: "center", display: "flex", fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem", lg: "1.2rem", xl: "1.3rem" } }}
                                    >
                                        ₹{product.price}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
}
import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, Grid, Rating, IconButton } from '@mui/material';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import FlashOnRoundedIcon from '@mui/icons-material/FlashOnRounded';
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useDispatch, useSelector } from 'react-redux';
import {
    addProductToWishlist,
    removeProductFromWishlist,

} from "../Redux/slicers/wishlistSlice";  //wishlistSlice
import { addToBagAsync } from '../Redux/slicers/bagSlice';  // Bag slice
import { toast } from "react-toastify";


const SingleProduct = () => {
    const { category, _id } = useParams(); // Get the product ID from the URL
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState("");
    const [favorites, setFavorites] = useState({});

    const [selectedSize, setSelectedSize] = useState(null);
    const dispatch = useDispatch();
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const isFavorite = product ? wishlistItems.some((item) => item.productId === product._id) : false;
    const BagItems = useSelector(state => state.bag.bagItems);
    const [UserId, setUserId] = useState(null);
    const handleSizeSelect = (size) => {
        setSelectedSize(size);
    };
    const API_URL = process.env.REACT_APP_API_URL;


    const toggleFavorite = async () => {
        if (isFavorite) {
            // If already in wishlist, remove it
            dispatch(removeProductFromWishlist(UserId, product._id));
            setFavorites((prev) => ({ ...prev, [product._id]: false }));
            toast.warn("Product removed from wishlist 💔", {
                position: "bottom-center"
            });
        } else {
            // If not in wishlist, add it
            dispatch(addProductToWishlist(UserId, product._id));
            setFavorites((prev) => ({ ...prev, [product._id]: true }));
            toast.success("Product Added to Wishlist ❤️", {
                position: "bottom-center",
            });
        }
    };
    const toggleBag = async () => {
        if (!product || !UserId) return;  // Ensure product and user exist
        if (product.size && product.size.length > 0 && !selectedSize) {
            toast.warn("Please select a size before adding to bag!", { position: "bottom-center" });
            return;
        }
        const existingItem = BagItems.find((item) => item.productId === product._id);
        if (!existingItem) {
            dispatch(addToBagAsync(UserId, product._id, 1, selectedSize));
            toast.success("Product added to Bag 🛍️", { position: "bottom-center" });
        }
    };
    const handleAddToBag = () => {
        toggleBag();
    };

    const handleBuyNow = () => {
        toggleBag();
        Navigate("/bag");
    }
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`${API_URL}/product/${_id}`);
                setProduct(response.data);

                setMainImage(response.data.images[0]);
            } catch (error) {
                toast.error('Error fetching product details', { position: 'bottom-center' });
            }
        };
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

        fetchProductDetails();
        fetchUserInfo();
    }, [_id, category]);

    if (!product) {
        return <Typography variant="h6" color="text.secondary">Loading...</Typography>;
    }

    return (
        <Box sx={{ padding: 2, flexGrow: "1" }}>
            <Grid container spacing={2} alignItems="flex-start">

                {/* Image Section */}
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <Box sx={{ display: "flex" }}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                marginRight: 2,
                            }}
                        >
                            {product.images.map((image, index) => (
                                <Box component={"img"}
                                    key={index}
                                    src={image}
                                    alt={`Thumbnail ${index + 1}`}
                                    onMouseEnter={() => setMainImage(image)} // Change the main image on hover
                                    sx={{
                                        width: { xs: "3rem", sm: "3.1rem", md: "3.2rem", lg: "3.3rem", xl: "3.4rem" },
                                        height: { xs: "3.2rem", sm: "3.5rem", md: "3.7rem", lg: "3.9rem", xl: "4rem" },
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        border: mainImage === image ? "2px solid blue" : "1px solid gray",
                                    }}
                                />
                            ))}
                        </Box>
                        {/* Main large Image */}
                        <Box sx={{ position: "relative", textAlign: "center" }}>
                            <Box component={"img"}
                                src={mainImage} // Main image displayed
                                alt={product.name}
                                sx={{
                                    width: { xs: "14rem", sm: "16.1rem", md: "22.7rem", lg: "30rem", xl: "30.4rem" },
                                    height: { xs: "18.2rem", sm: "20.5rem", md: "29.7rem", lg: "38rem", xl: "40rem" },
                                    borderRadius: "8px"
                                }}
                            />
                            <IconButton
                                onClick={toggleFavorite}
                                sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
                                }}
                            >
                                {isFavorite ? (
                                    <FavoriteIcon sx={{ color: "red" }} />
                                ) : (
                                    <FavoriteBorderIcon sx={{ color: "black" }} />
                                )}
                            </IconButton>
                        </Box>
                    </Box>
                </Grid>


                {/* Product Details Section */}
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
                    <Box sx={{ display: "flex", flexDirection: "column", paddingTop: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: "1.2rem", sm: "1.3rem", md: "1.4rem", lg: "1.5rem", xl: "1.6rem" } }}
                        >
                            {product.name}
                        </Typography>
                        <Typography variant="body1" sx={{ color: "green", fontSize: { xs: "0.9rem", sm: "1rem", md: "1rem", lg: "1.1rem", xl: "1.1rem" } }}
                        >Special price</Typography>

                        <Box >
                            <Typography variant="h6" color="primary" gutterBottom sx={{ fontSize: { xs: "1.3rem", sm: "1.3rem", md: "1.4rem", lg: "1.5rem", xl: "1.6rem" }, fontWeight: "500" }}>
                                ₹{product.price} <Box component={"span"} sx={{ color: "green", fontSize: "0.8rem" }}>{product.discount} off</Box>
                            </Typography>
                        </Box>

                        <Typography variant="body1" sx={{ marginBottom: 2, fontSize: { xs: "0.9rem", sm: "0.9rem", md: "1rem", lg: "1.1rem", xl: "1.2rem" } }}>
                            {product.description || "No description available."}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontSize: { xs: "0.9rem", sm: "0.9rem", md: "1rem", lg: "1.1rem", xl: "1.2rem" } }}>Rating</Typography>
                            <Rating defaultValue={product.rating} precision={0.5} readOnly />
                        </Box>
                        {/* Display Sizes If Available */}
                        {product.size && product.size.length > 0 && (
                            <Box sx={{ display: "flex", gap: 1, marginBottom: 2, }}>
                                <Typography variant="subtitle1" sx={{ fontSize: { xs: "0.9rem", sm: "0.9rem", md: "1rem", lg: "1.1rem", xl: "1.2rem" } }}>Size:</Typography>
                                {product.size.map((size, index) => (
                                    <Box
                                        key={index}
                                        onClick={() => handleSizeSelect(size)}
                                        sx={{
                                            padding: { xs: "0.4rem 0.6rem", sm: "0.4rem 0.6rem", md: "0.5rem 0.7rem", lg: "0.6rem 0.8rem", xl: "0.6rem 0.9rem" },
                                            border: "1px solid black",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            backgroundColor: selectedSize === size ? "rgb(247 89 142)" : "transparent",
                                            fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem", lg: "0.9rem", xl: "0.9rem" },
                                        }}
                                    >
                                        {size}
                                    </Box>
                                ))}
                            </Box>
                        )}

                        <Box sx={{ display: "flex", gap: 2, marginTop: 1 }}>

                            <Button variant="contained" color="primary" sx={{
                                padding: { xs: "0.4rem ", sm: "0.5rem ", md: "0.5rem ", lg: "0.6rem ", xl: "0.6rem" },
                                fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem", lg: "0.9rem", xl: "0.9rem" }
                            }} onClick={handleAddToBag}>
                                Add to Bag <ShoppingBagRoundedIcon sx={{ marginLeft: "0.2rem" }} />
                            </Button>

                            <Button variant="contained" color="warning" sx={{
                                padding: { xs: "0.4rem ", sm: "0.5rem ", md: "0.5rem ", lg: "0.6rem ", xl: "0.6rem" },
                                fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem", lg: "0.9rem", xl: "0.9rem" }
                            }} onClick={handleBuyNow} >
                                Buy Now   <FlashOnRoundedIcon sx={{ marginLeft: "0.2rem" }} />
                            </Button>
                        </Box>


                        {/* REVIEWS */}

                        <Box sx={{ marginTop: 3 }}>
                            <Typography variant="h6" color="primary" sx={{ fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem", lg: "1.3rem", xl: "1.3rem" } }} gutterBottom>
                                Reviews
                            </Typography>
                            <Grid container spacing={2}>
                                {product.reviews.map((review, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Box
                                            sx={{
                                                backgroundColor: "#f9f9f9",
                                                padding: 2,
                                                borderRadius: 2,
                                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                                border: "1px solid #e0e0e0",
                                                "&:hover": {
                                                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                                                },
                                            }}
                                        >
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    fontSize: { xs: "0.9rem", sm: "0.9rem", md: "1rem", lg: "1.1rem", xl: "1.1rem" },
                                                    fontWeight: "bold",
                                                    color: "#424242",
                                                    marginBottom: 1,
                                                }}
                                            >
                                                {review.author}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontSize: { xs: "0.9rem", sm: "0.9rem", md: "1rem", lg: "1.1rem", xl: "1.1rem" },
                                                    color: "#757575",
                                                    marginBottom: 2,
                                                    fontStyle: "italic",
                                                }}
                                            >
                                                "{review.review}"
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    display: "block",
                                                    textAlign: "right",
                                                    color: "#9e9e9e",
                                                }}
                                            >
                                                {"Unknown Date"}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SingleProduct;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardMedia, Typography, Grid, Box, IconButton } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router-dom";

export default function KidsClothes() {
    const [products, setProducts] = useState([]);
    const [favorites, setFavorites] = useState({});
    const navigate = useNavigate();
    const handleCardClick = (category, id) => {
        navigate(`/product/${category}/${id}`);
    };
    const API_URL = process.env.REACT_APP_API_URL;
    const toggleFavorite = (id) => {
        setFavorites((prev) => ({
            ...prev,
            [id]: !prev[id], // Toggle the favorite status
        }));
    };

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

    return (
        <Box sx={{ flexGrow: 1, padding: 3 }}>
            <Grid
                container
                spacing={{ xs: 2, sm: 3, md: 4 }}
                sx={{
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={product._id}>
                        <Card onClick={() => handleCardClick("clothing", product._id)}
                            sx={{
                                maxWidth: "100%",
                                transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease",
                                "&:hover": {
                                    transform: "scale(1.05)",
                                    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                                },
                            }}
                        >
                            <Box sx={{ position: "relative" }}>
                                <CardMedia
                                    component="img"
                                    height="270"
                                    image={product.images[0]} // Display the first image
                                    alt={product.name}
                                />
                                <IconButton
                                    onClick={() => toggleFavorite(product._id)}
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
                                    {favorites[product._id] ? (
                                        <FavoriteIcon sx={{ color: "red" }} />
                                    ) : (
                                        <FavoriteBorderIcon sx={{ color: "black" }} />
                                    )}
                                </IconButton>
                            </Box>
                            <CardContent sx={{ textAlign: "center" }}>
                                <Typography variant="h6" component="div" noWrap>
                                    {product.name}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="primary"
                                    sx={{

                                        fontWeight: "bold",
                                        marginTop: 1,
                                    }}
                                >
                                    ₹{product.price}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

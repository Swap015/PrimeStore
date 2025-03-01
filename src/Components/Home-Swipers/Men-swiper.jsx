
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardMedia, Typography, Box, Grid, IconButton } from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function MensSwiper() {
    const [products, setProducts] = useState([]);
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1024);
    const navigate = useNavigate();
    const handleCardClick = (clothing, id) => {
        navigate(`/product/clothing/${id}`);
    };
    const API_URL = process.env.REACT_APP_API_URL;
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_URL}/clothing`);
                setProducts(response.data);
            } catch (error) {
                toast.error('Error fetching product', { position: 'bottom-center' });
            }
        };
        fetchProducts();
        const handleResize = () => setIsLargeScreen(window.innerWidth > 1024);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Box
            sx={{
                flexGrow: 1,
                padding: 2,
                margin: "auto",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                boxShadow: "0px 1px 4px grey",
            }}
        >
            {/* Header Section */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.8rem",
                }}
            >
                <Typography variant="h6" color="text.primary" sx={{ xs: "1rem", sm: "1.1rem", md: "1.2rem", lg: "1.25rem", xl: "1.3rem" }}>
                    Discover More 👕
                </Typography>
                <IconButton size="small" onClick={() => navigate("/mens-clothing")} variant="outlined" sx={{ backgroundColor: "rgb(251, 71, 128)", "&:hover": { backgroundColor: "rgb(255, 0, 81)" } }}>
                    <ArrowForwardIosIcon sx={{ color: "white" }} />
                </IconButton>
            </Box>

            {/* Cards Section */}
            {isLargeScreen ? (
                // Grid Layout for Large Screens
                <Grid container spacing={3} justifyContent="center">
                    {products.slice(15, 21).map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={2} key={product._id}>
                            <Card onClick={() => handleCardClick("clothing", product._id)}
                                sx={{
                                    border: "1px solid #ccc",
                                    borderRadius: "10px",
                                    transition: "transform 0.3s ease",
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="250"
                                    image={product.images[0]}
                                    alt={product.name}
                                    sx={{
                                        objectFit: "cover", "&:hover": {
                                            transform: "scale(1.03)",
                                            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                                            cursor: "pointer",
                                        },
                                    }}
                                />
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                // Swiper for Small to Medium Screens
                <Box
                    sx={{
                        display: "flex",
                        overflowX: "auto",
                        gap: "10px",
                        paddingBottom: "4px",
                        scrollBehavior: "smooth",
                    }}
                >
                    {products.slice(16, 23).map((product) => (
                        <Card onClick={() => handleCardClick(product.category, product._id)}
                            key={product._id}
                            sx={{
                                width: { xs: "6rem", sm: "8rem", md: "9rem" },
                                height: { xs: "10rem", sm: "12rem", md: "13rem" },
                                flexShrink: 0,
                                border: "1px solid #ccc",
                                borderRadius: "10px",
                                transition: "transform 0.3s ease",
                                "&:hover": {
                                    transform: "scale(1.03)",
                                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                                    cursor: "pointer",
                                },
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="220"
                                image={product.images[0]}
                                alt={product.name}
                                sx={{ objectFit: "cover" }}
                            />
                        </Card>
                    ))}
                </Box>
            )}
        </Box>
    );
}

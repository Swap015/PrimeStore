import { Box, Grid, IconButton, Paper, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function CameraSwiper() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;
    const handleCardClick = (category, id) => {
        navigate(`/product/${category}/${id}`);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_URL}/electronics`);
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <Box sx={{ mx: "0.5rem" }}>
            {/* Paper Container */}
            <Paper variant="elevation" elevation={3} sx={{ paddingBottom: "2rem" }}>
                <Box sx={{ justifyContent: "space-between", display: "flex", padding: "1rem" }}>
                    <Typography variant="h6" color="initial" sx={{ xs: "1rem", sm: "1.1rem", md: "1.2rem", lg: "1.25rem", xl: "1.3rem" }}>
                        Best Cameras for You! 📸
                    </Typography>
                    <IconButton size="small" onClick={() => navigate("/cameras")} variant="outlined" sx={{ margin: "0.5rem", backgroundColor: "rgb(251, 71, 128)", "&:hover": { backgroundColor: "rgb(255, 8, 86)" } }}>
                        <ArrowForwardIosIcon sx={{ color: "white" }} />
                    </IconButton>
                </Box>
                {/* Grid for Images */}
                <Grid container spacing={2} justifyContent="center">
                    {products.slice(0, 6).map((product) => (
                        <Grid item key={product._id} >
                            <Box
                                component="img"
                                alt={product.name}
                                src={product.images[0]}
                                onClick={() => handleCardClick("electronics", product._id)}
                                sx={{
                                    cursor: "pointer", mx: "0.1rem",
                                    borderBottom: "1.9px solid #dadada",
                                    transition: "transform 0.2s ease-in-out",
                                    "&:hover": {
                                        transform: "scale(1.05)"
                                    },
                                    height: { xs: "9rem", sm: "9.5rem", md: "10rem", lg: "10.5rem", xl: "16rem" },
                                    width: { xs: "9.5rem", sm: "10rem", md: "10.5rem", lg: "11rem", xl: "17.5rem" }
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Box>
    );
}

export default CameraSwiper;

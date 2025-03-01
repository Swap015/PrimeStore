import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box, Typography, Paper, Grid, CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import EventIcon from '@mui/icons-material/Event';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/profile`, {
                    withCredentials: true,
                });
                setUserId(response.data.user._id);
            } catch (error) {
                toast.error("Error fetching user info:", { position: "top-center" });
            }
        };

        fetchUserInfo();
    }, []);

    useEffect(() => {
        if (!userId) return;  // Ensure userId is set before fetching orders

        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${API_URL}/order/${userId}`);
                setOrders(response.data.orders);
            } catch (error) {
                toast.error('Failed to fetch orders!', { position: 'bottom-center' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [userId]);

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
        <Box sx={{ padding: { xs: '10px', sm: '20px' }, maxWidth: '1200px', margin: '0 auto' }}>
            <Typography variant="h4" sx={{ marginBottom: '2rem', fontWeight: 'bold', color: 'primary.main', textAlign: 'center', fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem", lg: "2.2rem", xl: "2.5rem" } }}>
                <ShoppingBagIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem", lg: "2.2rem", xl: "2.5rem" } }} />
                Your Orders 📦
            </Typography>

            {orders.length === 0 ? (
                <Typography variant="h5" sx={{ marginBottom: '2.2rem', textAlign: 'center', color: 'text.secondary', fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem", lg: "1.25rem", xl: "1.3rem" } }}>
                    You have no orders yet. Start shopping now!
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {orders.map((order, index) => (
                        <Grid item xs={12} key={index}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 3,
                                    borderRadius: '15px',
                                    background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                                    },
                                }}
                            >
                                <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '1.5rem', color: 'primary.main', fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.5rem", lg: "1.6rem", xl: "1.7rem" } }}>
                                    <LocalShippingIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.5rem", lg: "1.6rem", xl: "1.7rem" } }} />
                                    Order #{index + 1} - ₹{order.totalPrice}
                                </Typography>
                                <Typography variant="body1" sx={{ marginBottom: '1.5rem', color: 'text.secondary', fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem", lg: "1.1rem", xl: "1.2rem" } }}>
                                    <EventIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem", lg: "1.1rem", xl: "1.2rem" } }} />
                                    Order Date: {new Date(order.orderDate).toLocaleDateString()}
                                </Typography>
                               
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default OrderPage;
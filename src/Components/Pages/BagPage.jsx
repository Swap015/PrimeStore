import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBag, removeFromBagAsync, setTotalPrice, clearBagAsync, updateBagQuantityAsync } from '../Redux/slicers/bagSlice';
import {
    Box, Typography, Button, IconButton, Paper, Grid, Skeleton, CircularProgress
} from '@mui/material';
import axios from 'axios';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../Authentication/AuthContext';


const BagPage = () => {
    const bagProducts = useSelector((state) => state.bag.bagItems);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated } = useContext(AuthContext);
    const [productDetails, setProductDetails] = useState({});
    const [userId, setUserId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const loadRazorpayScript = () => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => {
                setIsRazorpayLoaded(true); // Set Razorpay script as loaded
            };
            document.body.appendChild(script);
        };

        if (!window.Razorpay) {
            loadRazorpayScript();
        } else {
            setIsRazorpayLoaded(true); // Razorpay script is already loaded
        }
    }, []);

    const handlePayment = async () => {
        try {
            const response = await axios.post(`${API_URL}/order/create-order`, {
                amount: totalPrice,
            });
            const { id, curr, amount } = response.data;
            const options = {
                key: process.env.RAZORPAY_KEY_ID,
                amount: amount,
                currency: curr,
                name: 'PrimeStore',
                description: 'Payment for your order',
                order_id: id,
                handler: async function (response) {
                    try {
                        // Move products to orders
                        await axios.post(`${API_URL}/order/move-to-orders`, {
                            userId,
                            products: bagProducts,
                            totalPrice,
                        });
                        // Clear the bag in the database
                        await axios.delete(`${API_URL}/bag/clear/${userId}`);
                        // Clear the bag in Redux
                        dispatch(clearBagAsync(userId));
                        toast.success('Payment Successful!', { position: 'bottom-center' });
                        navigate('/order-success');
                    } catch (error) {
                        toast.error('Failed to update orders!', { position: 'bottom-center' });
                        toast.error('Error updating orders:', { position: 'top-center' });
                    }
                },
                prefill: {
                    name: 'Swapnil Motghare',
                    email: 'swapnil015@gmail.com',
                    contact: '9623071890',
                },
                theme: {
                    color: '#f50b59',
                },
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            toast.error('Payment Failed!', { position: 'top-center' });
        }
    };

    const handleRemove = (productId) => {
        dispatch(removeFromBagAsync(userId, productId));
    };

    const quantityIncrement = (productId) => {
        dispatch(updateBagQuantityAsync(userId, productId, 1)); // Increase by 1
    };

    const quantityDecrement = (productId) => {
        dispatch(updateBagQuantityAsync(userId, productId, -1)); // Decrease by 1
    };
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/profile`, {
                    withCredentials: true,
                });
                setUserId(response.data.user._id);
                dispatch(fetchBag(response.data.user._id));
            } catch (error) {
                toast.error('Failed to fetch user info', { position: 'bottom-center' });

            } finally {
                setIsLoading(false);
            }
        };
        fetchUserInfo();
    }, [bagProducts, dispatch]);

    useEffect(() => {
        const fetchProductInfo = async () => {
            const details = {};
            for (const item of bagProducts) {
                try {
                    const response = await axios.get(`${API_URL}/product/${item.productId}`);

                    details[item.productId] = response.data;
                } catch (error) {
                    toast.error('Failed to fetch user info', { position: 'bottom-center' });

                }
            }
            setProductDetails(details);
        };

        fetchProductInfo();
    }, [bagProducts]);

    // Calculate total price dynamically
    const totalPrice = useMemo(() => {
        return bagProducts.reduce((total, item) => {
            const product = productDetails[item.productId];
            const price = product?.price || 0;
            const quantity = item?.quantity || 0;
            return total + price * quantity;
        }, 0);
    }, [bagProducts, productDetails]);

    // Update total price in Redux
    useEffect(() => {
        dispatch(setTotalPrice(totalPrice));
    }, [totalPrice, dispatch]);

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
        <Box sx={{ padding: { xs: '10px', sm: '20px' }, maxWidth: 'auto', margin: '0 auto' }}>
            <Typography variant="h5" sx={{ marginBottom: '2.2rem', fontWeight: 'bold', color: 'primary.main', textAlign: 'center', fontSize: { xs: "1rem", sm: "1.2rem", md: "1.3rem", lg: "1.4rem", xl: "1.5rem" } }}>
                My Bag 🛍️
            </Typography>

            {isAuthenticated && bagProducts.length === 0 ? (
                <Box sx={{ justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
                    <Typography variant="h6" sx={{ marginBottom: '2.2rem', textAlign: 'center', color: 'text.secondary' }}>
                        Your bag is empty. Start shopping now!
                    </Typography>
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

            ) : (
                <Grid container spacing={3}>
                    {bagProducts.map((item) => {
                        const product = productDetails[item.productId];
                        if (!product) {
                            return (
                                <Grid item xs={12} key={`${item.productId}`}>
                                    <Paper elevation={3} sx={{ p: 3, borderRadius: '15px' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Skeleton variant="rectangular" width={120} height={120} sx={{ borderRadius: '15px', mr: 2 }} />
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Skeleton variant="text" width="60%" height={30} sx={{ mb: 1 }} />
                                                <Skeleton variant="text" width="40%" height={20} />
                                            </Box>
                                        </Box>
                                    </Paper>
                                </Grid>
                            );
                        }

                        return (
                            <Grid item xs={12} key={item.productId}>
                                <Paper elevation={3} sx={{ p: 3, borderRadius: '15px' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
                                        <Link to={`/product/${product.category}/${product._id}`}>
                                            <Box
                                                component="img"
                                                src={product.images[0]}
                                                alt={product.name}
                                                sx={{ width: { xs: '5rem', sm: '6rem' }, height: { xs: '5rem', sm: '7rem' }, borderRadius: '15px', objectFit: 'cover', marginRight: { sm: '2rem' } }}
                                            />
                                        </Link>
                                        <Box sx={{ flexGrow: 1, width: '100%', mt: { xs: 2, sm: 0 } }}>
                                            <Link to={`/product/${product.category}/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}
                                            >
                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1, textAlign: { xs: 'center', sm: 'left' }, fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem', lg: '1.2rem', xl: '1.2rem' } }}>
                                                    {product.name}
                                                </Typography>
                                            </Link>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: { xs: 'center', sm: 'left' }, fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem', lg: '1.3rem' } }}>
                                                ₹{product.price}
                                            </Typography>
                                            {product.size && product.size.length > 0 &&
                                                <Typography variant="body1" color="grey">Size: {item.size}</Typography>
                                            }
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <IconButton onClick={() => quantityDecrement(item.productId)} color="primary">
                                                        <RemoveCircleOutlineIcon />
                                                    </IconButton>
                                                    <Typography variant="body1" sx={{ mx: 1, fontWeight: 'bold', border: '1px solid', borderColor: 'divider', px: 2, py: 0.5, borderRadius: '5px' }}>
                                                        {item.quantity}
                                                    </Typography>
                                                    <IconButton onClick={() => quantityIncrement(item.productId)} color="primary">
                                                        <AddCircleOutlineIcon />
                                                    </IconButton>
                                                </Box>

                                            </Box>

                                            <Box display={"flex"} justifyContent={"space-between"}>

                                                <Typography variant="body1" sx={{ mb: 1, color: "green", textAlign: { xs: 'center', sm: 'left' }, fontSize: { xs: '0.9rem', sm: '1rem', md: '1rem', lg: '1.11rem', xl: '1.15rem' } }}>
                                                    Delivery by 4 Dec, Tuesday| Free <Box component="span" sx={{ textDecoration: "line-through", color: "gray" }}>
                                                        ₹40
                                                    </Box>
                                                </Typography>
                                                <IconButton
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() => handleRemove(item.productId)}
                                                    size='large'
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            {bagProducts.length > 0 && (
                <Box sx={{ mt: 4, textAlign: 'end', width: '100%' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: { xs: '1.2rem', sm: '1.2rem', md: '1.4rem', lg: '1.5rem', xl: '1.6rem' } }}>
                        Total: ₹{totalPrice || 0}
                    </Typography>
                    <Button onClick={handlePayment}
                        variant="contained"
                        sx={{ backgroundColor: "rgb(255, 45, 147)", mt: 2, padding: "0.6rem", fontSize: { xs: '0.8rem', sm: '1rem', md: '1.1rem', lg: '1rem', xl: '1.2rem' }, textTransform: 'none', "&:hover": { backgroundColor: "rgb(251, 0, 121)" }, width: 'auto' }}
                    >
                        PLACE ORDER
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default BagPage;



import React from 'react';
import { Typography, Box, Button, useMediaQuery } from '@mui/material';
import { keyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

// Keyframes for animation
const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
`;

const OrderSuccessPage = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width:600px)');
    return (
        <Box>
            {
                isMobile ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100vh',
                            background: 'linear-gradient(135deg,rgb(95, 248, 81),rgb(64, 155, 68))',
                            color: 'white',
                            textAlign: 'center',
                            padding: '20px',
                        }
                        }
                    >

                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 'bold',
                                animation: `${bounce} 2s infinite`,
                                marginBottom: '20px', textShadow: '5px 6px 4px rgba(0, 0, 0, 0.3)',
                            }}
                        >
                            🎉 Order Placed Successfully! 🎉
                        </Typography>
                        <Typography variant="h6" sx={{ marginBottom: '40px', textShadow: '2px 3px 4px rgba(0, 0, 0, 0.3)' }}>
                            Thank you for shopping with us. Your order is on its way!
                        </Typography>
                        <Button size='small'
                            variant="contained"
                            sx={{
                                backgroundColor: 'rgb(252, 0, 76)',
                                color: 'white',
                                padding: '9px 15px',
                                '&:hover': {
                                    backgroundColor: 'rgb(255, 73, 128)',
                                },
                            }}
                            onClick={() => navigate('/')}
                        >
                            Continue Shopping
                        </Button>
                    </Box >

                    // Big Devices
                ) : <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                        background: 'linear-gradient(135deg,rgb(95, 248, 81),rgb(64, 155, 68))',
                        color: 'white',
                        textAlign: 'center',
                        padding: '20px',
                    }
                    }
                >

                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 'bold',
                            animation: `${bounce} 2s infinite`,
                            marginBottom: '20px', textShadow: '5px 6px 4px rgba(0, 0, 0, 0.3)',
                        }}
                    >
                        🎉 Order Placed Successfully! 🎉
                    </Typography>
                    <Typography variant="h5" sx={{ marginBottom: '40px', textShadow: '2px 3px 4px rgba(0, 0, 0, 0.3)' }}>
                        Thank you for shopping with us. Your order is on its way!
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: 'white',
                            color: 'rgb(252, 0, 76)',
                            fontWeight: 'bold',
                            padding: '10px 30px',
                            '&:hover': {
                                backgroundColor: 'rgb(252, 209, 222)',
                            },
                        }}
                        onClick={() => navigate('/')}
                    >
                        Continue Shopping
                    </Button>
                </Box >
            }
        </Box >
    );
};

export default OrderSuccessPage;
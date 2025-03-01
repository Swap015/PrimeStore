import React, { useEffect, useState } from 'react';
import { Container, Card, CardContent, Typography, Avatar, Box, CircularProgress } from '@mui/material';
import { Email, Person } from '@mui/icons-material';
import axios from 'axios';
import { wrap } from 'framer-motion';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL;
    
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/profile`, {
                    withCredentials: true,
                });
                setUser(response.data.user);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };
        fetchUserInfo();
    }, []);

    if (!user) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <Card sx={{
                display: "flex",
                width: { xs: "19rem", sm: "29rem", md: "32rem", lg: "34rem", xl: "35rem" },
                height: { xs: "28srem", sm: "22rem", md: "24rem", lg: "26rem", xl: "28rem" },
                padding: { xs: "2rem", }, margin: { xs: "2rem", sm: "4rem" },
                background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                borderRadius: '2rem', alignItems: "center", justifyContent: "center"
            }}>
                <CardContent>
                    <Box display="flex" flexDirection="column" alignItems="center" gap="1rem">
                        <Avatar sx={{ width: '5rem', height: '5rem', backgroundColor: '#667eea' }}>
                            <Person sx={{ fontSize: '3rem' }} />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: "1rem", sm: "1.2rem", md: "1.3rem", lg: "1.4rem", xl: "1.6rem" }, textAlign: "center" }}>
                            {user.name}
                        </Typography>
                        <Box display="flex" alignItems="center" gap="0.5rem">
                            <Email sx={{
                                color: '#764ba2', fontSize: '1.5rem'
                            }} />
                            <Typography variant="h6" sx={{ fontSize: { xs: "0.8rem", sm: "1.1rem", md: "1.2rem", lg: "1.3rem", xl: "1.4rem" } }}>
                                {user.email}
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ProfilePage;

import React, { useState } from "react";
import {
    Box, TextField, Button, Typography, Container, Paper, Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';


export default function Signup() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const API_URL = process.env.REACT_APP_API_URL;
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`${API_URL}/user/signup`, formData)
            .then((response) => {
                toast.success(response.data.message);
            }).catch((err) => {
                toast.error(err.response?.data?.error);
            })

        // Validation
        if (!formData.name || !formData.email || !formData.password) {
            setError("All fields are required");
            toast.error("All fields are required!");
            return;
        }
        setError("");

    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundImage: `url(bg5.jpg)`, backgroundSize: "cover",
                padding: 2,
            }}
        >
            <Container sx={{ height: { xs: "20rem", sm: "21rem", md: "22rem", lg: "23rem" }, width: { xs: "17.5rem", sm: "20.5rem", md: "21.4rem", lg: "21.7rem" } }}>
                <Paper
                    elevation={20}
                    sx={{
                        padding: { xs: "0.9rem", sm: "1.2rem", md: "1.4rem", lg: "1.6rem" },
                        borderRadius: 3,
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: "1.1rem", sm: "1.2rem", md: "1.3rem", lg: "1.4rem" } }} >
                        Sign Up
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ marginBottom: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            variant="outlined"
                            fullWidth
                            size="small"
                            margin="dense"
                            required
                        />
                        <TextField
                            label="Email Address"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            variant="outlined"
                            fullWidth
                            margin="dense"
                            size="small"
                            type="email"
                            required
                        />
                        <TextField
                            label="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            variant="outlined"
                            fullWidth
                            margin="dense"
                            size="small"
                            type="password"
                            required
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="medium"
                            fullWidth
                            sx={{
                                marginTop: 1, backgroundColor: "#f63076", "&:hover": {
                                    backgroundColor: "rgb(255 0 76)"
                                }
                            }}
                        >
                            Sign Up
                        </Button>

                        <Typography sx={{ marginTop: 1 }} >
                            <Link to="/login" className="text-decoration-none"> Already have an account ? </Link>
                        </Typography>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
}

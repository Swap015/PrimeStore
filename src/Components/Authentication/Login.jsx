import React, { useContext, useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    InputAdornment,
    Container
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from "axios";
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LockIcon from '@mui/icons-material/Lock';
import AuthContext from "../Authentication/AuthContext";

export default function Login() {
    const [formData, setFormData] = useState({ email: "", password: "", });
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const API_URL = process.env.REACT_APP_API_URL;
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    function handleSubmit(e) {
        e.preventDefault()
        axios.post(`${API_URL}/user/login`, formData, { withCredentials: true })
            .then((response) => {
                toast.success(response.data.message);
                login();
                navigate("/");
            }).catch((err) => {
                toast.error(err.response?.data?.error);
            })
    }
    return (
        <Box
            sx={{
                display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", backgroundSize: "cover", height: "100vh", backgroundColor: "#f0f0f0", backgroundImage: `url(bg5.jpg)`, backgroundRepeat: "no-repeat"
            }}
        >
            <Container sx={{ width: { xs: "17.8rem", sm: "20.5rem", md: "20.4rem", lg: "21rem" }, height: "20rem" }}>

                <Paper sx={{ padding: "20px", borderRadius: "15px" }} elevation={20}>

                    <Typography variant="h6" fontWeight="bold" color="initial" sx={{ textAlign: "center", padding: "0.7rem", marginBottom: "10px", fontSize: { xs: "1.2rem", sm: "1.2rem", md: "1.3rem", lg: "1.4rem" } }}>Login </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField label="Email" name="email" type="email" required onChange={handleChange} size="small" fullWidth sx={{
                            marginBottom: "0.3rem"
                        }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <EmailRoundedIcon sx={{ backgroundColor: "transparent" }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField label="Password" name="password" type="password" required size="small" onChange={handleChange} margin="normal" fullWidth sx={{
                            marginBottom: "10px"
                        }} InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <LockIcon sx={{ backgroundColor: "transparent" }} />
                                </InputAdornment>
                            ),
                        }} />

                        <Button type="submit" variant="contained" size="medium" fullWidth sx={{
                            backgroundColor: "#f63076", marginTop: "10px", "&:hover": {
                                backgroundColor: "rgb(255 0 76)"
                            }
                        }}>Login</Button>

                        <Typography variant="body1" margin="normal" sx={{ marginTop: 2, textAlign: "center" }} >New User? <Link to="/signup" className="text-decoration-none"> Register </Link> </Typography>
                    </form>
                </Paper>
            </Container>
        </Box >
    );
}

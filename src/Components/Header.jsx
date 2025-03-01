import React, { useCallback, useContext, useState } from 'react';
import './css/Header.css';
import {
    Box, Button, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText,
    TextField, Autocomplete, Menu, MenuItem,
} from '@mui/material';
import {
    FavoriteBorder as FavoriteBorderIcon,
    ShoppingBagOutlined as ShoppingBagOutlinedIcon,
    PersonOutlineOutlined as PersonOutlineOutlinedIcon,
    MenuOutlined as MenuOutlinedIcon,
    StickyNote2Outlined as StickyNote2OutlinedIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import AuthContext from './Authentication/AuthContext';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import debounce from './Utils/debounce';

function Header() {
    const [draweropen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const { isAuthenticated, logout } = useContext(AuthContext);
    const location = useLocation();
    const API_URL = process.env.REACT_APP_API_URL;


    const handleSearch = useCallback(debounce(async (value) => {
        if (!value?.trim()) return;
        const searchFields = ['name', 'category', 'subcategory', 'brand', 'gender'];
        const priceFields = ['minPrice', 'maxPrice'];
        const params = new URLSearchParams();
        let found = false;
        for (const field of searchFields) {
            params.set(field, value.toLowerCase());
            try {
                const response = await axios.get(`${API_URL}/product/search?${params.toString()}`);
                const results = response.data;
                if (results.length > 0) {
                    navigate(`/search?${params.toString()}`);
                    found = true;
                    break;
                }
            } catch (error) {
                console.error(`Error searching by ${field}:`, error);
            }
            params.delete(field);
        }


        if (!found && !isNaN(value)) {
            for (const field of priceFields) {
                params.set(field, Number(value));

                try {
                    const response = await axios.get(`${API_URL}/item/search?${params.toString()}`);
                    const results = response.data;

                    if (results.length > 0) {
                        navigate(`/search?${params.toString()}`);
                        break;
                    }
                } catch (error) {
                    console.error(`Error searching by ${field}:`, error);
                }
                params.delete(field);
            }
        }
    }, 500), []);

    const toggleDrawer = (newOpen) => () => {
        setDrawerOpen(newOpen);
    };
    //Dropdown
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleLogOut = () => {
        logout();
        navigate('/login');
    }
    const handleProfile = () => {
        handleMenuClose();
        navigate("/profile-page");
    }
    const handleOrder = () => {
        navigate("/order-page");
        handleMenuClose();
    }

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <List className="List smallScreen">
                {!isAuthenticated && location.pathname !== "/login" &&
                    <ListItem onClick={() => navigate("/login")} >
                        <ListItemIcon>
                            <LoginIcon sx={{ color: 'black' }} />
                        </ListItemIcon>
                        <ListItemText primary="Login" />
                    </ListItem>
                }
                <ListItem onClick={() => navigate("/order-page")}>
                    <ListItemIcon >
                        <StickyNote2OutlinedIcon sx={{ color: 'black' }} />
                    </ListItemIcon>
                    <ListItemText primary="Orders" />
                </ListItem>
                <ListItem onClick={() => navigate("/profile-page")}>
                    <ListItemIcon >
                        <PersonOutlineOutlinedIcon sx={{ color: 'black' }} />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                </ListItem>
                <ListItem onClick={() => navigate("/wishlist")}>
                    <ListItemIcon >
                        <FavoriteBorderIcon sx={{ color: 'black' }} />
                    </ListItemIcon>
                    <ListItemText primary="Wishlist" />
                </ListItem>
                <ListItem onClick={() => navigate("/bag")}>
                    <ListItemIcon >
                        <ShoppingBagOutlinedIcon sx={{ color: 'black' }} />
                    </ListItemIcon>
                    <ListItemText primary="Bag" />
                </ListItem>
                {isAuthenticated &&
                    <ListItem onClick={handleLogOut}>
                        <ListItemIcon >
                            <LogoutIcon sx={{ color: 'black' }} />
                        </ListItemIcon>
                        <ListItemText primary="logout" />
                    </ListItem>
                }
            </List >
        </Box >
    );

    return (
        <nav className="">
            <MenuOutlinedIcon onClick={toggleDrawer(true)} className="menuIcon" />
            <Drawer open={draweropen} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
            <div className="logoContainer" sx={{ display: 'flex' }}>

                <Box component="img" src="/appLogo.png" onClick={() => navigate("/")} sx={{
                    height: { xs: "1.8rem", sm: "2rem", md: "2.2rem", lg: "2.3rem", xl: "2.4rem" },
                    width: { xs: "1.6rem", sm: "1.8rem", md: "2rem", lg: "2.1rem", xl: "2.2rem" },
                }} alt="Logo" />
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }} >
                    <Box component="span" className="logoText" fontWeight={"400"} sx={{ fontSize: { xs: '0rem', sm: '1.2rem', md: '1.25rem', lg: '1.25rem', xl: '1.3rem' }, margin: " 0.5rem" }} >
                        PrimeStore
                    </Box>
                </Link>

            </div>

            <Box
                sx={{
                    width: { xs: '90%', sm: '70%', md: '50%' },
                    mx: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Autocomplete
                    sx={{
                        width: { xs: '90%', sm: '70%', md: '50%' },
                        fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', lg: '1.1rem', xl: '1.2rem' },
                    }}
                    freeSolo
                    options={[]}
                    onChange={(event, value) => handleSearch(value)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="Search for products, brands, and more..."
                            variant="outlined"
                            sx={{
                                height: '40px',
                                '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                    borderRadius: '35px',
                                    backgroundColor: 'white',
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#1d9bff'
                                    },
                                }

                            }}
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <SearchIcon
                                        sx={{
                                            color: '#888',
                                            marginRight: '8px', cursor: "pointer"
                                        }}
                                    />
                                ),
                            }}
                        />
                    )}
                />
            </Box>

            <ul className="List bigScreen">
                <li></li>
                <li>
                    {!isAuthenticated && location.pathname !== "/login" && (
                        <Link to="/login" >
                            <Button variant="contained" size="medium" sx={{
                                color: 'black', boxShadow: "none",
                                backgroundColor: "transparent", "&:hover": {
                                    backgroundColor: "#f3288d", boxShadow: "none"
                                }
                            }}>
                                Login
                            </Button>
                        </Link>
                    )}
                </li>
                <li>
                    <IconButton onClick={handleMenuClick} sx={{ color: 'black' }}>
                        <PersonOutlineOutlinedIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleProfile}>Profile</MenuItem>
                        <MenuItem onClick={handleOrder}>Orders</MenuItem>
                        {isAuthenticated ? <MenuItem onClick={handleLogOut}> Logout </MenuItem> : ""}

                    </Menu>
                </li>
                <li>
                    <IconButton sx={{ color: 'black' }} onClick={() => navigate("/wishlist")}>
                        <FavoriteBorderIcon />
                    </IconButton>
                </li>
                <li>
                    <IconButton sx={{ color: 'black' }} onClick={() => navigate("/bag")}>
                        <ShoppingBagOutlinedIcon />
                    </IconButton>
                </li>
            </ul>
        </nav>
    );
}

export default Header;


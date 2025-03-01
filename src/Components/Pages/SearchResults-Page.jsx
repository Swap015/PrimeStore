import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Grid, Card, CardMedia, CardContent, useMediaQuery, CircularProgress } from "@mui/material";
import FilterBox from "./Products-FilterBox";
import MobileFilterDrawer from "./MobileFilter";
import { toast } from "react-toastify";
import { set } from "mongoose";


const SearchResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filters, setFilters] = useState({
        categories: [],
        brands: [],
        priceRange: [100, 80000],
        rating: 0,
    });
    const [uniqueBrands, setUniqueBrands] = useState([]);
    const [uniqueCategories, setUniqueCategories] = useState([]);
    const isMobile = useMediaQuery('(max-width:600px)');
    // Extract search parameters
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");
    const name = queryParams.get("name");
    const category = queryParams.get("category");
    const minPrice = queryParams.get("minPrice");
    const maxPrice = queryParams.get("maxPrice");
    const brand = queryParams.get("brand");
    const gender = queryParams.get("gender");
    const subcategory = queryParams.get("subcategory");
    const [isLoading, setIsLoading] = useState(true);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/product/search`, {
                    params: {
                        name,
                        category,
                        subcategory,
                        minPrice,
                        maxPrice,
                        brand,
                        gender,
                    },
                });
                setAllProducts(data); // Store all products
                setFilteredProducts(data); // Initially, filtered products are the same as all products

                // Extract unique brands and categories
                const brands = [...new Set(data.map((product) => product.brand))];
                const categories = [...new Set(data.map((product) => product.category))];
                setUniqueBrands(brands);
                setUniqueCategories(categories);

            } catch (error) {
                toast.error("Error fetching search results:", { position: "top-center" });
            }
            finally {
                setIsLoading(false);
            }
        };
        if (name || category || subcategory || minPrice || maxPrice || brand || gender) {
            fetchProducts();
        }
    }, [name, category, subcategory, minPrice, maxPrice, brand, gender]);

    // Apply filters locally whenever filters change
    useEffect(() => {
        const applyFiltersLocally = () => {
            let filtered = allProducts;

            // Filter by categories
            if (filters.categories.length > 0) {
                filtered = filtered.filter((product) =>
                    filters.categories.includes(product.category)
                );
            }
            // Filter by brands
            if (filters.brands.length > 0) {
                filtered = filtered.filter((product) =>
                    filters.brands.includes(product.brand)
                );
            }
            // Filter by price range
            filtered = filtered.filter(
                (product) =>
                    product.price >= filters.priceRange[0] &&
                    product.price <= filters.priceRange[1]
            );

            // Filter by rating
            if (filters.rating > 0) {
                filtered = filtered.filter(
                    (product) => product.rating >= filters.rating
                );
            }

            setFilteredProducts(filtered); // Update filtered products
        };

        applyFiltersLocally();
    }, [filters, allProducts]); // Re-run when filters or allProducts change

    const handleProductClick = (id, category) => {
        navigate(`/productDetails/${id}`);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters); // Update filters state
    };

    const handleClearFilters = () => {
        setFilters({
            categories: [],
            brands: [],
            priceRange: [100, 80000],
            rating: 0,
            gender: '',
        });
    };

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
        <Box sx={{ p: 3, display: "flex" }}>
            <Box sx={{ width: '250px', mr: 3 }}>
                {!isMobile ? (
                    <FilterBox
                        onFilterChange={handleFilterChange}
                        clearFilters={handleClearFilters}
                        categories={uniqueCategories}
                        brands={uniqueBrands}
                    />
                ) : (
                    <MobileFilterDrawer onFilterChange={handleFilterChange} clearFilters={handleClearFilters} categories={uniqueCategories} brands={uniqueBrands} />
                )}
            </Box>
            <Box flexGrow={1}>
                <Typography variant="body1" m={1}>Search Results for "{query || name || category || brand || subcategory || gender}"</Typography>
                {filteredProducts.length === 0 ? (
                    <Typography variant="h6">No products found.</Typography>
                ) : (
                    <Grid container spacing={1} >
                        {filteredProducts.map((product) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={product._id} sx={{ display: "flex", justifyContent: "center", flexGrow: { xs: 1 } }}  >
                                <Card onClick={() => handleProductClick(product._id, product.category)}
                                    sx={{
                                        cursor: "pointer",
                                        height: { xs: "20rem", sm: "20rem", md: "22rem", lg: "20rem", xl: "20rem" },
                                        width: { xs: "13rem", sm: "14rem", md: "13rem", lg: "13rem", xl: "20rem" }
                                    }}
                                >
                                    <CardMedia component="img" image={product.images?.[0] || "/placeholder.jpg"} alt={product.name} sx={{ height: "13rem", width: { xs: "13rem", sm: "13rem", md: "12rem", lg: "13rem", xl: "20rem" }, objectFit: "cover" }} />
                                    <CardContent>
                                        <Typography variant="h6" noWrap>{product.name}</Typography>
                                        <Typography variant="body1" fontWeight={"bold"}>₹{product.price}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {product.brand}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Box>
    );
};

export default SearchResult;

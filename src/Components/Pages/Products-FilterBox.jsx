import React, { useState } from 'react';
import { Box, Typography, Slider, FormGroup, FormControlLabel, Checkbox, Button, Divider, Rating } from '@mui/material';

const FilterBox = ({ onFilterChange, clearFilters, categories, brands }) => {
    const [priceRange, setPriceRange] = useState([100, 80000]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedRating, setSelectedRating] = useState(0);
    const [selectedGender, setSelectedGender] = useState('');

    const handleCategoryChange = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };

    const handleBrandChange = (brand) => {
        setSelectedBrands((prev) =>
            prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
        );
    };
    const handlePriceChange = (event, newValue) => {
        setPriceRange(newValue);
    };
    const handleGenderChange = (gender) => {
        setSelectedGender(gender);
    };

    const applyFilters = () => {
        onFilterChange({
            categories: selectedCategories,
            brands: selectedBrands,
            priceRange,
            rating: selectedRating,
            gender: selectedGender,
        });
    };

    const handleClear = () => {
        setSelectedCategories([]);
        setSelectedBrands([]);
        setPriceRange([100, 80000]);
        setSelectedRating(0);
        setSelectedGender('');
        clearFilters();
    };

    return (
        <Box sx={{ p: 2, width: '12rem', boxShadow: 3, borderRadius: 2, backgroundColor: '#f9f9f9' }}>
            <Typography variant="h6" gutterBottom>🔍 Filters</Typography>
            <Divider sx={{ mb: 2 }} />

            {/* Category Filter */}
            <Typography variant="subtitle1">Category</Typography>
            <FormGroup>
                {categories.map((category) => (
                    <FormControlLabel
                        key={category}
                        control={
                            <Checkbox
                                checked={selectedCategories.includes(category)}
                                onChange={() => handleCategoryChange(category)}
                            />
                        }
                        label={category}
                    />
                ))}
            </FormGroup>

            <Divider sx={{ my: 2 }} />

            {/* Brand Filter */}
            <Typography variant="subtitle1">Brand</Typography>
            <FormGroup>
                {brands.map((brand) => (
                    <FormControlLabel
                        key={brand}
                        control={
                            <Checkbox
                                checked={selectedBrands.includes(brand)}
                                onChange={() => handleBrandChange(brand)}
                            />
                        }
                        label={brand}
                    />
                ))}
            </FormGroup>

            <Divider sx={{ my: 2 }} />

            

            {/* Price Range Filter */}
            <Typography variant="subtitle1">Price Range (₹)</Typography>
            <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={100}
                max={80000}
                sx={{ mt: 1 }}
            />
            <Divider sx={{ my: 2 }} />

            {/* Rating Filter */}
            <Typography variant="subtitle1">Rating</Typography>
            <Rating
                name="rating-filter"
                value={selectedRating}
                onChange={(event, newValue) => setSelectedRating(newValue)}
            />

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="contained" color="primary" onClick={applyFilters}>
                    Apply
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleClear}>
                    Clear
                </Button>
            </Box>
        </Box>
    );
};

export default FilterBox;
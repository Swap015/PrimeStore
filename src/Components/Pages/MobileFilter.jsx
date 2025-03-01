import React, { useState } from 'react';
import { Box, Drawer, IconButton, useMediaQuery, CircularProgress, Tooltip } from '@mui/material';
import FilterBox from './Products-FilterBox';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { keyframes } from '@emotion/react';

// Keyframe for the bounce animation
const bounce = keyframes`
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-5px); }
`;

const MobileFilterDrawer = ({ onFilterChange, clearFilters, categories, brands, isLoading }) => {
    const [open, setOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');

    const toggleDrawer = () => {
        setOpen((prev) => !prev);
    };

    return (
        <>
            {isMobile && (
                <Tooltip title={open ? "Close Filters" : "Open Filters"} placement="right" arrow>
                    <IconButton
                        sx={{
                            position: 'fixed',
                            top: '40%',
                            left: open ? 185 : 0,
                            zIndex: 1300,
                            bgcolor: 'rgba(251, 39, 134, 0.9)',
                            color: 'white',
                            borderRadius: '0 12px 12px 0',
                            transition: 'left 0.3s ease-in-out, background-color 0.3s ease',
                            width: '22px',
                            height: '30px',
                            '&:hover': {
                                bgcolor: 'rgba(255, 0, 115, 0.9)',
                                animation: `${bounce} 0.5s ease`,
                            },
                        }}
                        onClick={toggleDrawer}
                    >
                        {open ? (
                            <CloseIcon sx={{ transition: 'transform 0.3s ease', transform: 'rotate(90deg)' }} />
                        ) : (
                            <FilterListIcon
                                sx={{
                                    transition: 'transform 0.3s ease',
                                    transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
                                }}
                            />
                        )}
                    </IconButton>
                </Tooltip>
            )}

            <Drawer
                anchor="left"
                open={open}
                variant="persistent"
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 190,
                        boxShadow: 3,
                        zIndex: 1200,
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                        transition: 'width 0.3s ease-in-out',
                    },
                }}
            >
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress color="secondary" />
                    </Box>
                ) : (
                    <FilterBox
                        onFilterChange={onFilterChange}
                        clearFilters={clearFilters}
                        categories={categories}
                        brands={brands}
                    />
                )}
            </Drawer>
        </>
    );
};

export default MobileFilterDrawer;
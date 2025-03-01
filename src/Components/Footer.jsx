import React from 'react'
import './css/Footer.css'
import { Box, Divider, Grid, Stack, Typography } from '@mui/material'
import { GrInstagram } from 'react-icons/gr'
import { LuFacebook } from 'react-icons/lu'
import { TbBrandYoutube } from 'react-icons/tb'
import { BsTwitterX } from 'react-icons/bs'

function Footer() {

    return (
        <Box component="footer" sx={{
            position: 'relative',
            bottom: 0,
            left: 0,
            width: '100%',
            background: 'linear-gradient(to bottom, rgb(255, 95, 156), rgb(255, 0, 124))',
            padding: '10px',
            textAlign: 'center',
            boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)', color: 'black'
        }}>

            <Grid container spacing={4} justifyContent="center">

                <Grid item xs={12} sm={4}>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem", lg: "1.25rem", xl: "1.3rem" } }}>About</Typography>
                    <Typography variant="body1" sx={{ fontSize: { xs: "0.9rem", sm: "0.9rem", md: "1rem", lg: "1.1rem", xl: "2rem" } }}>
                        Shop smart, live better. Quality products, unbeatable prices, effortless shopping! 🛍️🛒
                    </Typography>
                </Grid>


                <Grid item xs={12} sm={4}>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem", lg: "1.25rem", xl: "1.3rem" } }}>Categories</Typography>
                    <Typography variant="body1" sx={{ fontSize: { xs: "0.9rem", sm: "0.9rem", md: "1rem", lg: "1.1rem", xl: "2rem" } }}>Mobiles</Typography>
                    <Typography variant="body1" sx={{ fontSize: { xs: "0.9rem", sm: "0.9rem", md: "1rem", lg: "1.1rem", xl: "2rem" } }}>Mens</Typography>
                    <Typography variant="body1" sx={{ fontSize: { xs: "0.9rem", sm: "0.9rem", md: "1rem", lg: "1.1rem", xl: "2rem" } }}>Womens</Typography>
                </Grid>


                <Grid item xs={12} sm={4}>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem", lg: "1.25rem", xl: "2rem" } }}>Contact</Typography>
                    <Typography variant="body1" sx={{ fontSize: { xs: "0.9rem", sm: "0.9rem", md: "1rem", lg: "1.1rem", xl: "2rem" } }} noWrap>Email: swapnilmotghare44@gmail.com</Typography>
                    <Typography variant="body1" sx={{ fontSize: { xs: "0.9rem", sm: "0.9rem", md: "1rem", lg: "1.1rem", xl: "2rem" } }}>Phone: 9623071890</Typography>
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            justifyContent: 'center',
                            marginTop: 2,
                            color: 'black',
                        }}>
                        <LuFacebook size={25} />
                        <GrInstagram size={25} />
                        <TbBrandYoutube size={25} />
                        <BsTwitterX size={25} />
                    </Stack>
                </Grid>
            </Grid>



            <Divider sx={{ backgroundColor: 'white', height: 1, my: 2, borderColor: 'white' }} variant="middle" />

            <Typography >
                &copy;2024 <span className='FooterlogoText'> PrimeStore </span> - All rights reserved
            </Typography >
        </Box >
    )
}

export default Footer
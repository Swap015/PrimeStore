import { Box, useMediaQuery } from '@mui/material'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import MensCards from './Cards/mensClothing.jsx';
import KidsCards from './Cards/kidsClothing.jsx';
import WomensCards from './Cards/womensClothing.jsx';
import MensSwiper from './Home-Swipers/Men-swiper.jsx';
import CameraSwiper from './Home-Swipers/Camera-swiper.jsx';

function Home() {
    const isMobile = useMediaQuery('(max-width:600px)');
    const featuredProducts = [

        { id: 1, image: 'slide3.jpg' },
        { id: 2, image: 'slide4.jpg' },
        { id: 3, image: 'slide5.jpg' },
        { id: 4, image: 'slide6.jpg' }
    ];

    return (
        <Box sx={{ paddingX:"0.7rem" }}>
            <Swiper
                navigation={!isMobile ? true : false}
                loop={true}
                spaceBetween={30}
                grabCursor={true}
                autoplay={{ delay: 3000 }}
                modules={[Autoplay, Navigation]}
                className="mySwiper "
                breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 1 },
                    1024: { slidesPerView: 1 },
                }}
                style={{
                    padding: '10px 0',
                }} >
                {featuredProducts.map((product) => (
                    <SwiperSlide key={product.id}>
                        <Box style={{ padding: '0.4rem', border: '1px solid #ccc', borderRadius: '8px' }}>
                            <Box component="img"
                                src={product.image} alt='product'
                                sx={{ width:  "100%" , height: { xs: "7rem", sm: "9rem", md: "12rem", lg: "15rem", xl: "16.7rem" }, objectFit: 'cover', borderRadius: '5px' }} />
                        </Box>
                    </SwiperSlide>
                ))}
            </Swiper>

            <MensSwiper />
            <WomensCards />
            <CameraSwiper />
            <KidsCards />
            <MensCards />

        </Box>
    )
}
export default Home


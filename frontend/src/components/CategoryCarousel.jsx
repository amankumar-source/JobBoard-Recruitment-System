
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';
import { motion } from 'framer-motion';

const category = [
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "FullStack Developer",
    "UI/UX Designer",
    "DevOps Engineer",
    "Mobile Developer"
];

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    };

    return (
        <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
                {/* Section Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
                        Browse by <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500">Category</span>
                    </h2>
                    <p className="text-xl text-gray-600 font-medium">
                        Find your perfect role in seconds
                    </p>
                </motion.div>

                {/* Premium Carousel */}
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full max-w-6xl mx-auto"
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {category.map((cat, index) => (
                            <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/4">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    viewport={{ once: true }}
                                >
                                    <Button
                                        onClick={() => searchJobHandler(cat)}
                                        className="w-full h-20 text-lg font-bold rounded-2xl border-2 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105
                                            bg-white border-purple-200 text-purple-700
                                            hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white hover:border-transparent"
                                    >
                                        {cat}
                                    </Button>
                                </motion.div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Custom Styled Arrows */}
                    <CarouselPrevious className="left-4 w-14 h-14 bg-white/80 backdrop-blur-sm border-2 border-purple-200 text-purple-700 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white shadow-xl" />
                    <CarouselNext className="right-4 w-14 h-14 bg-white/80 backdrop-blur-sm border-2 border-purple-200 text-purple-700 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white shadow-xl" />
                </Carousel>
            </div>
        </section>
    );
};

export default CategoryCarousel;




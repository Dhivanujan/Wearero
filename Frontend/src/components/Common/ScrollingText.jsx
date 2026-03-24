import React from 'react';
import { motion } from 'framer-motion';

const ScrollingText = () => {
    // Array of text to display in the marquee
    const texts = [
        "Free Shipping Over $100",
        "New Arrivals Daily",
        "Premium Quality Fabrics",
        "Sustainable Fashion",
        "Shop The Latest Trends",
        "Hassle-Free Returns",
        "Exclusive Online Deals"
    ];

    // Duplicate the array to ensure seamless looping
    const scrollingText = [...texts, ...texts, ...texts];

    return (
        <div className="bg-black dark:bg-white text-white dark:text-black py-4 overflow-hidden border-y border-white/10 dark:border-black/10">
            <motion.div
                className="flex whitespace-nowrap"
                animate={{ x: ["0%", "-100%"] }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 20, // Adjust speed here
                }}
            >
                {scrollingText.map((text, index) => (
                    <div key={index} className="flex items-center mx-8">
                        <span className="text-sm font-bold uppercase tracking-widest">{text}</span>
                        <span className="mx-8 text-white/30 dark:text-black/30">•</span> 
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default ScrollingText;
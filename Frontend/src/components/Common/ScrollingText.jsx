import React from 'react';

const ScrollingText = () => {
    const texts = [
        "Free Shipping Over $100",
        "New Arrivals Daily",
        "Premium Quality Fabrics",
        "Sustainable Fashion",
        "Shop The Latest Trends",
        "Hassle-Free Returns",
        "Exclusive Online Deals"
    ];

    // Render enough duplicates for seamless infinite scroll
    const renderItems = () =>
        texts.map((text, index) => (
            <div key={index} className="flex items-center shrink-0 mx-6 md:mx-8">
                <span className="text-xs md:text-sm font-bold uppercase tracking-widest whitespace-nowrap">{text}</span>
                <span className="mx-6 md:mx-8 text-white/30 dark:text-black/30">•</span>
            </div>
        ));

    return (
        <div className="bg-black dark:bg-white text-white dark:text-black py-3 md:py-4 overflow-hidden border-y border-white/10 dark:border-black/10">
            <div className="flex animate-marquee">
                <div className="flex shrink-0">{renderItems()}</div>
                <div className="flex shrink-0">{renderItems()}</div>
                <div className="flex shrink-0">{renderItems()}</div>
            </div>
        </div>
    );
};

export default ScrollingText;
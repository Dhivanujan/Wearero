import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Newsletter = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically integrate with your backend or newsletter service
        toast.success("Thanks for subscribing! You'll hear from us soon.");
        setEmail('');
    };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-accent/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-56 md:w-80 h-56 md:h-80 bg-rabbit-red/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="max-w-2xl mx-auto"
        >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 font-heading tracking-tight text-gray-900 dark:text-white">
            Subscribe to our Newsletter
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6 md:mb-8 leading-relaxed">
            Get the latest updates on new products and upcoming sales directly in your inbox.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-stretch sm:items-center w-full max-w-lg mx-auto">
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address" 
                    className="w-full flex-1 px-5 md:px-6 py-3 md:py-4 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent transition-all shadow-sm text-sm md:text-base"
                    required
                />
                <button 
                    type="submit" 
                    className="px-6 md:px-8 py-3 md:py-4 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-300 text-sm md:text-base whitespace-nowrap"
                >
                    Subscribe
                </button>
            </form>
            <p className="mt-3 md:mt-4 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                We respect your privacy. Unsubscribe at any time.
            </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;

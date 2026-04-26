import React from "react";
import heroImg from "../../assets/rabbit-hero.jpg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden text-white">
      
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Fashion Collection"
          className="w-full h-full object-cover object-center scale-110 animate-[subtleZoom_25s_ease-in-out_infinite_alternate]"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Radial Depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0)_0%,rgba(0,0,0,0.6)_100%)]" />

        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('/noise.png')]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 min-h-screen flex flex-col justify-center items-center text-center">
        
        {/* Category Tag */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 text-xs tracking-[0.3em] uppercase text-gray-300"
        >
          Men • Women • Unisex
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1 }}
          className="text-5xl sm:text-6xl md:text-8xl font-extrabold leading-[0.9] tracking-tight max-w-5xl"
        >
          Wear Your <br />
          <span className="bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
            Escape
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-6 max-w-xl text-gray-300 text-base md:text-lg leading-relaxed"
        >
          Designed for every body. Discover premium essentials crafted for movement,
          comfort, and effortless style.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row gap-5"
        >
          <Link
            to="/collections/all"
            className="group relative inline-flex items-center justify-center h-14 px-8 rounded-full bg-white text-black font-semibold transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-xl hover:shadow-white/20"
          >
            Explore Collection
            <span className="ml-2 transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>

          <Link
            to="/collections/all?category=Top Wear"
            className="inline-flex items-center justify-center h-14 px-8 rounded-full border border-white/30 bg-white/5 backdrop-blur-md text-white font-semibold transition-all duration-300 hover:bg-white/10 hover:border-white/60 hover:scale-105"
          >
            Discover Drop
          </Link>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-14 text-sm text-gray-400"
        >
          ⭐ Rated 4.9 by 12,000+ customers worldwide
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs tracking-widest text-white/40 uppercase">
          Scroll
        </span>

        <div className="w-[28px] h-[45px] border border-white/30 rounded-full flex justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-white rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
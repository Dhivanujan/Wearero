import React, { useEffect, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../../lib/api'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

const NewArrivals = () => {
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Drag states
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/new-arrivals`);
        const data = await response.json();
        if (response.ok) {
          setNewArrivals(data);
        } else {
          toast.error(data.message || 'Unable to load new arrivals');
        }
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
        toast.error('Something went wrong while loading new arrivals');
      }
    };

    fetchNewArrivals();
  }, []);

  // Drag Handlers
  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = x - startX
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUpOrLeave = () => {
    setIsDragging(false)
  }

  // Scroll button click
  const scroll = (direction) => {
    const scrollAmount = direction === 'left' ? -300 : 300
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  // Enable/disable buttons based on scroll position
  const updateScrollButtons = () => {
    const container = scrollRef.current
    if (container) {
      const leftScroll = container.scrollLeft
      const rightScrollable = container.scrollWidth > leftScroll + container.clientWidth
      setCanScrollLeft(leftScroll > 0)
      setCanScrollRight(rightScrollable)
    }
  }

  useEffect(() => {
    const container = scrollRef.current
    if (container) {
      container.addEventListener('scroll', updateScrollButtons)
      updateScrollButtons()
      return () => container.removeEventListener("scroll", updateScrollButtons)
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', updateScrollButtons)
      }
    }
  }, [])

  return (
    <section className='py-16 px-4 lg:px-0'>
      <div className='container mx-auto text-center mb-10 relative'>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='text-3xl font-bold mb-4'
        >
          Explore New Arrivals
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='text-lg text-gray-600 mb-8'
        >
          Elevate your wardrobe with the newest arrivals — curated for those who live on the cutting edge of fashion.
        </motion.p>
      </div>

      {/* Scrollable content */}
      <div className='container mx-auto relative'>
        <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className={`container mx-auto overflow-x-scroll flex space-x-6 relative ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
            } scrollbar-hide`}
        >
            {newArrivals.map((product) => (
            <div
                key={product._id}
                className='min-w-[100%] sm:min-w-[50%] md:min-w-[30%] lg:min-w-[25%] relative'
            >
                <img
                src={product.images[0]?.url?.startsWith('http') ? product.images[0]?.url : `${API_BASE_URL}${product.images[0]?.url}`}
                alt={product.images[0]?.altText || product.name}
                className='w-full h-[500px] object-cover rounded-lg'
                draggable="false"
                />
                <div className='absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md text-white p-4 rounded-b-lg'>
                <Link to={`/product/${product._id}`} className='block'>
                    <h4 className='font-medium'>{product.name}</h4>
                    <p className='mt-1'>${product.price}</p>
                </Link>
                </div>
            </div>
            ))}
        </div>

         {/* Scroll buttons */}
         <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`absolute top-1/2 left-0 transform -translate-y-1/2 p-2 rounded-full border bg-white text-black shadow-lg z-10 hover:bg-gray-100 transition-all duration-300 ${
              canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <FiChevronLeft className='text-2xl' />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`absolute top-1/2 right-0 transform -translate-y-1/2 p-2 rounded-full border bg-white text-black shadow-lg z-10 hover:bg-gray-100 transition-all duration-300 ${
              canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <FiChevronRight className='text-2xl' />
          </button>
      </div>
    </section>
  )
}

export default NewArrivals

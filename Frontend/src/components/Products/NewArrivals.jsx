import React, { useEffect, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../../lib/api'
import { toast } from 'sonner'

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
        <h2 className='text-3xl font-bold mb-4'>Explore New Arrivals</h2>
        <p className='text-lg text-gray-600 mb-8'>
          Elevate your wardrobe with the newest arrivals — curated for those who live on the cutting edge of fashion.
        </p>

        {/* Scroll buttons */}
        <div className='absolute right-0 bottom-[-30px] flex space-x-2'>
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 rounded border ${
              canScrollLeft
                ? 'bg-white text-black hover:bg-gray-100'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <FiChevronLeft className='text-2xl' />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-2 rounded border ${
              canScrollRight
                ? 'bg-white text-black hover:bg-gray-100'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <FiChevronRight className='text-2xl' />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`container mx-auto overflow-x-scroll flex space-x-6 relative ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } hide-scrollbar`}
      >
        {newArrivals.map((product) => (
          <div
            key={product._id}
            className='min-w-[90%] sm:min-w-[45%] md:min-w-[33%] lg:min-w-[25%] xl:min-w-[20%] relative'
          >
            <img
              src={product.images[0]?.url}
              alt={product.images[0]?.altText || product.name}
              className='w-full h-[400px] md:h-[500px] object-cover rounded-lg'
              draggable="false"
            />
            <div className='absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm text-white p-4 rounded-b-lg'>
              <Link to={`/product/${product._id}`}>
                <h4 className='font-medium'>{product.name}</h4>
                <p className='mt-1'>${product.price}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default NewArrivals

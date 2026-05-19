import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { API_BASE_URL, resolveImageUrl } from "../../lib/api";
import { motion } from "framer-motion";

const SkeletonCard = () => (
  <div className="min-w-[260px] sm:min-w-[300px] snap-center flex-shrink-0 animate-pulse">
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 h-full">
      <div className="aspect-[4/5] bg-gray-200 dark:bg-gray-800" />
      <div className="p-4 md:p-5 space-y-3">
        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-16" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/5" />
      </div>
    </div>
  </div>
);

const NewArrivals = () => {
  const scrollRef = useRef(null);

  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // FETCH DATA
  useEffect(() => {
    const controller = new AbortController();

    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${API_BASE_URL}/api/products/new-arrivals`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("Failed to fetch new arrivals");

        const data = await res.json();
        setNewArrivals(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError("Unable to load new arrivals.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();

    return () => controller.abort();
  }, []);

  // SCROLL
  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;

    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  }, []);

  const handleScroll = useCallback((direction) => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction === "left" ? -350 : 350,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollButtons();

    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [updateScrollButtons, newArrivals.length]);

  const skeletons = useMemo(
    () => Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />),
    []
  );

  return (
    <section className="py-16 md:py-24 px-4 lg:px-8 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
      
      {/* HEADER */}
      <div className="container mx-auto text-center mb-10 md:mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 dark:text-white"
        >
          Fresh Drops
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-base md:text-lg text-gray-500 dark:text-gray-400 mt-3"
        >
          Be the first to wear our latest releases.
        </motion.p>
      </div>

      {/* CONTENT */}
      <div className="relative container mx-auto">

        {/* LEFT BUTTON */}
        <button
          onClick={() => handleScroll("left")}
          disabled={!canScrollLeft}
          className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white dark:bg-gray-800 shadow-xl disabled:opacity-0 disabled:pointer-events-none"
        >
          <FiChevronLeft className="text-2xl" />
        </button>

        {/* RIGHT BUTTON */}
        <button
          onClick={() => handleScroll("right")}
          disabled={!canScrollRight}
          className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white dark:bg-gray-800 shadow-xl disabled:opacity-0 disabled:pointer-events-none"
        >
          <FiChevronRight className="text-2xl" />
        </button>

        {/* SCROLL AREA */}
        <div
          ref={scrollRef}
          className="flex space-x-4 md:space-x-6 overflow-x-auto pb-8 pt-4 px-2 md:px-6 scrollbar-hide snap-x snap-mandatory scroll-smooth"
        >
          {loading ? (
            skeletons
          ) : error ? (
            <div className="w-full text-center text-red-500 py-10">
              {error}
            </div>
          ) : newArrivals.length === 0 ? (
            <div className="w-full text-center text-gray-500 py-10">
              No new arrivals found.
            </div>
          ) : (
            newArrivals.map((product) => {
              const imageUrl = resolveImageUrl(product.images?.[0]?.url);

              return (
                <div
                  key={product._id}
                  className="min-w-[260px] sm:min-w-[300px] snap-center flex-shrink-0"
                >
                  <Link
                    to={`/product/${product._id}`}
                    className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 transition-all hover:shadow-xl hover:-translate-y-1 duration-300 h-full flex flex-col group"
                  >

                    {/* IMAGE (FIXED UNIFORM SIZE) */}
                    <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="p-4 md:p-5 flex flex-col flex-1">
                      <div className="flex justify-between gap-2 mb-2">
                        <h4 className="font-bold text-base md:text-lg text-gray-900 dark:text-white line-clamp-2 h-[48px] overflow-hidden">
                          {product.name}
                        </h4>

                        <span className="font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                          ${product.price}
                        </span>
                      </div>

                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-3 h-[60px] overflow-hidden mb-4">
                        {product.description}
                      </p>

                      <div className="mt-auto">
                        <span className="text-xs md:text-sm font-medium text-accent dark:text-accent-light">
                          View Details →
                        </span>
                      </div>
                    </div>

                  </Link>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
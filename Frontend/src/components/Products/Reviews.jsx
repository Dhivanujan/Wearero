import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../lib/api";

const Reviews = ({ productId, reviews = [] }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, token } = useAuth();

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment) {
      toast.error("Please provide both rating and comment");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/products/${productId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating, comment }),
        }
      );

      if (response.ok) {
        toast.success("Review added successfully!");
        setRating(0);
        setComment("");
        window.location.reload(); // Simple reload to refresh reviews
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to add review");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16">
      <h3 className="text-3xl font-bold mb-10 text-gray-900 dark:text-white">
        Customer Reviews ({reviews.length})
      </h3>

      {/* List of Reviews */}
      <div className="space-y-8 mb-12">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div
              key={index}
              className="border-b border-gray-200 dark:border-gray-700 pb-8 last:border-b-0"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-900 dark:text-white font-bold text-lg mr-4">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-gray-900 dark:text-white">
                      {review.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Verified Buyer
                    </p>
                  </div>
                </div>
                <div className="flex text-yellow-400 text-lg">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      {i < review.rating ? (
                        <i className="ri-star-fill"></i>
                      ) : (
                        <i className="ri-star-line text-gray-300 dark:text-gray-600"></i>
                      )}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic">
            No reviews yet. Be the first to review!
          </p>
        )}
      </div>

      {/* Add Review Form */}
      {token ? (
        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-sm">
          <h4 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Write a Review
          </h4>
          <form onSubmit={handleReviewSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rating
              </label>
              <div className="flex text-yellow-400 text-3xl cursor-pointer gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} onClick={() => setRating(star)} className="hover:scale-110 transition-transform">
                    {star <= rating ? (
                      <i className="ri-star-fill"></i>
                    ) : (
                      <i className="ri-star-line text-gray-300 dark:text-gray-600"></i>
                    )}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Review
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                rows="4"
                placeholder="Share your thoughts about the product..."
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black dark:bg-white text-white dark:text-black py-3 px-8 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">
            Please log in to write a review.
          </p>
          <a
            href="/login"
            className="inline-block bg-black dark:bg-white text-white dark:text-black py-3 px-8 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Login
          </a>
        </div>
      )}
    </div>
  );
};

export default Reviews;

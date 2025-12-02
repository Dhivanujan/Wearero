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
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Reviews ({reviews.length})
      </h3>

      {/* List of Reviews */}
      <div className="space-y-6 mb-10">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {review.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {/* Assuming review has createdAt, if not, just hide date */}
                      {/* {new Date(review.createdAt).toLocaleDateString()} */}
                    </p>
                  </div>
                </div>
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      {i < review.rating ? (
                        <i className="ri-star-fill"></i>
                      ) : (
                        <i className="ri-star-line"></i>
                      )}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {review.comment}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No reviews yet. Be the first to review!
          </p>
        )}
      </div>

      {/* Add Review Form */}
      {token ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Write a Review
          </h4>
          <form onSubmit={handleReviewSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rating
              </label>
              <div className="flex text-yellow-500 text-2xl cursor-pointer">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} onClick={() => setRating(star)}>
                    {star <= rating ? (
                      <i className="ri-star-fill"></i>
                    ) : (
                      <i className="ri-star-line"></i>
                    )}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Please log in to write a review.
          </p>
          <a
            href="/login"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Login
          </a>
        </div>
      )}
    </div>
  );
};

export default Reviews;

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../lib/api';
import ProductGrid from '../components/Products/ProductGrid';
import { toast } from 'sonner';

const WishlistPage = () => {
  const { token } = useAuth();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/wishlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setWishlistProducts(data);
        } else {
          toast.error(data.message || 'Failed to fetch wishlist');
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        toast.error('Error fetching wishlist');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchWishlist();
    } else {
        setLoading(false);
    }
  }, [token]);

  if (loading) {
    return <div className="text-center py-10 text-black dark:text-white">Loading wishlist...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-black dark:text-white font-heading">My Wishlist</h1>
      {wishlistProducts.length > 0 ? (
        <ProductGrid products={wishlistProducts} />
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400 text-lg">Your wishlist is empty.</p>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;

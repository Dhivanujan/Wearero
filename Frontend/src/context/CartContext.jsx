import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { API_BASE_URL } from '../lib/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const defaultCart = { products: [], totalPrice: 0, guestId: null };

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(defaultCart);
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        const guestId = localStorage.getItem('guestId');
        let url = `${API_BASE_URL}/api/cart`;

        if (userId) {
            url += `?userId=${userId}`;
        } else if (guestId) {
            url += `?guestId=${guestId}`;
        } else {
            setCart({ ...defaultCart });
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(url);
            if (response.status === 404) {
                setCart({ ...defaultCart });
                return;
            }

            if (response.ok) {
                const data = await response.json();
                if (data?.guestId) {
                    localStorage.setItem('guestId', data.guestId);
                }
                setCart({
                    products: data.products || [],
                    totalPrice: data.totalPrice || 0,
                    guestId: data.guestId || null,
                });
            } else {
                setCart({ ...defaultCart });
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity, size, color) => {
        const userId = localStorage.getItem('userId');
        let guestId = localStorage.getItem('guestId');

        if (!userId && !guestId) {
            guestId = `guest_${new Date().getTime()}`;
            localStorage.setItem('guestId', guestId);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/cart`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity, size, color, userId, guestId })
            });
            if (response.ok) {
                const data = await response.json();
                if (data?.guestId) {
                    localStorage.setItem('guestId', data.guestId);
                }
                fetchCart();
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    const updateQuantity = async (productId, size, color, newQuantity) => {
        const userId = localStorage.getItem('userId');
        const guestId = localStorage.getItem('guestId');

        try {
            const response = await fetch(`${API_BASE_URL}/api/cart`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, size, color, quantity: newQuantity, userId, guestId })
            });
            if (response.ok) {
                fetchCart();
            }
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };

    const removeFromCart = async (productId, size, color) => {
        const userId = localStorage.getItem('userId');
        const guestId = localStorage.getItem('guestId');

        try {
            const response = await fetch(`${API_BASE_URL}/api/cart`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, size, color, userId, guestId })
            });
            if (response.ok) {
                fetchCart();
            }
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const mergeCart = async () => {
        const guestId = localStorage.getItem('guestId');
        const token = localStorage.getItem('token');
        if (guestId && token) {
             try {
                await fetch(`${API_BASE_URL}/api/cart/merge`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ guestId }),
                });
                localStorage.removeItem('guestId');
                fetchCart();
            } catch (error) {
                console.error("Error merging cart:", error);
            }
        }
    }

    useEffect(() => {
        fetchCart();
    }, []);

    const clearCart = () => {
        setCart({ ...defaultCart });
        localStorage.removeItem('guestId');
    };

    const cartCount = useMemo(() => {
        return cart?.products?.reduce((acc, item) => acc + item.quantity, 0) || 0;
    }, [cart]);

    return (
        <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, updateQuantity, removeFromCart, mergeCart, cartCount, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

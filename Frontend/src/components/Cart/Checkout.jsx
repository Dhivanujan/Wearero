import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
// import StripeButton from './StripeButton';

const Checkout = () => {
  const navigate = useNavigate();
  const [checkoutId, setCheckoutId] = useState(null)
  const [cart, setCart] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: ""
  });

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const guestId = localStorage.getItem('guestId');

      let url = 'http://localhost:3000/api/cart';
      if (userId) {
        url += `?userId=${userId}`;
      } else if (guestId) {
        url += `?guestId=${guestId}`;
      } else {
        return; // No user or guest
      }

      try {
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
          setCart(data);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart();
  }, []);

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/login');
        return;
    }

    if (!cart || !cart.products || cart.products.length === 0) {
        alert("Your cart is empty");
        return;
    }

    const orderData = {
        orderItems: cart.products,
        shippingAddress: {
            address: shippingAddress.address,
            city: shippingAddress.city,
            postalCode: shippingAddress.postalCode,
            country: shippingAddress.country,
            phone: shippingAddress.phone,
        },
        paymentMethod: "COD", // Default for now
        totalPrice: cart.totalPrice,
    };

    try {
        const response = await fetch('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData),
        });

        const data = await response.json();
        if (response.ok) {
            setCheckoutId(data._id);
            navigate(`/order-confirmation`); // Or navigate to order details
        } else {
            alert(data.message || "Failed to place order");
        }
    } catch (error) {
        console.error("Error placing order:", error);
    }
  }


const handlePaymentSuccess =  (details) => {
    console.log("Payment Successful", details);
    navigate("/order-confirmation")
    
}
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter'>
      {/* Left section */}
      <div className='bg-white rounded-lg p-6'>
        <h2 className='text-2xl uppercase mb-6'>Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          <h3 className='text-lg mb-4'>Contact Details</h3>
          <div className='mb-4'>
            <label className='block text-gray-700'>Email</label>
            <input
              type="email"
              value='user@example.com'
              className='w-full p-2 border rounded'
              disabled
            />
          </div>

          <h3 className='text-lg mb-4'>Delivery</h3>
          <div className='mb-4 grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-gray-700'>First Name</label>
              <input
                type="text"
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, firstName: e.target.value })
                }
                className='w-full p-2 border rounded'
                required
              />
            </div>
            <div>
              <label className='block text-gray-700'>Last Name</label>
              <input
                type="text"
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, lastName: e.target.value })
                }
                className='w-full p-2 border rounded'
                required
              />
            </div>
          </div>
          <div className="mb-4 ">
            <label className='block text-gray-700'>Address</label>
            <input type="text"
            value={shippingAddress.address}
            onChange={(e) => setShippingAddress({
                ...shippingAddress,
                address: e.target.value
            })} className='w-full p-2 border rounded' required/>
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className='block text-gray-700'>City</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, city: e.target.value })
                }
                className='w-full p-2 border rounded'
                required
              />
            </div>
            <div>
              <label className='block text-gray-700'>Postal Code</label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                }
                className='w-full p-2 border rounded'
                required
              />
            </div>
          </div>
          <div className="mb-4 ">
            <label className='block text-gray-700'>Country</label>
            <input type="text"
            value={shippingAddress.country}
            onChange={(e) => setShippingAddress({
                ...shippingAddress,
                country: e.target.value
            })} className='w-full p-2 border rounded' required/>
          </div>
          <div className="mb-4 ">
            <label className='block text-gray-700'>Phone</label>
            <input type="tel"
            value={shippingAddress.phone}
            onChange={(e) => setShippingAddress({
                ...shippingAddress,
                phone: e.target.value
            })} className='w-full p-2 border rounded' required/>
          </div>
          <div className="mt-6">
            {!checkoutId ? (
                <button type="submit" className='w-full bg-black text-white py-3 rounded'>Continue to Payment</button>
            ) : (
                <div>
                    <h3 className='text-lg mb-4'>Pay with Stripe</h3>
                    {/* <StripeButton amount={100} onSuccess={handlePaymentSuccess} onError={(err) => alert("Payment failed. Try again")}/> */}
                </div>
            )}
          </div>
        </form>
      </div>
      {/* {Right Section} */}
      <div className='bg-gray-50 p-6 rounded-lg '>
        <h3 className='text-lg mb-4'>Order Summary</h3>
        <div className="border-t py-4 mb-4">
          {cart.products.map((product, index) => (
            <div key={index} className='flex items-start justify-between py-2 border-b'>
              <div className="flex items-start">
                <img 
                src={product.image} 
                alt={product.name} 
                className='w-20 h-24 object-cover mr-4' />
                <div>
                  <h3 className='text-md'>{product.name}</h3>
                  <p className='text-gray-500'>Size: {product.size}</p>
                  <p className='text-gray-500'>Color: {product.color}</p>
                </div>
              </div>
              <p className='text-xl'>${product.price?.toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className='flex justify-between items-centertext-lg mb-4'>
          <p>Subtotal</p>
          <p>${cart.totalPrice?.toLocaleString()}</p>
        </div>
        <div className="flex justify-between items-center text-lg">
          <p>Shipping</p>
          <p>Free</p>
        </div>
        <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
          <p>Total</p>
          <p>${cart.totalPrice?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}

export default Checkout;

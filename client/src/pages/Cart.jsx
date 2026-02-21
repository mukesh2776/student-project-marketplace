import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { promoCodesAPI } from '../services/api';
import Button from '../components/Button';
import { HiTrash, HiShoppingCart, HiArrowRight, HiX } from 'react-icons/hi';

const Cart = () => {
    const navigate = useNavigate();
    const { items, removeFromCart, clearCart, getTotal, getCommission } = useCart();
    const { isAuthenticated } = useAuth();

    // Promo code states
    const [promoCode, setPromoCode] = useState('');
    const [promoLoading, setPromoLoading] = useState(false);
    const [promoError, setPromoError] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null); // { discountType, discountValue, applicableProjectIds }
    const [discountAmount, setDiscountAmount] = useState(0);

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) {
            setPromoError('Please enter a promo code');
            return;
        }

        setPromoLoading(true);
        setPromoError('');

        try {
            const res = await promoCodesAPI.validate({
                code: promoCode.trim(),
                projectIds: items.map(i => i._id)
            });

            const { discountType, discountValue, applicableProjectIds } = res.data;

            // Calculate discount amount
            const applicableTotal = items
                .filter(item => applicableProjectIds.includes(item._id))
                .reduce((sum, item) => sum + item.price, 0);

            let discount = 0;
            if (discountType === 'percentage') {
                discount = (applicableTotal * discountValue) / 100;
            } else {
                discount = Math.min(discountValue, applicableTotal);
            }

            setDiscountAmount(Math.round(discount));
            setAppliedPromo({ discountType, discountValue, applicableProjectIds });
        } catch (error) {
            setPromoError(error.response?.data?.message || 'Invalid promo code');
            setAppliedPromo(null);
            setDiscountAmount(0);
        } finally {
            setPromoLoading(false);
        }
    };

    const handleRemovePromo = () => {
        setAppliedPromo(null);
        setDiscountAmount(0);
        setPromoCode('');
        setPromoError('');
    };

    const handleCheckout = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        // In real app, redirect to payment gateway
        alert('Payment integration coming soon!');
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary-500/20 flex items-center justify-center">
                        <HiShoppingCart className="w-12 h-12 text-primary-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-6">Browse our projects and add some to your cart</p>
                    <Link to="/projects">
                        <Button rightIcon={<HiArrowRight className="w-5 h-5" />}>
                            Browse Projects
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const total = getTotal();
    const commission = getCommission();
    const grandTotal = total - discountAmount;

    return (
        <div className="min-h-screen py-8 bg-gray-100">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-gray-500">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div key={item._id} className="flex flex-col sm:flex-row items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <img
                                    src={item.thumbnail || 'https://via.placeholder.com/120'}
                                    alt={item.title}
                                    className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <Link to={`/projects/${item._id}`}>
                                        <h3 className="text-gray-900 font-medium hover:text-primary-600 transition-colors">
                                            {item.title}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                                        {item.shortDescription || item.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {item.techStack?.slice(0, 3).map((tech, index) => (
                                            <span key={index} className="tag text-xs">{tech}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-xl font-bold text-gray-900">₹{item.price?.toLocaleString()}</p>
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="mt-2 text-red-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        <HiTrash className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={clearCart}
                            className="w-full text-center text-gray-500 hover:text-red-500 text-sm transition-colors"
                        >
                            Clear all items
                        </button>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-500">
                                    <span>Subtotal ({items.length} items)</span>
                                    <span>₹{total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Platform Fee (10%)</span>
                                    <span>₹{commission.toLocaleString()}</span>
                                </div>

                                {/* Discount line */}
                                {appliedPromo && discountAmount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span className="flex items-center gap-1">
                                            Discount
                                            <span className="text-xs bg-green-100 px-2 py-0.5 rounded-full text-green-700">
                                                {appliedPromo.discountType === 'percentage'
                                                    ? `${appliedPromo.discountValue}% OFF`
                                                    : `₹${appliedPromo.discountValue} OFF`}
                                            </span>
                                        </span>
                                        <span>-₹{discountAmount.toLocaleString()}</span>
                                    </div>
                                )}

                                <div className="border-t border-gray-200 pt-4 flex justify-between">
                                    <span className="text-gray-900 font-bold text-lg">Total</span>
                                    <span className="text-2xl font-bold text-primary-600">
                                        ₹{grandTotal.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Promo Code */}
                            <div className="mb-6">
                                {appliedPromo ? (
                                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                                        <div>
                                            <p className="text-green-600 font-medium text-sm">✓ Promo applied</p>
                                            <p className="text-green-700 font-mono font-bold">{promoCode.toUpperCase()}</p>
                                        </div>
                                        <button
                                            onClick={handleRemovePromo}
                                            className="text-red-400 hover:text-red-500 text-sm p-1 rounded transition-colors"
                                        >
                                            <HiX className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Promo code"
                                                value={promoCode}
                                                onChange={(e) => {
                                                    setPromoCode(e.target.value);
                                                    setPromoError('');
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleApplyPromo();
                                                    }
                                                }}
                                                className="input-field flex-1"
                                            />
                                            <Button
                                                variant="secondary"
                                                size="md"
                                                onClick={handleApplyPromo}
                                                loading={promoLoading}
                                            >
                                                Apply
                                            </Button>
                                        </div>
                                        {promoError && (
                                            <p className="text-red-400 text-sm mt-2">{promoError}</p>
                                        )}
                                    </>
                                )}
                            </div>

                            <Button fullWidth onClick={handleCheckout}>
                                Proceed to Checkout
                            </Button>
                            <p className="text-gray-400 text-xs text-center mt-4">
                                By proceeding, you agree to our Terms of Service
                            </p>

                            {/* What you get */}
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <h4 className="text-white font-medium mb-3">What you'll get:</h4>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-400">✓</span>
                                        Full source code
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-400">✓</span>
                                        Documentation
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-400">✓</span>
                                        5 downloads per project
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-400">✓</span>
                                        30 days access
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;


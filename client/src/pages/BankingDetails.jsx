import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bankingAPI } from '../services/api';
import Button from '../components/Button';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';
import {
    HiCreditCard,
    HiTrash,
    HiSave,
    HiShieldCheck,
    HiExclamation,
    HiArrowLeft
} from 'react-icons/hi';

const BankingDetails = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [hasExisting, setHasExisting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [form, setForm] = useState({
        accountHolderName: '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        accountType: 'savings',
        upiId: ''
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchDetails = async () => {
            try {
                const response = await bankingAPI.get();
                setForm({
                    accountHolderName: response.data.accountHolderName || '',
                    bankName: response.data.bankName || '',
                    accountNumber: response.data.accountNumber || '',
                    ifscCode: response.data.ifscCode || '',
                    accountType: response.data.accountType || 'savings',
                    upiId: response.data.upiId || ''
                });
                setHasExisting(true);
            } catch (error) {
                if (error.response?.status !== 404) {
                    console.error('Error fetching banking details:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await bankingAPI.upsert(form);
            setHasExisting(true);
            toast.success('Banking details saved successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save banking details');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await bankingAPI.delete();
            setForm({
                accountHolderName: '',
                bankName: '',
                accountNumber: '',
                ifscCode: '',
                accountType: 'savings',
                upiId: ''
            });
            setHasExisting(false);
            setShowDeleteModal(false);
            toast.success('Banking details deleted successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete banking details');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loading text="Loading banking details..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/dashboard?tab=banking')}
                        className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <HiArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Banking Details</h1>
                        <p className="text-gray-500">Manage your bank account for receiving payments and making purchases</p>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="glass-card p-4 mb-6 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${hasExisting ? 'bg-green-50' : 'bg-yellow-50'}`}>
                        {hasExisting ? (
                            <HiShieldCheck className="w-5 h-5 text-green-400" />
                        ) : (
                            <HiExclamation className="w-5 h-5 text-yellow-400" />
                        )}
                    </div>
                    <div>
                        <p className="text-gray-900 font-medium">
                            {hasExisting ? 'Banking details saved' : 'No banking details found'}
                        </p>
                        <p className="text-gray-500 text-sm">
                            {hasExisting
                                ? 'Your banking details are on file. You can update them anytime.'
                                : 'Add your banking details to start receiving payments from sales.'}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                            <HiCreditCard className="w-5 h-5 text-purple-500" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Bank Account Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Account Holder Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Account Holder Name *
                            </label>
                            <input
                                type="text"
                                name="accountHolderName"
                                value={form.accountHolderName}
                                onChange={handleChange}
                                required
                                placeholder="Enter full name as per bank"
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Bank Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bank Name *
                            </label>
                            <input
                                type="text"
                                name="bankName"
                                value={form.bankName}
                                onChange={handleChange}
                                required
                                placeholder="e.g. State Bank of India"
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Account Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Account Number *
                            </label>
                            <input
                                type="text"
                                name="accountNumber"
                                value={form.accountNumber}
                                onChange={handleChange}
                                required
                                placeholder="Enter account number"
                                maxLength={20}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* IFSC Code */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                IFSC Code *
                            </label>
                            <input
                                type="text"
                                name="ifscCode"
                                value={form.ifscCode}
                                onChange={handleChange}
                                required
                                placeholder="e.g. SBIN0001234"
                                maxLength={11}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all uppercase"
                            />
                        </div>

                        {/* Account Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Account Type
                            </label>
                            <select
                                name="accountType"
                                value={form.accountType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            >
                                <option value="savings">Savings</option>
                                <option value="current">Current</option>
                            </select>
                        </div>

                        {/* UPI ID */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                UPI ID <span className="text-gray-500">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                name="upiId"
                                value={form.upiId}
                                onChange={handleChange}
                                placeholder="e.g. yourname@upi"
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
                        <Button
                            type="submit"
                            loading={saving}
                            leftIcon={<HiSave className="w-5 h-5" />}
                        >
                            {hasExisting ? 'Update Details' : 'Save Details'}
                        </Button>

                        {hasExisting && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setShowDeleteModal(true)}
                                className="border-red-500 text-red-400 hover:bg-red-500/20"
                                leftIcon={<HiTrash className="w-5 h-5" />}
                            >
                                Delete Details
                            </Button>
                        )}
                    </div>
                </form>

                {/* Info Card */}
                <div className="glass-card p-4 mt-6">
                    <p className="text-gray-500 text-sm">
                        🔒 Your banking details are stored securely and will only be used for processing payments on this platform.
                        Seller earnings from project sales will be transferred to this account.
                    </p>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                    <div className="glass-card p-6 max-w-md w-full">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                                <HiExclamation className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Banking Details?</h3>
                            <p className="text-gray-500">
                                This will remove your saved banking information. You won't be able to receive payments until you add new details.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="ghost"
                                fullWidth
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                fullWidth
                                onClick={handleDelete}
                                loading={deleting}
                                className="bg-red-500 hover:bg-red-600"
                            >
                                Yes, Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BankingDetails;

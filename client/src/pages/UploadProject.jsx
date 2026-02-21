import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectsAPI, uploadAPI } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import {
    HiUpload,
    HiPlus,
    HiX,
    HiPhotograph,
    HiLink,
    HiCurrencyRupee,
    HiFolder
} from 'react-icons/hi';

const UploadProject = () => {
    const navigate = useNavigate();
    const { isAuthenticated, isSeller } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        shortDescription: '',
        price: '',
        category: '',
        techStack: [],
        demoUrl: '',
        videoUrl: '',
        features: [],
        requirements: [],
        thumbnail: '',
        images: [],
        downloadFile: '',
    });
    const [errors, setErrors] = useState({});
    const [newTech, setNewTech] = useState('');
    const [newFeature, setNewFeature] = useState('');
    const [newRequirement, setNewRequirement] = useState('');

    // File upload states
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [projectFile, setProjectFile] = useState(null);
    const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
    const [uploadingProject, setUploadingProject] = useState(false);

    const thumbnailInputRef = useRef(null);
    const projectInputRef = useRef(null);

    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    if (!isSeller) {
        return (
            <div className="min-h-screen flex items-center justify-center py-12">
                <div className="text-center glass-card p-8 max-w-md">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Seller Access Required</h2>
                    <p className="text-gray-400 mb-6">
                        You need to be a seller to upload projects.
                        Go to Dashboard → Settings to change your role.
                    </p>
                    <Button onClick={() => navigate('/dashboard?tab=settings')}>
                        Go to Settings
                    </Button>
                </div>
            </div>
        );
    }

    const categories = [
        { value: 'web-development', label: 'Web Development' },
        { value: 'mobile-app', label: 'Mobile App' },
        { value: 'machine-learning', label: 'Machine Learning' },
        { value: 'data-science', label: 'Data Science' },
        { value: 'blockchain', label: 'Blockchain' },
        { value: 'iot', label: 'IoT' },
        { value: 'game-development', label: 'Game Development' },
        { value: 'desktop-app', label: 'Desktop App' },
        { value: 'api', label: 'API / Backend' },
        { value: 'other', label: 'Other' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const addToArray = (field, value, setValue) => {
        if (value.trim()) {
            setFormData({
                ...formData,
                [field]: [...formData[field], value.trim()]
            });
            setValue('');
        }
    };

    const removeFromArray = (field, index) => {
        setFormData({
            ...formData,
            [field]: formData[field].filter((_, i) => i !== index)
        });
    };

    // Handle thumbnail image selection
    const handleThumbnailSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be less than 5MB');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setThumbnailPreview(reader.result);
        };
        reader.readAsDataURL(file);
        setThumbnailFile(file);

        // Upload immediately
        setUploadingThumbnail(true);
        try {
            const response = await uploadAPI.image(file);
            setFormData({ ...formData, thumbnail: response.data.url });
            toast.success('Thumbnail uploaded!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to upload thumbnail');
            setThumbnailPreview('');
            setThumbnailFile(null);
        } finally {
            setUploadingThumbnail(false);
        }
    };

    // Handle project zip file selection
    const handleProjectFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.name.toLowerCase().endsWith('.zip')) {
            toast.error('Please select a ZIP file');
            return;
        }

        // Validate file size (100MB max)
        if (file.size > 100 * 1024 * 1024) {
            toast.error('Project file must be less than 100MB');
            return;
        }

        setProjectFile(file);

        // Upload immediately
        setUploadingProject(true);
        try {
            const response = await uploadAPI.project(file);
            setFormData({ ...formData, downloadFile: response.data.url });
            toast.success('Project file uploaded!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to upload project file');
            setProjectFile(null);
        } finally {
            setUploadingProject(false);
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.description) newErrors.description = 'Description is required';
        if (!formData.price) newErrors.price = 'Price is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (formData.techStack.length === 0) newErrors.techStack = 'Add at least one technology';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const projectData = {
                ...formData,
                price: Number(formData.price),
            };
            await projectsAPI.create(projectData);
            toast.success('Project uploaded successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to upload project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Upload Project</h1>
                    <p className="text-gray-500">Share your project with the community and earn money</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <div className="glass-card p-6 space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>

                        <Input
                            label="Project Title"
                            name="title"
                            placeholder="Enter a catchy title for your project"
                            value={formData.title}
                            onChange={handleChange}
                            error={errors.title}
                        />

                        <Input
                            label="Short Description"
                            name="shortDescription"
                            placeholder="Brief description (max 200 characters)"
                            value={formData.shortDescription}
                            onChange={handleChange}
                            maxLength={200}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Description
                            </label>
                            <textarea
                                name="description"
                                rows={6}
                                placeholder="Describe your project in detail..."
                                value={formData.description}
                                onChange={handleChange}
                                className="input-field resize-none"
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-400">{errors.description}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="input-field"
                                >
                                    <option value="">Select category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="mt-1 text-sm text-red-400">{errors.category}</p>
                                )}
                            </div>

                            <Input
                                label="Price (₹)"
                                name="price"
                                type="number"
                                placeholder="499"
                                value={formData.price}
                                onChange={handleChange}
                                error={errors.price}
                                leftIcon={<HiCurrencyRupee className="w-5 h-5" />}
                            />
                        </div>
                    </div>

                    {/* Tech Stack */}
                    <div className="glass-card p-6 space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">Tech Stack</h2>

                        <div className="flex gap-2">
                            <Input
                                placeholder="Add technology (e.g., React, Node.js)"
                                value={newTech}
                                onChange={(e) => setNewTech(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addToArray('techStack', newTech, setNewTech);
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => addToArray('techStack', newTech, setNewTech)}
                                leftIcon={<HiPlus className="w-4 h-4" />}
                            >
                                Add
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {formData.techStack.map((tech, index) => (
                                <span key={index} className="tag flex items-center gap-1">
                                    {tech}
                                    <button
                                        type="button"
                                        onClick={() => removeFromArray('techStack', index)}
                                        className="hover:text-red-400"
                                    >
                                        <HiX className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        {errors.techStack && (
                            <p className="text-sm text-red-400">{errors.techStack}</p>
                        )}
                    </div>

                    {/* Features */}
                    <div className="glass-card p-6 space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">Features</h2>

                        <div className="flex gap-2">
                            <Input
                                placeholder="Add a feature"
                                value={newFeature}
                                onChange={(e) => setNewFeature(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addToArray('features', newFeature, setNewFeature);
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => addToArray('features', newFeature, setNewFeature)}
                                leftIcon={<HiPlus className="w-4 h-4" />}
                            >
                                Add
                            </Button>
                        </div>

                        <ul className="space-y-2">
                            {formData.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2 text-gray-600">
                                    <span className="w-2 h-2 bg-primary-500 rounded-full" />
                                    <span className="flex-1">{feature}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeFromArray('features', index)}
                                        className="text-gray-400 hover:text-red-400"
                                    >
                                        <HiX className="w-4 h-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Files & Links */}
                    <div className="glass-card p-6 space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900">Files & Links</h2>

                        {/* Thumbnail Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Thumbnail Image
                            </label>
                            <input
                                type="file"
                                ref={thumbnailInputRef}
                                onChange={handleThumbnailSelect}
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                className="hidden"
                            />
                            <div
                                onClick={() => thumbnailInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-purple-500 transition-colors"
                            >
                                {thumbnailPreview ? (
                                    <div className="relative">
                                        <img
                                            src={thumbnailPreview}
                                            alt="Thumbnail preview"
                                            className="max-h-48 mx-auto rounded-lg"
                                        />
                                        <p className="text-gray-500 text-sm mt-2">Click to change image</p>
                                    </div>
                                ) : uploadingThumbnail ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-gray-500">Uploading...</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <HiPhotograph className="w-12 h-12 text-gray-500" />
                                        <p className="text-gray-500">Click to upload thumbnail</p>
                                        <p className="text-gray-500 text-sm">JPEG, PNG, GIF, WebP (Max 5MB)</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Project File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Project Source Files (ZIP)
                            </label>
                            <input
                                type="file"
                                ref={projectInputRef}
                                onChange={handleProjectFileSelect}
                                accept=".zip"
                                className="hidden"
                            />
                            <div
                                onClick={() => projectInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-purple-500 transition-colors"
                            >
                                {projectFile ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <HiFolder className="w-10 h-10 text-purple-400" />
                                        <div className="text-left">
                                            <p className="text-gray-900 font-medium">{projectFile.name}</p>
                                            <p className="text-gray-500 text-sm">
                                                {(projectFile.size / (1024 * 1024)).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                ) : uploadingProject ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-gray-500">Uploading...</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <HiUpload className="w-12 h-12 text-gray-500" />
                                        <p className="text-gray-500">Click to upload project ZIP file</p>
                                        <p className="text-gray-500 text-sm">ZIP files only (Max 100MB)</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Input
                            label="Live Demo URL (Optional)"
                            name="demoUrl"
                            placeholder="https://your-demo.vercel.app"
                            value={formData.demoUrl}
                            onChange={handleChange}
                            leftIcon={<HiLink className="w-5 h-5" />}
                        />

                        <Input
                            label="Video URL (Optional)"
                            name="videoUrl"
                            placeholder="https://youtube.com/watch?v=..."
                            value={formData.videoUrl}
                            onChange={handleChange}
                            leftIcon={<HiLink className="w-5 h-5" />}
                        />
                    </div>

                    {/* Pricing Info */}
                    <div className="glass-card p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                                <HiCurrencyRupee className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-gray-900 font-semibold mb-1">Pricing Note</h3>
                                <p className="text-gray-500 text-sm">
                                    You'll receive 90% of the sale price. Our platform takes a 10% commission
                                    to cover payment processing and hosting costs.
                                </p>
                                {formData.price && (
                                    <p className="text-green-600 mt-2">
                                        You'll earn: ₹{(Number(formData.price) * 0.9).toFixed(0)} per sale
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate('/dashboard')}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={loading}
                            leftIcon={<HiUpload className="w-5 h-5" />}
                            className="flex-1"
                        >
                            Upload Project
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadProject;

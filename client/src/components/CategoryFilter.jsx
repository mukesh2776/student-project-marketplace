const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
    const defaultCategories = [
        { value: 'all', label: 'All Projects', icon: '🎯' },
        { value: 'web-development', label: 'Web Development', icon: '🌐' },
        { value: 'mobile-app', label: 'Mobile Apps', icon: '📱' },
        { value: 'machine-learning', label: 'Machine Learning', icon: '🤖' },
        { value: 'data-science', label: 'Data Science', icon: '📊' },
        { value: 'blockchain', label: 'Blockchain', icon: '⛓️' },
        { value: 'iot', label: 'IoT', icon: '💡' },
        { value: 'game-development', label: 'Game Development', icon: '🎮' },
        { value: 'desktop-app', label: 'Desktop Apps', icon: '🖥️' },
        { value: 'api', label: 'APIs & Backend', icon: '⚙️' },
        { value: 'other', label: 'Other', icon: '📦' },
    ];

    const categoryList = categories || defaultCategories;

    return (
        <div className="glass-card p-4 space-y-2">
            <h3 className="text-gray-900 font-semibold mb-4">Categories</h3>
            <div className="space-y-1">
                {categoryList.map((category) => (
                    <button
                        key={category.value}
                        onClick={() => onCategoryChange(category.value)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${selectedCategory === category.value
                            ? 'bg-primary-50 text-primary-600 border border-primary-200'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <span className="text-lg">{category.icon}</span>
                        <span className="text-sm font-medium">{category.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryFilter;

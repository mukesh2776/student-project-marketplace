import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import CategoryFilter from '../components/CategoryFilter';
import SkeletonCard from '../components/SkeletonCard';
import ScrollReveal from '../components/ScrollReveal';
import { HiSearch, HiAdjustments } from 'react-icons/hi';

const Projects = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    const category = searchParams.get('category') || 'all';
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page')) || 1;

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const params = { page, limit: 12, sort };
                if (category !== 'all') params.category = category;
                if (search) params.search = search;
                const response = await projectsAPI.getAll(params);
                setProjects(response.data.projects);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [category, search, sort, page]);

    const updateParams = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value && value !== 'all') {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        if (key !== 'page') newParams.delete('page');
        setSearchParams(newParams);
    };

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'rating', label: 'Highest Rated' },
        { value: 'popular', label: 'Most Popular' },
    ];

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {search ? `Search results for "${search}"` : 'Browse Projects'}
                    </h1>
                    <p className="text-gray-500">
                        Find the perfect project for your portfolio
                    </p>
                </div>

                {/* Search and Filters Bar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="flex-1 relative">
                        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={search}
                            onChange={(e) => updateParams('search', e.target.value)}
                            className="input-field pl-10"
                        />
                    </div>

                    <select
                        value={sort}
                        onChange={(e) => updateParams('sort', e.target.value)}
                        className="input-field w-full sm:w-48"
                    >
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="lg:hidden btn-secondary flex items-center gap-2 justify-center"
                    >
                        <HiAdjustments className="w-5 h-5" />
                        Filters
                    </button>
                </div>

                <div className="flex gap-8">
                    {/* Sidebar Filters */}
                    <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
                        <CategoryFilter
                            selectedCategory={category}
                            onCategoryChange={(cat) => updateParams('category', cat)}
                        />
                    </aside>

                    {/* Projects Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </div>
                        ) : projects.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {projects.map((project, index) => (
                                        <ScrollReveal key={project._id} delay={index * 80}>
                                            <ProjectCard project={project} />
                                        </ScrollReveal>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center gap-2 mt-12">
                                        {page > 1 && (
                                            <button
                                                onClick={() => updateParams('page', page - 1)}
                                                className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-sm"
                                            >
                                                Previous
                                            </button>
                                        )}

                                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                            const pageNum = i + 1;
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => updateParams('page', pageNum)}
                                                    className={`w-10 h-10 rounded-lg transition-colors ${page === pageNum
                                                        ? 'bg-primary-500 text-white'
                                                        : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 shadow-sm'
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}

                                        {page < totalPages && (
                                            <button
                                                onClick={() => updateParams('page', page + 1)}
                                                className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-sm"
                                            >
                                                Next
                                            </button>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
                                <p className="text-gray-500">
                                    Try adjusting your search or filters
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Projects;

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    // Debouncing effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim()) {
                navigate(`/search?q=${encodeURIComponent(query)}`);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, navigate]);

    const handleClear = () => {
        setQuery('');
        navigate('/dashboard');
    };

    return (
        <div className="relative flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2 w-full md:w-96 border border-gray-100 dark:border-gray-700 focus-within:border-indigo-200 focus-within:ring-2 focus-within:ring-indigo-50 dark:focus-within:ring-indigo-900 transition-all">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search bookmarks..."
                className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder-gray-400 text-gray-800 dark:text-gray-100"
            />
            {query && (
                <button onClick={handleClear} className="p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <X className="w-3 h-3 text-gray-400" />
                </button>
            )}
        </div>
    );
};

export default SearchBar;

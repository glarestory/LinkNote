import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Bookmark } from '../types/bookmark';
import { deleteBookmark } from '../services/bookmarkService';
import api from '../services/authService';
import BookmarkCard from '../components/BookmarkCard';
import BookmarkModal from '../components/BookmarkModal';
import { createBookmark, updateBookmark } from '../services/bookmarkService'; // Needed for modal

const SearchResultsPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState<Bookmark[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBookmark, setEditingBookmark] = useState<Bookmark | undefined>(undefined);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const fetchResults = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/bookmarks/search?q=${encodeURIComponent(query)}`);
                setResults(response.data.data);
            } catch (error) {
                console.error('Search error', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    const handleEdit = (bookmark: Bookmark) => {
        setEditingBookmark(bookmark);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        await deleteBookmark(id);
        setResults(prev => prev.filter(b => b.id !== id));
    };

    const handleModalSubmit = async (data: any) => {
        if (editingBookmark) {
            await updateBookmark(editingBookmark.id, data);
            setResults(prev => prev.map(b => b.id === editingBookmark.id ? { ...b, ...data } : b));
        }
        setIsModalOpen(false);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                Search results for "{query}"
                <span className="ml-2 text-sm font-normal text-gray-500">
                    ({results.length} found)
                </span>
            </h2>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-48 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : results.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-500">No bookmarks found matching your query.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {results.map(bookmark => (
                        <BookmarkCard
                            key={bookmark.id}
                            bookmark={bookmark}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            <BookmarkModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={editingBookmark}
            />
        </div>
    );
};

export default SearchResultsPage;

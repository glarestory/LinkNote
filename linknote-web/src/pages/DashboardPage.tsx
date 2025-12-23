import { useState, useEffect } from 'react';
import { getBookmarks, createBookmark, updateBookmark, deleteBookmark } from '../services/bookmarkService';
import { Bookmark } from '../types/bookmark';
import { Plus } from 'lucide-react';
import BookmarkCard from '../components/BookmarkCard';
import BookmarkModal from '../components/BookmarkModal';

const DashboardPage = () => {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBookmark, setEditingBookmark] = useState<Bookmark | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchBookmarks = async () => {
        try {
            setIsLoading(true);
            const response = await getBookmarks();
            if (response.success) {
                setBookmarks(response.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookmarks();
    }, []);

    const handleCreate = () => {
        setEditingBookmark(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (bookmark: Bookmark) => {
        setEditingBookmark(bookmark);
        setIsModalOpen(true);
    };

    const handleSubmit = async (data: any) => {
        try {
            setIsSubmitting(true);
            if (editingBookmark) {
                await updateBookmark(editingBookmark.id, data);
            } else {
                await createBookmark(data);
            }
            await fetchBookmarks();
            setIsModalOpen(false);
        } catch (error) {
            alert('Failed to save bookmark');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteBookmark(id);
            setBookmarks(prev => prev.filter(b => b.id !== id));
        } catch (error) {
            alert('Failed to delete bookmark');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Actions */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">My Bookmarks</h2>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-indigo-300 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Add Bookmark
                </button>
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white dark:bg-gray-800 h-48 rounded-2xl animate-pulse border border-gray-100 dark:border-gray-700" />
                    ))}
                </div>
            ) : bookmarks.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                        📚
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No bookmarks yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Save your first bookmark to get started!</p>
                    <button
                        onClick={handleCreate}
                        className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                    >
                        Create one now
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {bookmarks.map(bookmark => (
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
                onSubmit={handleSubmit}
                initialData={editingBookmark}
                isLoading={isSubmitting}
            />
        </div>
    );
};

export default DashboardPage;

import { Bookmark } from '../types/bookmark';
import { ExternalLink, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface BookmarkCardProps {
    bookmark: Bookmark;
    onEdit: (bookmark: Bookmark) => void;
    onDelete: (id: string) => void;
}

const BookmarkCard = ({ bookmark, onEdit, onDelete }: BookmarkCardProps) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (confirm('정말 삭제하시겠습니까?')) {
            setIsDeleting(true);
            onDelete(bookmark.id);
        }
    };

    return (
        <div className="group relative bg-white border border-gray-100 hover:border-indigo-100 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full animate-fade-in-up">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-100">
                        {bookmark.favicon_url ? (
                            <img src={bookmark.favicon_url} alt="" className="w-6 h-6 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                        ) : (
                            <span className="text-xl">🔖</span>
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <h3 className="font-bold text-gray-900 truncate leading-tight group-hover:text-indigo-600 transition-colors" title={bookmark.title}>
                            {bookmark.title}
                        </h3>
                        <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-400 hover:text-indigo-500 truncate flex items-center gap-1 mt-0.5"
                        >
                            {new URL(bookmark.url).hostname}
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                    </div>
                </div>
            </div>

            {bookmark.note && (
                <div className="mb-4 flex-grow">
                    <p className="text-sm text-gray-600 line-clamp-3 bg-gray-50 p-3 rounded-lg border border-gray-100/50">
                        {bookmark.note}
                    </p>
                </div>
            )}

            <div className="mt-auto border-t border-gray-100 pt-3 flex items-center justify-between text-xs text-gray-400">
                <span>{new Date(bookmark.created_at).toLocaleDateString()}</span>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-200">
                    <button
                        onClick={(e) => { e.preventDefault(); onEdit(bookmark); }}
                        className="p-1.5 hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 rounded-lg transition-colors"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); handleDelete(); }}
                        disabled={isDeleting}
                        className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                    >
                        {isDeleting ? <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookmarkCard;

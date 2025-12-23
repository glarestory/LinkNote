import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateBookmarkData, UpdateBookmarkData, Bookmark } from '../types/bookmark';
import { Loader2 } from 'lucide-react';

const bookmarkSchema = z.object({
    url: z.string().url('유효한 URL을 입력해주세요'),
    title: z.string().min(1, '제목은 필수입니다').max(255),
    note: z.string().max(500, '메모는 500자 이내여야 합니다').optional(),
});

type BookmarkFormData = z.infer<typeof bookmarkSchema>;

interface BookmarkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: BookmarkFormData) => Promise<void>;
    initialData?: Bookmark;
    isLoading?: boolean;
}

const BookmarkModal = ({ isOpen, onClose, onSubmit, initialData, isLoading }: BookmarkModalProps) => {
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<BookmarkFormData>({
        resolver: zodResolver(bookmarkSchema),
        defaultValues: {
            url: '',
            title: '',
            note: ''
        }
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setValue('url', initialData.url);
                setValue('title', initialData.title);
                setValue('note', initialData.note || '');
            } else {
                reset();
            }
        }
    }, [isOpen, initialData, setValue, reset]);

    // Handle URL blur to auto-fill title (mock implementation for now)
    const handleUrlBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const url = e.target.value;
        if (url && !initialData) { // Only auto-fill for new bookmarks
            try {
                const domain = new URL(url).hostname;
                // If title is empty, set domain as temporary title
                setValue('title', domain, { shouldValidate: true });
            } catch (e) {
                // Invalid URL, ignore
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl transform transition-all">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        {initialData ? '북마크 수정' : '새 북마크 추가'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            URL
                        </label>
                        <input
                            {...register('url')}
                            onBlur={handleUrlBlur}
                            placeholder="https://example.com"
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        />
                        {errors.url && <p className="mt-1 text-sm text-red-500">{errors.url.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            제목
                        </label>
                        <input
                            {...register('title')}
                            placeholder="웹사이트 제목"
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            메모 (선택)
                        </label>
                        <textarea
                            {...register('note')}
                            placeholder="간단한 메모를 남겨보세요..."
                            rows={4}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                        />
                        {errors.note && <p className="mt-1 text-sm text-red-500">{errors.note.message}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            저장
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookmarkModal;

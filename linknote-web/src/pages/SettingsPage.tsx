import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/authService';
import { getBookmarks } from '../services/bookmarkService';

const SettingsPage = () => {
    const { user, checkAuth, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'theme' | 'data'>('profile');

    // Profile State
    const [displayName, setDisplayName] = useState(user?.display_name || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.put('/users/me', { display_name: displayName, avatar_url: avatarUrl });
            await checkAuth(); // Refresh user data
            alert('Profile updated successfully');
        } catch (error) {
            alert('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportData = async () => {
        try {
            const bookmarks = await getBookmarks(1, 10000); // Fetch all
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bookmarks.data));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", `linknote_backup_${new Date().toISOString().slice(0, 10)}.json`);
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        } catch (error) {
            alert('Export failed');
        }
    };

    const handleDeleteAccount = async () => {
        if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
            try {
                await api.delete('/users/me');
                await logout();
            } catch (error) {
                alert('Failed to delete account');
            }
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-64 space-y-2">
                    {['profile', 'theme', 'data'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`w-full text-left px-4 py-2 rounded-lg font-medium capitalize transition-colors ${activeTab === tab
                                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    {activeTab === 'profile' && (
                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Display Name</label>
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Avatar URL</label>
                                <input
                                    type="text"
                                    value={avatarUrl}
                                    onChange={(e) => setAvatarUrl(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                />
                                {avatarUrl && <img src={avatarUrl} alt="Preview" className="w-16 h-16 rounded-full mt-4 object-cover" />}
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                            >
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    )}

                    {activeTab === 'theme' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium dark:text-white">Appearance</h3>
                            <div className="space-y-2">
                                {['light', 'dark', 'system'].map((t) => (
                                    <label key={t} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <input
                                            type="radio"
                                            name="theme"
                                            value={t}
                                            checked={theme === t}
                                            onChange={() => setTheme(t as any)}
                                            className="text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="capitalize dark:text-gray-200">{t}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'data' && (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-medium dark:text-white mb-2">Export Data</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Download all your bookmarks as a JSON file.</p>
                                <button
                                    onClick={handleExportData}
                                    className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    Export JSON
                                </button>
                            </div>

                            <div className="border-t border-gray-100 dark:border-gray-700 pt-8">
                                <h3 className="text-lg font-medium text-red-600 mb-2">Danger Zone</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Permanently delete your account and all data.</p>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition"
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;

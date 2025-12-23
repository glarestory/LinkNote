import { useState, useRef, useEffect } from 'react';
import { User } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ProfileDropdownProps {
    user: User;
}

const ProfileDropdown = ({ user }: ProfileDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 pl-4 border-l border-gray-100 dark:border-gray-700 hover:opacity-80 transition-opacity"
            >
                <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{user.display_name}</p>
                </div>
                <img src={user.avatar_url} alt="Profile" className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50 animate-fade-in-up">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 md:hidden">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.display_name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                    </div>

                    <button
                        onClick={() => { navigate('/settings'); setIsOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                    </button>

                    <button
                        onClick={toggleTheme}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </button>

                    <div className="border-t border-gray-100 dark:border-gray-700 my-1" />

                    <button
                        onClick={() => { logout(); setIsOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;

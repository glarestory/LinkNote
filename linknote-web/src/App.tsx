import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SearchResultsPage from './pages/SearchResultsPage';
import SettingsPage from './pages/SettingsPage';
import SearchBar from './components/SearchBar';
import ProfileDropdown from './components/ProfileDropdown';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 transition-colors">
            {/* Global Header for Protected Routes */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-40 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <a href="/" className="text-xl font-black bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">LinkNote</a>

                        <div className="hidden md:block">
                            <SearchBar />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <ProfileDropdown user={user} />
                    </div>
                </div>
            </header>
            <main>
                {children}
            </main>
        </div>
    );
};

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <DashboardPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/search"
                            element={
                                <ProtectedRoute>
                                    <SearchResultsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/settings"
                            element={
                                <ProtectedRoute>
                                    <SettingsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;

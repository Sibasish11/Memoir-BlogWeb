import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Import Footer
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import ReadingPage from './pages/ReadingPage';
import ProfilePage from './pages/ProfilePage'; // Import ProfilePage
import MyStoriesPage from './pages/MyStoriesPage';
import BlogPage from './pages/BlogPage';
import { AppRoutes } from './constants';

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path={AppRoutes.Home} element={<HomePage />} />
              <Route path={AppRoutes.Reading} element={<ReadingPage />} />
              <Route path={AppRoutes.Blog} element={<BlogPage />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path={AppRoutes.Dashboard} element={<DashboardPage />} />
                <Route path={AppRoutes.Editor} element={<EditorPage />} />
                <Route path={AppRoutes.EditBlog} element={<EditorPage />} />
                <Route path={AppRoutes.Profile} element={<ProfilePage />} />
                <Route path={AppRoutes.MyStories} element={<MyStoriesPage />} />
                <Route path={AppRoutes.Settings} element={<NotFoundPage />} /> 
              </Route>
              
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer /> 
        </div>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;

<h1 className="font-whispering text-4xl">MEMOIR</h1>
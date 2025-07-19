import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BlogEntry } from '../types';
import Button from '../components/Button';
import BlogCard from '../components/BlogCard';
import { AppRoutes, LOCAL_STORAGE_BLOGS_KEY, dummyBlogsData } from '../constants'; 
import PlusIcon from '../components/icons/PlusIcon';
import GenreSelectionModal from '../components/GenreSelectionModal';

type DashboardTab = 'forYou' | 'yourBlogs' | 'explore';

const DashboardPage: React.FC = () => {
  const { user, showGenreSelectionModal, setShowGenreSelectionModal } = useAuth();
  const navigate = useNavigate();
  
  const [userBlogs, setUserBlogs] = useState<BlogEntry[]>([]);
  const [isLoadingUserBlogs, setIsLoadingUserBlogs] = useState(true);
  const [activeTab, setActiveTab] = useState<DashboardTab>('explore'); 

  const fetchUserBlogs = useCallback(() => {
    if (!user) {
      setUserBlogs([]);
      setIsLoadingUserBlogs(false);
      return;
    }
    setIsLoadingUserBlogs(true);
    const storedBlogs = localStorage.getItem(LOCAL_STORAGE_BLOGS_KEY);
    if (storedBlogs) {
      try {
        const allBlogs = JSON.parse(storedBlogs) as BlogEntry[];
        const currentUserBlogs = allBlogs
          .filter(blog => blog.authorId === user.id)
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        setUserBlogs(currentUserBlogs);
      } catch (e) {
        console.error("Failed to parse blogs from localStorage:", e);
        setUserBlogs([]); 
        localStorage.removeItem(LOCAL_STORAGE_BLOGS_KEY); 
      }
    } else {
      setUserBlogs([]); 
    }
    setIsLoadingUserBlogs(false);
  }, [user]);
  
  useEffect(() => {
    fetchUserBlogs();
  }, [fetchUserBlogs]);

  useEffect(() => {
    if (user?.selectedGenres && user.selectedGenres.length > 0) {
      setActiveTab('forYou');
    } else {
      setActiveTab('explore');
    }
  }, [user?.selectedGenres]);

  const handleEditBlog = (id: string) => {
    navigate(`${AppRoutes.Editor}/${id}`);
  };

  const handleDeleteBlog = (id: string) => {
    const storedBlogs = localStorage.getItem(LOCAL_STORAGE_BLOGS_KEY);
    if (storedBlogs) {
      try {
        let allBlogs = JSON.parse(storedBlogs) as BlogEntry[];
        const updatedBlogs = allBlogs.filter(blog => blog.id !== id);
        localStorage.setItem(LOCAL_STORAGE_BLOGS_KEY, JSON.stringify(updatedBlogs));
        fetchUserBlogs(); 
      } catch (e) {
        console.error("Failed to parse or update blogs in localStorage during delete:", e);
      }
    }
  };

  const forYouBlogs = useMemo(() => {
    if (!user?.selectedGenres || user.selectedGenres.length === 0) {
      return [];
    }
    return dummyBlogsData.filter(blog =>
      user.selectedGenres?.some(selectedGenre => 
        blog.tags.some(tag => tag.toLowerCase() === selectedGenre.toLowerCase())
      )
    );
  }, [user?.selectedGenres]);

  const recommendedBlogs = useMemo(() => dummyBlogsData.slice(0, 2), []);

  const renderBlogList = (blogsToList: BlogEntry[], isUserBlogSection: boolean = false) => {
    if (isLoadingUserBlogs && isUserBlogSection) {
      return <p className="text-gray-600 text-center py-10">Loading your blogs...</p>;
    }
    if (!user && isUserBlogSection) { 
        return <p className="text-gray-600 text-center py-10">Please log in to see your blogs.</p>;
    }

    if (blogsToList.length === 0) {
      if (isUserBlogSection) {
         return (
            <div className="text-center py-10 bg-white shadow-lg rounded-lg p-6">
              <img src="https://picsum.photos/seed/emptyblogs/300/150" alt="No blogs yet" className="mx-auto mb-4 rounded-md shadow-sm"/>
              <p className="text-lg text-gray-600 mb-3">You haven't written any blogs yet.</p>
              <Button onClick={() => navigate(AppRoutes.Editor)} variant="primary">Start Writing</Button>
            </div>
          );
      }
      if (activeTab === 'forYou') {
        if (!user?.selectedGenres || user.selectedGenres.length === 0) {
            return (
                <div className="text-center py-10 bg-white shadow-lg rounded-lg p-6">
                    <p className="text-lg text-gray-600 mb-3">Personalize your feed by selecting topics you love!</p>
                    <Button onClick={() => setShowGenreSelectionModal(true)} variant='outline' className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                        Choose Your Interests
                    </Button>
                </div>
            );
        }
        return <p className="text-gray-600 text-center py-10">No stories match your selected interests yet. Try exploring other topics or adjusting your interests!</p>;
      }
      return <p className="text-gray-600 text-center py-10">No stories found for this section. Try exploring other topics!</p>;
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogsToList.map(blog => (
          <BlogCard 
            key={blog.id} 
            blog={blog} 
            onEdit={isUserBlogSection ? handleEditBlog : undefined} 
            onDelete={isUserBlogSection ? handleDeleteBlog : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      {showGenreSelectionModal && <GenreSelectionModal />}
      
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.name || user?.email?.split('@')[0]}!</p>
          </div>
          <Button 
              onClick={() => navigate(AppRoutes.Editor)} 
              variant="primary"
              size="md"
              className="flex items-center mt-4 sm:mt-0"
            >
              <PlusIcon className="w-5 h-5 mr-2" /> Write New Blog
            </Button>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-8">
            <div className="bg-white p-6 shadow-xl rounded-lg">
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                  {(['forYou', 'yourBlogs', 'explore'] as DashboardTab[]).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`${
                        activeTab === tab
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-slate-800 hover:border-gray-300'
                      } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm capitalize transition-colors`}
                      aria-current={activeTab === tab ? 'page' : undefined}
                    >
                      {tab === 'forYou' ? 'For You' : tab === 'yourBlogs' ? 'Your Blogs' : 'Explore All'}
                    </button>
                  ))}
                </nav>
              </div>

              {activeTab === 'forYou' && renderBlogList(forYouBlogs)}
              {activeTab === 'yourBlogs' && renderBlogList(userBlogs, true)}
              {activeTab === 'explore' && renderBlogList(dummyBlogsData)}
            </div>
          </div>

          <aside className="lg:w-1/3 space-y-6">
            <div className="bg-white p-6 shadow-xl rounded-lg">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Recommended Blogs</h3>
              <div className="space-y-4">
                {recommendedBlogs.length > 0 ? recommendedBlogs.map(blog => (
                  <BlogCard key={`recommendation-${blog.id}`} blog={blog} />
                )) : <p className="text-gray-600 text-sm">No recommended blogs available.</p>}
              </div>
            </div>

            <div className="bg-white p-6 shadow-xl rounded-lg">
                {user?.selectedGenres && user.selectedGenres.length > 0 ? (
                    <>
                        <h3 className="text-xl font-semibold text-slate-800 mb-4">Your Topics</h3>
                        <div className="flex flex-wrap gap-2">
                        {user.selectedGenres.map(genre => (
                            <span key={genre} className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                            {genre}
                            </span>
                        ))}
                        </div>
                         <Button onClick={() => setShowGenreSelectionModal(true)} variant='outline' size='sm' className="mt-4 text-sm border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                            Change Interests
                        </Button>
                    </>
                ) : (
                    <>
                        <h3 className="text-xl font-semibold text-slate-800 mb-3">Discover Topics</h3>
                        <p className="text-gray-600 text-sm mb-3">Personalize your feed by selecting topics you love!</p>
                        <Button onClick={() => setShowGenreSelectionModal(true)} variant='outline' size='sm' className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                            Choose Your Interests
                        </Button>
                    </>
                )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
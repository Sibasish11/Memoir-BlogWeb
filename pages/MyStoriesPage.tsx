
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BlogEntry } from '../types';
import Button from '../components/Button';
import BlogCard from '../components/BlogCard';
import { AppRoutes, LOCAL_STORAGE_BLOGS_KEY } from '../constants';
import PlusIcon from '../components/icons/PlusIcon';

const MyStoriesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [publishedBlogs, setPublishedBlogs] = useState<BlogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserBlogs = useCallback(() => {
    if (!user) {
      setPublishedBlogs([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const storedBlogs = localStorage.getItem(LOCAL_STORAGE_BLOGS_KEY);
    if (storedBlogs) {
      try {
        const allBlogs = JSON.parse(storedBlogs) as BlogEntry[];
        const currentUserPublishedBlogs = allBlogs
          .filter(blog => blog.authorId === user.id && blog.status === 'published')
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        setPublishedBlogs(currentUserPublishedBlogs);
      } catch (e) {
        console.error("Failed to parse blogs from localStorage:", e);
        setPublishedBlogs([]); 
      }
    } else {
      setPublishedBlogs([]); 
    }
    setIsLoading(false);
  }, [user]);
  
  useEffect(() => {
    fetchUserBlogs();
  }, [fetchUserBlogs]);

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
        fetchUserBlogs(); // Refresh the list
      } catch (e) {
        console.error("Failed to parse or update blogs in localStorage during delete:", e);
      }
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><p className="text-xl">Loading your stories...</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">My Published Stories</h1>
                <p className="mt-2 text-md text-gray-600">Here are the stories you've shared with the world.</p>
            </div>
             <Button 
              onClick={() => navigate(AppRoutes.Editor)} 
              variant="primary"
              size="md"
              className="flex items-center mt-4 sm:mt-0"
            >
              <PlusIcon className="w-5 h-5 mr-2" /> Write New Story
            </Button>
        </header>

        {publishedBlogs.length === 0 ? (
          <div className="text-center py-20 bg-white shadow-lg rounded-lg p-6">
            <img src="https://picsum.photos/seed/emptypublished/300/150" alt="No published stories" className="mx-auto mb-6 rounded-md shadow-sm"/>
            <h2 className="text-2xl font-semibold text-slate-700 mb-3">No posts yet.</h2>
            <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
              You haven't published any stories yet. Publish a draft or write something new to share your thoughts.
            </p>
            <div className="flex justify-center space-x-4">
                <Button onClick={() => navigate(AppRoutes.Dashboard)} variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                    View Dashboard & Drafts
                </Button>
                <Button onClick={() => navigate(AppRoutes.Editor)} variant="primary">
                    Start Writing
                </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {publishedBlogs.map(blog => (
              <BlogCard 
                key={blog.id} 
                blog={blog} 
                onEdit={handleEditBlog}
                onDelete={handleDeleteBlog}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyStoriesPage;

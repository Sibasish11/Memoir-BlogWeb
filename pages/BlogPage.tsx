
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BlogEntry, User } from '../types';
import { LOCAL_STORAGE_BLOGS_KEY, LOCAL_STORAGE_USERS_KEY, LOCAL_STORAGE_LIKES_KEY, dummyBlogsData, AppRoutes } from '../constants';
import NotFoundPage from './NotFoundPage';
import HeartIcon from '../components/icons/HeartIcon';
import Button from '../components/Button';
import UserCircleIcon from '../components/icons/UserCircleIcon';

const BlogPage: React.FC = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();
  const { user: currentUser, setShowGenreSelectionModal } = useAuth();

  const [blog, setBlog] = useState<BlogEntry | null | undefined>(undefined);
  const [author, setAuthor] = useState<Partial<User> | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (!blogId) {
      setBlog(null);
      return;
    }

    // Combine user-created blogs and dummy blogs
    const storedBlogsString = localStorage.getItem(LOCAL_STORAGE_BLOGS_KEY);
    const storedBlogs: BlogEntry[] = storedBlogsString ? JSON.parse(storedBlogsString) : [];
    const allBlogs = [...dummyBlogsData, ...storedBlogs.filter(sb => !dummyBlogsData.some(db => db.id === sb.id))];
    
    const foundBlog = allBlogs.find(b => b.id === blogId);
    setBlog(foundBlog || null);

    if (foundBlog) {
        setLikeCount(foundBlog.likes || 0);
        // Find author details
        if (foundBlog.authorId === 'memoir-official') {
            setAuthor({ name: foundBlog.authorName || 'Memoir Staff' });
        } else {
            const storedUsersString = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
            const storedUsers: User[] = storedUsersString ? JSON.parse(storedUsersString) : [];
            const foundAuthor = storedUsers.find(u => u.id === foundBlog.authorId);
            setAuthor(foundAuthor || { name: foundBlog.authorName || 'Unknown Author' });
        }

        // Check if current user has liked this post
        if (currentUser) {
            const allLikes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIKES_KEY) || '{}');
            const blogLikers: string[] = allLikes[blogId] || [];
            setIsLiked(blogLikers.includes(currentUser.id));
        }
    }
  }, [blogId, currentUser]);

  const handleLikeToggle = () => {
    if (!currentUser) {
      alert("Please log in to like posts.");
      navigate(AppRoutes.Home);
      return;
    }
    if (!blog) return;

    const allLikes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIKES_KEY) || '{}');
    let blogLikers: string[] = allLikes[blog.id] || [];
    
    let newLikesCount = likeCount;
    const newIsLiked = !isLiked;

    if (newIsLiked) {
      blogLikers.push(currentUser.id);
      newLikesCount++;
    } else {
      blogLikers = blogLikers.filter(id => id !== currentUser.id);
      newLikesCount--;
    }

    allLikes[blog.id] = blogLikers;
    localStorage.setItem(LOCAL_STORAGE_LIKES_KEY, JSON.stringify(allLikes));
    
    // Update the master blog list in localStorage as well
    const storedBlogsString = localStorage.getItem(LOCAL_STORAGE_BLOGS_KEY);
    const storedBlogs: BlogEntry[] = storedBlogsString ? JSON.parse(storedBlogsString) : [];
    const updatedBlogs = storedBlogs.map(b => 
      b.id === blog.id ? { ...b, likes: newLikesCount } : b
    );
    localStorage.setItem(LOCAL_STORAGE_BLOGS_KEY, JSON.stringify(updatedBlogs));

    setLikeCount(newLikesCount);
    setIsLiked(newIsLiked);
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  if (blog === undefined) {
    return <div className="flex justify-center items-center h-screen"><p className="text-xl">Loading story...</p></div>;
  }

  if (blog === null) {
    return <NotFoundPage />;
  }

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
            {blog.title}
          </h1>
          <div className="flex items-center space-x-4 text-gray-600">
             <div className="flex items-center">
                 <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-slate-200 mr-3">
                    <span className="text-lg font-medium leading-none text-slate-600">
                        {(author?.name || 'A').substring(0, 1).toUpperCase()}
                    </span>
                </span>
                <div>
                    <p className="font-semibold text-slate-800">{author?.name || 'Anonymous'}</p>
                    <p className="text-sm">Published on {formatDate(blog.createdAt)}</p>
                </div>
             </div>
          </div>
        </header>

        {blog.coverImageUrl && (
          <img 
            src={blog.coverImageUrl} 
            alt={blog.title} 
            className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg mb-8"
          />
        )}
        
        <div className="prose prose-lg max-w-none prose-slate text-gray-800 leading-relaxed mb-10" style={{whiteSpace: "pre-wrap"}}>
          {blog.content}
        </div>
        
        <footer className="pt-8 border-t border-gray-200">
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-3">
                  {blog.tags.map(tag => (
                    <span key={tag} className="bg-gray-200 rounded-full px-4 py-2 text-sm font-semibold text-gray-700">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-center space-x-4">
                <Button 
                    variant={isLiked ? 'primary' : 'outline'}
                    onClick={handleLikeToggle} 
                    aria-pressed={isLiked}
                    className={`transition-colors duration-200 ${isLiked ? 'bg-red-600 hover:bg-red-700 border-red-600 text-white' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                >
                    <HeartIcon className="w-5 h-5 mr-2" isFilled={isLiked} />
                    <span>{isLiked ? 'Liked' : 'Like'}</span>
                </Button>
                <p className="font-semibold text-gray-700">{likeCount} {likeCount === 1 ? 'like' : 'likes'}</p>
            </div>
        </footer>
      </article>
    </div>
  );
};

export default BlogPage;
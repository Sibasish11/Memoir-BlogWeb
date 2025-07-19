
import React from 'react';
import { BlogEntry } from '../types';
import Button from './Button';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';
import { Link, useNavigate } from 'react-router-dom';
import { AppRoutes } from '../constants';
import HeartIcon from './icons/HeartIcon';

interface BlogCardProps {
  blog: BlogEntry;
  onEdit?: (id: string) => void; 
  onDelete?: (id: string) => void; 
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(blog.id);
    }
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
        onDelete(blog.id);
      }
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <Link 
      to={AppRoutes.Blog.replace(':blogId', blog.id)}
      aria-label={`Read more about ${blog.title}`}
      className="bg-white shadow-xl rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col group"
    >
      <div className="overflow-hidden">
        {blog.coverImageUrl ? (
          <img src={blog.coverImageUrl} alt={blog.title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"/>
        ) : (
          <div className="w-full h-48 bg-gray-300 flex items-center justify-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{blog.title}</h3>
        
        <div className="flex items-center justify-between text-gray-500 text-sm mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide">
              <span className={`${blog.status === 'published' ? 'text-green-600' : 'text-amber-600'}`}>
                {blog.status}
              </span>
            </p>
            <div className="flex items-center space-x-1">
              <HeartIcon className="w-4 h-4 text-red-500" isFilled={true} />
              <span className="font-medium">{blog.likes || 0}</span>
            </div>
        </div>
        
        <p className="text-gray-600 line-clamp-3 mb-4 flex-grow">
          {blog.content}
        </p>

        {blog.tags && blog.tags.length > 0 && (
          <div className="mb-4">
            {blog.tags.slice(0, 3).map(tag => (
              <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {(onEdit || onDelete) && (
          <div className="flex justify-end space-x-3 mt-auto pt-4 border-t border-gray-100">
            {onEdit && (
              <Button onClick={(e) => handleActionClick(e, handleEditClick)} variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white z-10">
                <PencilIcon className="w-4 h-4 mr-2" /> Edit
              </Button>
            )}
            {onDelete && (
              <Button onClick={(e) => handleActionClick(e, handleDeleteClick)} variant="danger" size="sm" className="z-10">
                <TrashIcon className="w-4 h-4 mr-2" /> Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default BlogCard;
import React from 'react';
import BlogCard from '../components/BlogCard';
import { dummyBlogsData } from '../constants'; 

const ReadingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">Explore Stories</h1>
          <p className="mt-2 text-md text-gray-600">Discover articles and insights from the MEMOIR community.</p>
        </header>

        {dummyBlogsData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No stories available at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {dummyBlogsData.map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingPage;
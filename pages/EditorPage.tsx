
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BlogEntry } from '../types';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import Button from '../components/Button';
import { AppRoutes, LOCAL_STORAGE_BLOGS_KEY } from '../constants';

const EditorPage: React.FC = () => {
  const { blogId } = useParams<{ blogId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState(''); 
  const [coverImage, setCoverImage] = useState<File | null>(null); 
  const [coverImageName, setCoverImageName] = useState<string | undefined>(undefined); 
  const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>(undefined); 
  const [newSelectedImagePreview, setNewSelectedImagePreview] = useState<string | null>(null); 
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchBlogDetails = useCallback(() => {
    if (blogId && user) {
      const storedBlogs = localStorage.getItem(LOCAL_STORAGE_BLOGS_KEY);
      if (storedBlogs) {
        const blogs = JSON.parse(storedBlogs) as BlogEntry[];
        const blogToEdit = blogs.find(b => b.id === blogId && b.authorId === user.id);
        if (blogToEdit) {
          setTitle(blogToEdit.title);
          setContent(blogToEdit.content);
          setTags(blogToEdit.tags.join(', '));
          setCoverImageName(blogToEdit.coverImageName); 
          setCoverImageUrl(blogToEdit.coverImageUrl); 
          setCoverImage(null); 
          if (newSelectedImagePreview) { 
            URL.revokeObjectURL(newSelectedImagePreview);
          }
          setNewSelectedImagePreview(null); 
        } else {
          setErrorMessage("Blog post not found or you don't have permission to edit it.");
        }
      }
    } else {
        setTitle('');
        setContent('');
        setTags('');
        setCoverImage(null);
        setCoverImageName(undefined);
        setCoverImageUrl(undefined);
        if (newSelectedImagePreview) {
          URL.revokeObjectURL(newSelectedImagePreview);
        }
        setNewSelectedImagePreview(null);
    }
  }, [blogId, user, newSelectedImagePreview]);
  
  useEffect(() => {
    fetchBlogDetails();
  }, [fetchBlogDetails]);

  useEffect(() => {
    const currentPreviewUrl = newSelectedImagePreview;
    return () => {
      if (currentPreviewUrl) {
        URL.revokeObjectURL(currentPreviewUrl);
      }
    };
  }, [newSelectedImagePreview]);


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (newSelectedImagePreview) { 
      URL.revokeObjectURL(newSelectedImagePreview);
    }

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file); 
      setCoverImageName(file.name); 
      setNewSelectedImagePreview(URL.createObjectURL(file)); 
      setCoverImageUrl(undefined); 
    } else { 
      setCoverImage(null);
      setCoverImageName(undefined);
      setNewSelectedImagePreview(null);
    }
  };

  const handleSubmit = async (status: 'published' | 'draft') => {
    if (!user) {
      setErrorMessage("You must be logged in to save a blog post.");
      return;
    }
    if (!title.trim() || !content.trim()) {
      setErrorMessage("Title and content cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let finalCoverImageUrl = coverImageUrl; 
    let finalCoverImageName = coverImageName;

    if (coverImage) { 
      finalCoverImageUrl = `https://picsum.photos/seed/${encodeURIComponent(coverImage.name)}/600/400`; 
      finalCoverImageName = coverImage.name;
    } else if (!blogId && !finalCoverImageUrl) { 
        finalCoverImageName = undefined;
        finalCoverImageUrl = undefined;
    }

    const storedBlogs = localStorage.getItem(LOCAL_STORAGE_BLOGS_KEY);
    let blogs: BlogEntry[] = storedBlogs ? JSON.parse(storedBlogs) : [];
    const existingBlog = blogId ? blogs.find(b => b.id === blogId) : undefined;

    const blogEntry: BlogEntry = {
      id: blogId || Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      authorId: user.id,
      authorName: user.name || user.email.split('@')[0],
      createdAt: existingBlog ? existingBlog.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status,
      coverImageName: finalCoverImageName,
      coverImageUrl: finalCoverImageUrl,
      likes: existingBlog ? existingBlog.likes || 0 : 0
    };

    if (blogId) {
      blogs = blogs.map(b => b.id === blogId ? blogEntry : b);
    } else {
      blogs.push(blogEntry);
    }
    localStorage.setItem(LOCAL_STORAGE_BLOGS_KEY, JSON.stringify(blogs));

    setIsSubmitting(false);
    navigate(AppRoutes.Dashboard);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800">
            {blogId ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {blogId ? 'Refine your thoughts and update your story.' : 'Share your story with the world, or save it as a draft.'}
          </p>
        </header>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {errorMessage}
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6 bg-white p-6 sm:p-8 shadow-xl rounded-lg">
          <Input
            label="Title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Your Amazing Blog Title"
            required
            className="text-lg font-semibold"
          />
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <TextArea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your masterpiece here..."
              required
              rows={15}
              className="min-h-[300px]"
            />
            <p className="mt-1 text-xs text-gray-500">
              Note: This is a simple text area. A full version would include a rich text editor.
            </p>
          </div>

          <Input
            label="Tags (comma-separated)"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., travel, tech, personal"
          />

          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image (Optional)
            </label>
            <input
              type="file"
              id="coverImage"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
            
            {newSelectedImagePreview && (
              <img src={newSelectedImagePreview} alt="New cover preview" className="mt-3 max-h-48 w-auto rounded-md shadow-md"/>
            )}
            {!newSelectedImagePreview && coverImageUrl && (
              <img src={coverImageUrl} alt="Current cover" className="mt-3 max-h-48 w-auto rounded-md shadow-md"/>
            )}
            {(coverImageName && !newSelectedImagePreview && !coverImageUrl) && ( 
                 <p className="mt-1 text-xs text-gray-500">Selected: {coverImageName}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Image upload is mocked for this demo.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={() => handleSubmit('draft')}
              variant="secondary"
              isLoading={isSubmitting}
              className="w-full sm:w-auto"
            >
              Save as Draft
            </Button>
            <Button
              type="button"
              onClick={() => handleSubmit('published')}
              variant="primary"
              isLoading={isSubmitting}
              className="w-full sm:w-auto"
            >
              {blogId ? 'Update Post' : 'Publish'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditorPage;
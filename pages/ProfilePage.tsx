import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import GenreSelectionModal from '../components/GenreSelectionModal';

const ProfilePage: React.FC = () => {
  const { user, setShowGenreSelectionModal, showGenreSelectionModal } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
        <p className="text-xl text-gray-600">Loading user profile or not logged in...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      {showGenreSelectionModal && <GenreSelectionModal />}
      <div className="max-w-3xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-800">My Profile</h1>
          <p className="mt-2 text-md text-gray-600">Manage your account details and preferences.</p>
        </header>

        <div className="space-y-8">
          {/* User Information Card */}
          <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6 border-b pb-3">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Name</label>
                <p className="mt-1 text-lg text-gray-900">{user.name || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-lg text-gray-900">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Genre Preferences Card */}
          <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
                 <h2 className="text-2xl font-semibold text-slate-800">Your Interests</h2>
                 <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowGenreSelectionModal(true)}
                    className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                 >
                    Change Interests
                </Button>
            </div>
            {user.selectedGenres && user.selectedGenres.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {user.selectedGenres.map((genre) => (
                  <span
                    key={genre}
                    className="bg-blue-100 text-blue-700 text-sm font-medium px-4 py-2 rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">You haven't selected any interests yet. Update them to get personalized content!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
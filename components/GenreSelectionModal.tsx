import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AVAILABLE_GENRES } from '../constants';
import Button from './Button';
import Modal from './Modal';

const MIN_GENRES_REQUIRED = 3;

const GenreSelectionModal: React.FC = () => {
  const { user, saveUserGenres, setShowGenreSelectionModal, showGenreSelectionModal } = useAuth();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.selectedGenres) {
      setSelectedGenres(user.selectedGenres);
    }
  }, [user]);

  const handleToggleGenre = (genre: string) => {
    setError(null); 
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleSavePreferences = () => {
    if (selectedGenres.length < MIN_GENRES_REQUIRED) {
      setError(`Please select at least ${MIN_GENRES_REQUIRED} genres to personalize your feed.`);
      return;
    }
    saveUserGenres(selectedGenres);
  };

  if (!showGenreSelectionModal) {
    return null;
  }

  return (
    <Modal 
      isOpen={showGenreSelectionModal} 
      onClose={() => {
        if (user?.selectedGenres && user.selectedGenres.length >= MIN_GENRES_REQUIRED) {
            setShowGenreSelectionModal(false);
        } else {
            setError(`Please select at least ${MIN_GENRES_REQUIRED} genres to continue.`);
        }
      }}
      title="Personalize Your Experience"
    >
      <div className="space-y-4">
        <p className="text-gray-600">
          Help us tailor your content by selecting a few topics you're interested in. 
          Choose at least {MIN_GENRES_REQUIRED}.
        </p>
        
        <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-2 border border-gray-300 rounded-md bg-gray-50">
          {AVAILABLE_GENRES.map(genre => (
            <button
              key={genre}
              onClick={() => handleToggleGenre(genre)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ease-in-out border
                ${selectedGenres.includes(genre) 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white text-gray-800 hover:bg-gray-200 border-gray-300'
                }`}
            >
              {selectedGenres.includes(genre) ? `✓ ${genre}` : `+ ${genre}`}
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        
        <p className="text-sm text-gray-500">
          Selected: {selectedGenres.length} / {MIN_GENRES_REQUIRED} minimum
        </p>

        <Button
          onClick={handleSavePreferences}
          variant="primary"
          className="w-full"
          disabled={selectedGenres.length < MIN_GENRES_REQUIRED}
        >
          Save Preferences & Continue
        </Button>
      </div>
    </Modal>
  );
};

export default GenreSelectionModal;
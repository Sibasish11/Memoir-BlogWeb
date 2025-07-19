
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { LOCAL_STORAGE_SESSION_KEY, LOCAL_STORAGE_USERS_KEY, AppRoutes, LOCAL_STORAGE_USER_PREFERENCES_KEY } from '../constants';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  showGenreSelectionModal: boolean;
  setShowGenreSelectionModal: React.Dispatch<React.SetStateAction<boolean>>;
  saveUserGenres: (genres: string[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showGenreSelectionModal, setShowGenreSelectionModal] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedSession = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
    if (storedSession) {
      try {
        const sessionUser = JSON.parse(storedSession) as User;
        // No need to load preferences here again if they are part of sessionUser
        setUser(sessionUser); 
      } catch (e) {
        console.error("Failed to parse session user:", e);
        localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const getUsers = (): User[] => {
    const storedUsers = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    return storedUsers ? JSON.parse(storedUsers) : [];
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
  };

  const getUserPreferences = (userId: string): string[] | undefined => {
    const allPrefsString = localStorage.getItem(LOCAL_STORAGE_USER_PREFERENCES_KEY);
    if (allPrefsString) {
      const allPrefs: Record<string, string[]> = JSON.parse(allPrefsString);
      return allPrefs[userId];
    }
    return undefined;
  };

  const handleSuccessfulAuth = (authUser: User) => {
    const preferences = getUserPreferences(authUser.id);
    let userToSet = { ...authUser };

    if (preferences && preferences.length > 0) {
      userToSet.selectedGenres = preferences;
      setUser(userToSet);
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(userToSet));
      setShowGenreSelectionModal(false);
      navigate(AppRoutes.Dashboard);
    } else {
      // Set basic user, selectedGenres will be undefined
      setUser(userToSet); 
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(userToSet));
      setShowGenreSelectionModal(true); // Prompt for genre selection
      // Navigate to dashboard, modal will overlay
      navigate(AppRoutes.Dashboard);
    }
    setIsLoading(false);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const users = getUsers();
    const foundUser = users.find(u => u.email === email);

    if (foundUser) {
      handleSuccessfulAuth(foundUser);
    } else {
      setError("Invalid email or password.");
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 1000));
    let users = getUsers();
    if (users.find(u => u.email === email)) {
      setError("User with this email already exists.");
      setIsLoading(false);
      return;
    }

    const newUser: User = { 
      id: Date.now().toString(), 
      email, 
      name: name || email.split('@')[0],
      // selectedGenres will be populated by handleSuccessfulAuth or genre modal
    };
    users.push(newUser);
    saveUsers(users);
    handleSuccessfulAuth(newUser);
  };

  const logout = () => {
    setUser(null);
    setShowGenreSelectionModal(false); // Reset modal state on logout
    localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
    // Optionally clear preferences for the user if desired, or keep them for next login
    // For now, preferences in LOCAL_STORAGE_USER_PREFERENCES_KEY are persisted
    navigate(AppRoutes.Home);
  };

  const saveUserGenres = (genres: string[]) => {
    if (!user) return;

    const allPrefsString = localStorage.getItem(LOCAL_STORAGE_USER_PREFERENCES_KEY);
    const allPrefs: Record<string, string[]> = allPrefsString ? JSON.parse(allPrefsString) : {};
    allPrefs[user.id] = genres;
    localStorage.setItem(LOCAL_STORAGE_USER_PREFERENCES_KEY, JSON.stringify(allPrefs));

    const updatedUser: User = { ...user, selectedGenres: genres };
    setUser(updatedUser);
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(updatedUser)); // Persist updated user to session
    setShowGenreSelectionModal(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      error, 
      login, 
      signup, 
      logout, 
      showGenreSelectionModal, 
      setShowGenreSelectionModal,
      saveUserGenres
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

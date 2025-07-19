import React, { useState } from 'react';
import Button from '../components/Button';
import Modal from '../components/Modal';
import AuthForm from '../components/AuthForm';

const HomePage: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white p-4 relative">
      <header className="text-center mb-12 z-10 flex flex-col items-center">
        <h1 className="text-8xl md:text-9xl font-whispering font-bold mb-4 text-white">MEMOIR</h1>
        <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto">
          Your personal space to write, reflect, and share. Create beautiful blog entries with ease.
        </p>
      </header>
      
      <main className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 z-10">
        <Button 
          variant="primary" 
          size="lg" 
          onClick={() => setIsLoginModalOpen(true)}
          className="shadow-lg transform hover:scale-105 transition-transform duration-150"
        >
          Log In
        </Button>
        <Button 
          variant="secondary" 
          size="lg" 
          onClick={() => setIsSignUpModalOpen(true)}
          className="bg-slate-200 hover:bg-slate-300 text-slate-800 shadow-lg transform hover:scale-105 transition-transform duration-150"
        >
          Sign Up
        </Button>
      </main>

      <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} title="Log In to MEMOIR">
        <AuthForm onSuccess={() => setIsLoginModalOpen(false)} />
      </Modal>

      <Modal isOpen={isSignUpModalOpen} onClose={() => setIsSignUpModalOpen(false)} title="Join MEMOIR">
        <AuthForm isSignUp onSuccess={() => setIsSignUpModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default HomePage;
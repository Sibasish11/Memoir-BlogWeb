import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-slate-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="border-t border-slate-700 pt-8 text-center">
          <p className="text-sm text-slate-500">&copy; 2025 MEMOIR. All rights reserved.</p>
          <p className="text-xs text-slate-600 mt-2">Crafted with ❤️ for writers by Sibasish.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
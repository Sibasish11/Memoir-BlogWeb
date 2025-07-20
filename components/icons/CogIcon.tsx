
import React from 'react';

interface IconProps {
  className?: string;
}

const CogIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-.962a8.97 8.97 0 0 1 5.961 3.427c.493.596.226 1.48-.37 1.837L14.4 9.428M9.594 3.94a8.968 8.968 0 0 0-5.961 3.427c-.493.596-.226 1.48.37 1.837L5.6 9.428m0 0a8.967 8.967 0 0 1-2.326 3.127M5.6 9.428a8.967 8.967 0 0 0 2.326 3.127m10.174-3.127a8.967 8.967 0 0 1 2.326 3.127M15.6 9.428a8.967 8.967 0 0 0-2.326 3.127m0 0L12 12.75V15l2.115 1.408M12 12.75L9.885 15l-2.115-1.408M14.4 9.428 12 12.75l-2.4-3.322M12 12.75l2.4 3.322M12 12.75 9.6 9.428m6 0a8.97 8.97 0 0 1-5.961-3.427M9.594 3.94A8.97 8.97 0 0 0 3.633 7.367M12 3a9 9 0 0 1 9 9h-3a6 6 0 0 0-6-6V3Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15V21" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25A8.963 8.963 0 0 0 5.25 12H3a9 9 0 0 1 9-9Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

export default CogIcon;


import React from 'react';

interface IconProps {
  className?: string;
}

const UserIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A18.732 18.732 0 0 1 12 22.5c-2.786 0-5.433-.608-7.499-1.632Z" />
  </svg>
);

export default UserIcon;

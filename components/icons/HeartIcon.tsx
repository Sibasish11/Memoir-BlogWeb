
import React from 'react';

interface IconProps {
  className?: string;
  isFilled?: boolean;
}

const HeartIcon: React.FC<IconProps> = ({ className = "w-5 h-5", isFilled = false }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill={isFilled ? "currentColor" : "none"} 
    stroke="currentColor" 
    strokeWidth={1.5} 
    className={className}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" 
    />
  </svg>
);

export default HeartIcon;
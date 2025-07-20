import React from 'react';

const LogoIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path
      d="M4 18V6L12 14L20 6V18"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default LogoIcon;
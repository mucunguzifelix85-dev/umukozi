import React from "react";

export const UmukoziLogo: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    {/* Head */}
    <circle cx="50" cy="18" r="10" fill="#16a34a" />

    {/* Load/Box on head */}
    <rect x="33" y="4" width="34" height="10" rx="2" fill="#15803d" />

    {/* Body */}
    <path d="M50 28 C38 32 32 45 34 62 L66 62 C68 45 62 32 50 28Z" fill="#16a34a" />

    {/* Left arm bent forward under load */}
    <path d="M34 35 Q22 38 24 50" stroke="#16a34a" strokeWidth="7" strokeLinecap="round" fill="none" />

    {/* Right arm bent forward under load */}
    <path d="M66 35 Q78 38 76 50" stroke="#16a34a" strokeWidth="7" strokeLinecap="round" fill="none" />

    {/* Left leg */}
    <path d="M40 62 Q36 78 34 90" stroke="#16a34a" strokeWidth="7" strokeLinecap="round" fill="none" />

    {/* Right leg */}
    <path d="M60 62 Q64 78 66 90" stroke="#16a34a" strokeWidth="7" strokeLinecap="round" fill="none" />
  </svg>
);

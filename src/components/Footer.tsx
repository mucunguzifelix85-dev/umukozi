import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-auto py-4 px-4 bg-black border-t border-white/10 flex flex-col items-center gap-2 text-center">
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] uppercase tracking-widest font-black text-[#00A550]">
          Support Numbers
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <a href="tel:+250789136987" className="text-[11px] font-bold text-gray-300 hover:text-[#00A550]">
            +250 789 136 987
          </a>
          <span className="text-gray-600">•</span>
          <a href="tel:+250780867473" className="text-[11px] font-bold text-gray-300 hover:text-[#00A550]">
            +250 780 867 473
          </a>
          <span className="text-gray-600">•</span>
          <a href="tel:+250798582533" className="text-[11px] font-bold text-gray-300 hover:text-[#00A550]">
            +250 798 582 533
          </a>
        </div>
      </div>
      <span className="text-[10px] uppercase tracking-widest font-black text-gray-500 mt-1">
        Powered by <span className="text-white">VAF Ubwenge Tech</span>
      </span>
    </footer>
  );
};


import React from 'react';

const Header: React.FC = () => {
  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-3">
            {/* Logo image removed as per request */}
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              RealEstate <span className="text-emerald-600">MPF</span>
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation links removed as per request */}
            <button className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-800 transition shadow-sm">
              Analyze Location
            </button>
          </div>
          {/* Mobile menu icon */}
          <div className="md:hidden flex items-center">
             <button className="text-slate-600">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
               </svg>
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;

import React from 'react';

const SkeletonProjectCard = () => {
  return (
    <div className="px-[12px] py-[12px] relative group rounded-[20px] shadow-md border border-slate-200 transition duration-200 ease-in-out bg-white overflow-hidden h-[207px] max-w-[731px] w-full">
      {/* Effet de vague animé avec un meilleur contraste */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-gray-100 via-gray-200/70 to-gray-100"></div>
      
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        {/* Avatar placeholder - CARRÉ et non rond */}
        <div className="flex items-center gap-3">
          <div className="w-[50px] h-[50px] bg-gray-200 rounded-sm relative overflow-hidden">
            {/* Animation de pulsation au sein de l'avatar */}
            <div className="absolute inset-0 animate-[pulse_0.7s_ease-in-out_infinite] bg-gradient-to-r from-gray-200 to-gray-300"></div>
          </div>
          <div className="h-4 w-32 bg-gray-200 rounded animate-[pulse_0.7s_ease-in-out_infinite]"></div>
        </div>
        
        {/* Bookmark icon placeholder */}
        <div className="h-6 w-6 bg-gray-200 rounded animate-[pulse_0.7s_ease-in-out_infinite]"></div>
      </div>
      
      {/* Card body */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <div className="h-6 w-3/4 bg-gray-200 rounded animate-[pulse_0.7s_ease-in-out_infinite]"></div>
        
        {/* Tech stack placeholders */}
        <div className="flex flex-wrap gap-2 py-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-6 w-16 bg-gray-200 rounded-[3px] animate-[pulse_0.7s_ease-in-out_infinite]"></div>
          ))}
        </div>
        
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between p-4">
        {/* Creator info placeholder - CARRÉ et non rond */}
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-gray-200 rounded-sm relative overflow-hidden">
            {/* Animation de pulsation au sein de l'avatar */}
            <div className="absolute inset-0 animate-[pulse_0.7s_ease-in-out_infinite] bg-gradient-to-r from-gray-200 to-gray-300"></div>
          </div>
          <div className="h-3 w-20 bg-gray-200 rounded animate-[pulse_0.7s_ease-in-out_infinite]"></div>
        </div>
        
        {/* Status placeholder */}
        <div className="h-6 w-20 bg-gray-200 rounded-[3px] animate-[pulse_0.7s_ease-in-out_infinite]"></div>
      </div>
    </div>
  );
};

export default SkeletonProjectCard; 
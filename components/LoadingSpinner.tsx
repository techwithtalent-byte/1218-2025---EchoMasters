import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex justify-center items-center py-20">
            <div 
                className="w-12 h-12 border-4 border-gray-700 border-t-[#d4af37] rounded-full"
                style={{ animation: 'spin 1s linear infinite' }}
            ></div>
        </div>
    );
};

export default LoadingSpinner;
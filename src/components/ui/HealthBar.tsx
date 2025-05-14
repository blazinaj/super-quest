import React from 'react';

interface HealthBarProps {
  current: number;
  max: number;
  bgColor?: string;
}

const HealthBar: React.FC<HealthBarProps> = ({ 
  current, 
  max, 
  bgColor = 'bg-green-600' 
}) => {
  const percentage = (current / max) * 100;
  
  // Determine color based on health percentage
  let barColor = bgColor;
  if (!bgColor.includes('red') && !bgColor.includes('green')) {
    if (percentage <= 20) {
      barColor = 'bg-red-600';
    } else if (percentage <= 50) {
      barColor = 'bg-yellow-500';
    }
  }
  
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-indigo-200 mb-1">
        <span>HP</span>
        <span>{current}/{max}</span>
      </div>
      <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${barColor} transition-width duration-300 ease-out`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default HealthBar;
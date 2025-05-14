import React from 'react';
import { Sword } from 'lucide-react';

const Title: React.FC = () => {
  return (
    <div className="flex items-center justify-center mb-6 animate-pulse">
      <Sword className="w-10 h-10 text-yellow-400 mr-2" />
      <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 tracking-wider">
        SUPER QUEST
      </h1>
      <Sword className="w-10 h-10 text-yellow-400 ml-2 transform scale-x-[-1]" />
    </div>
  );
};

export default Title;
import React, { useRef, useEffect } from 'react';

interface BattleLogProps {
  messages: string[];
}

const BattleLog: React.FC<BattleLogProps> = ({ messages }) => {
  const logRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages]);
  
  return (
    <div className="w-full">
      <h3 className="text-yellow-200 font-bold mb-2">Battle Log</h3>
      <div 
        ref={logRef}
        className="bg-indigo-900/80 p-3 rounded-lg border border-indigo-600 h-32 overflow-y-auto text-sm"
      >
        {messages.length === 0 ? (
          <div className="text-indigo-300 italic">The battle begins...</div>
        ) : (
          <div className="space-y-1">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`${
                  message.includes('defeated') || message.includes('Level up')
                    ? 'text-yellow-300 font-bold'
                    : message.includes('for') && message.includes('damage')
                      ? message.includes('You attack')
                        ? 'text-green-300'
                        : 'text-red-300'
                      : 'text-indigo-200'
                }`}
              >
                {message}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BattleLog;
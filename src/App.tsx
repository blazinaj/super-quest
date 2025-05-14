import React from 'react';
import { GameProvider } from './context/GameContext';
import GameContainer from './components/GameContainer';
import Title from './components/Title';

function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-indigo-950 flex flex-col items-center justify-center p-4">
        <Title />
        <GameContainer />
      </div>
    </GameProvider>
  );
}

export default App;
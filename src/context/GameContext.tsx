import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { gameReducer, initialGameState } from '../reducers/gameReducer';
import { GameState, GameAction, GameContextType } from '../types/gameTypes';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load game state from localStorage if it exists
  const savedState = localStorage.getItem('superQuestGameState');
  const parsedSavedState = savedState ? JSON.parse(savedState) : null;
  
  const [state, dispatch] = useReducer(
    gameReducer, 
    parsedSavedState || initialGameState
  );
  
  // Save game state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('superQuestGameState', JSON.stringify(state));
  }, [state]);
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};
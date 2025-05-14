import React from 'react';
import { useGame } from '../../context/GameContext';
import Button from '../ui/Button';
import PlayerStats from '../ui/PlayerStats';
import { ArrowLeft, Option as Potion, Shield, Sword } from 'lucide-react';

const InventoryScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  
  const handleUseItem = (itemId: string) => {
    const item = state.inventory.find(i => i.id === itemId);
    if (item) {
      dispatch({ type: 'USE_ITEM', payload: item });
    }
  };
  
  const getItemIcon = (type: string) => {
    switch(type) {
      case 'weapon':
        return <Sword className="w-4 h-4" />;
      case 'armor':
        return <Shield className="w-4 h-4" />;
      case 'consumable':
      default:
        return <Potion className="w-4 h-4" />;
    }
  };
  
  return (
    <div className="flex flex-col p-4 min-h-[600px]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-yellow-300 mb-2">Inventory</h2>
        <PlayerStats player={state.player} />
      </div>
      
      <div className="flex-1 mb-6">
        <div className="bg-indigo-800/40 p-4 rounded-lg">
          <h3 className="text-yellow-200 text-lg font-bold mb-3">Items ({state.inventory.length})</h3>
          
          {state.inventory.length === 0 ? (
            <div className="text-center py-8 text-indigo-300">
              Your inventory is empty
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {state.inventory.map(item => (
                <div key={item.id} className="bg-indigo-800/80 p-3 rounded-lg flex items-center border border-indigo-600">
                  <div className="w-10 h-10 bg-indigo-700 rounded-full flex items-center justify-center text-indigo-200 mr-3">
                    {getItemIcon(item.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-yellow-200 font-bold">{item.name}</h4>
                    <p className="text-indigo-200 text-sm">{item.description}</p>
                  </div>
                  {item.type === 'consumable' && (
                    <Button 
                      onClick={() => handleUseItem(item.id)} 
                      small 
                      primary
                    >
                      Use
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-auto">
        <Button 
          onClick={() => dispatch({ type: 'CHANGE_SCREEN', payload: 'map' })} 
          secondary 
          icon={<ArrowLeft className="w-4 h-4 mr-1" />}
        >
          Back to Map
        </Button>
      </div>
    </div>
  );
};

export default InventoryScreen;
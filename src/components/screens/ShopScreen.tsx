import React from 'react';
import { useGame } from '../../context/GameContext';
import Button from '../ui/Button';
import PlayerStats from '../ui/PlayerStats';
import { ShoppingBag, RefreshCw, ArrowLeft } from 'lucide-react';
import { getRarityColor } from '../../utils/itemUtils';
import { Item } from '../../types/gameTypes';

const ShopScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  
  const handleBuyItem = (item: Item) => {
    if (state.player.gold >= item.price) {
      dispatch({ type: 'BUY_ITEM', payload: item });
    }
  };
  
  const handleSellItem = (item: Item) => {
    dispatch({ type: 'SELL_ITEM', payload: item });
  };
  
  const handleRefreshShop = () => {
    dispatch({ type: 'REFRESH_SHOP' });
  };
  
  const renderItem = (item: Item, isSelling: boolean = false) => {
    const price = isSelling ? item.value : item.price;
    const canAfford = !isSelling && state.player.gold >= price;
    
    return (
      <div key={item.id} className="bg-indigo-800/80 p-3 rounded-lg border border-indigo-600 mb-2">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className={`font-bold ${getRarityColor(item.rarity)}`}>{item.name}</h4>
            <p className="text-indigo-200 text-sm">{item.description}</p>
            <p className="text-yellow-300 text-sm">{price} Gold</p>
          </div>
          <Button
            onClick={() => isSelling ? handleSellItem(item) : handleBuyItem(item)}
            small
            primary={canAfford || isSelling}
            disabled={!isSelling && !canAfford}
          >
            {isSelling ? 'Sell' : 'Buy'}
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col p-4 min-h-[600px]">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-yellow-300">Shop</h2>
          <Button
            onClick={handleRefreshShop}
            secondary
            icon={<RefreshCw className="w-4 h-4 mr-1" />}
          >
            Refresh Stock
          </Button>
        </div>
        <PlayerStats player={state.player} />
      </div>
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Shop Items */}
        <div className="bg-indigo-800/40 p-4 rounded-lg">
          <h3 className="text-yellow-200 text-lg font-bold mb-3 flex items-center">
            <ShoppingBag className="w-4 h-4 mr-2" /> Available Items
          </h3>
          <div className="space-y-2">
            {state.shopInventory.map(item => renderItem(item))}
          </div>
        </div>
        
        {/* Inventory */}
        <div className="bg-indigo-800/40 p-4 rounded-lg">
          <h3 className="text-yellow-200 text-lg font-bold mb-3">Your Items</h3>
          <div className="space-y-2">
            {state.inventory.map(item => renderItem(item, true))}
          </div>
        </div>
      </div>
      
      <div className="mt-4">
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
}

export default ShopScreen;
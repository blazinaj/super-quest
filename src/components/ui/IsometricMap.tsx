import React from 'react';
import { Castle, Trees, Mountain, Skull, Waves, Circle, Crosshair } from 'lucide-react';

export interface MapTile {
  x: number;
  y: number;
  type: 'grass' | 'water' | 'mountain' | 'forest' | 'castle' | 'crypt';
  accessible: boolean;
  discovered: boolean;
}

interface IsometricMapProps {
  onTileSelect: (x: number, y: number, type: string) => void;
  selectedTile?: { x: number; y: number } | null;
  playerPosition?: { x: number; y: number } | null;
}

const IsometricMap: React.FC<IsometricMapProps> = ({ onTileSelect, selectedTile, playerPosition }) => {
  const [hoveredTile, setHoveredTile] = React.useState<{ x: number; y: number } | null>(null);

  // Define the map layout (7x7 grid)
  const mapLayout: MapTile[][] = [
    [
      { x: 0, y: 0, type: 'grass', accessible: true, discovered: true },
      { x: 0, y: 1, type: 'grass', accessible: true, discovered: true },
      { x: 0, y: 2, type: 'water', accessible: false, discovered: true },
      { x: 0, y: 3, type: 'castle', accessible: true, discovered: true },
      { x: 0, y: 4, type: 'water', accessible: false, discovered: true },
      { x: 0, y: 5, type: 'grass', accessible: true, discovered: true },
      { x: 0, y: 6, type: 'grass', accessible: true, discovered: true },
    ],
    [
      { x: 1, y: 0, type: 'grass', accessible: true, discovered: true },
      { x: 1, y: 1, type: 'forest', accessible: true, discovered: true },
      { x: 1, y: 2, type: 'grass', accessible: true, discovered: true },
      { x: 1, y: 3, type: 'grass', accessible: true, discovered: true },
      { x: 1, y: 4, type: 'grass', accessible: true, discovered: true },
      { x: 1, y: 5, type: 'forest', accessible: true, discovered: true },
      { x: 1, y: 6, type: 'grass', accessible: true, discovered: true },
    ],
    [
      { x: 2, y: 0, type: 'water' },
      { x: 2, y: 1, type: 'grass' },
      { x: 2, y: 2, type: 'mountain' },
      { x: 2, y: 3, type: 'grass' },
      { x: 2, y: 4, type: 'mountain' },
      { x: 2, y: 5, type: 'grass' },
      { x: 2, y: 6, type: 'water' },
    ],
    [
      { x: 3, y: 0, type: 'grass' },
      { x: 3, y: 1, type: 'grass' },
      { x: 3, y: 2, type: 'grass' },
      { x: 3, y: 3, type: 'crypt' },
      { x: 3, y: 4, type: 'grass' },
      { x: 3, y: 5, type: 'grass' },
      { x: 3, y: 6, type: 'grass' },
    ],
    [
      { x: 4, y: 0, type: 'water' },
      { x: 4, y: 1, type: 'grass' },
      { x: 4, y: 2, type: 'mountain' },
      { x: 4, y: 3, type: 'grass' },
      { x: 4, y: 4, type: 'mountain' },
      { x: 4, y: 5, type: 'grass' },
      { x: 4, y: 6, type: 'water' },
    ],
    [
      { x: 5, y: 0, type: 'grass' },
      { x: 5, y: 1, type: 'forest' },
      { x: 5, y: 2, type: 'grass' },
      { x: 5, y: 3, type: 'grass' },
      { x: 5, y: 4, type: 'grass' },
      { x: 5, y: 5, type: 'forest' },
      { x: 5, y: 6, type: 'grass' },
    ],
    [
      { x: 6, y: 0, type: 'grass' },
      { x: 6, y: 1, type: 'grass' },
      { x: 6, y: 2, type: 'water' },
      { x: 6, y: 3, type: 'grass' },
      { x: 6, y: 4, type: 'water' },
      { x: 6, y: 5, type: 'grass' },
      { x: 6, y: 6, type: 'grass' },
    ],
  ];

  const isAdjacent = (x1: number, y1: number, x2: number, y2: number): boolean => {
    return Math.abs(x1 - x2) <= 1 && Math.abs(y1 - y2) <= 1;
  };

  const isTileAccessible = (x: number, y: number): boolean => {
    if (!playerPosition) return true; // Allow movement if no player position is set
    const tile = mapLayout[x][y];
    return tile.accessible && isAdjacent(x, y, playerPosition.x, playerPosition.y);
  };

  const getTileIcon = (type: string) => {
    switch (type) {
      case 'castle':
        return <Castle className="w-6 h-6 text-purple-400" />;
      case 'forest':
        return <Trees className="w-6 h-6 text-green-400" />;
      case 'mountain':
        return <Mountain className="w-6 h-6 text-gray-300" />;
      case 'crypt':
        return <Skull className="w-6 h-6 text-red-400" />;
      case 'water':
        return <Waves className="w-6 h-6 text-blue-400" />;
      default:
        return null;
    }
  };

  const getTileColor = (type: string) => {
    switch (type) {
      case 'grass':
        return 'bg-green-800';
      case 'water':
        return 'bg-blue-800';
      case 'mountain':
        return 'bg-gray-700';
      case 'forest':
        return 'bg-green-900';
      case 'castle':
        return 'bg-purple-900';
      case 'crypt':
        return 'bg-red-900';
      default:
        return 'bg-gray-800';
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full md:w-[600px] lg:w-[700px] aspect-square transform rotate-45">
        <div className="absolute inset-0 grid grid-cols-7 gap-1 p-2">
          {mapLayout.map((row, i) =>
            row.map((tile, j) => {
              const isHovered = hoveredTile?.x === i && hoveredTile?.y === j;
              const isSelected = selectedTile?.x === i && selectedTile?.y === j;
              const isPlayerPosition = playerPosition?.x === i && playerPosition?.y === j;
              const isAccessible = isTileAccessible(i, j);
              
              return (
                <div
                  key={`${i}-${j}`}
                  className={`
                    relative transform -rotate-45
                    ${getTileColor(tile.type)}
                    transition-all duration-200
                    ${isHovered && isAccessible ? 'scale-110 z-10 brightness-125' : ''}
                    ${!isAccessible ? 'opacity-50' : ''}
                    ${isSelected ? 'ring-4 ring-yellow-400 z-20' : ''}
                    ${isAccessible ? 'cursor-pointer' : 'cursor-not-allowed'} rounded-lg
                    hover:shadow-lg
                    flex items-center justify-center
                    min-h-[40px]
                  `}
                  onMouseEnter={() => setHoveredTile({ x: i, y: j })}
                  onMouseLeave={() => setHoveredTile(null)}
                  onClick={() => isAccessible && onTileSelect(i, j, tile.type)}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    {getTileIcon(tile.type)}
                    {isPlayerPosition && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Crosshair className="w-6 h-6 text-blue-400 animate-pulse" />
                      </div>
                    )}
                    {isSelected && !isPlayerPosition && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Circle className="w-3 h-3 text-yellow-400 fill-current animate-pulse" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      
      {/* Location Info with Movement Hint */}
      {(selectedTile || playerPosition) && (
        <div className="mt-4 -rotate-45 bg-indigo-800/80 p-2 rounded-lg border border-indigo-600 text-center">
          {playerPosition && (
            <p className="text-blue-300 text-sm mb-1">
              Player at: {mapLayout[playerPosition.x][playerPosition.y].type.charAt(0).toUpperCase() + mapLayout[playerPosition.x][playerPosition.y].type.slice(1)}
            </p>
          )}
          {selectedTile && (
            <p className="text-yellow-300 text-sm">
              Selected: {mapLayout[selectedTile.x][selectedTile.y].type.charAt(0).toUpperCase() + mapLayout[selectedTile.x][selectedTile.y].type.slice(1)}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default IsometricMap;
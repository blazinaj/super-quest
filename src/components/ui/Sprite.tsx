import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

interface SpriteProps {
  type: 'hero' | 'enemy';
  isAnimating?: boolean;
  action?: 'attack' | 'defend' | 'heal' | 'idle' | 'victory' | 'defeat';
  onAnimationComplete?: () => void;
  enemyType?: string;
}

const Sprite: React.FC<SpriteProps> = ({ type, isAnimating, action = 'idle', onAnimationComplete, enemyType = 'default' }) => {
  const [frame, setFrame] = useState(0);
  
  const getTransform = (action: string, isAnimating: boolean, type: string) => {
    if (!isAnimating) {
      return {
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
      };
    }

    switch (action) {
      case 'attack':
        return {
          x: type === 'hero' ? 40 : -40,
          y: 0,
          rotate: type === 'hero' ? -15 : 15,
          scale: 1.1,
        };
      case 'defend':
        return {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 0.8,
        };
      case 'heal':
        return {
          x: 0,
          y: -20,
          rotate: 0,
          scale: 1.1,
        };
      case 'victory':
        return {
          x: 0,
          y: -10,
          rotate: frame % 2 === 0 ? -5 : 5,
          scale: 1.2,
        };
      case 'defeat':
        return {
          x: 0,
          y: 20,
          rotate: -90,
          scale: 0.9,
        };
      default:
        return {
          x: 0,
          y: Math.sin(Date.now() / 500) * 3,
          rotate: 0,
          scale: 1,
        };
    }
  };

  const transform = getTransform(action, isAnimating || false, type);
  
  const springs = useSpring({
    to: {
      translateX: transform.x,
      translateY: transform.y,
      rotate: transform.rotate,
      scale: transform.scale,
      opacity: action === 'heal' && isAnimating ? 0.7 : 1,
    },
    from: {
      translateX: 0,
      translateY: 0,
      rotate: 0,
      scale: 1,
      opacity: 1,
    },
    config: { tension: 300, friction: 20 },
    onRest: onAnimationComplete,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % 4);
    }, 150);
    
    return () => clearInterval(interval);
  }, []);

  const getSprite = () => {
    const sprites = {
      hero: [
        // Idle
        [
          "  O  ",
          " /|\\ ",
          " / \\ "
        ],
        // Attack
        [
          "  O/  ",
          " /|   ",
          " / \\ "
        ],
        // Defend
        [
          "  O  ",
          " [|] ",
          " / \\ "
        ],
        // Heal
        [
          "\\O/",
          " + ",
          "/ \\"
        ],
        // Victory
        [
          "\\O/",
          " | ",
          "/ \\"
        ],
        // Defeat
        [
          "  x  ",
          " /|\\ ",
          " / \\ "
        ]
      ],
      goblin: [
        // Idle
        [
          " ,^, ",
          "<°v°>",
          " )=( "
        ],
        // Attack
        [
          "  ,^,\\",
          " <°v° ",
          "  )=( "
        ],
        // Defend
        [
          " ,^, ",
          "[°v°]",
          " )=( "
        ]
      ],
      dragon: [
        // Idle
        [
          "  ^==^  ",
          " >=||=< ",
          "   ][   "
        ],
        // Attack
        [
          "   ^==^\\",
          "  >=||= ",
          "    ][  "
        ],
        // Defend
        [
          "  ^==^  ",
          "[>=||=<]",
          "   ][   "
        ]
      ],
      skeleton: [
        // Idle
        [
          " +-+ ",
          " |x| ",
          " /-\\ "
        ],
        // Attack
        [
          "  +-+\\",
          "  |x| ",
          "  /-\\ "
        ],
        // Defend
        [
          " +-+ ",
          "[|x|]",
          " /-\\ "
        ]
      ],
      default: [
        // Idle
        [
          " \\O/ ",
          "  |  ",
          " / \\ "
        ],
        // Attack
        [
          "  \\O\\",
          "   | ",
          " / \\ "
        ],
        // Defend
        [
          " \\O/ ",
          " [|] ",
          " / \\ "
        ]
      ]
    };

    let spriteSet;
    if (type === 'enemy') {
      spriteSet = sprites[enemyType] || sprites.default;
    } else {
      spriteSet = sprites.hero;
    }

    switch (action) {
      case 'attack':
        return spriteSet[1];
      case 'defend':
        return spriteSet[2];
      case 'heal':
        return type === 'hero' ? spriteSet[3] : spriteSet[0];
      case 'victory':
        return type === 'hero' ? spriteSet[4] : spriteSet[0];
      case 'defeat':
        return type === 'hero' ? spriteSet[5] : spriteSet[0];
      default:
        return spriteSet[0];
    }
  };

  const sprite = getSprite();

  return (
    <animated.div 
      style={{
        ...springs,
        transform: springs.scale.to(
          (s) => `translate(${springs.translateX.get()}px, ${springs.translateY.get()}px) rotate(${springs.rotate.get()}deg) scale(${s})`
        ),
      }}
      className={`relative flex items-center justify-center ${
        action === 'heal' ? 'after:absolute after:inset-0 after:bg-green-400/20 after:animate-pulse' : ''
      } ${
        action === 'victory' ? 'after:absolute after:inset-0 after:bg-yellow-400/20 after:animate-pulse' : ''
      }`}
    >
      <pre 
        className={`font-mono text-2xl leading-tight ${
          type === 'hero' 
            ? action === 'victory' 
              ? 'text-yellow-400' 
              : action === 'defeat'
                ? 'text-red-400'
                : 'text-blue-400'
            : 'text-red-400'
        }`}
      >
        {sprite.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </pre>
    </animated.div>
  );
};

export default Sprite;
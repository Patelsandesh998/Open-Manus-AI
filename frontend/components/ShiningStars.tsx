import { motion } from 'framer-motion';

interface ShiningStarsProps {
  count?: number;
  size?: 'small' | 'medium' | 'large';
}

export const ShiningStars: React.FC<ShiningStarsProps> = ({ 
  count = 15,
  size = 'medium'
}) => {
  const sizeConfig = {
    small: { container: 32, starSize: 1, coreSize: 0.25 },
    medium: { container: 40, starSize: 1.5, coreSize: 0.3 },
    large: { container: 48, starSize: 2, coreSize: 0.35 }
  };

  const config = sizeConfig[size];

  // Generate more controlled star positions in a circular pattern
  const stars = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 2 * Math.PI;
    const radius = 35 + Math.random() * 15; // More controlled radius
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    
    return {
      id: i,
      x: x,
      y: y,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 1,
      size: config.starSize * (0.6 + Math.random() * 0.4)
    };
  });

  return (
    <div 
      className="relative overflow-hidden flex items-center justify-center"
      style={{ width: config.container, height: config.container }}
    >
      {/* Central glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(123, 97, 255, 0.4), rgba(59, 130, 246, 0.2), transparent)'
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Animated stars in circular pattern */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            background: 'rgba(255, 255, 255, 0.8)',
            boxShadow: `0 0 ${star.size * 2}px rgba(123, 97, 255, 0.6)`
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Center bright core */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: config.container * config.coreSize,
          height: config.container * config.coreSize,
          background: 'linear-gradient(135deg, #7B61FF, #3B82F6)',
          boxShadow: '0 0 12px rgba(123, 97, 255, 0.6)'
        }}
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 180, 360]
        }}
        transition={{
          scale: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          },
          rotate: {
            duration: 6,
            repeat: Infinity,
            ease: "linear"
          }
        }}
      />

      {/* Sparkle icon overlay - more subtle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.02, 1]
          }}
          transition={{
            rotate: {
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            },
            scale: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <svg
            width={config.container * 0.4}
            height={config.container * 0.4}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L13.09 8.26L15 7L14.5 9.5L21 10L14.5 12L15 14.5L13.09 13.24L12 20L10.91 13.24L9 14.5L9.5 12L3 10L9.5 9.5L9 7L10.91 8.26L12 2Z"
              fill="white"
              opacity="0.7"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};
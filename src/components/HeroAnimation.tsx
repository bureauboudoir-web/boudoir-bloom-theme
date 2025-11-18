const HeroAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {/* Floating light particles - More visible */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${Math.random() * 8 + 4}px`,
            height: `${Math.random() * 8 + 4}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `radial-gradient(circle, ${
              i % 2 === 0 ? 'rgba(220, 38, 38, 0.8)' : 'rgba(217, 119, 6, 0.8)'
            }, transparent)`,
            boxShadow: `0 0 20px ${
              i % 2 === 0 ? 'rgba(220, 38, 38, 0.6)' : 'rgba(217, 119, 6, 0.6)'
            }`,
            animation: `float ${Math.random() * 8 + 8}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
      
      {/* Larger glowing orbs */}
      {[...Array(5)].map((_, i) => (
        <div
          key={`orb-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${Math.random() * 30 + 20}px`,
            height: `${Math.random() * 30 + 20}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `radial-gradient(circle, ${
              i % 2 === 0 ? 'rgba(220, 38, 38, 0.3)' : 'rgba(217, 119, 6, 0.3)'
            }, transparent)`,
            filter: 'blur(10px)',
            animation: `pulse ${Math.random() * 4 + 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
      
      {/* Light rays - More visible */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/6 w-1 h-full bg-gradient-to-b from-transparent via-red-600/40 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" style={{ filter: 'blur(2px)' }} />
        <div className="absolute top-0 left-1/3 w-1 h-full bg-gradient-to-b from-transparent via-amber-600/40 to-transparent animate-[shimmer_4s_ease-in-out_infinite]" style={{ animationDelay: '1s', filter: 'blur(2px)' }} />
        <div className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-transparent via-red-600/40 to-transparent animate-[shimmer_5s_ease-in-out_infinite]" style={{ animationDelay: '2s', filter: 'blur(2px)' }} />
        <div className="absolute top-0 left-2/3 w-1 h-full bg-gradient-to-b from-transparent via-amber-600/40 to-transparent animate-[shimmer_3.5s_ease-in-out_infinite]" style={{ animationDelay: '1.5s', filter: 'blur(2px)' }} />
        <div className="absolute top-0 left-5/6 w-1 h-full bg-gradient-to-b from-transparent via-red-600/40 to-transparent animate-[shimmer_4.5s_ease-in-out_infinite]" style={{ animationDelay: '0.5s', filter: 'blur(2px)' }} />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.8;
          }
          25% {
            transform: translateY(-30px) translateX(15px) scale(1.1);
            opacity: 1;
          }
          50% {
            transform: translateY(-60px) translateX(-15px) scale(0.9);
            opacity: 0.6;
          }
          75% {
            transform: translateY(-30px) translateX(15px) scale(1.1);
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.6;
          }
        }
        
        @keyframes shimmer {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroAnimation;

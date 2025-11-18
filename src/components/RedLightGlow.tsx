const RedLightGlow = () => {
  return (
    <div className="relative h-24 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-50 animate-pulse" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 bg-primary/30 rounded-full blur-2xl opacity-70" />
      </div>
    </div>
  );
};

export default RedLightGlow;

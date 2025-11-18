import roseDivider from "@/assets/rose-divider.png";

const RoseDivider = () => {
  return (
    <div className="relative py-8 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>
      <div className="relative z-10 px-8 bg-background">
        <img 
          src={roseDivider} 
          alt="" 
          className="h-12 w-auto opacity-70 animate-fade-in"
          style={{ filter: "drop-shadow(0 0 8px hsl(var(--glow-red) / 0.3))" }}
        />
      </div>
    </div>
  );
};

export default RoseDivider;

import roseDivider from "@/assets/rose-divider.png";

const RoseDivider = () => {
  return (
    <div className="relative py-8 flex items-center justify-center overflow-hidden">
      <div className="px-8">
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

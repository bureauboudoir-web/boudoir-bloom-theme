import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import StreetLampIcon from "@/components/StreetLampIcon";

const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <StreetLampIcon className="w-8 h-8 transition-transform group-hover:scale-110 drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]" />
          <span 
            className="font-serif text-2xl font-bold bg-gradient-to-r from-red-900 via-rose-600 to-amber-500 bg-clip-text text-transparent"
            style={{
              textShadow: '0 0 30px hsl(0 80% 50% / 0.5), 0 0 60px hsl(45 100% 50% / 0.3)',
              filter: 'drop-shadow(0 0 15px hsl(0 80% 50% / 0.4))',
              fontWeight: 800,
              letterSpacing: '0.02em'
            }}
          >
            Bureau Boudoir
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Button asChild size="sm" className="glow-red">
            <Link to="/signup">Become a Creator</Link>
          </Button>
          <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

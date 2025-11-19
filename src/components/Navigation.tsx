import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import StreetLampIcon from "@/components/StreetLampIcon";

const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <StreetLampIcon className="w-8 h-8 transition-transform group-hover:scale-110" />
          <span 
            className="font-serif text-2xl font-bold"
            style={{
              color: 'hsl(0 100% 27%)',
              textShadow: '0 0 20px hsl(0 100% 27% / 0.4), 0 0 40px hsl(0 100% 27% / 0.2)',
              fontWeight: 800,
              letterSpacing: '0.02em'
            }}
          >
            Bureau Boudoir
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Button asChild size="sm" className="glow-red bg-primary text-primary-foreground hover:bg-[#d1ae94] rounded-full px-6 w-auto inline-flex">
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

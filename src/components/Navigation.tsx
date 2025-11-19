import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import StreetLampIcon from "@/components/StreetLampIcon";

const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 md:gap-3 group">
          <StreetLampIcon className="w-6 h-6 md:w-8 md:h-8 transition-transform group-hover:scale-110" />
          <span 
            className="font-serif text-lg md:text-2xl font-bold"
            style={{ fontWeight: 800, letterSpacing: '0.02em' }}
          >
            <span style={{ color: 'hsl(0 100% 27%)', textShadow: '0 0 20px hsl(0 100% 27% / 0.4)' }}>Bureau</span>
            {' '}
            <span style={{ color: '#d1ae94', textShadow: '0 0 20px rgba(209, 174, 148, 0.4)' }}>Boudoir</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-2 md:gap-4">
          <Button asChild size="sm" className="glow-red bg-primary text-primary-foreground hover:bg-[#d1ae94] rounded-full px-4 md:px-6 w-auto inline-flex text-xs md:text-sm">
            <Link to="/signup">Become a Creator</Link>
          </Button>
          <Link to="/login" className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

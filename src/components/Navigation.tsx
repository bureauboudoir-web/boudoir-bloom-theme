import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold text-primary text-glow-red">Bureau Boudoir</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Login
          </Link>
          <Button asChild variant="default" size="sm" className="glow-red">
            <Link to="/signup">Become a Creator</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

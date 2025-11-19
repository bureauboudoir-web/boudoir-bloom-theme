import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import StreetLampIcon from "@/components/StreetLampIcon";

const Navigation = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="font-serif text-2xl font-bold text-primary text-glow-red">Bureau Boudoir</span>
          <StreetLampIcon className="w-6 h-6" />
        </Link>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={() => scrollToSection('about')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </button>
          <Button asChild variant="default" size="sm" className="glow-red">
            <Link to="/signup">Join</Link>
          </Button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

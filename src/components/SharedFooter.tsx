import { Link } from "react-router-dom";
import { Twitter, Music, Instagram } from "lucide-react";
import StreetLampIcon from "./StreetLampIcon";

export const SharedFooter = () => {
  return (
    <footer className="border-t border-border py-12 px-6 bg-secondary/20">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Column 1: Logo */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="relative">
              <StreetLampIcon className="w-12 h-12 opacity-80" />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-primary/20 rounded-full blur-xl" />
            </div>
            <span className="font-serif text-2xl font-bold">
              <span style={{ color: 'hsl(0 100% 27%)', textShadow: '0 0 20px hsl(0 100% 27% / 0.4)' }}>Bureau</span>
              {' '}
              <span style={{ color: '#d1ae94', textShadow: '0 0 20px rgba(209, 174, 148, 0.4)' }}>Boudoir</span>
            </span>
          </div>
          
          {/* Column 2: Navigation */}
          <nav className="flex flex-col items-center gap-4">
            <h3 className="text-sm font-bold text-[#d1ae94] mb-2">Navigate</h3>
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
            <Link to="/signup" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Join
            </Link>
          </nav>
          
          {/* Column 3: Social & Contact */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <h3 className="text-sm font-bold text-[#d1ae94] mb-2">Connect</h3>
            
            {/* Social Icons */}
            <div className="flex gap-4 mb-4">
              <a href="https://x.com/bureauboudoir" target="_blank" rel="noopener noreferrer" 
                 className="text-[#d1ae94] hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://tiktok.com/@bureauboudoir" target="_blank" rel="noopener noreferrer"
                 className="text-[#d1ae94] hover:text-primary transition-colors">
                <Music className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/bureauboudoir" target="_blank" rel="noopener noreferrer"
                 className="text-[#d1ae94] hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            
            {/* Contact Details */}
            <div className="text-sm text-muted-foreground space-y-1 text-center md:text-right">
              <p>X: @bureauboudoir</p>
              <p>TikTok: @bureauboudoir</p>
              <p>WhatsApp: +31 6 86 14 75 57</p>
            </div>
          </div>
          
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Bureau Boudoir. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

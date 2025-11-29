import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { X, Instagram, Youtube, Music } from "lucide-react";
import StreetLampIcon from "./StreetLampIcon";
import { LanguageSelector } from "./LanguageSelector";

export const SharedFooter = () => {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border py-12 px-6 bg-secondary/20">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-8">
          {/* Logo in Lamp Light */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <StreetLampIcon className="w-16 h-16 opacity-80" />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-8 bg-primary/20 rounded-full blur-xl" />
            </div>
            <span className="font-serif text-3xl font-bold" style={{ fontWeight: 800, letterSpacing: '0.02em' }}>
              <span style={{ color: 'hsl(0 100% 27%)', textShadow: '0 0 30px hsl(0 100% 27% / 0.4)' }}>Bureau</span>
              {' '}
              <span style={{ color: '#d1ae94', textShadow: '0 0 30px rgba(209, 174, 148, 0.6)' }}>Boudoir</span>
            </span>
          </div>

          {/* Horizontal Navigation */}
          <nav className="flex items-center gap-6 text-sm">
            <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
              {t('nav.about')}
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
              {t('nav.contact')}
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
              {t('nav.terms')}
            </Link>
          </nav>

          {/* Language Selector & Social Icons */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <LanguageSelector />
            <div className="flex gap-6">
              <a href="https://x.com/bureauboudoir" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label={t('footer.social.twitter')}>
                <X className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/bureauboudoir" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label={t('footer.social.instagram')}>
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/@BureauBoudoir" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label={t('footer.social.youtube')}>
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://www.tiktok.com/@bureauboudoir" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label={t('footer.social.tiktok')}>
                <Music className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground text-center">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

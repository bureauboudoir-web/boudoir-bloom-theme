import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import mapImage from "@/assets/amsterdam-map-luxury.png";
import StreetLampIcon from "@/components/StreetLampIcon";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-primary mb-6 text-glow-red">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to begin your journey with Bureau Boudoir? Get in touch with us.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="p-8 text-center hover:shadow-xl transition-shadow">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-serif text-xl font-bold mb-3">Location</h3>
              <p className="text-muted-foreground">
                Oudekerksplein 18h<br />
                Amsterdam, Netherlands
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-shadow">
              <Mail className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-serif text-xl font-bold mb-3">Email</h3>
              <a href="mailto:hello@bureauboudoir.com" className="text-primary hover:underline">
                hello@bureauboudoir.com
              </a>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-shadow">
              <Phone className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-serif text-xl font-bold mb-3">Phone</h3>
              <a href="tel:+31201234567" className="text-muted-foreground hover:text-primary transition-colors">
                +31 20 123 4567
              </a>
            </Card>
          </div>

          {/* Amsterdam Location Map */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl">
            <img 
              src={mapImage} 
              alt="Bureau Boudoir location in Amsterdam's Red Light District" 
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-12 text-center">
              <h2 className="font-serif text-4xl font-bold text-primary mb-4 text-glow-red">
                In the Heart of Amsterdam
              </h2>
              <p className="text-xl text-foreground max-w-3xl mx-auto mb-6">
                Our studio is located in the iconic Red Light District, where Amsterdam's rich history 
                meets modern creativity. Experience the authentic atmosphere that inspires our work.
              </p>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Oudekerksplein+18h+Amsterdam" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6 mt-20">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-8">
            {/* Logo in Lamp Light */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <StreetLampIcon className="w-16 h-16 opacity-80" />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-8 bg-primary/20 rounded-full blur-xl" />
              </div>
              <span className="font-serif text-2xl font-bold text-primary" style={{
                textShadow: '0 0 20px hsl(var(--glow-red)), 0 0 40px hsl(var(--glow-red) / 0.5)'
              }}>
                Bureau Boudoir
              </span>
            </div>

            {/* Horizontal Navigation */}
            <nav className="flex items-center gap-6 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms & Conditions
              </Link>
            </nav>

            {/* Copyright */}
            <p className="text-sm text-muted-foreground text-center">
              © 2024 Bureau Boudoir. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;

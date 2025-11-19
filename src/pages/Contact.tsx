import { PageContainer } from "@/components/PageContainer";
import { Twitter, Music, Instagram, MessageCircle, Mail } from "lucide-react";
import mapImage from "@/assets/amsterdam-map-luxury.png";

const Contact = () => {
  return (
    <PageContainer>
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[#d1ae94] mb-6">
          Get in Touch
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Ready to begin your journey with Bureau Boudoir? We're here to help.
        </p>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
          
          {/* Left Column: Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-[#d1ae94] mb-8">Contact Information</h2>
              <p className="text-muted-foreground mb-8">
                We'd love to hear from you. Reach out through any of these channels.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 border border-[#d1ae94]/30 flex items-center justify-center flex-shrink-0">
                  <Twitter className="w-6 h-6 text-[#d1ae94]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">X (Twitter)</p>
                  <a href="https://x.com/bureauboudoir" target="_blank" rel="noopener noreferrer" 
                     className="text-foreground hover:text-[#d1ae94] transition-colors">
                    @bureauboudoir
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 border border-[#d1ae94]/30 flex items-center justify-center flex-shrink-0">
                  <Music className="w-6 h-6 text-[#d1ae94]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">TikTok</p>
                  <a href="https://tiktok.com/@bureauboudoir" target="_blank" rel="noopener noreferrer"
                     className="text-foreground hover:text-[#d1ae94] transition-colors">
                    @bureauboudoir
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 border border-[#d1ae94]/30 flex items-center justify-center flex-shrink-0">
                  <Instagram className="w-6 h-6 text-[#d1ae94]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Instagram</p>
                  <a href="https://instagram.com/bureauboudoir" target="_blank" rel="noopener noreferrer"
                     className="text-foreground hover:text-[#d1ae94] transition-colors">
                    @bureauboudoir
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 border border-[#d1ae94]/30 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-[#d1ae94]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                  <a href="https://wa.me/31686147557" target="_blank" rel="noopener noreferrer"
                     className="text-foreground hover:text-[#d1ae94] transition-colors">
                    +31 6 86 14 75 57
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 border border-[#d1ae94]/30 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[#d1ae94]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a href="mailto:hello@bureauboudoir.com"
                     className="text-foreground hover:text-[#d1ae94] transition-colors">
                    hello@bureauboudoir.com
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column: Map */}
          <div className="space-y-6">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <img 
                src={mapImage} 
                alt="Bureau Boudoir location in Amsterdam"
                className="w-full h-auto"
              />
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-bold text-foreground">Visit Us</p>
              <p className="text-muted-foreground">Oudekerksplein 18h</p>
              <p className="text-muted-foreground">Amsterdam, Netherlands</p>
            </div>
          </div>
          
        </div>
      </section>
    </PageContainer>
  );
};

export default Contact;

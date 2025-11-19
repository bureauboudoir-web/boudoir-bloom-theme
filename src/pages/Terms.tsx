import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import StreetLampIcon from "@/components/StreetLampIcon";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-serif text-5xl font-bold text-primary mb-8 text-glow-red">
            Terms & Conditions
          </h1>
          
          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-xl text-muted-foreground mb-8">
              Last updated: January 2024
            </p>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold mb-4">1. Agreement to Terms</h2>
              <p className="text-muted-foreground">
                By accessing or using Bureau Boudoir's services, you agree to be bound by these Terms and Conditions. 
                If you do not agree with any part of these terms, you may not access our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold mb-4">2. Creator Services</h2>
              <p className="text-muted-foreground mb-4">
                Bureau Boudoir provides professional content creation, marketing, and management services for adult content creators.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>All creators must be 18 years or older</li>
                <li>Valid identification is required for verification</li>
                <li>Content must comply with platform guidelines and local laws</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold mb-4">3. Privacy & Confidentiality</h2>
              <p className="text-muted-foreground">
                We take your privacy seriously. All personal information, content, and business details are kept strictly confidential 
                and protected under our privacy policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold mb-4">4. Payment Terms</h2>
              <p className="text-muted-foreground">
                Payment schedules, revenue sharing, and financial arrangements are detailed in individual creator agreements. 
                All payments are processed securely and transparently.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold mb-4">5. Content Ownership</h2>
              <p className="text-muted-foreground">
                Creators retain ownership of their content. Bureau Boudoir is granted license to use, distribute, and market 
                content as part of our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold mb-4">6. Contact</h2>
              <p className="text-muted-foreground">
                For questions about these terms, please contact us at{" "}
                <a href="mailto:legal@bureauboudoir.com" className="text-primary hover:underline">
                  legal@bureauboudoir.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6 mt-20">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-8">
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

            <p className="text-sm text-muted-foreground text-center">
              © 2024 Bureau Boudoir. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Terms;

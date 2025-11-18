import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.experience) {
      toast.error("Please fill in all fields");
      return;
    }

    // Simulate form submission
    console.log("Form submitted:", formData);
    toast.success("Thank you! Your application has been received. A rep will contact you soon.");
    
    // Reset form
    setFormData({ name: "", email: "", phone: "", experience: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-24 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md p-8 bg-card border-primary/20">
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl font-bold mb-2 text-glow-red">Become a Creator</h1>
            <p className="text-muted-foreground">Start your journey with Bureau Boudoir</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+31 6 12345678"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="experience">Experience Level</Label>
              <Select value={formData.experience} onValueChange={(value) => setFormData({ ...formData, experience: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Start Creator</SelectItem>
                  <SelectItem value="growing">Growing Creator</SelectItem>
                  <SelectItem value="established">Established Creator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button type="submit" className="w-full glow-red">
              Submit Application
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Signup;

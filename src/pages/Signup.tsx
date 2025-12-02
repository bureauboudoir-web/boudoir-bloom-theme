import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { PageContainer } from "@/components/PageContainer";
import { supabase } from "@/integrations/supabase/client";
import { applicationSchema } from "@/lib/validation";
import { z } from "zod";

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: ""
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; experience?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate with Zod
    try {
      applicationSchema.parse(formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: any = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0]] = error.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }
    }

    setLoading(true);

    try {
      // Insert application with pending status
      const { error: appError } = await supabase
        .from('creator_applications')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          experience_level: formData.experience,
          status: 'pending'
        }]);

      if (appError) throw appError;

      // Send confirmation email (non-blocking)
      try {
        await supabase.functions.invoke('send-application-received', {
          body: { email: formData.email, name: formData.name }
        });
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
        // Don't fail the whole process if confirmation email fails
      }

      // Send notification to admins
      try {
        await supabase.functions.invoke('send-admin-notification', {
          body: {
            applicantName: formData.name,
            applicantEmail: formData.email,
            experienceLevel: formData.experience,
          }
        });
      } catch (notifError) {
        console.error("Error sending admin notification:", notifError);
        // Don't fail the whole process if notification fails
      }

      toast.success("Application submitted! Check your email for confirmation.");
      setTimeout(() => navigate("/"), 2000);

    } catch (error: any) {
      if (error.message?.includes('duplicate')) {
        toast.error("An application with this email already exists.");
      } else {
        toast.error("Failed to submit application. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="container mx-auto px-6 py-24 max-w-md">
        <Card className="border-border bg-secondary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-[#d1ae94]">Become a Creator</CardTitle>
            <CardDescription>
              Submit your application to join Bureau Boudoir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  className={errors.name ? "border-red-500" : ""}
                  required
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className={errors.email ? "border-red-500" : ""}
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+31 6 12345678"
                  className={errors.phone ? "border-red-500" : ""}
                  required
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Creator Level</Label>
                <Select 
                  value={formData.experience} 
                  onValueChange={(value) => setFormData({ ...formData, experience: value })}
                >
                  <SelectTrigger className={errors.experience ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Start - Just beginning</SelectItem>
                    <SelectItem value="growing">Growing - Building audience</SelectItem>
                    <SelectItem value="established">Established - Experienced creator</SelectItem>
                  </SelectContent>
                </Select>
                {errors.experience && (
                  <p className="text-sm text-red-500">{errors.experience}</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full glow-red bg-primary text-primary-foreground hover:bg-[#d1ae94] rounded-full"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <a href="/login" className="text-[#d1ae94] hover:text-primary transition-colors">
                  Log in here
                </a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Signup;

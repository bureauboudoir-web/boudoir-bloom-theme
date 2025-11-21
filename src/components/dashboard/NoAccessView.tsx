import { Clock, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export const NoAccessView = () => {
  const { signOut } = useAuth();
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-serif text-2xl md:text-3xl font-bold">Bureau Boudoir</h1>
          <Button variant="ghost" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>
      
      <div className="container mx-auto px-6 py-24">
        <Card className="max-w-2xl mx-auto border-border bg-secondary/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-[#d1ae94]" />
            </div>
            <CardTitle className="text-2xl text-[#d1ae94]">Application Under Review</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Thank you for submitting your application to become a Bureau Boudoir Creator.
            </p>
            <p className="text-muted-foreground">
              Your application is currently being reviewed by our team. You'll receive an email when a decision has been made.
            </p>
            <p className="text-sm text-muted-foreground mt-6">
              If you have any questions, please don't hesitate to reach out to us.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

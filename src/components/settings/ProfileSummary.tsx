import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Phone, Mail, Calendar } from "lucide-react";

interface ProfileSummaryProps {
  profile: any;
  onboardingData: any;
}

export const ProfileSummary = ({ profile, onboardingData }: ProfileSummaryProps) => {
  const formatDate = (date: string | null) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Summary
        </CardTitle>
        <CardDescription>Your account information at a glance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Full Name</p>
            <p className="font-medium">{onboardingData?.personal_full_name || profile?.full_name || "Not set"}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {profile?.email || "Not set"}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Date of Birth</p>
            <p className="font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDate(onboardingData?.personal_date_of_birth)}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Nationality</p>
            <p className="font-medium">{onboardingData?.personal_nationality || "Not set"}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {onboardingData?.personal_location || "Not set"}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="font-medium flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {onboardingData?.personal_phone_number || profile?.phone || "Not set"}
            </p>
          </div>

          {onboardingData?.body_height && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Height</p>
              <p className="font-medium">{onboardingData.body_height} cm</p>
            </div>
          )}

          {onboardingData?.body_type && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Body Type</p>
              <Badge variant="secondary">{onboardingData.body_type}</Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
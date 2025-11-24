import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCheck, RefreshCw, MessageSquare, Video, Calendar } from "lucide-react";
import { OnboardingMeetingTab } from "./OnboardingMeetingTab";
import { FollowUpMeetingTab } from "./FollowUpMeetingTab";
import { MyMeetingsTab } from "./MyMeetingsTab";
import { StudioShootTab } from "./StudioShootTab";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface MeetingBookingTabsProps {
  userId: string;
}

export const MeetingBookingTabs = ({ userId }: MeetingBookingTabsProps) => {
  const [activeTab, setActiveTab] = useState("onboarding");
  const [managerId, setManagerId] = useState<string>();
  const [hasOnboardingMeeting, setHasOnboardingMeeting] = useState(false);

  useEffect(() => {
    fetchManagerAndMeetingStatus();
  }, [userId]);

  const fetchManagerAndMeetingStatus = async () => {
    // Get assigned manager
    const { data: profile } = await supabase
      .from('profiles')
      .select('assigned_manager_id')
      .eq('id', userId)
      .single();

    if (profile?.assigned_manager_id) {
      setManagerId(profile.assigned_manager_id);
    }

    // Check if onboarding meeting exists and is completed
    const { data: meetings } = await supabase
      .from('creator_meetings')
      .select('*')
      .eq('user_id', userId)
      .eq('meeting_purpose', 'onboarding')
      .maybeSingle();

    if (meetings && meetings.status === 'completed') {
      setHasOnboardingMeeting(true);
      setActiveTab("my-meetings");
    }
  };

  const handleMeetingBooked = () => {
    fetchManagerAndMeetingStatus();
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-5 h-auto">
        <TabsTrigger value="onboarding" className="flex flex-col items-center gap-1 py-3">
          <UserCheck className="h-4 w-4" />
          <span className="text-xs">Onboarding</span>
        </TabsTrigger>
        <TabsTrigger
          value="follow-up"
          className="flex flex-col items-center gap-1 py-3"
          disabled={!hasOnboardingMeeting}
        >
          <RefreshCw className="h-4 w-4" />
          <span className="text-xs">Follow-Up</span>
        </TabsTrigger>
        <TabsTrigger
          value="feedback"
          className="flex flex-col items-center gap-1 py-3"
          disabled={!hasOnboardingMeeting}
        >
          <MessageSquare className="h-4 w-4" />
          <span className="text-xs">Feedback</span>
        </TabsTrigger>
        <TabsTrigger
          value="studio"
          className="flex flex-col items-center gap-1 py-3"
          disabled={!hasOnboardingMeeting}
        >
          <Video className="h-4 w-4" />
          <span className="text-xs">Studio</span>
        </TabsTrigger>
        <TabsTrigger value="my-meetings" className="flex flex-col items-center gap-1 py-3">
          <Calendar className="h-4 w-4" />
          <span className="text-xs">My Meetings</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="onboarding" className="mt-6">
        {hasOnboardingMeeting ? (
          <div className="text-center py-8 text-muted-foreground">
            <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">Onboarding Complete!</p>
            <p className="text-sm">You've completed your onboarding meeting.</p>
          </div>
        ) : (
          <OnboardingMeetingTab
            userId={userId}
            managerId={managerId}
            onMeetingBooked={handleMeetingBooked}
          />
        )}
      </TabsContent>

      <TabsContent value="follow-up" className="mt-6">
        <FollowUpMeetingTab
          userId={userId}
          managerId={managerId}
          onMeetingRequested={handleMeetingBooked}
        />
      </TabsContent>

      <TabsContent value="feedback" className="mt-6">
        <FollowUpMeetingTab
          userId={userId}
          managerId={managerId}
          onMeetingRequested={handleMeetingBooked}
        />
      </TabsContent>

      <TabsContent value="studio" className="mt-6">
        <StudioShootTab
          userId={userId}
          managerId={managerId}
          onShootRequested={handleMeetingBooked}
        />
      </TabsContent>

      <TabsContent value="my-meetings" className="mt-6">
        <MyMeetingsTab userId={userId} />
      </TabsContent>
    </Tabs>
  );
};

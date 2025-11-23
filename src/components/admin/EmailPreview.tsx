import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailTemplatePreviewProps {
  creatorName: string;
  creatorEmail: string;
  dashboardUrl: string;
  meetingDate?: string;
  meetingTime?: string;
  managerName?: string;
}

const MeetingInvitationPreview = ({ creatorName, creatorEmail, dashboardUrl }: EmailTemplatePreviewProps) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' }}>
    <div style={{ backgroundColor: '#dc2626', padding: '40px 20px', textAlign: 'center' }}>
      <h1 style={{ color: '#ffffff', margin: '0', fontSize: '28px', fontWeight: 'bold' }}>
        Welcome to Our Team! 🌹
      </h1>
    </div>
    <div style={{ padding: '40px 20px' }}>
      <h2 style={{ color: '#1f2937', fontSize: '24px', marginBottom: '20px' }}>
        Hi {creatorName},
      </h2>
      <p style={{ color: '#4b5563', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
        Great news! You've been invited to book your introduction meeting with your representative.
        This is an important step where we'll get to know each other and discuss your journey ahead.
      </p>
      <p style={{ color: '#4b5563', fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}>
        Click the button below to access your dashboard and schedule your meeting at a time that works for you.
      </p>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <a
          href={dashboardUrl}
          style={{
            display: 'inline-block',
            backgroundColor: '#dc2626',
            color: '#ffffff',
            padding: '16px 32px',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          Book Your Meeting
        </a>
      </div>
      <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
        <p style={{ color: '#991b1b', fontSize: '14px', margin: '0' }}>
          <strong>📧 Email:</strong> {creatorEmail}
        </p>
      </div>
      <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.6' }}>
        We're excited to have you on board and can't wait to meet you!
      </p>
    </div>
    <div style={{ backgroundColor: '#f9fafb', padding: '20px', textAlign: 'center', borderTop: '1px solid #e5e7eb' }}>
      <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0' }}>
        This is an automated email. Please do not reply to this message.
      </p>
    </div>
  </div>
);

const AccessGrantedPreview = ({ creatorName, dashboardUrl, earlyAccess }: EmailTemplatePreviewProps & { earlyAccess: boolean }) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' }}>
    <div style={{ backgroundColor: '#16a34a', padding: '40px 20px', textAlign: 'center' }}>
      <h1 style={{ color: '#ffffff', margin: '0', fontSize: '28px', fontWeight: 'bold' }}>
        Dashboard Access Granted! 🎉
      </h1>
    </div>
    <div style={{ padding: '40px 20px' }}>
      <h2 style={{ color: '#1f2937', fontSize: '24px', marginBottom: '20px' }}>
        Congratulations {creatorName}!
      </h2>
      <p style={{ color: '#4b5563', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
        {earlyAccess 
          ? "You've been granted early access to your full creator dashboard. You can now access all features and start your journey with us!"
          : "Your introduction meeting has been completed and you now have full access to your creator dashboard!"}
      </p>
      <p style={{ color: '#4b5563', fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}>
        You can now:
      </p>
      <ul style={{ color: '#4b5563', fontSize: '16px', lineHeight: '1.8', marginBottom: '30px' }}>
        <li>Complete your onboarding process</li>
        <li>Review and sign your contract</li>
        <li>Manage your content and commitments</li>
        <li>View your invoices and payments</li>
        <li>Connect with your team</li>
      </ul>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <a
          href={dashboardUrl}
          style={{
            display: 'inline-block',
            backgroundColor: '#16a34a',
            color: '#ffffff',
            padding: '16px 32px',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          Access Your Dashboard
        </a>
      </div>
      <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.6' }}>
        Welcome to the team! We're thrilled to have you with us.
      </p>
    </div>
    <div style={{ backgroundColor: '#f9fafb', padding: '20px', textAlign: 'center', borderTop: '1px solid #e5e7eb' }}>
      <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0' }}>
        This is an automated email. Please do not reply to this message.
      </p>
    </div>
  </div>
);

const MeetingReminderPreview = ({ creatorName, meetingDate, meetingTime, dashboardUrl }: EmailTemplatePreviewProps) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' }}>
    <div style={{ backgroundColor: '#2563eb', padding: '40px 20px', textAlign: 'center' }}>
      <h1 style={{ color: '#ffffff', margin: '0', fontSize: '28px', fontWeight: 'bold' }}>
        Meeting Reminder 📅
      </h1>
    </div>
    <div style={{ padding: '40px 20px' }}>
      <h2 style={{ color: '#1f2937', fontSize: '24px', marginBottom: '20px' }}>
        Hi {creatorName},
      </h2>
      <p style={{ color: '#4b5563', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
        This is a friendly reminder about your upcoming introduction meeting.
      </p>
      <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
        <p style={{ color: '#1e40af', fontSize: '16px', margin: '0 0 10px 0' }}>
          <strong>📅 Date:</strong> {meetingDate || 'January 15, 2024'}
        </p>
        <p style={{ color: '#1e40af', fontSize: '16px', margin: '0' }}>
          <strong>🕐 Time:</strong> {meetingTime || '2:00 PM'}
        </p>
      </div>
      <p style={{ color: '#4b5563', fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}>
        Please make sure you're available at the scheduled time. If you need to reschedule, you can do so from your dashboard.
      </p>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <a
          href={dashboardUrl}
          style={{
            display: 'inline-block',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            padding: '16px 32px',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          View Meeting Details
        </a>
      </div>
    </div>
    <div style={{ backgroundColor: '#f9fafb', padding: '20px', textAlign: 'center', borderTop: '1px solid #e5e7eb' }}>
      <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0' }}>
        This is an automated email. Please do not reply to this message.
      </p>
    </div>
  </div>
);

const ContractNotificationPreview = ({ creatorName, dashboardUrl }: EmailTemplatePreviewProps) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' }}>
    <div style={{ backgroundColor: '#7c3aed', padding: '40px 20px', textAlign: 'center' }}>
      <h1 style={{ color: '#ffffff', margin: '0', fontSize: '28px', fontWeight: 'bold' }}>
        Contract Ready for Signature ✍️
      </h1>
    </div>
    <div style={{ padding: '40px 20px' }}>
      <h2 style={{ color: '#1f2937', fontSize: '24px', marginBottom: '20px' }}>
        Hi {creatorName},
      </h2>
      <p style={{ color: '#4b5563', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
        Your creator contract has been generated and is ready for your review and signature.
      </p>
      <p style={{ color: '#4b5563', fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}>
        Please take your time to review all terms and conditions. Once you're ready, you can digitally sign the contract directly from your dashboard.
      </p>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <a
          href={dashboardUrl}
          style={{
            display: 'inline-block',
            backgroundColor: '#7c3aed',
            color: '#ffffff',
            padding: '16px 32px',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          Review & Sign Contract
        </a>
      </div>
      <div style={{ backgroundColor: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
        <p style={{ color: '#6b21a8', fontSize: '14px', margin: '0' }}>
          <strong>⚠️ Important:</strong> Your contract must be signed before you can start creating content with us.
        </p>
      </div>
    </div>
    <div style={{ backgroundColor: '#f9fafb', padding: '20px', textAlign: 'center', borderTop: '1px solid #e5e7eb' }}>
      <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0' }}>
        This is an automated email. Please do not reply to this message.
      </p>
    </div>
  </div>
);

export const EmailPreview = () => {
  const [previewData, setPreviewData] = useState({
    creatorName: "Sofia Martinez",
    creatorEmail: "sofia.martinez@example.com",
    dashboardUrl: `${window.location.origin}/dashboard`,
    meetingDate: "January 15, 2024",
    meetingTime: "2:00 PM",
    managerName: "Alex Thompson",
  });

  const [activeTab, setActiveTab] = useState("meeting-invitation");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          <CardTitle>Email Preview</CardTitle>
        </div>
        <CardDescription>
          Preview all email templates with custom data before they're sent to creators
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sample Data Controls */}
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-sm">Preview Data</CardTitle>
            <CardDescription className="text-xs">
              Customize the sample data shown in email previews
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="creatorName">Creator Name</Label>
              <Input
                id="creatorName"
                value={previewData.creatorName}
                onChange={(e) => setPreviewData({ ...previewData, creatorName: e.target.value })}
                placeholder="Creator Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="creatorEmail">Creator Email</Label>
              <Input
                id="creatorEmail"
                value={previewData.creatorEmail}
                onChange={(e) => setPreviewData({ ...previewData, creatorEmail: e.target.value })}
                placeholder="creator@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meetingDate">Meeting Date</Label>
              <Input
                id="meetingDate"
                value={previewData.meetingDate}
                onChange={(e) => setPreviewData({ ...previewData, meetingDate: e.target.value })}
                placeholder="January 15, 2024"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meetingTime">Meeting Time</Label>
              <Input
                id="meetingTime"
                value={previewData.meetingTime}
                onChange={(e) => setPreviewData({ ...previewData, meetingTime: e.target.value })}
                placeholder="2:00 PM"
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Templates Preview */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="meeting-invitation" className="text-xs">
              📧 Meeting Invite
            </TabsTrigger>
            <TabsTrigger value="access-granted" className="text-xs">
              🎉 Access Granted
            </TabsTrigger>
            <TabsTrigger value="meeting-reminder" className="text-xs">
              📅 Reminder
            </TabsTrigger>
            <TabsTrigger value="contract" className="text-xs">
              ✍️ Contract
            </TabsTrigger>
          </TabsList>

          <TabsContent value="meeting-invitation" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Meeting Invitation Email</h3>
                <p className="text-sm text-muted-foreground">
                  Sent when admin invites creator to book their introduction meeting
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Mail className="h-4 w-4 mr-2" />
                Print Preview
              </Button>
            </div>
            <div className="border rounded-lg overflow-hidden bg-white">
              <MeetingInvitationPreview {...previewData} />
            </div>
          </TabsContent>

          <TabsContent value="access-granted" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Access Granted Email</h3>
                <p className="text-sm text-muted-foreground">
                  Sent when creator receives full dashboard access
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Mail className="h-4 w-4 mr-2" />
                Print Preview
              </Button>
            </div>
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden bg-white">
                <div className="p-4 bg-muted/50 border-b">
                  <p className="text-sm font-medium">Early Access Version</p>
                </div>
                <AccessGrantedPreview {...previewData} earlyAccess={true} />
              </div>
              <div className="border rounded-lg overflow-hidden bg-white">
                <div className="p-4 bg-muted/50 border-b">
                  <p className="text-sm font-medium">After Meeting Version</p>
                </div>
                <AccessGrantedPreview {...previewData} earlyAccess={false} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="meeting-reminder" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Meeting Reminder Email</h3>
                <p className="text-sm text-muted-foreground">
                  Sent as a reminder before scheduled meetings
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Mail className="h-4 w-4 mr-2" />
                Print Preview
              </Button>
            </div>
            <div className="border rounded-lg overflow-hidden bg-white">
              <MeetingReminderPreview {...previewData} />
            </div>
          </TabsContent>

          <TabsContent value="contract" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Contract Notification Email</h3>
                <p className="text-sm text-muted-foreground">
                  Sent when contract is ready for creator signature
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Mail className="h-4 w-4 mr-2" />
                Print Preview
              </Button>
            </div>
            <div className="border rounded-lg overflow-hidden bg-white">
              <ContractNotificationPreview {...previewData} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

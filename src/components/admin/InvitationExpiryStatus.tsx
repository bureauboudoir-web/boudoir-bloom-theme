import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, MousePointer } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface InvitationExpiryStatusProps {
  emailStatus: string | null;
  emailSentAt: string | null;
  passwordResetExpiresAt: string | null;
  linkClickedAt: string | null;
  linkUsedAt: string | null;
}

export const InvitationExpiryStatus = ({
  emailStatus,
  emailSentAt,
  passwordResetExpiresAt,
  linkClickedAt,
  linkUsedAt,
}: InvitationExpiryStatusProps) => {
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!passwordResetExpiresAt) return;

    const updateTimeRemaining = () => {
      const now = new Date();
      const expiryDate = new Date(passwordResetExpiresAt);
      const diff = expiryDate.getTime() - now.getTime();

      if (diff <= 0) {
        setIsExpired(true);
        setTimeRemaining("Expired");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else {
        setTimeRemaining(`${minutes}m`);
      }

      setIsExpired(false);
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [passwordResetExpiresAt]);

  // If password has been set, show success
  if (linkUsedAt) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <CheckCircle className="w-3 h-3 text-green-500" />
        <span className="text-green-500">
          Setup completed {formatDistanceToNow(new Date(linkUsedAt), { addSuffix: true })}
        </span>
      </div>
    );
  }

  // If link was clicked but not used yet
  if (linkClickedAt) {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs">
          <MousePointer className="w-3 h-3 text-blue-500" />
          <span className="text-blue-500">
            Magic link opened {formatDistanceToNow(new Date(linkClickedAt), { addSuffix: true })}
          </span>
        </div>
        {passwordResetExpiresAt && (
          <div className="flex items-center gap-2 text-xs">
            {isExpired ? (
              <>
                <XCircle className="w-3 h-3 text-destructive" />
                <span className="text-destructive">Magic link expired - Resend invitation</span>
              </>
            ) : (
              <>
                <Clock className="w-3 h-3 text-yellow-500" />
                <span className="text-yellow-500">
                  Expires in {timeRemaining}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  // Show email status and expiry info
  if (emailStatus === 'sent' && emailSentAt) {
    const sentTime = formatDistanceToNow(new Date(emailSentAt), { addSuffix: true });
    
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs">
          <CheckCircle className="w-3 h-3 text-green-500" />
          <span className="text-green-500">Email sent {sentTime}</span>
        </div>
        {passwordResetExpiresAt && (
          <div className="flex items-center gap-2 text-xs">
            {isExpired ? (
              <>
                <XCircle className="w-3 h-3 text-destructive" />
                <span className="text-destructive">Magic link expired - Resend invitation</span>
              </>
            ) : (
              <>
                <Clock className="w-3 h-3 text-yellow-500" />
                <span className="text-yellow-500">
                  Expires in {timeRemaining}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  // Email failed or pending
  if (emailStatus === 'failed') {
    return (
      <div className="flex items-center gap-2 text-xs">
        <XCircle className="w-3 h-3 text-destructive" />
        <span className="text-destructive">Email failed - Resend invitation</span>
      </div>
    );
  }

  if (emailStatus === 'pending') {
    return (
      <div className="flex items-center gap-2 text-xs">
        <Clock className="w-3 h-3 text-yellow-500" />
        <span className="text-yellow-500">Email sending...</span>
      </div>
    );
  }

  // No email status available (legacy approval)
  return (
    <div className="flex items-center gap-2 text-xs">
      <XCircle className="w-3 h-3 text-muted-foreground" />
      <span className="text-muted-foreground">
        Email status unavailable - Resend invitation
      </span>
    </div>
  );
};
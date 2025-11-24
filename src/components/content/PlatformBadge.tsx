import { Badge } from "@/components/ui/badge";
import { MessageCircle, Camera, Youtube, Twitter, Heart, Send } from "lucide-react";

export type PlatformType = 'tiktok' | 'instagram' | 'youtube' | 'twitter' | 'onlyfans' | 'fansly' | 'telegram' | 'other' | null;

interface PlatformBadgeProps {
  platform: PlatformType;
  className?: string;
}

const platformConfig = {
  tiktok: {
    label: 'TikTok',
    icon: MessageCircle,
    className: 'bg-[#FE2C55]/10 text-[#FE2C55] border-[#FE2C55]/20 hover:bg-[#FE2C55]/20'
  },
  instagram: {
    label: 'Instagram',
    icon: Camera,
    className: 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 border-purple-500/20 hover:from-purple-500/20 hover:to-pink-500/20'
  },
  youtube: {
    label: 'YouTube',
    icon: Youtube,
    className: 'bg-[#FF0000]/10 text-[#FF0000] border-[#FF0000]/20 hover:bg-[#FF0000]/20'
  },
  twitter: {
    label: 'Twitter',
    icon: Twitter,
    className: 'bg-[#1DA1F2]/10 text-[#1DA1F2] border-[#1DA1F2]/20 hover:bg-[#1DA1F2]/20'
  },
  onlyfans: {
    label: 'OnlyFans',
    icon: Heart,
    className: 'bg-[#00AFF0]/10 text-[#00AFF0] border-[#00AFF0]/20 hover:bg-[#00AFF0]/20'
  },
  fansly: {
    label: 'Fansly',
    icon: Heart,
    className: 'bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20'
  },
  telegram: {
    label: 'Telegram',
    icon: Send,
    className: 'bg-[#0088CC]/10 text-[#0088CC] border-[#0088CC]/20 hover:bg-[#0088CC]/20'
  },
  other: {
    label: 'Other',
    icon: MessageCircle,
    className: 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
  }
};

export const PlatformBadge = ({ platform, className = "" }: PlatformBadgeProps) => {
  if (!platform) return null;
  
  const config = platformConfig[platform] || platformConfig.other;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`${config.className} ${className} gap-1.5`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
};

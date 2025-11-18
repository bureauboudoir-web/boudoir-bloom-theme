import { Music, Camera, User, Image, FileText } from "lucide-react";

export type ContentTypeCategory = 'tiktok' | 'instagram' | 'profile_pictures' | 'banners' | 'other';

interface ContentTypeIconProps {
  type: ContentTypeCategory | null;
  className?: string;
}

export const ContentTypeIcon = ({ type, className = "w-4 h-4" }: ContentTypeIconProps) => {
  switch (type) {
    case 'tiktok':
      return <Music className={className} />;
    case 'instagram':
      return <Camera className={className} />;
    case 'profile_pictures':
      return <User className={className} />;
    case 'banners':
      return <Image className={className} />;
    case 'other':
      return <FileText className={className} />;
    default:
      return <FileText className={className} />;
  }
};

export const contentTypeLabels: Record<ContentTypeCategory, string> = {
  tiktok: 'TikTok',
  instagram: 'Instagram',
  profile_pictures: 'Profile Pictures',
  banners: 'Banners',
  other: 'Other'
};

export const contentTypeColors: Record<ContentTypeCategory, string> = {
  tiktok: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
  instagram: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  profile_pictures: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  banners: 'bg-green-500/10 text-green-500 border-green-500/20',
  other: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
};

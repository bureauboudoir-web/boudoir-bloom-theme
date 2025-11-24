import { Badge } from "@/components/ui/badge";
import { Video, Image, FileText, Target, Palette, Package } from "lucide-react";

export type ContentCategory = 'video' | 'photo' | 'script' | 'hook' | 'marketing_artwork' | 'other' | null;

interface CategoryBadgeProps {
  category: ContentCategory;
  className?: string;
}

const categoryConfig = {
  video: {
    label: 'Video',
    icon: Video,
    className: 'bg-rose-500/10 text-rose-600 border-rose-500/20'
  },
  photo: {
    label: 'Photo',
    icon: Image,
    className: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
  },
  script: {
    label: 'Script',
    icon: FileText,
    className: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
  },
  hook: {
    label: 'Hook',
    icon: Target,
    className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
  },
  marketing_artwork: {
    label: 'Marketing',
    icon: Palette,
    className: 'bg-violet-500/10 text-violet-600 border-violet-500/20'
  },
  other: {
    label: 'Other',
    icon: Package,
    className: 'bg-muted text-muted-foreground border-border'
  }
};

export const CategoryBadge = ({ category, className = "" }: CategoryBadgeProps) => {
  if (!category) return null;
  
  const config = categoryConfig[category] || categoryConfig.other;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`${config.className} ${className} gap-1.5`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
};

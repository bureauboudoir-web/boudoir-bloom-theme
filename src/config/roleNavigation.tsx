import { 
  LayoutDashboard, 
  Users, 
  UserCog, 
  Shield, 
  FileText, 
  Settings,
  Calendar,
  MessageSquare,
  Phone,
  CheckSquare,
  UserCheck,
  MessageCircle,
  Palette,
  TrendingUp,
  BookOpen,
  BarChart,
  Camera,
  Upload,
  CalendarRange,
  User,
  Sparkles,
  Mic
} from "lucide-react";

export interface NavItem {
  label: string;
  icon: any;
  path: string;
  requiresRole?: string[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

// Admin Navigation
export const adminNavigation: NavSection[] = [
  {
    title: "Dashboard",
    items: [
      { label: "Overview", icon: LayoutDashboard, path: "/dashboard/admin" },
    ]
  },
  {
    title: "Management",
    items: [
      { label: "User Management", icon: Users, path: "/dashboard/admin/users" },
      { label: "Creator Management", icon: UserCog, path: "/dashboard/admin/creators" },
      { label: "Staff Management", icon: UserCheck, path: "/dashboard/admin/staff" },
      { label: "Roles & Permissions", icon: Shield, path: "/dashboard/admin/roles" },
    ]
  },
  {
    title: "Operations",
    items: [
      { label: "Reports", icon: FileText, path: "/dashboard/admin/reports" },
      { label: "Settings", icon: Settings, path: "/dashboard/admin/settings" },
    ]
  },
  {
    title: "Team Tools",
    items: [
      { label: "Chat", icon: MessageCircle, path: "/dashboard/chat" },
      { label: "Marketing", icon: TrendingUp, path: "/dashboard/marketing" },
      { label: "Studio", icon: Camera, path: "/dashboard/studio" },
    ]
  },
  {
    title: "Personal",
    items: [
      { label: "My Meetings", icon: Calendar, path: "/dashboard/admin/meetings" },
      { label: "My Commitments", icon: CheckSquare, path: "/dashboard/admin/commitments" },
      { label: "Contact Us", icon: Phone, path: "/dashboard/admin/contact" },
    ]
  }
];

// Manager Navigation
export const managerNavigation: NavSection[] = [
  {
    title: "Dashboard",
    items: [
      { label: "Overview", icon: LayoutDashboard, path: "/dashboard/manager" },
    ]
  },
  {
    title: "Creator Management",
    items: [
      { label: "Approve Creators", icon: UserCheck, path: "/dashboard/manager/approve" },
      { label: "Assign Creators", icon: Users, path: "/dashboard/manager/assign" },
      { label: "Review Scripts", icon: FileText, path: "/dashboard/manager/scripts" },
      { label: "Review Hooks", icon: Sparkles, path: "/dashboard/manager/hooks" },
    ]
  },
  {
    title: "Operations",
    items: [
      { label: "Studio Schedule", icon: Camera, path: "/dashboard/manager/studio" },
      { label: "Team Notes", icon: MessageSquare, path: "/dashboard/manager/notes" },
    ]
  },
  {
    title: "Team Tools",
    items: [
      { label: "Chat", icon: MessageCircle, path: "/dashboard/chat" },
      { label: "Marketing", icon: TrendingUp, path: "/dashboard/marketing" },
      { label: "Studio", icon: Camera, path: "/dashboard/studio" },
    ]
  },
  {
    title: "Personal",
    items: [
      { label: "My Meetings", icon: Calendar, path: "/dashboard/manager/meetings" },
      { label: "My Commitments", icon: CheckSquare, path: "/dashboard/manager/commitments" },
      { label: "Contact Us", icon: Phone, path: "/dashboard/manager/contact" },
    ]
  }
];

// Chat Navigation
export const chatNavigation: NavSection[] = [
  {
    title: "Dashboard",
    items: [
      { label: "Overview", icon: LayoutDashboard, path: "/dashboard/chat" },
    ]
  },
  {
    title: "Content",
    items: [
      { label: "Creator Personas", icon: User, path: "/dashboard/chat/personas" },
      { label: "PPV Scripts", icon: FileText, path: "/dashboard/chat/ppv-scripts" },
      { label: "Chat Templates", icon: MessageCircle, path: "/dashboard/chat/templates" },
      { label: "Creator Campaigns", icon: TrendingUp, path: "/dashboard/chat/campaigns" },
      { label: "Notes", icon: MessageSquare, path: "/dashboard/chat/notes" },
    ]
  },
  {
    title: "Personal",
    items: [
      { label: "My Meetings", icon: Calendar, path: "/dashboard/chat/meetings" },
      { label: "My Commitments", icon: CheckSquare, path: "/dashboard/chat/commitments" },
      { label: "Contact Us", icon: Phone, path: "/dashboard/chat/contact" },
    ]
  }
];

// Marketing Navigation
export const marketingNavigation: NavSection[] = [
  {
    title: "Dashboard",
    items: [
      { label: "Overview", icon: LayoutDashboard, path: "/dashboard/marketing" },
    ]
  },
  {
    title: "Content",
    items: [
      { label: "Hook Library", icon: Sparkles, path: "/dashboard/marketing/hooks" },
      { label: "Post Ideas", icon: BookOpen, path: "/dashboard/marketing/ideas" },
      { label: "Content Calendar", icon: CalendarRange, path: "/dashboard/marketing/calendar" },
      { label: "Captions Library", icon: FileText, path: "/dashboard/marketing/captions" },
      { label: "Funnels", icon: TrendingUp, path: "/dashboard/marketing/funnels" },
    ]
  },
  {
    title: "Personal",
    items: [
      { label: "My Meetings", icon: Calendar, path: "/dashboard/marketing/meetings" },
      { label: "My Commitments", icon: CheckSquare, path: "/dashboard/marketing/commitments" },
      { label: "Contact Us", icon: Phone, path: "/dashboard/marketing/contact" },
    ]
  }
];

// Studio Navigation
export const studioNavigation: NavSection[] = [
  {
    title: "Dashboard",
    items: [
      { label: "Overview", icon: LayoutDashboard, path: "/dashboard/studio" },
    ]
  },
  {
    title: "Production",
    items: [
      { label: "Shoot Planner", icon: Calendar, path: "/dashboard/studio/planner" },
      { label: "Shot Lists", icon: CheckSquare, path: "/dashboard/studio/shot-lists" },
      { label: "Upload Area", icon: Upload, path: "/dashboard/studio/upload" },
      { label: "Studio Calendar", icon: CalendarRange, path: "/dashboard/studio/calendar" },
    ]
  },
  {
    title: "Personal",
    items: [
      { label: "My Meetings", icon: Calendar, path: "/dashboard/studio/meetings" },
      { label: "My Commitments", icon: CheckSquare, path: "/dashboard/studio/commitments" },
      { label: "Contact Us", icon: Phone, path: "/dashboard/studio/contact" },
    ]
  }
];

// Creator Navigation
export const creatorNavigation: NavSection[] = [
  {
    title: "Dashboard",
    items: [
      { label: "Overview", icon: LayoutDashboard, path: "/dashboard/creator" },
    ]
  },
  {
    title: "Profile",
    items: [
      { label: "Profile Info", icon: User, path: "/dashboard/creator/profile" },
      { label: "Persona", icon: Sparkles, path: "/dashboard/creator/persona" },
      { label: "Starter Pack", icon: BookOpen, path: "/dashboard/creator/starter-pack" },
    ]
  },
  {
    title: "Tools",
    items: [
      { label: "Voice Training", icon: Mic, path: "/dashboard/creator/voice-training" },
      { label: "Sample Selector", icon: Palette, path: "/dashboard/creator/samples" },
      { label: "Scripts Review", icon: FileText, path: "/dashboard/creator/scripts" },
    ]
  },
  {
    title: "Personal",
    items: [
      { label: "My Meetings", icon: Calendar, path: "/dashboard/creator/meetings" },
      { label: "My Commitments", icon: CheckSquare, path: "/dashboard/creator/commitments" },
      { label: "Contact Us", icon: Phone, path: "/dashboard/creator/contact" },
    ]
  }
];

export const getRoleNavigation = (role: string): NavSection[] => {
  switch (role) {
    case 'admin':
    case 'super_admin':
      return adminNavigation;
    case 'manager':
      return managerNavigation;
    case 'chatter':
      return chatNavigation;
    case 'marketing':
      return marketingNavigation;
    case 'studio':
      return studioNavigation;
    case 'creator':
      return creatorNavigation;
    default:
      return creatorNavigation;
  }
};

export const getRoleDashboardPath = (role: string): string => {
  switch (role) {
    case 'admin':
    case 'super_admin':
      return '/dashboard/admin';
    case 'manager':
      return '/dashboard/manager';
    case 'chatter':
      return '/dashboard/chat';
    case 'marketing':
      return '/dashboard/marketing';
    case 'studio':
      return '/dashboard/studio';
    case 'creator':
      return '/dashboard/creator';
    default:
      return '/dashboard/creator';
  }
};

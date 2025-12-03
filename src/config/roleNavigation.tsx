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
  Mic,
  Wrench,
  Key
} from "lucide-react";

export interface NavItem {
  label: string;
  labelKey?: string;
  icon: any;
  path: string;
  requiresRole?: string[];
}

export interface NavSection {
  title: string;
  titleKey?: string;
  items: NavItem[];
}

// Admin Navigation
export const adminNavigation: NavSection[] = [
  {
    title: "Dashboard",
    titleKey: "dashboard.sections.dashboard",
    items: [
      { label: "Overview", labelKey: "dashboard.nav.overview", icon: LayoutDashboard, path: "/dashboard/admin" },
    ]
  },
  {
    title: "Management",
    titleKey: "dashboard.sections.management",
    items: [
      { label: "User Management", labelKey: "admin.nav.userManagement", icon: Users, path: "/dashboard/admin/users" },
      { label: "Creator Management", labelKey: "admin.nav.creatorManagement", icon: UserCog, path: "/dashboard/creators" },
      { label: "Staff Management", labelKey: "admin.nav.staffManagement", icon: UserCheck, path: "/dashboard/admin/staff" },
      { label: "Roles & Permissions", labelKey: "admin.nav.rolesPermissions", icon: Shield, path: "/dashboard/admin/roles" },
    ]
  },
  {
    title: "Operations",
    titleKey: "dashboard.sections.supportAdmin",
    items: [
      { label: "Reports", labelKey: "admin.nav.reports", icon: FileText, path: "/dashboard/admin/reports" },
      { label: "API Keys", labelKey: "admin.nav.apiKeys", icon: Key, path: "/dashboard/admin/api-keys" },
      { label: "API Documentation", labelKey: "admin.nav.apiDocs", icon: BookOpen, path: "/dashboard/admin/api-docs" },
      { label: "Settings", labelKey: "dashboard.nav.settings", icon: Settings, path: "/dashboard/admin/settings" },
    ]
  },
  {
    title: "Team Tools",
    titleKey: "dashboard.sections.management",
    items: [
      { label: "Chat", icon: MessageCircle, path: "/dashboard/chat" },
      { label: "Chat Team", icon: MessageCircle, path: "/dashboard/chat-team" },
      { label: "Marketing", icon: TrendingUp, path: "/dashboard/marketing" },
      { label: "Marketing Team", icon: TrendingUp, path: "/dashboard/marketing-team" },
      { label: "Studio", icon: Camera, path: "/dashboard/studio" },
      { label: "Studio Team", icon: Camera, path: "/dashboard/studio-team" },
    ]
  },
  {
    title: "Personal",
    titleKey: "dashboard.sections.profileSetup",
    items: [
      { label: "My Meetings", labelKey: "dashboard.nav.meetings", icon: Calendar, path: "/dashboard/admin/meetings" },
      { label: "My Commitments", labelKey: "dashboard.nav.commitments", icon: CheckSquare, path: "/dashboard/admin/commitments" },
      { label: "Contact Us", labelKey: "dashboard.nav.contact", icon: Phone, path: "/dashboard/admin/contact" },
    ]
  }
];

// Manager Navigation
export const managerNavigation: NavSection[] = [
  {
    title: "Dashboard",
    titleKey: "dashboard.sections.dashboard",
    items: [
      { label: "Overview", labelKey: "dashboard.nav.overview", icon: LayoutDashboard, path: "/dashboard/manager" },
    ]
  },
  {
    title: "Creator Management",
    titleKey: "dashboard.sections.management",
    items: [
      { label: "Approve Creators", labelKey: "manager.nav.approveCreators", icon: UserCheck, path: "/dashboard/manager/approve" },
      { label: "Assign Creators", labelKey: "manager.nav.assignCreators", icon: Users, path: "/dashboard/manager/assign" },
      { label: "Review Scripts", labelKey: "manager.nav.reviewScripts", icon: FileText, path: "/dashboard/manager/scripts" },
      { label: "Review Hooks", labelKey: "manager.nav.reviewHooks", icon: Sparkles, path: "/dashboard/manager/hooks" },
    ]
  },
  {
    title: "Operations",
    titleKey: "dashboard.sections.workPayments",
    items: [
      { label: "Studio Schedule", labelKey: "manager.nav.studioSchedule", icon: Camera, path: "/dashboard/manager/studio" },
      { label: "Team Notes", labelKey: "manager.nav.teamNotes", icon: MessageSquare, path: "/dashboard/manager/notes" },
    ]
  },
  {
    title: "Team Tools",
    titleKey: "dashboard.sections.management",
    items: [
      { label: "Chat", icon: MessageCircle, path: "/dashboard/chat" },
      { label: "Chat Team", icon: MessageCircle, path: "/dashboard/chat-team" },
      { label: "Marketing", icon: TrendingUp, path: "/dashboard/marketing" },
      { label: "Marketing Team", icon: TrendingUp, path: "/dashboard/marketing-team" },
      { label: "Studio", icon: Camera, path: "/dashboard/studio" },
      { label: "Studio Team", icon: Camera, path: "/dashboard/studio-team" },
    ]
  },
  {
    title: "Personal",
    titleKey: "dashboard.sections.profileSetup",
    items: [
      { label: "My Meetings", labelKey: "dashboard.nav.meetings", icon: Calendar, path: "/dashboard/manager/meetings" },
      { label: "My Commitments", labelKey: "dashboard.nav.commitments", icon: CheckSquare, path: "/dashboard/manager/commitments" },
      { label: "Contact Us", labelKey: "dashboard.nav.contact", icon: Phone, path: "/dashboard/manager/contact" },
    ]
  }
];

// Chat Navigation
export const chatNavigation: NavSection[] = [
  {
    title: "Dashboard",
    titleKey: "dashboard.sections.dashboard",
    items: [
      { label: "Overview", labelKey: "dashboard.nav.overview", icon: LayoutDashboard, path: "/dashboard/chat" },
    ]
  },
  {
    title: "Content",
    titleKey: "dashboard.sections.management",
    items: [
      { label: "Creator Personas", labelKey: "chat.nav.personas", icon: User, path: "/dashboard/chat/personas" },
      { label: "PPV Scripts", labelKey: "chat.nav.ppvScripts", icon: FileText, path: "/dashboard/chat/ppv-scripts" },
      { label: "Chat Templates", labelKey: "chat.nav.templates", icon: MessageCircle, path: "/dashboard/chat/templates" },
      { label: "Creator Campaigns", labelKey: "chat.nav.campaigns", icon: TrendingUp, path: "/dashboard/chat/campaigns" },
      { label: "Notes", labelKey: "chat.nav.notes", icon: MessageSquare, path: "/dashboard/chat/notes" },
    ]
  },
  {
    title: "Personal",
    titleKey: "dashboard.sections.profileSetup",
    items: [
      { label: "My Meetings", labelKey: "dashboard.nav.meetings", icon: Calendar, path: "/dashboard/chat/meetings" },
      { label: "My Commitments", labelKey: "dashboard.nav.commitments", icon: CheckSquare, path: "/dashboard/chat/commitments" },
      { label: "Contact Us", labelKey: "dashboard.nav.contact", icon: Phone, path: "/dashboard/chat/contact" },
    ]
  }
];

// Marketing Navigation
export const marketingNavigation: NavSection[] = [
  {
    title: "Dashboard",
    titleKey: "dashboard.sections.dashboard",
    items: [
      { label: "Overview", labelKey: "dashboard.nav.overview", icon: LayoutDashboard, path: "/dashboard/marketing" },
    ]
  },
  {
    title: "Content",
    titleKey: "dashboard.sections.management",
    items: [
      { label: "Hook Library", labelKey: "marketing.nav.hookLibrary", icon: Sparkles, path: "/dashboard/marketing/hooks" },
      { label: "Post Ideas", labelKey: "marketing.nav.postIdeas", icon: BookOpen, path: "/dashboard/marketing/ideas" },
      { label: "Content Calendar", labelKey: "marketing.nav.contentCalendar", icon: CalendarRange, path: "/dashboard/marketing/calendar" },
      { label: "Captions Library", labelKey: "marketing.nav.captionsLibrary", icon: FileText, path: "/dashboard/marketing/captions" },
      { label: "Funnels", labelKey: "marketing.nav.funnels", icon: TrendingUp, path: "/dashboard/marketing/funnels" },
    ]
  },
  {
    title: "Personal",
    titleKey: "dashboard.sections.profileSetup",
    items: [
      { label: "My Meetings", labelKey: "dashboard.nav.meetings", icon: Calendar, path: "/dashboard/marketing/meetings" },
      { label: "My Commitments", labelKey: "dashboard.nav.commitments", icon: CheckSquare, path: "/dashboard/marketing/commitments" },
      { label: "Contact Us", labelKey: "dashboard.nav.contact", icon: Phone, path: "/dashboard/marketing/contact" },
    ]
  }
];

// Studio Navigation
export const studioNavigation: NavSection[] = [
  {
    title: "Dashboard",
    titleKey: "dashboard.sections.dashboard",
    items: [
      { label: "Overview", labelKey: "dashboard.nav.overview", icon: LayoutDashboard, path: "/dashboard/studio" },
    ]
  },
  {
    title: "Production",
    titleKey: "dashboard.sections.management",
    items: [
      { label: "Shoot Planner", labelKey: "studio.nav.shootPlanner", icon: Calendar, path: "/dashboard/studio/planner" },
      { label: "Shot Lists", labelKey: "studio.nav.shotLists", icon: CheckSquare, path: "/dashboard/studio/shot-lists" },
      { label: "Upload Area", labelKey: "studio.nav.uploadArea", icon: Upload, path: "/dashboard/studio/upload" },
      { label: "Studio Calendar", labelKey: "studio.nav.studioCalendar", icon: CalendarRange, path: "/dashboard/studio/calendar" },
    ]
  },
  {
    title: "Personal",
    titleKey: "dashboard.sections.profileSetup",
    items: [
      { label: "My Meetings", labelKey: "dashboard.nav.meetings", icon: Calendar, path: "/dashboard/studio/meetings" },
      { label: "My Commitments", labelKey: "dashboard.nav.commitments", icon: CheckSquare, path: "/dashboard/studio/commitments" },
      { label: "Contact Us", labelKey: "dashboard.nav.contact", icon: Phone, path: "/dashboard/studio/contact" },
    ]
  }
];

// Creator Navigation
export const creatorNavigation: NavSection[] = [
  {
    title: "Dashboard",
    titleKey: "dashboard.sections.dashboard",
    items: [
      { label: "Overview", labelKey: "dashboard.nav.overview", icon: LayoutDashboard, path: "/dashboard/creator" },
    ]
  },
  {
    title: "Profile",
    titleKey: "dashboard.sections.profileSetup",
    items: [
      { label: "Profile Info", labelKey: "dashboard.nav.profile", icon: User, path: "/dashboard/creator/profile" },
      { label: "Persona", labelKey: "dashboard.nav.persona", icon: Sparkles, path: "/dashboard/creator/persona" },
      { label: "Starter Pack", labelKey: "dashboard.nav.starterPack", icon: BookOpen, path: "/dashboard/creator/starter-pack" },
    ]
  },
  {
    title: "Tools",
    titleKey: "dashboard.sections.management",
    items: [
      { label: "Tools", labelKey: "dashboard.nav.tools", icon: Wrench, path: "/dashboard/creator/tools" },
      { label: "Voice Training", labelKey: "dashboard.nav.voiceTraining", icon: Mic, path: "/dashboard/creator/tools/voice-training" },
      { label: "Sample Selector", labelKey: "dashboard.nav.contentPreferences", icon: Palette, path: "/dashboard/creator/samples" },
      { label: "Scripts Review", labelKey: "dashboard.nav.scripts", icon: FileText, path: "/dashboard/creator/scripts" },
    ]
  },
  {
    title: "Personal",
    titleKey: "dashboard.sections.workPayments",
    items: [
      { label: "My Meetings", labelKey: "dashboard.nav.meetings", icon: Calendar, path: "/dashboard/creator/meetings" },
      { label: "My Commitments", labelKey: "dashboard.nav.commitments", icon: CheckSquare, path: "/dashboard/creator/commitments" },
      { label: "Contact Us", labelKey: "dashboard.nav.contact", icon: Phone, path: "/dashboard/creator/contact" },
    ]
  }
];

// Chat Team Navigation
export const chatTeamNavigation: NavSection[] = [
  {
    title: "Dashboard",
    titleKey: "dashboard.sections.dashboard",
    items: [
      { label: "Overview", labelKey: "dashboard.nav.overview", icon: LayoutDashboard, path: "/dashboard/chat-team" },
    ]
  },
  {
    title: "Chat Operations",
    titleKey: "dashboard.sections.management",
    items: [
      { label: "Inbox", icon: MessageCircle, path: "/dashboard/chat-team/inbox" },
      { label: "Creator List", icon: Users, path: "/dashboard/chat-team/creators" },
      { label: "Voice Tools", icon: Mic, path: "/dashboard/chat-team/voice" },
      { label: "Scripts Library", icon: FileText, path: "/dashboard/chat-team/scripts" },
      { label: "Content Library", icon: BookOpen, path: "/dashboard/chat-team/content" },
    ]
  },
  {
    title: "Personal",
    titleKey: "dashboard.sections.profileSetup",
    items: [
      { label: "My Meetings", labelKey: "dashboard.nav.meetings", icon: Calendar, path: "/dashboard/chat-team/meetings" },
      { label: "Contact Us", labelKey: "dashboard.nav.contact", icon: Phone, path: "/dashboard/chat-team/contact" },
    ]
  }
];

// Marketing Team Navigation
export const marketingTeamNavigation: NavSection[] = [
  {
    title: "Dashboard",
    titleKey: "dashboard.sections.dashboard",
    items: [
      { label: "Overview", labelKey: "dashboard.nav.overview", icon: LayoutDashboard, path: "/dashboard/marketing-team" },
    ]
  },
  {
    title: "Marketing Operations",
    titleKey: "dashboard.sections.management",
    items: [
      { label: "Posting Calendar", icon: CalendarRange, path: "/dashboard/marketing-team/calendar" },
      { label: "Content Planner", icon: TrendingUp, path: "/dashboard/marketing-team/planner" },
      { label: "Captions Library", icon: FileText, path: "/dashboard/marketing-team/captions" },
      { label: "Creator Profiles", icon: User, path: "/dashboard/marketing-team/creators" },
    ]
  },
  {
    title: "Personal",
    titleKey: "dashboard.sections.profileSetup",
    items: [
      { label: "My Meetings", labelKey: "dashboard.nav.meetings", icon: Calendar, path: "/dashboard/marketing-team/meetings" },
      { label: "Contact Us", labelKey: "dashboard.nav.contact", icon: Phone, path: "/dashboard/marketing-team/contact" },
    ]
  }
];

// Studio Team Navigation
export const studioTeamNavigation: NavSection[] = [
  {
    title: "Dashboard",
    titleKey: "dashboard.sections.dashboard",
    items: [
      { label: "Overview", labelKey: "dashboard.nav.overview", icon: LayoutDashboard, path: "/dashboard/studio-team" },
    ]
  },
  {
    title: "Studio Operations",
    titleKey: "dashboard.sections.management",
    items: [
      { label: "Studio Schedule", icon: Calendar, path: "/dashboard/studio-team/schedule" },
      { label: "Shoot List", icon: CheckSquare, path: "/dashboard/studio-team/shoots" },
      { label: "Upload Content", icon: Upload, path: "/dashboard/studio-team/upload" },
      { label: "Commitments", icon: CalendarRange, path: "/dashboard/studio-team/commitments" },
    ]
  },
  {
    title: "Personal",
    titleKey: "dashboard.sections.profileSetup",
    items: [
      { label: "My Meetings", labelKey: "dashboard.nav.meetings", icon: Calendar, path: "/dashboard/studio-team/meetings" },
      { label: "Contact Us", labelKey: "dashboard.nav.contact", icon: Phone, path: "/dashboard/studio-team/contact" },
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
    case 'chat_team':
      return chatTeamNavigation;
    case 'marketing_team':
      return marketingTeamNavigation;
    case 'studio_team':
      return studioTeamNavigation;
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
    case 'chat_team':
      return '/dashboard/chat-team';
    case 'marketing_team':
      return '/dashboard/marketing-team';
    case 'studio_team':
      return '/dashboard/studio-team';
    case 'creator':
      return '/dashboard/creator';
    default:
      return '/dashboard/creator';
  }
};

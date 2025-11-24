import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  FileText, 
  Upload, 
  Mail, 
  Calendar, 
  CheckSquare, 
  Shield, 
  DollarSign,
  FolderOpen,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

type TabId = "overview" | "onboarding" | "account" | "settings" | "meetings" | "upload" | "commitments" | "shoots" | "invoices" | "contract" | "support" | "library" | "admin" | "manager";

interface DashboardNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  pendingCommitments: number;
  newInvoices: number;
  upcomingShoots?: number;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isManagerOnly: boolean;
  isCreator: boolean;
  isManager: boolean;
  onAdminClick: () => void;
  onManagerClick: () => void;
  onMobileMenuClose?: () => void;
  accessLevel?: 'no_access' | 'meeting_only' | 'full_access';
}

export const DashboardNav = ({
  activeTab,
  onTabChange,
  pendingCommitments,
  newInvoices,
  upcomingShoots = 0,
  isAdmin,
  isSuperAdmin,
  isManagerOnly,
  isCreator,
  isManager,
  onAdminClick,
  onManagerClick,
  onMobileMenuClose,
  accessLevel = 'full_access',
}: DashboardNavProps) => {
  const { t } = useTranslation();
  
  const handleTabClick = (tabId: TabId) => {
    onTabChange(tabId);
    onMobileMenuClose?.();
  };

  // Tabs allowed for meeting_only access
  const allowedTabsForMeetingOnly: TabId[] = ['overview', 'onboarding', 'meetings', 'account', 'settings'];

  const getDashboardLabel = () => {
    return t('dashboard.nav.overview');
  };

  const navSections = [
    {
      title: t('dashboard.sections.dashboard'),
      items: [
        { id: "overview" as TabId, label: getDashboardLabel(), icon: <CheckSquare className="w-4 h-4" /> },
      ]
    },
    {
      title: t('dashboard.sections.profileSetup'),
      items: [
        // Only show onboarding for pure creators (not admins/managers)
        ...(isCreator && !isAdmin && !isSuperAdmin && !isManager ? [
          { id: "onboarding" as TabId, label: t('dashboard.nav.onboarding'), icon: <FileText className="w-4 h-4" /> }
        ] : []),
        // Only show Creator Profile for users who have the creator role
        ...(isCreator ? [
          { id: "account" as TabId, label: t('dashboard.nav.account'), icon: <User className="w-4 h-4" /> }
        ] : []),
        { id: "settings" as TabId, label: t('dashboard.nav.settings'), icon: <Settings className="w-4 h-4" /> },
        { id: "meetings" as TabId, label: t('dashboard.nav.meetings'), icon: <Calendar className="w-4 h-4" /> },
        { id: "upload" as TabId, label: t('dashboard.nav.upload'), icon: <Upload className="w-4 h-4" /> },
        { id: "library" as TabId, label: t('dashboard.nav.library'), icon: <FolderOpen className="w-4 h-4" /> },
      ]
    },
    {
      title: t('dashboard.sections.workPayments'),
      items: [
        { 
          id: "commitments" as TabId, 
          label: t('dashboard.nav.commitments'), 
          icon: <CheckSquare className="w-4 h-4" />,
          badge: pendingCommitments,
          badgeVariant: "destructive" as const
        },
        { 
          id: "shoots" as TabId, 
          label: t('dashboard.nav.shoots'), 
          icon: <Calendar className="w-4 h-4" />,
          badge: upcomingShoots,
          badgeVariant: "destructive" as const
        },
        { 
          id: "invoices" as TabId, 
          label: t('dashboard.nav.invoices'), 
          icon: <DollarSign className="w-4 h-4" />,
          badge: newInvoices,
          badgeVariant: "destructive" as const
        },
        { id: "contract" as TabId, label: t('dashboard.nav.contract'), icon: <FileText className="w-4 h-4" /> },
      ]
    },
    {
      title: t('dashboard.sections.supportAdmin'),
      items: [
        { id: "support" as TabId, label: t('dashboard.nav.support'), icon: <Mail className="w-4 h-4" /> },
      ]
    }
  ];

  // Filter sections based on access level
  const filteredSections = accessLevel === 'meeting_only'
    ? navSections.map(section => ({
        ...section,
        items: section.items.filter(item => allowedTabsForMeetingOnly.includes(item.id))
      })).filter(section => section.items.length > 0)
    : navSections;

  // Add management section for admin/manager users
  const managementSection = (isAdmin || isSuperAdmin || isManagerOnly) ? {
    title: t('dashboard.sections.management'),
    items: [
      ...(isAdmin || isSuperAdmin ? [{ 
        id: "admin" as TabId, 
        label: t('dashboard.nav.adminControls'), 
        icon: <Shield className="w-4 h-4" /> 
      }] : []),
      ...(isManagerOnly ? [{ 
        id: "manager" as TabId, 
        label: t('dashboard.nav.managerControls'), 
        icon: <Shield className="w-4 h-4" /> 
      }] : []),
    ]
  } : null;

  return (
    <nav className="space-y-6">
      {filteredSections.map((section, idx) => (
        <div key={idx} className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
            {section.title}
          </h3>
          <div className="space-y-1">
            {section.items.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-11 px-3 transition-all",
                  activeTab === item.id && "bg-primary text-primary-foreground shadow-sm"
                )}
                onClick={() => handleTabClick(item.id)}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <Badge variant={item.badgeVariant} className="ml-auto min-w-[20px] h-5 px-1.5 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
      ))}

      {/* Management Section */}
      {managementSection && (
        <div className="pt-4 border-t border-border space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
            {managementSection.title}
          </h3>
          <div className="space-y-1">
            {managementSection.items.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-11 px-3 transition-all",
                  activeTab === item.id && "bg-primary text-primary-foreground shadow-sm"
                )}
                onClick={() => handleTabClick(item.id)}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

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
  FolderOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

type TabId = "overview" | "onboarding" | "account" | "meetings" | "upload" | "commitments" | "shoots" | "invoices" | "contract" | "support" | "library";

interface DashboardNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  pendingCommitments: number;
  newInvoices: number;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isManagerOnly: boolean;
  onAdminClick: () => void;
  onManagerClick: () => void;
  onMobileMenuClose?: () => void;
}

export const DashboardNav = ({
  activeTab,
  onTabChange,
  pendingCommitments,
  newInvoices,
  isAdmin,
  isSuperAdmin,
  isManagerOnly,
  onAdminClick,
  onManagerClick,
  onMobileMenuClose,
}: DashboardNavProps) => {
  const { t } = useTranslation();
  
  const handleTabClick = (tabId: TabId) => {
    onTabChange(tabId);
    onMobileMenuClose?.();
  };

  const navSections = [
    {
      title: t('dashboard.sections.dashboard'),
      items: [
        { id: "overview" as TabId, label: t('dashboard.nav.overview'), icon: <CheckSquare className="w-4 h-4" /> },
      ]
    },
    {
      title: t('dashboard.sections.profileSetup'),
      items: [
        { id: "onboarding" as TabId, label: t('dashboard.nav.onboarding'), icon: <FileText className="w-4 h-4" /> },
        { id: "account" as TabId, label: t('dashboard.nav.account'), icon: <User className="w-4 h-4" /> },
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
          badgeVariant: "secondary" as const
        },
        { id: "shoots" as TabId, label: t('dashboard.nav.shoots'), icon: <Calendar className="w-4 h-4" /> },
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

  return (
    <nav className="space-y-6">
      {navSections.map((section, idx) => (
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

      {/* Admin/Manager Dashboard - Special Treatment */}
      {(isAdmin || isSuperAdmin || isManagerOnly) && (
        <div className="pt-4 border-t border-border space-y-2">
          {(isAdmin || isSuperAdmin) && (
            <Button
              variant="outline"
              className="w-full justify-start h-11 px-3 border-primary/40 hover:bg-primary/10 hover:border-primary transition-all"
              onClick={() => {
                onAdminClick();
                onMobileMenuClose?.();
              }}
            >
              <Shield className="w-4 h-4 mr-3 text-primary" />
              <span className="text-sm font-medium">{t('dashboard.nav.adminDashboard')}</span>
            </Button>
          )}
          {isManagerOnly && (
            <Button
              variant="outline"
              className="w-full justify-start h-11 px-3 border-primary/40 hover:bg-primary/10 hover:border-primary transition-all"
              onClick={() => {
                onManagerClick();
                onMobileMenuClose?.();
              }}
            >
              <Shield className="w-4 h-4 mr-3 text-primary" />
              <span className="text-sm font-medium">{t('dashboard.nav.managerDashboard')}</span>
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

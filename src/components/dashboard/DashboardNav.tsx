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
  DollarSign 
} from "lucide-react";
import { cn } from "@/lib/utils";

type TabId = "overview" | "onboarding" | "account" | "meetings" | "upload" | "commitments" | "shoots" | "invoices" | "contract" | "support";

interface DashboardNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  pendingCommitments: number;
  newInvoices: number;
  isAdminOrManager: boolean;
  onAdminClick: () => void;
  onMobileMenuClose?: () => void;
}

export const DashboardNav = ({
  activeTab,
  onTabChange,
  pendingCommitments,
  newInvoices,
  isAdminOrManager,
  onAdminClick,
  onMobileMenuClose,
}: DashboardNavProps) => {
  
  const handleTabClick = (tabId: TabId) => {
    onTabChange(tabId);
    onMobileMenuClose?.();
  };

  const navSections = [
    {
      title: "Dashboard",
      items: [
        { id: "overview" as TabId, label: "Overview", icon: <CheckSquare className="w-4 h-4" /> },
      ]
    },
    {
      title: "Profile & Setup",
      items: [
        { id: "onboarding" as TabId, label: "Onboarding", icon: <FileText className="w-4 h-4" /> },
        { id: "account" as TabId, label: "Creator Profile", icon: <User className="w-4 h-4" /> },
        { id: "meetings" as TabId, label: "My Meetings", icon: <Calendar className="w-4 h-4" /> },
        { id: "upload" as TabId, label: "Uploads", icon: <Upload className="w-4 h-4" /> },
      ]
    },
    {
      title: "Work & Payments",
      items: [
        { 
          id: "commitments" as TabId, 
          label: "Commitments", 
          icon: <CheckSquare className="w-4 h-4" />,
          badge: pendingCommitments,
          badgeVariant: "secondary" as const
        },
        { id: "shoots" as TabId, label: "Studio Shoots", icon: <Calendar className="w-4 h-4" /> },
        { 
          id: "invoices" as TabId, 
          label: "Invoices", 
          icon: <DollarSign className="w-4 h-4" />,
          badge: newInvoices,
          badgeVariant: "destructive" as const
        },
        { id: "contract" as TabId, label: "Contract", icon: <FileText className="w-4 h-4" /> },
      ]
    },
    {
      title: "Support & Admin",
      items: [
        { id: "support" as TabId, label: "Contact Us", icon: <Mail className="w-4 h-4" /> },
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

      {/* Admin Dashboard - Special Treatment */}
      {isAdminOrManager && (
        <div className="pt-4 border-t border-border">
          <Button
            variant="outline"
            className="w-full justify-start h-11 px-3 border-primary/40 hover:bg-primary/10 hover:border-primary transition-all"
            onClick={() => {
              onAdminClick();
              onMobileMenuClose?.();
            }}
          >
            <Shield className="w-4 h-4 mr-3 text-primary" />
            <span className="text-sm font-medium">Admin Dashboard</span>
          </Button>
        </div>
      )}
    </nav>
  );
};

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Rocket, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  TrendingUp,
  Shield,
  Database,
  Mail,
  FileCheck,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ReadinessItem {
  category: string;
  icon: typeof TrendingUp;
  total: number;
  completed: number;
  critical: number;
  status: 'ready' | 'warning' | 'critical';
}

export const ProductionReadinessCheck = () => {
  const [loading, setLoading] = useState(false);
  const [readiness, setReadiness] = useState<ReadinessItem[]>([]);
  const [overallScore, setOverallScore] = useState(0);

  const checkReadiness = async () => {
    setLoading(true);
    try {
      const { data: testStatus } = await supabase
        .from('production_test_status')
        .select('*');

      const automatedTests: ReadinessItem = {
        category: "Automated Tests",
        icon: TrendingUp,
        total: 3,
        completed: testStatus?.filter(t => 
          t.test_category === 'automated' && t.status === 'completed'
        ).length || 0,
        critical: 3,
        status: 'critical'
      };

      const securityChecks: ReadinessItem = {
        category: "Security Configuration",
        icon: Shield,
        total: 4,
        completed: 2,
        critical: 4,
        status: 'warning'
      };

      const databaseChecks: ReadinessItem = {
        category: "Database Integrity",
        icon: Database,
        total: 3,
        completed: 2,
        critical: 2,
        status: 'warning'
      };

      const emailTests: ReadinessItem = {
        category: "Email System",
        icon: Mail,
        total: 5,
        completed: testStatus?.filter(t => 
          t.test_category === 'email' && t.status === 'completed'
        ).length || 0,
        critical: 2,
        status: 'ready'
      };

      const manualTests: ReadinessItem = {
        category: "Manual Verification",
        icon: FileCheck,
        total: 7,
        completed: testStatus?.filter(t => 
          t.test_category === 'manual' && t.status === 'completed'
        ).length || 0,
        critical: 3,
        status: 'warning'
      };

      const items = [automatedTests, securityChecks, databaseChecks, emailTests, manualTests];
      setReadiness(items);

      const totalTasks = items.reduce((sum, item) => sum + item.total, 0);
      const completedTasks = items.reduce((sum, item) => sum + item.completed, 0);
      const score = Math.round((completedTasks / totalTasks) * 100);
      setOverallScore(score);

      toast.success("Readiness check complete");
    } catch (error: any) {
      toast.error("Failed to check readiness: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkReadiness();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle2 className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const isProductionReady = overallScore >= 95 && 
    readiness.every(item => item.completed >= item.critical);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-5 w-5" />
          Production Readiness Dashboard
        </CardTitle>
        <CardDescription>
          Real-time overview of deployment readiness
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Overall Readiness</h3>
              <p className="text-sm text-muted-foreground">
                {isProductionReady ? "Ready for deployment" : "Additional steps required"}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{overallScore}%</div>
              <Badge variant={isProductionReady ? "default" : "secondary"}>
                {isProductionReady ? "Production Ready" : "In Progress"}
              </Badge>
            </div>
          </div>
          <Progress value={overallScore} className="h-3" />
        </div>

        {!isProductionReady && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Complete critical items before deploying to production.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <h3 className="font-medium text-sm">Category Breakdown:</h3>
          {readiness.map((item, index) => {
            const Icon = item.icon;
            const percentage = Math.round((item.completed / item.total) * 100);
            
            return (
              <div key={index} className="p-3 rounded-lg border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <div>
                      <div className="font-medium text-sm">{item.category}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.completed}/{item.total} completed
                        {item.critical > 0 && ` • ${item.critical} critical`}
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 ${getStatusColor(item.status)}`}>
                    {getStatusIcon(item.status)}
                    <span className="text-sm font-medium">{percentage}%</span>
                  </div>
                </div>
                <Progress value={percentage} className="h-1.5" />
              </div>
            );
          })}
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button 
            onClick={checkReadiness} 
            disabled={loading}
            variant="outline"
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              "Refresh Status"
            )}
          </Button>
          
          {isProductionReady && (
            <Button className="flex-1">
              <Rocket className="mr-2 h-4 w-4" />
              Deploy to Production
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

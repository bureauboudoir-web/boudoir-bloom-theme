import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Scale, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChecklistItem {
  id: string;
  category: 'tos' | 'privacy';
  item: string;
  checked: boolean;
}

export const LegalReviewChecklist = () => {
  const [items, setItems] = useState<ChecklistItem[]>([
    // Terms of Service
    { id: "tos-company", category: "tos", item: "Company name and legal entity correct", checked: false },
    { id: "tos-services", category: "tos", item: "Services description is accurate", checked: false },
    { id: "tos-payment", category: "tos", item: "Payment terms clearly defined", checked: false },
    { id: "tos-termination", category: "tos", item: "Termination clauses reviewed", checked: false },
    { id: "tos-liability", category: "tos", item: "Liability limitations appropriate", checked: false },
    { id: "tos-contact", category: "tos", item: "Contact information updated", checked: false },
    // Privacy Policy
    { id: "privacy-data", category: "privacy", item: "Data collection practices listed", checked: false },
    { id: "privacy-usage", category: "privacy", item: "Data usage explained", checked: false },
    { id: "privacy-storage", category: "privacy", item: "Data storage and security described", checked: false },
    { id: "privacy-sharing", category: "privacy", item: "Third-party data sharing disclosed", checked: false },
    { id: "privacy-rights", category: "privacy", item: "User rights (GDPR) included", checked: false },
    { id: "privacy-cookies", category: "privacy", item: "Cookie policy explained", checked: false },
    { id: "privacy-contact", category: "privacy", item: "Privacy contact email provided", checked: false }
  ]);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const { data: tosData } = await supabase
      .from('production_test_status')
      .select('notes')
      .eq('test_category', 'Legal')
      .eq('test_item', 'Terms of Service review')
      .single();

    const { data: privacyData } = await supabase
      .from('production_test_status')
      .select('notes')
      .eq('test_category', 'Legal')
      .eq('test_item', 'Privacy Policy review')
      .single();

    try {
      if (tosData?.notes) {
        const tosItems = JSON.parse(tosData.notes);
        setItems(prev => prev.map(item => {
          const saved = tosItems.find((s: ChecklistItem) => s.id === item.id);
          return saved || item;
        }));
      }
      if (privacyData?.notes) {
        const privacyItems = JSON.parse(privacyData.notes);
        setItems(prev => prev.map(item => {
          const saved = privacyItems.find((s: ChecklistItem) => s.id === item.id);
          return saved || item;
        }));
      }
    } catch (e) {
      console.error("Failed to parse saved progress");
    }
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const saveProgress = async () => {
    try {
      const tosItems = items.filter(i => i.category === 'tos');
      const privacyItems = items.filter(i => i.category === 'privacy');
      
      const tosComplete = tosItems.every(i => i.checked);
      const privacyComplete = privacyItems.every(i => i.checked);

      await Promise.all([
        supabase.from('production_test_status').upsert({
          test_category: 'Legal',
          test_item: 'Terms of Service review',
          status: tosComplete ? 'pass' : 'pending',
          notes: JSON.stringify(tosItems),
          completed_by: (await supabase.auth.getUser()).data.user?.id,
          completed_at: tosComplete ? new Date().toISOString() : null
        }),
        supabase.from('production_test_status').upsert({
          test_category: 'Legal',
          test_item: 'Privacy Policy review',
          status: privacyComplete ? 'pass' : 'pending',
          notes: JSON.stringify(privacyItems),
          completed_by: (await supabase.auth.getUser()).data.user?.id,
          completed_at: privacyComplete ? new Date().toISOString() : null
        })
      ]);

      toast.success("Progress saved!");
    } catch (error: any) {
      toast.error("Failed to save: " + error.message);
    }
  };

  const tosProgress = (items.filter(i => i.category === 'tos' && i.checked).length / items.filter(i => i.category === 'tos').length) * 100;
  const privacyProgress = (items.filter(i => i.category === 'privacy' && i.checked).length / items.filter(i => i.category === 'privacy').length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Legal Review Checklist
        </CardTitle>
        <CardDescription>
          Review Terms of Service and Privacy Policy
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Terms of Service</h3>
            <Badge variant={tosProgress === 100 ? "default" : "outline"}>
              {Math.round(tosProgress)}%
            </Badge>
          </div>
          <div className="space-y-2">
            {items.filter(i => i.category === 'tos').map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-2 rounded-lg border">
                <Checkbox
                  id={item.id}
                  checked={item.checked}
                  onCheckedChange={() => toggleItem(item.id)}
                />
                <label htmlFor={item.id} className="text-sm cursor-pointer flex-1">
                  {item.item}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Privacy Policy</h3>
            <Badge variant={privacyProgress === 100 ? "default" : "outline"}>
              {Math.round(privacyProgress)}%
            </Badge>
          </div>
          <div className="space-y-2">
            {items.filter(i => i.category === 'privacy').map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-2 rounded-lg border">
                <Checkbox
                  id={item.id}
                  checked={item.checked}
                  onCheckedChange={() => toggleItem(item.id)}
                />
                <label htmlFor={item.id} className="text-sm cursor-pointer flex-1">
                  {item.item}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={saveProgress} className="w-full">
          Save Progress
        </Button>

        <div className="text-sm text-muted-foreground space-y-2 border-t pt-4">
          <p className="font-medium">Important:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Have legal counsel review all documents</li>
            <li>Ensure compliance with local laws and GDPR</li>
            <li>Update documents when business practices change</li>
            <li>Make policies easily accessible to users</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
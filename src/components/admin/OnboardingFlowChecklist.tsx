import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChecklistItem {
  id: string;
  step: number;
  title: string;
  description: string;
  checked: boolean;
}

export const OnboardingFlowChecklist = () => {
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: "personal", step: 1, title: "Personal Information", description: "Name, DOB, location, emergency contact", checked: false },
    { id: "body", step: 2, title: "Body & Appearance", description: "Height, weight, hair color, tattoos, piercings", checked: false },
    { id: "boundaries", step: 3, title: "Boundaries & Limits", description: "Comfortable with, hard limits, soft limits", checked: false },
    { id: "persona", step: 4, title: "Stage Persona", description: "Stage name, description, personality, fantasy", checked: false },
    { id: "backstory", step: 5, title: "Amsterdam Backstory", description: "Years in Amsterdam, neighborhood, RLD experience", checked: false },
    { id: "scripts", step: 6, title: "Messaging Scripts", description: "Greeting, sexting, PPV, renewal messages", checked: false },
    { id: "pricing", step: 7, title: "Pricing Strategy", description: "Subscription, PPV, custom content rates", checked: false },
    { id: "content", step: 8, title: "Content Preferences", description: "Themes, shooting preferences, equipment needs", checked: false },
    { id: "socials", step: 9, title: "Social Media Links", description: "Instagram, Twitter, TikTok, OnlyFans, Fansly", checked: false },
    { id: "commitments", step: 10, title: "Commitments Agreement", description: "Review and agree to all terms", checked: false }
  ]);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const { data } = await supabase
      .from('production_test_status')
      .select('notes')
      .eq('test_category', 'Testing')
      .eq('test_item', 'Test all 10 onboarding steps')
      .single();

    if (data?.notes) {
      try {
        const savedItems = JSON.parse(data.notes);
        setItems(savedItems);
      } catch (e) {
        console.error("Failed to parse saved progress");
      }
    }
  };

  const saveProgress = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('production_test_status')
        .upsert({
          test_category: 'Testing',
          test_item: 'Test all 10 onboarding steps',
          status: items.every(i => i.checked) ? 'pass' : 'pending',
          notes: JSON.stringify(items),
          completed_by: (await supabase.auth.getUser()).data.user?.id,
          completed_at: items.every(i => i.checked) ? new Date().toISOString() : null
        });

      if (error) throw error;
      toast.success("Progress saved!");
    } catch (error: any) {
      toast.error("Failed to save: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const progress = (items.filter(i => i.checked).length / items.length) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Onboarding Flow Test
            </CardTitle>
            <CardDescription>
              Complete all 10 steps as a test creator
            </CardDescription>
          </div>
          <Badge variant={progress === 100 ? "default" : "outline"}>
            {Math.round(progress)}% Complete
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
            >
              <Checkbox
                id={item.id}
                checked={item.checked}
                onCheckedChange={() => toggleItem(item.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <label
                  htmlFor={item.id}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Step {item.step}: {item.title}
                </label>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={saveProgress} disabled={saving} className="w-full">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Progress"
          )}
        </Button>

        <div className="text-sm text-muted-foreground space-y-2 border-t pt-4">
          <p className="font-medium">Testing Instructions:</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Create a test creator account or use existing test account</li>
            <li>Complete each onboarding step and verify all fields save correctly</li>
            <li>Check for validation errors on required fields</li>
            <li>Verify auto-save functionality works between steps</li>
            <li>Test navigation between steps (next/previous)</li>
            <li>Confirm final submission marks onboarding as complete</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Copy, TrendingUp, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HookLibraryProps {
  creatorId: string | null;
}

export const HookLibrary = ({ creatorId }: HookLibraryProps) => {
  const [hooks, setHooks] = useState<any[]>([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newHook, setNewHook] = useState({ hook_text: "", platform: "instagram" });
  const { toast } = useToast();

  useEffect(() => {
    if (creatorId) {
      fetchHooks();
    }
  }, [creatorId]);

  const fetchHooks = async () => {
    if (!creatorId) return;
    
    try {
      const { data, error } = await supabase
        .from('marketing_hooks')
        .select('*')
        .or(`creator_id.eq.${creatorId},creator_id.is.null`)
        .order('is_trending', { ascending: false })
        .order('engagement_rate', { ascending: false, nullsFirst: false });

      if (error) throw error;
      setHooks(data || []);
    } catch (error) {
      console.error('Error fetching hooks:', error);
    }
  };

  const handleCreateHook = async () => {
    if (!creatorId || !newHook.hook_text) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('marketing_hooks').insert({
        creator_id: creatorId,
        created_by: user.id,
        hook_text: newHook.hook_text,
        platform: newHook.platform
      });

      if (error) throw error;

      toast({ title: "Hook added successfully" });
      setNewHook({ hook_text: "", platform: "instagram" });
      setShowNewForm(false);
      fetchHooks();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  if (!creatorId) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Select a creator to view hooks</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hook Library</h2>
        <Button onClick={() => setShowNewForm(!showNewForm)}>
          <Plus className="h-4 w-4 mr-2" />
          New Hook
        </Button>
      </div>

      {showNewForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Hook</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <select
              className="w-full p-2 border rounded"
              value={newHook.platform}
              onChange={(e) => setNewHook({ ...newHook, platform: e.target.value })}
            >
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="twitter">Twitter</option>
              <option value="onlyfans">OnlyFans</option>
            </select>
            <Textarea
              placeholder="Your hook text..."
              value={newHook.hook_text}
              onChange={(e) => setNewHook({ ...newHook, hook_text: e.target.value })}
              rows={3}
            />
            <div className="flex gap-2">
              <Button onClick={handleCreateHook}>Add Hook</Button>
              <Button variant="outline" onClick={() => setShowNewForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {hooks.map(hook => (
          <Card key={hook.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary">{hook.platform}</Badge>
                  {hook.is_trending && (
                    <Badge variant="default">
                      <Flame className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                  {hook.engagement_rate && (
                    <Badge variant="outline">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {hook.engagement_rate}% rate
                    </Badge>
                  )}
                </div>
                <Button size="sm" variant="ghost" onClick={() => handleCopy(hook.hook_text)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{hook.hook_text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

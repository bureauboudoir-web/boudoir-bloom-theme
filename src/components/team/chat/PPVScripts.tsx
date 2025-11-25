import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Copy, Trash2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PPVScriptsProps {
  creatorId: string | null;
}

export const PPVScripts = ({ creatorId }: PPVScriptsProps) => {
  const [scripts, setScripts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newScript, setNewScript] = useState({ title: "", content: "", category: "upsell" });
  const { toast } = useToast();

  useEffect(() => {
    if (creatorId) {
      fetchScripts();
    }
  }, [creatorId]);

  const fetchScripts = async () => {
    if (!creatorId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ppv_scripts')
        .select('*')
        .eq('creator_id', creatorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScripts(data || []);
    } catch (error) {
      console.error('Error fetching scripts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateScript = async () => {
    if (!creatorId || !newScript.title || !newScript.content) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('ppv_scripts').insert({
        creator_id: creatorId,
        created_by: user.id,
        title: newScript.title,
        content: newScript.content,
        category: newScript.category
      });

      if (error) throw error;

      toast({ title: "Script created successfully" });
      setNewScript({ title: "", content: "", category: "upsell" });
      setShowNewForm(false);
      fetchScripts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: "Copied to clipboard" });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('ppv_scripts').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Script deleted" });
      fetchScripts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (!creatorId) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Select a creator to view PPV scripts</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">PPV Scripts</h2>
        <Button onClick={() => setShowNewForm(!showNewForm)}>
          <Plus className="h-4 w-4 mr-2" />
          New Script
        </Button>
      </div>

      {showNewForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Script</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Script title"
              value={newScript.title}
              onChange={(e) => setNewScript({ ...newScript, title: e.target.value })}
            />
            <select
              className="w-full p-2 border rounded"
              value={newScript.category}
              onChange={(e) => setNewScript({ ...newScript, category: e.target.value })}
            >
              <option value="greeting">Greeting</option>
              <option value="upsell">Upsell</option>
              <option value="renewal">Renewal</option>
              <option value="sexting">Sexting</option>
            </select>
            <Textarea
              placeholder="Script content..."
              value={newScript.content}
              onChange={(e) => setNewScript({ ...newScript, content: e.target.value })}
              rows={6}
            />
            <div className="flex gap-2">
              <Button onClick={handleCreateScript}>Create</Button>
              <Button variant="outline" onClick={() => setShowNewForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {scripts.map(script => (
          <Card key={script.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-lg">{script.title}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary">{script.category}</Badge>
                  {script.is_approved && (
                    <Badge variant="default">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Approved
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => handleCopy(script.content)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(script.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{script.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Copy, Trash2, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChatTemplatesProps {
  creatorId: string | null;
}

export const ChatTemplates = ({ creatorId }: ChatTemplatesProps) => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ title: "", content: "", category: "greeting" });
  const { toast } = useToast();

  useEffect(() => {
    if (creatorId) {
      fetchTemplates();
    }
  }, [creatorId]);

  const fetchTemplates = async () => {
    if (!creatorId) return;
    
    try {
      const { data, error } = await supabase
        .from('chat_templates')
        .select('*')
        .or(`creator_id.eq.${creatorId},creator_id.is.null`)
        .order('usage_count', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleCreateTemplate = async () => {
    if (!creatorId || !newTemplate.title || !newTemplate.content) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('chat_templates').insert({
        creator_id: creatorId,
        created_by: user.id,
        title: newTemplate.title,
        content: newTemplate.content,
        category: newTemplate.category
      });

      if (error) throw error;

      toast({ title: "Template created successfully" });
      setNewTemplate({ title: "", content: "", category: "greeting" });
      setShowNewForm(false);
      fetchTemplates();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleCopy = async (template: any) => {
    navigator.clipboard.writeText(template.content);
    
    // Increment usage count
    await supabase
      .from('chat_templates')
      .update({ usage_count: (template.usage_count || 0) + 1 })
      .eq('id', template.id);
    
    toast({ title: "Copied to clipboard" });
    fetchTemplates();
  };

  if (!creatorId) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Select a creator to view chat templates</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Chat Templates</h2>
        <Button onClick={() => setShowNewForm(!showNewForm)}>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      {showNewForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Template title"
              value={newTemplate.title}
              onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
            />
            <select
              className="w-full p-2 border rounded"
              value={newTemplate.category}
              onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
            >
              <option value="greeting">Greeting</option>
              <option value="ice_breaker">Ice Breaker</option>
              <option value="upsell">Upsell</option>
              <option value="retention">Retention</option>
            </select>
            <Textarea
              placeholder="Template content..."
              value={newTemplate.content}
              onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
              rows={4}
            />
            <div className="flex gap-2">
              <Button onClick={handleCreateTemplate}>Create</Button>
              <Button variant="outline" onClick={() => setShowNewForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {templates.map(template => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base">{template.title}</CardTitle>
                  <Badge variant="secondary" className="text-xs">{template.category}</Badge>
                </div>
                <Button size="sm" variant="ghost" onClick={() => handleCopy(template)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{template.content}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <span>Used {template.usage_count || 0} times</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

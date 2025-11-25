import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pin, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface TeamNotesProps {
  creatorId: string | null;
  teamType: 'chat' | 'marketing' | 'studio' | 'general';
}

export const TeamNotes = ({ creatorId, teamType }: TeamNotesProps) => {
  const [notes, setNotes] = useState<any[]>([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newNote, setNewNote] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (creatorId) {
      fetchNotes();
    }
  }, [creatorId]);

  const fetchNotes = async () => {
    if (!creatorId) return;
    
    try {
      const { data, error } = await supabase
        .from('team_notes')
        .select(`
          *,
          author:author_id (full_name, email)
        `)
        .eq('creator_id', creatorId)
        .eq('team_type', teamType)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleCreateNote = async () => {
    if (!creatorId || !newNote.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('team_notes').insert({
        creator_id: creatorId,
        author_id: user.id,
        team_type: teamType,
        content: newNote
      });

      if (error) throw error;

      toast({ title: "Note added successfully" });
      setNewNote("");
      setShowNewForm(false);
      fetchNotes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const togglePin = async (noteId: string, isPinned: boolean) => {
    try {
      const { error } = await supabase
        .from('team_notes')
        .update({ is_pinned: !isPinned })
        .eq('id', noteId);

      if (error) throw error;
      fetchNotes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (noteId: string) => {
    try {
      const { error } = await supabase.from('team_notes').delete().eq('id', noteId);
      if (error) throw error;
      toast({ title: "Note deleted" });
      fetchNotes();
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
        <p className="text-muted-foreground">Select a creator to view team notes</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Notes</h2>
        <Button onClick={() => setShowNewForm(!showNewForm)}>
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>

      {showNewForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Write your note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2">
              <Button onClick={handleCreateNote}>Add Note</Button>
              <Button variant="outline" onClick={() => setShowNewForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {notes.map(note => (
          <Card key={note.id} className={note.is_pinned ? "border-primary" : ""}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">
                    {note.author?.full_name || note.author?.email || "Unknown"}
                  </p>
                  {note.is_pinned && (
                    <Pin className="h-4 w-4 text-primary fill-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => togglePin(note.id, note.is_pinned)}
                >
                  <Pin className={`h-4 w-4 ${note.is_pinned ? 'fill-current' : ''}`} />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(note.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{note.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

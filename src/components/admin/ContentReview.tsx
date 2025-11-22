import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, CheckCircle, XCircle, Clock, Video, Image as ImageIcon, FileIcon, Search, Grid, List } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { StatsCard } from "./StatsCard";

interface ContentUpload {
  id: string;
  user_id: string;
  file_url: string;
  file_name: string;
  file_size: number;
  content_type: string;
  length: string | null;
  description: string;
  marketing_notes: string | null;
  uploaded_at: string;
  status: 'pending_review' | 'approved' | 'needs_revision';
  profiles: {
    email: string;
    full_name: string | null;
  };
}

export const ContentReview = () => {
  const { user } = useAuth();
  const { isSuperAdmin, isAdmin } = useUserRole();
  const [uploads, setUploads] = useState<ContentUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    revisionRate: 0,
  });

  useEffect(() => {
    if (user) {
      fetchUploads();
      fetchStats();
    }
  }, [filterStatus, user]);

  const fetchUploads = async () => {
    try {
      let creatorIds: string[] = [];

      if (!isSuperAdmin && !isAdmin && user) {
        const { data: assignedMeetings } = await supabase
          .from('creator_meetings')
          .select('user_id')
          .eq('assigned_manager_id', user.id);

        creatorIds = [...new Set(assignedMeetings?.map(m => m.user_id) || [])];

        if (creatorIds.length === 0) {
          setUploads([]);
          setLoading(false);
          return;
        }
      }

      let query = supabase
        .from('content_uploads')
        .select(`
          *,
          profiles:user_id (
            email,
            full_name
          )
        `)
        .order('uploaded_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      if (!isSuperAdmin && !isAdmin && creatorIds.length > 0) {
        query = query.in('user_id', creatorIds);
      }

      const { data, error } = await query;

      if (error) throw error;
      setUploads((data || []) as any);
    } catch (error) {
      console.error('Error fetching uploads:', error);
      toast({
        title: "Error",
        description: "Failed to load uploads",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: allUploads } = await supabase
        .from('content_uploads')
        .select('status');

      const pending = allUploads?.filter(u => u.status === 'pending_review').length || 0;
      const approved = allUploads?.filter(u => u.status === 'approved').length || 0;
      const needsRevision = allUploads?.filter(u => u.status === 'needs_revision').length || 0;
      const total = allUploads?.length || 1;
      const revisionRate = Math.round((needsRevision / total) * 100);

      setStats({
        pending,
        approved,
        revisionRate,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStatusUpdate = async (id: string, status: 'approved' | 'needs_revision') => {
    try {
      const { error } = await supabase
        .from('content_uploads')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Content marked as ${status === 'approved' ? 'approved' : 'needs revision'}`
      });

      fetchUploads();
      fetchStats();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('video/')) return <Video className="w-5 h-5" />;
    if (contentType.startsWith('image/')) return <ImageIcon className="w-5 h-5" />;
    return <FileIcon className="w-5 h-5" />;
  };

  const getStatusBadge = (status: ContentUpload['status']) => {
    const config = {
      pending_review: {
        label: 'Pending Review',
        icon: Clock,
        className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      },
      approved: {
        label: 'Approved',
        icon: CheckCircle,
        className: 'bg-green-500/10 text-green-500 border-green-500/20'
      },
      needs_revision: {
        label: 'Needs Revision',
        icon: XCircle,
        className: 'bg-red-500/10 text-red-500 border-red-500/20'
      }
    };

    const { label, icon: Icon, className } = config[status];
    
    return (
      <Badge variant="outline" className={className}>
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const filteredUploads = uploads.filter(upload => {
    const searchLower = searchQuery.toLowerCase();
    return (
      upload.file_name.toLowerCase().includes(searchLower) ||
      upload.description.toLowerCase().includes(searchLower) ||
      upload.profiles.full_name?.toLowerCase().includes(searchLower) ||
      upload.profiles.email.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <Card className="p-6 bg-card border-primary/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Pending Review"
          value={stats.pending}
          icon={Clock}
          description="Awaiting review"
        />
        <StatsCard
          title="Approved"
          value={stats.approved}
          icon={CheckCircle}
          description="This period"
        />
        <StatsCard
          title="Revision Rate"
          value={`${stats.revisionRate}%`}
          icon={XCircle}
          description="Content quality"
        />
      </div>

      <Card className="p-6 bg-card border-primary/20">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h3 className="font-serif text-xl font-bold">Content Review</h3>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Uploads</SelectItem>
                <SelectItem value="pending_review">Pending Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="needs_revision">Needs Revision</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by filename, creator, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {filteredUploads.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No uploads found
          </p>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
            {filteredUploads.map((upload) => (
              <Card key={upload.id} className="p-4 bg-muted/30 border-primary/20">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-muted-foreground">
                        {getFileIcon(upload.content_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{upload.file_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {upload.profiles.full_name || upload.profiles.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(upload.file_size)} • {format(new Date(upload.uploaded_at), "PPP")}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(upload.status)}
                  </div>

                  {upload.length && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Length:</span> {upload.length}
                    </p>
                  )}

                  <p className="text-sm">{upload.description}</p>

                  {upload.marketing_notes && (
                    <p className="text-xs text-primary/80 bg-primary/5 p-2 rounded">
                      <span className="font-medium">Marketing Notes:</span> {upload.marketing_notes}
                    </p>
                  )}

                  <div className="flex gap-2 pt-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(upload.file_url, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    {upload.status !== 'approved' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-600/20 hover:bg-green-600/10"
                        onClick={() => handleStatusUpdate(upload.id, 'approved')}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                    )}
                    {upload.status !== 'needs_revision' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-600/20 hover:bg-red-600/10"
                        onClick={() => handleStatusUpdate(upload.id, 'needs_revision')}
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Revision
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

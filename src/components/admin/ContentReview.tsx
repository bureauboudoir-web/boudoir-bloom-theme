import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, CheckCircle, XCircle, Clock, Video, Image as ImageIcon, FileIcon, Search, Grid, List, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { StatsCard } from "./StatsCard";
import { PaginationControls } from "./shared/PaginationControls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentPreviewModal } from "@/components/content/ContentPreviewModal";
import { PlatformBadge, PlatformType } from "@/components/content/PlatformBadge";
import { CategoryBadge, ContentCategory } from "@/components/content/CategoryBadge";

interface ContentUpload {
  id: string;
  user_id: string;
  file_url: string;
  file_name: string;
  file_size: number;
  content_type: string;
  content_category: ContentCategory;
  platform_type: PlatformType;
  length: string | null;
  title: string | null;
  description: string;
  marketing_notes: string | null;
  hashtags: string[] | null;
  usage_rights: string | null;
  is_featured: boolean;
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [selectedTab, setSelectedTab] = useState("all");
  const [previewContent, setPreviewContent] = useState<ContentUpload | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<string>("all");

  useEffect(() => {
    if (user) {
      fetchUploads();
      fetchStats();
    }
    
    const channel = supabase
      .channel('content_review_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'content_uploads' }, () => {
        fetchUploads();
        fetchStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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

  const getFileIcon = (contentType: string | null) => {
    if (!contentType) return <FileIcon className="w-5 h-5" />;
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

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('content_uploads')
        .update({ is_featured: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Content ${!currentStatus ? 'featured' : 'unfeatured'}`
      });

      fetchUploads();
    } catch (error) {
      console.error('Error toggling featured:', error);
      toast({
        title: "Error",
        description: "Failed to update featured status",
        variant: "destructive"
      });
    }
  };

  const filteredUploads = uploads.filter(upload => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (
      upload.file_name.toLowerCase().includes(searchLower) ||
      upload.title?.toLowerCase().includes(searchLower) ||
      upload.description.toLowerCase().includes(searchLower) ||
      upload.profiles.full_name?.toLowerCase().includes(searchLower) ||
      upload.profiles.email.toLowerCase().includes(searchLower) ||
      upload.hashtags?.some(tag => tag.toLowerCase().includes(searchLower))
    );

    const matchesPlatform = filterPlatform === 'all' || upload.platform_type === filterPlatform;
    
    const now = new Date();
    const uploadDate = new Date(upload.uploaded_at);
    const isNew = (now.getTime() - uploadDate.getTime()) < 24 * 60 * 60 * 1000;

    const matchesTab = 
      selectedTab === 'all' ||
      (selectedTab === 'new' && isNew) ||
      (selectedTab === 'featured' && upload.is_featured) ||
      selectedTab === upload.status;

    return matchesSearch && matchesPlatform && matchesTab;
  });
  
  const totalPages = Math.ceil(filteredUploads.length / itemsPerPage);
  const paginatedUploads = filteredUploads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        <h3 className="font-serif text-xl font-bold mb-6">Content Review</h3>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="new">New (24h)</TabsTrigger>
            <TabsTrigger value="pending_review">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="needs_revision">Revision</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 mb-6 flex-wrap">
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
          <Select value={filterPlatform} onValueChange={setFilterPlatform}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Platforms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="onlyfans">OnlyFans</SelectItem>
              <SelectItem value="fansly">Fansly</SelectItem>
              <SelectItem value="telegram">Telegram</SelectItem>
            </SelectContent>
          </Select>
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
          <>
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
              {paginatedUploads.map((upload) => (
              <Card key={upload.id} className="p-4 bg-muted/30 border-primary/20">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-muted-foreground">
                        {getFileIcon(upload.content_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium truncate">{upload.title || upload.file_name}</p>
                          {upload.is_featured && <Star className="w-4 h-4 text-blue-500 fill-current" />}
                        </div>
                        <div className="flex gap-2 mb-1">
                          <CategoryBadge category={upload.content_category} />
                          <PlatformBadge platform={upload.platform_type} />
                        </div>
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
                      onClick={() => setPreviewContent(upload)}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleFeatured(upload.id, upload.is_featured)}
                    >
                      <Star className={`w-3 h-3 mr-1 ${upload.is_featured ? 'fill-current' : ''}`} />
                      {upload.is_featured ? 'Unfeature' : 'Feature'}
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
            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={filteredUploads.length}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(items) => {
                  setItemsPerPage(items);
                  setCurrentPage(1);
                }}
              />
            )}
          </>
        )}
      </Card>

      {previewContent && (
        <ContentPreviewModal
          open={!!previewContent}
          onOpenChange={(open) => !open && setPreviewContent(null)}
          content={{
            id: previewContent.id,
            title: previewContent.title || undefined,
            fileName: previewContent.file_name,
            fileUrl: previewContent.file_url,
            contentType: previewContent.content_type,
            contentCategory: previewContent.content_category,
            platformType: previewContent.platform_type,
            status: previewContent.status,
            isFeatured: previewContent.is_featured,
            description: previewContent.description || undefined,
            length: previewContent.length || undefined,
            fileSize: previewContent.file_size || undefined,
            uploadedAt: previewContent.uploaded_at,
            hashtags: previewContent.hashtags || undefined,
            usageRights: previewContent.usage_rights || undefined,
          }}
          onApprove={() => handleStatusUpdate(previewContent.id, 'approved')}
          onReject={() => handleStatusUpdate(previewContent.id, 'needs_revision')}
          onToggleFeatured={() => handleToggleFeatured(previewContent.id, previewContent.is_featured)}
          isManager={true}
        />
      )}
    </div>
  );
};

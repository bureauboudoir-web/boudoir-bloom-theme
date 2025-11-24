import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentCard } from "@/components/content/ContentCard";
import { ContentPreviewModal } from "@/components/content/ContentPreviewModal";
import { Loader2, Search, X, Video, Image, FileText, Target, Palette, Package } from "lucide-react";
import { ContentCategory } from "@/components/content/CategoryBadge";
import { PlatformType } from "@/components/content/PlatformBadge";

interface ContentItem {
  id: string;
  title?: string;
  file_name: string;
  file_url: string;
  content_type: string | null;
  content_category: ContentCategory;
  platform_type: PlatformType;
  status: string | null;
  is_featured?: boolean;
  description: string | null;
  length: string | null;
  file_size: number | null;
  uploaded_at: string;
  hashtags?: string[];
  usage_rights?: string;
}

interface ContentLibraryProps {
  userId: string;
}

const categoryTabs = [
  { value: 'all', label: 'All Content', icon: Package },
  { value: 'video', label: 'Videos', icon: Video },
  { value: 'photo', label: 'Photos', icon: Image },
  { value: 'script', label: 'Scripts', icon: FileText },
  { value: 'hook', label: 'Hooks', icon: Target },
  { value: 'marketing_artwork', label: 'Marketing', icon: Palette },
];

export const ContentLibrary = ({ userId }: ContentLibraryProps) => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [previewContent, setPreviewContent] = useState<ContentItem | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('content_uploads_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'content_uploads',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchContent();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  useEffect(() => {
    applyFilters();
  }, [content, searchQuery, selectedCategory, filterPlatform, filterStatus]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("content_uploads")
        .select("*")
        .eq("user_id", userId)
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      setContent((data || []) as ContentItem[]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...content];

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.content_category === selectedCategory);
    }

    // Platform filter
    if (filterPlatform !== "all") {
      filtered = filtered.filter((item) => item.platform_type === filterPlatform);
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((item) => item.status === filterStatus);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(query) ||
          item.file_name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.hashtags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredContent(filtered);
  };

  const handleDownload = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  const handleDelete = async (id: string, fileUrl: string) => {
    if (!confirm("Are you sure you want to delete this content?")) return;

    try {
      const filePath = fileUrl.split("/").pop();
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from("content-uploads")
          .remove([`${userId}/${filePath}`]);

        if (storageError) throw storageError;
      }

      const { error } = await supabase
        .from("content_uploads")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Content deleted successfully",
      });

      fetchContent();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterPlatform("all");
    setFilterStatus("all");
  };

  const hasActiveFilters = searchQuery || filterPlatform !== "all" || filterStatus !== "all";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Content Library</h2>
        <p className="text-muted-foreground">
          Manage and organize your uploaded content across all platforms
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by title, description, or hashtags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterPlatform} onValueChange={setFilterPlatform}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Platforms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="twitter">Twitter</SelectItem>
            <SelectItem value="onlyfans">OnlyFans</SelectItem>
            <SelectItem value="fansly">Fansly</SelectItem>
            <SelectItem value="telegram">Telegram</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending_review">Pending Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="needs_revision">Needs Revision</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters}>
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {categoryTabs.map((tab) => {
            const Icon = tab.icon;
            const count = tab.value === 'all' 
              ? content.length 
              : content.filter(item => item.content_category === tab.value).length;
            
            return (
              <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                <span className="text-xs text-muted-foreground">({count})</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categoryTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6">
            {filteredContent.length === 0 ? (
              <div className="text-center py-12">
                <tab.icon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No {tab.label.toLowerCase()} found
                </h3>
                <p className="text-muted-foreground">
                  {hasActiveFilters 
                    ? "Try adjusting your filters" 
                    : `Upload your first ${tab.label.toLowerCase()}`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContent.map((item) => (
                  <ContentCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    fileName={item.file_name}
                    fileUrl={item.file_url}
                    contentType={item.content_type}
                    contentCategory={item.content_category}
                    platformType={item.platform_type}
                    status={item.status}
                    isFeatured={item.is_featured}
                    description={item.description || undefined}
                    length={item.length || undefined}
                    fileSize={item.file_size || undefined}
                    uploadedAt={item.uploaded_at}
                    hashtags={item.hashtags}
                    onView={() => setPreviewContent(item)}
                    onDownload={() => handleDownload(item.file_url)}
                    onDelete={() => handleDelete(item.id, item.file_url)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Preview Modal */}
      {previewContent && (
        <ContentPreviewModal
          open={!!previewContent}
          onOpenChange={(open) => !open && setPreviewContent(null)}
          content={{
            id: previewContent.id,
            title: previewContent.title,
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
            hashtags: previewContent.hashtags,
            usageRights: previewContent.usage_rights,
          }}
        />
      )}
    </div>
  );
};

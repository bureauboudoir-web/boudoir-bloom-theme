import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { RoleNavigation } from "@/components/RoleNavigation";
import { creatorNavigation } from "@/config/roleNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, Trash2, Music } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VoiceSample {
  id: string;
  file_url: string;
  created_at: string;
}

export default function VoiceTrainingWizard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { roles, loading } = useUserRole();
  const [uploading, setUploading] = useState(false);
  const [voiceSamples, setVoiceSamples] = useState<VoiceSample[]>([]);

  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
      return;
    }

    if (!loading && !roles.includes("creator") && !roles.includes("admin")) {
      navigate("/dashboard");
    }
  }, [user, roles, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchVoiceSamples();
    }
  }, [user]);

  const fetchVoiceSamples = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('uploads')
      .select('id, file_url, created_at')
      .eq('creator_id', user.id)
      .eq('file_type', 'audio')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching voice samples:', error);
      return;
    }

    setVoiceSamples(data || []);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('audio/')) {
          toast.error(`${file.name} is not a valid audio file`);
          continue;
        }

        // Upload to storage
        const fileExt = file.name.split('.').pop();
        const filePath = `${user.id}/voice-samples/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('content-uploads')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('content-uploads')
          .getPublicUrl(filePath);

        // Save metadata to database
        const { error: dbError } = await supabase
          .from('uploads')
          .insert({
            creator_id: user.id,
            file_type: 'audio',
            file_url: publicUrl
          });

        if (dbError) throw dbError;
      }

      toast.success('Voice samples uploaded successfully!');
      fetchVoiceSamples();
      e.target.value = ''; // Reset input
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Failed to upload voice samples');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteSample = async (sampleId: string, fileUrl: string) => {
    if (!confirm('Are you sure you want to delete this voice sample?')) return;

    try {
      // Extract file path from URL
      const urlParts = fileUrl.split('/content-uploads/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from('content-uploads').remove([filePath]);
      }

      // Delete from database
      const { error } = await supabase
        .from('uploads')
        .delete()
        .eq('id', sampleId);

      if (error) throw error;

      toast.success('Voice sample deleted');
      fetchVoiceSamples();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error('Failed to delete voice sample');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user || (!roles.includes("creator") && !roles.includes("admin"))) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Access denied</p>
      </div>
    );
  }

  return (
    <DashboardLayout navigation={<RoleNavigation sections={creatorNavigation} />}>
      <div className="container mx-auto p-6 max-w-3xl">
        <Link 
          to="/dashboard/creator/tools" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tools
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Voice Training Wizard</CardTitle>
            <CardDescription>
              Upload 3–5 short audio samples so we can train your AI voice.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <div className="space-y-2">
                <p className="text-sm font-medium">Drop audio files here or click to browse</p>
                <p className="text-xs text-muted-foreground">Supported formats: MP3, WAV, M4A (3-5 samples recommended)</p>
              </div>
              <Input
                type="file"
                accept="audio/mp3,audio/wav,audio/m4a,audio/mpeg,audio/x-wav,audio/x-m4a"
                multiple
                onChange={handleFileUpload}
                disabled={uploading}
                className="mt-4 cursor-pointer"
              />
            </div>

            {voiceSamples.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Uploaded Voice Samples ({voiceSamples.length})</h3>
                <div className="space-y-2">
                  {voiceSamples.map((sample) => (
                    <div key={sample.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <Music className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Voice Sample</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(sample.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSample(sample.id, sample.file_url)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploading && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <LoadingSpinner size="sm" />
                <span>Uploading voice samples...</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

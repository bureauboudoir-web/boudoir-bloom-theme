import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Mic, Upload, CheckCircle2, Clock, Lightbulb, Volume2 } from "lucide-react";
import { toast } from "sonner";

interface VoiceSample {
  id: string;
  emotional_category: string;
  file_url: string;
  created_at: string;
}

const EMOTIONAL_CATEGORIES = [
  { 
    value: 'happy', 
    label: '😊 Happy', 
    prompt: 'Talk about something that makes you smile or brings you joy. Share a happy memory or describe what makes you feel good.',
    color: 'text-yellow-500'
  },
  { 
    value: 'sad', 
    label: '😢 Sad', 
    prompt: 'Speak about a moment of loss or disappointment. Express vulnerability and genuine emotion about something difficult.',
    color: 'text-blue-500'
  },
  { 
    value: 'excited', 
    label: '🎉 Excited', 
    prompt: 'Share your enthusiasm about something you\'re passionate about! Let your excitement and energy show naturally.',
    color: 'text-orange-500'
  },
  { 
    value: 'calm', 
    label: '😌 Calm', 
    prompt: 'Speak in a peaceful, relaxed tone. Talk about meditation, a quiet moment, or something that helps you feel centered.',
    color: 'text-green-500'
  },
  { 
    value: 'angry', 
    label: '😠 Angry', 
    prompt: 'Express frustration about something that bothers you. Let your intensity come through while maintaining control.',
    color: 'text-red-500'
  },
  { 
    value: 'neutral', 
    label: '😐 Neutral', 
    prompt: 'Speak naturally in a conversational tone. Just be yourself and talk about your day or general observations.',
    color: 'text-gray-500'
  }
];

export const VoiceTrainingWizard = () => {
  const { user } = useAuth();
  const [step, setStep] = useState<'intro' | 'recording'>('intro');
  const [samples, setSamples] = useState<VoiceSample[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchSamples();
    }
  }, [user]);

  const fetchSamples = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('uploads')
      .select('*')
      .eq('creator_id', user.id)
      .not('emotional_category', 'is', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching samples:', error);
      return;
    }

    setSamples(data || []);
  };

  const handleFileUpload = async (file: File, category: string) => {
    if (!user) return;

    setUploading(true);
    setCurrentCategory(category);

    try {
      // Validate file
      if (!file.type.startsWith('audio/')) {
        throw new Error('Please upload an audio file');
      }

      if (file.size > 20 * 1024 * 1024) { // 20MB limit
        throw new Error('File size must be less than 20MB');
      }

      // Upload to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${category}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('content-uploads')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('content-uploads')
        .getPublicUrl(fileName);

      // Save to database
      const { error: dbError } = await supabase
        .from('uploads')
        .insert({
          creator_id: user.id,
          file_url: publicUrl,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          emotional_category: category,
          voice_tool_sync_status: 'pending'
        });

      if (dbError) throw dbError;

      toast.success(`${category} sample uploaded successfully!`);
      await fetchSamples();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload sample');
    } finally {
      setUploading(false);
      setCurrentCategory(null);
    }
  };

  const handleSubmitForTraining = async () => {
    if (!user || samples.length < 3) {
      toast.error('Please upload at least 3 samples');
      return;
    }

    setSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('sync-voice-to-tool', {
        body: {
          creator_id: user.id,
          samples: samples.map(s => ({
            file_url: s.file_url,
            emotional_category: s.emotional_category
          }))
        }
      });

      if (error) throw error;

      toast.success('Voice samples submitted for training! Processing will take 5-10 minutes.');
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error.message || 'Failed to submit samples');
    } finally {
      setSubmitting(false);
    }
  };

  const getSampleForCategory = (category: string) => {
    return samples.find(s => s.emotional_category === category);
  };

  const uploadedCount = EMOTIONAL_CATEGORIES.filter(cat => getSampleForCategory(cat.value)).length;
  const progressPercent = (uploadedCount / EMOTIONAL_CATEGORIES.length) * 100;

  if (step === 'intro') {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="text-3xl">Create Your AI Voice</CardTitle>
            <CardDescription className="text-base">
              Train your personalized AI voice model in just a few minutes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                What to Expect
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>6 different emotional categories to record</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>20-45 seconds per sample (longer is better)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>Guided prompts for each emotional tone</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>Minimum 3 samples required, all 6 recommended</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>Training takes 5-10 minutes after upload</span>
                </li>
              </ul>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                For Best Results
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Record in a quiet environment</li>
                <li>• Speak naturally and clearly</li>
                <li>• Stay consistent with your distance from the microphone</li>
                <li>• Express genuine emotion for each category</li>
                <li>• Take your time - quality over speed</li>
              </ul>
            </div>

            <Button 
              size="lg" 
              className="w-full"
              onClick={() => setStep('recording')}
            >
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Progress</span>
              <span className="text-muted-foreground">
                {uploadedCount}/{EMOTIONAL_CATEGORIES.length} samples uploaded
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
            {uploadedCount < 3 && (
              <p className="text-xs text-muted-foreground">
                Upload at least 3 samples to submit for training
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Emotional Categories Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {EMOTIONAL_CATEGORIES.map((category) => {
          const sample = getSampleForCategory(category.value);
          const isUploading = uploading && currentCategory === category.value;

          return (
            <Card key={category.value} className={sample ? 'border-primary' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className={category.color}>{category.label}</span>
                      {sample && <CheckCircle2 className="w-5 h-5 text-primary" />}
                      {isUploading && <Clock className="w-5 h-5 text-muted-foreground animate-spin" />}
                    </CardTitle>
                    <CardDescription className="mt-2 text-sm">
                      {category.prompt}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Button
                    variant={sample ? "outline" : "default"}
                    size="sm"
                    disabled={isUploading}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'audio/*';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) handleFileUpload(file, category.value);
                      };
                      input.click();
                    }}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {sample ? 'Replace' : 'Upload'}
                  </Button>
                  {sample && (
                    <Badge variant="secondary">Uploaded</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Submit Button */}
      <Card>
        <CardContent className="pt-6">
          <Button
            size="lg"
            className="w-full"
            disabled={uploadedCount < 3 || submitting}
            onClick={handleSubmitForTraining}
          >
            {submitting ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Submitting for Training...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Submit for Training
              </>
            )}
          </Button>
          {uploadedCount < 3 && (
            <p className="text-xs text-center text-muted-foreground mt-2">
              Upload at least 3 samples to continue
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

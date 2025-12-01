import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Mic, Upload, CheckCircle2, Clock, Lightbulb, Volume2, ArrowRight, ArrowLeft, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface VoiceSample {
  id: string;
  emotional_category: string;
  file_url: string;
  created_at: string;
}

const EMOTIONAL_CATEGORIES = [
  { 
    value: 'happy_excited', 
    label: '🎉 Happy & Excited', 
    description: 'High energy, positive emotions for upbeat messages',
    prompt: '"Hey! Oh my god, guess what just happened - you won\'t believe this!"',
    color: 'text-yellow-500'
  },
  { 
    value: 'intimate_flirty', 
    label: '💕 Intimate & Flirty', 
    description: 'Romantic, seductive tone for intimate conversations',
    prompt: '"I\'ve been thinking about you all day... what are you doing later?"',
    color: 'text-pink-500'
  },
  { 
    value: 'calm_caring', 
    label: '😊 Calm & Caring', 
    description: 'Gentle, nurturing tone for supportive messages',
    prompt: '"Hey, just wanted to check in on you. How are you feeling today?"',
    color: 'text-green-500'
  },
  { 
    value: 'confident_teasing', 
    label: '😏 Confident & Teasing', 
    description: 'Assertive, playful personality with attitude',
    prompt: '"Oh really? You think you can handle that? Prove it."',
    color: 'text-purple-500'
  },
  { 
    value: 'soft_relaxed', 
    label: '🌙 Soft & Relaxed', 
    description: 'Quiet, intimate moments and late-night talks',
    prompt: '"Mmm... I\'m just lying here, wish you were next to me..."',
    color: 'text-blue-400'
  },
  { 
    value: 'casual_natural', 
    label: '💬 Casual & Natural', 
    description: 'Everyday conversation baseline - your natural voice',
    prompt: '"So yeah, I went to the store earlier and grabbed some stuff."',
    color: 'text-gray-500'
  }
];

export const VoiceTrainingWizard = () => {
  const { user } = useAuth();
  const [step, setStep] = useState<'intro' | 'recording' | 'review'>('intro');
  const [samples, setSamples] = useState<VoiceSample[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [qualityScores, setQualityScores] = useState<Record<string, { clarity: number; emotion: number; quality: number }>>({});

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

      // Generate mock quality scores (will be replaced by real API data)
      const mockClarity = Math.floor(Math.random() * 20) + 80; // 80-100
      const mockEmotion = Math.floor(Math.random() * 20) + 75; // 75-95
      const mockQuality = Math.floor((mockClarity + mockEmotion) / 2);
      
      setQualityScores(prev => ({
        ...prev,
        [category]: {
          clarity: mockClarity,
          emotion: mockEmotion,
          quality: mockQuality
        }
      }));

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
  const recommendedCount = 6;
  const minimumCount = 3;

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
                  <span>Upload samples for at least 3 categories. Each sample is analyzed for quality in real-time.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>Your samples will be uploaded securely</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>AI training will begin automatically</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>Training typically takes 5-10 minutes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>You'll be notified when your voice is ready</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>You can continue using the app while training</span>
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

  if (step === 'review') {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Review Your Samples</CardTitle>
            <CardDescription>
              Ready to train your AI voice with {uploadedCount} samples
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {EMOTIONAL_CATEGORIES.filter(cat => getSampleForCategory(cat.value)).map(category => {
              const sample = getSampleForCategory(category.value);
              const scores = qualityScores[category.value] || { clarity: 0, emotion: 0, quality: 0 };
              
              return (
                <Card key={category.value} className="border-primary/20">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium flex items-center gap-2">
                          <span className={category.color}>{category.label}</span>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {sample?.file_url.split('/').pop()?.substring(0, 40)}
                        </p>
                      </div>
                      <Badge 
                        variant={scores.quality >= 80 ? "default" : "secondary"}
                        className="text-sm"
                      >
                        {scores.quality}/100
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Clarity</span>
                        <div className="flex items-center gap-2">
                          <Progress value={scores.clarity} className="w-24 h-1.5" />
                          <span className="font-medium w-8">{scores.clarity}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Emotion</span>
                        <div className="flex items-center gap-2">
                          <Progress value={scores.emotion} className="w-24 h-1.5" />
                          <span className="font-medium w-8">{scores.emotion}</span>
                        </div>
                      </div>
                      {scores.quality < 80 && (
                        <div className="flex items-start gap-2 mt-2 p-2 bg-yellow-500/10 rounded">
                          <Lightbulb className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <p className="text-yellow-700 dark:text-yellow-300">
                            Suggestion: Please try uploading the sample again
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {uploadedCount < recommendedCount && (
              <Card className="bg-yellow-500/5 border-yellow-500/20">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm mb-1">Recommendation</h4>
                      <p className="text-sm text-muted-foreground">
                        You've uploaded {uploadedCount} out of {recommendedCount} recommended samples. 
                        While training will work with {minimumCount} samples, adding more categories will 
                        significantly improve voice quality and emotional range.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-blue-500/5 border-blue-500/20">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm mb-2">What happens next?</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Your samples will be uploaded securely</li>
                      <li>• AI training will begin automatically</li>
                      <li>• Training typically takes 5-10 minutes</li>
                      <li>• You'll be notified when your voice is ready</li>
                      <li>• You can continue using the app while training</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => setStep('recording')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Samples
              </Button>
              <Button
                size="lg"
                className="flex-1"
                disabled={submitting}
                onClick={handleSubmitForTraining}
              >
                {submitting ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start Training
                  </>
                )}
              </Button>
            </div>
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
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Record Voice Samples</h2>
              <Badge variant="secondary" className="text-sm">
                {uploadedCount}/{recommendedCount} Complete
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Upload samples for at least 3 categories. Each sample is analyzed for quality in real-time.
            </p>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Emotional Categories Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {EMOTIONAL_CATEGORIES.map((category) => {
          const sample = getSampleForCategory(category.value);
          const isUploading = uploading && currentCategory === category.value;
          const scores = qualityScores[category.value];

          return (
            <Card key={category.value} className={sample ? 'border-primary/50' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center gap-2 mb-1">
                      <span className={category.color}>{category.label}</span>
                      {sample && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                      {isUploading && <Clock className="w-4 h-4 text-muted-foreground animate-spin" />}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mb-2">{category.description}</p>
                  </div>
                  {sample && scores && (
                    <Badge 
                      variant={scores.quality >= 80 ? "default" : "secondary"}
                      className="ml-2"
                    >
                      {scores.quality}/100
                    </Badge>
                  )}
                </div>
                
                <div className="bg-muted/30 p-3 rounded-md mt-2">
                  <p className="text-xs font-medium mb-1">Example Script:</p>
                  <p className="text-xs text-muted-foreground italic">{category.prompt}</p>
                </div>
              </CardHeader>
              <CardContent>
                {sample && scores ? (
                  <div className="space-y-3">
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Clarity</span>
                        <div className="flex items-center gap-2">
                          <Progress value={scores.clarity} className="w-20 h-1.5" />
                          <span className="font-medium w-6">{scores.clarity}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Emotion</span>
                        <div className="flex items-center gap-2">
                          <Progress value={scores.emotion} className="w-20 h-1.5" />
                          <span className="font-medium w-6">{scores.emotion}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
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
                      Replace Sample
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
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
                    {isUploading ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Audio File
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <Card>
        <CardContent className="pt-6">
          <Button
            size="lg"
            className="w-full"
            disabled={uploadedCount < minimumCount}
            onClick={() => setStep('review')}
          >
            Review & Train
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          {uploadedCount < minimumCount && (
            <p className="text-xs text-center text-muted-foreground mt-2">
              Upload at least {minimumCount} samples to continue ({uploadedCount}/{minimumCount})
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

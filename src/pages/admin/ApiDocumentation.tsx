import { useEffect } from "react";
import { PageContainer } from "@/components/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/useUserRole";
import { useNavigate } from "react-router-dom";
import { Copy, ExternalLink, Key, Shield } from "lucide-react";

export default function ApiDocumentation() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin, isSuperAdmin, rolesLoaded } = useUserRole();
  
  // Redirect non-admins
  useEffect(() => {
    if (rolesLoaded && !isAdmin && !isSuperAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can view API documentation.",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [rolesLoaded, isAdmin, isSuperAdmin, navigate, toast]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard",
    });
  };

  const baseUrl = "https://pohxtstwslymiqrxmlal.supabase.co/functions/v1";

  if (!rolesLoaded || !(isAdmin || isSuperAdmin)) {
    return null;
  }

  return (
    <PageContainer>
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">API Documentation</h1>
          <p className="text-muted-foreground mt-2">
            External API documentation for Content Generator and Voice Tool integrations
          </p>
        </div>
        {/* Base URL Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Base URL
            </CardTitle>
            <CardDescription>All API endpoints use this base URL</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-md bg-muted px-4 py-3 font-mono text-sm">
                {baseUrl}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(baseUrl)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Authentication Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Authentication
            </CardTitle>
            <CardDescription>
              All API requests require authentication using API keys
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Header Format:</p>
              <code className="block rounded-md bg-muted px-4 py-3 font-mono text-sm">
                x-api-key: YOUR_API_KEY
              </code>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Example cURL Request:</p>
              <pre className="rounded-md bg-muted px-4 py-3 font-mono text-xs overflow-x-auto">
{`curl -X GET "${baseUrl}/external-creators" \\
  -H "x-api-key: sk_your_api_key_here" \\
  -H "Content-Type: application/json"`}
              </pre>
            </div>
            <div className="rounded-md border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm flex items-start gap-2">
                <Key className="h-4 w-4 mt-0.5 text-primary" />
                <span>
                  <strong>Note:</strong> Manage your API keys in the{" "}
                  <Button
                    variant="link"
                    className="h-auto p-0 text-primary"
                    onClick={() => navigate("/dashboard/admin/api-keys")}
                  >
                    API Key Management
                  </Button>{" "}
                  section.
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Status Endpoint Card */}
        <Card>
          <CardHeader>
            <CardTitle>API Status</CardTitle>
            <CardDescription>Check API availability and version</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded bg-green-100 dark:bg-green-900 px-2 py-1 text-xs font-semibold text-green-700 dark:text-green-300">
                  GET
                </span>
                <code className="font-mono text-sm">/external-api-status</code>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Returns the current API status and available endpoints. No authentication required.
              </p>
              <div>
                <p className="text-sm font-medium mb-2">Response Example:</p>
                <pre className="rounded-md bg-muted px-4 py-3 font-mono text-xs overflow-x-auto">
{`{
  "version": "1.0",
  "status": "ok",
  "documentation_url": "/dashboard/admin/api-docs",
  "endpoints": {
    "creators_list": "/external-creators",
    "creator_data": "/external-creator-data",
    "content_upload": "/external-content-upload",
    "voice_upload": "/external-voice-upload"
  }
}`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endpoints Card */}
        <Card>
          <CardHeader>
            <CardTitle>Available Endpoints</CardTitle>
            <CardDescription>List of all available API endpoints</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Get All Creators */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-100 dark:bg-blue-900 px-2 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300">
                  GET
                </span>
                <code className="font-mono text-sm">/external-creators</code>
              </div>
              <p className="text-sm text-muted-foreground">
                Retrieve a list of all creators with their basic information.
              </p>
              <div>
                <p className="text-sm font-medium mb-2">Response Example:</p>
                <pre className="rounded-md bg-muted px-4 py-3 font-mono text-xs overflow-x-auto">
{`{
  "creators": [
    {
      "id": "uuid",
      "full_name": "Creator Name",
      "email": "creator@example.com",
      "creator_status": "active",
      "profile_picture_url": "https://..."
    }
  ]
}`}
                </pre>
              </div>
            </div>

            {/* Get Creator Data */}
            <div className="space-y-3 border-t pt-6">
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-100 dark:bg-blue-900 px-2 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300">
                  GET
                </span>
                <code className="font-mono text-sm">/external-creator-data</code>
              </div>
              <p className="text-sm text-muted-foreground">
                Get detailed information about a specific creator.
              </p>
              <div>
                <p className="text-sm font-medium mb-2">Query Parameters:</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>
                    <code className="font-mono text-xs">creator_id</code> (required) - UUID of the creator
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Response Example:</p>
                <pre className="rounded-md bg-muted px-4 py-3 font-mono text-xs overflow-x-auto">
{`{
  "profile": { ... },
  "onboarding_data": { ... },
  "content_preferences": { ... }
}`}
                </pre>
              </div>
            </div>

            {/* Upload Content */}
            <div className="space-y-3 border-t pt-6">
              <div className="flex items-center gap-2">
                <span className="rounded bg-green-100 dark:bg-green-900 px-2 py-1 text-xs font-semibold text-green-700 dark:text-green-300">
                  POST
                </span>
                <code className="font-mono text-sm">/external-content-upload</code>
              </div>
              <p className="text-sm text-muted-foreground">
                Upload content files for a creator.
              </p>
              <div>
                <p className="text-sm font-medium mb-2">Request Body:</p>
                <pre className="rounded-md bg-muted px-4 py-3 font-mono text-xs overflow-x-auto">
{`{
  "creator_id": "uuid",
  "file_name": "content.mp4",
  "file_url": "https://...",
  "content_type": "video",
  "description": "Content description"
}`}
                </pre>
              </div>
            </div>

            {/* Upload Voice */}
            <div className="space-y-3 border-t pt-6">
              <div className="flex items-center gap-2">
                <span className="rounded bg-green-100 dark:bg-green-900 px-2 py-1 text-xs font-semibold text-green-700 dark:text-green-300">
                  POST
                </span>
                <code className="font-mono text-sm">/external-voice-upload</code>
              </div>
              <p className="text-sm text-muted-foreground">
                Upload voice training data for a creator.
              </p>
              <div>
                <p className="text-sm font-medium mb-2">Request Body:</p>
                <pre className="rounded-md bg-muted px-4 py-3 font-mono text-xs overflow-x-auto">
{`{
  "creator_id": "uuid",
  "file_name": "voice_sample.mp3",
  "file_url": "https://...",
  "description": "Voice sample description"
}`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Responses Card */}
        <Card>
          <CardHeader>
            <CardTitle>Error Responses</CardTitle>
            <CardDescription>Common error codes and their meanings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <code className="rounded bg-red-100 dark:bg-red-900 px-2 py-1 text-xs font-semibold text-red-700 dark:text-red-300">
                  401
                </code>
                <span className="text-sm font-medium">Unauthorized</span>
              </div>
              <pre className="rounded-md bg-muted px-4 py-3 font-mono text-xs">
{`{ "error": "Invalid API key" }`}
              </pre>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <code className="rounded bg-red-100 dark:bg-red-900 px-2 py-1 text-xs font-semibold text-red-700 dark:text-red-300">
                  403
                </code>
                <span className="text-sm font-medium">Forbidden</span>
              </div>
              <pre className="rounded-md bg-muted px-4 py-3 font-mono text-xs">
{`{ "error": "Insufficient permissions" }`}
              </pre>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <code className="rounded bg-red-100 dark:bg-red-900 px-2 py-1 text-xs font-semibold text-red-700 dark:text-red-300">
                  404
                </code>
                <span className="text-sm font-medium">Not Found</span>
              </div>
              <pre className="rounded-md bg-muted px-4 py-3 font-mono text-xs">
{`{ "error": "Resource not found" }`}
              </pre>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <code className="rounded bg-red-100 dark:bg-red-900 px-2 py-1 text-xs font-semibold text-red-700 dark:text-red-300">
                  500
                </code>
                <span className="text-sm font-medium">Internal Server Error</span>
              </div>
              <pre className="rounded-md bg-muted px-4 py-3 font-mono text-xs">
{`{ "error": "Internal server error" }`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Key Management Section */}
        <Card>
          <CardHeader>
            <CardTitle>API Key Management</CardTitle>
            <CardDescription>How to manage your API keys</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Generating Keys</h4>
              <p className="text-sm text-muted-foreground">
                Navigate to the{" "}
                <Button
                  variant="link"
                  className="h-auto p-0 text-primary"
                  onClick={() => navigate("/dashboard/admin/api-keys")}
                >
                  API Key Management
                </Button>{" "}
                page to generate new API keys. Each key will be shown only once upon creation.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Revoking Keys</h4>
              <p className="text-sm text-muted-foreground">
                If a key is compromised, immediately revoke it from the API Key Management page.
                Applications using the revoked key will lose access immediately.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Key Rotation</h4>
              <p className="text-sm text-muted-foreground">
                For security best practices, rotate your API keys periodically. Generate a new key,
                update your applications, then revoke the old key.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
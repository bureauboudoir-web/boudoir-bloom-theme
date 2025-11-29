import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PageContainer } from "@/components/PageContainer";

const API_BASE_URL = "https://pohxtstwslymiqrxmlal.supabase.co/functions/v1";

export default function ApiDocumentation() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">API Documentation</h1>
            <p className="text-muted-foreground mt-1">
              External API reference for BB integrations
            </p>
          </div>
        </div>

        {/* Base URL */}
        <Card>
          <CardHeader>
            <CardTitle>Base URL</CardTitle>
            <CardDescription>All API requests must use this base URL</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm">
                {API_BASE_URL}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(API_BASE_URL)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Authentication */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>All endpoints require API key authentication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              Include your API key in the <code className="bg-muted px-1.5 py-0.5 rounded">x-api-key</code> header
              with every request:
            </p>
            <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
              <code className="text-sm">{`x-api-key: your-api-key-here`}</code>
            </pre>
          </CardContent>
        </Card>

        {/* Endpoints */}
        <div className="space-y-4">
          {/* GET /external-creators */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline">GET</Badge>
                  /external-creators
                </CardTitle>
              </div>
              <CardDescription>Retrieve list of all creators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Request Example</h4>
                <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                  <code className="text-sm">{`curl -X GET \\
  ${API_BASE_URL}/external-creators \\
  -H "x-api-key: your-api-key"`}</code>
                </pre>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Response Example</h4>
                <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                  <code className="text-sm">{`{
  "creators": [
    {
      "id": "uuid",
      "name": "Creator Name",
      "email": "creator@example.com",
      "profile_photo_url": "https://...",
      "creator_status": "active"
    }
  ]
}`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* GET /external-creator-data */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline">GET</Badge>
                  /external-creator-data
                </CardTitle>
              </div>
              <CardDescription>Retrieve complete profile for a specific creator</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Query Parameters</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li><code className="bg-muted px-1.5 py-0.5 rounded">creator_id</code> (required) - UUID of the creator</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Request Example</h4>
                <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                  <code className="text-sm">{`curl -X GET \\
  "${API_BASE_URL}/external-creator-data?creator_id=uuid" \\
  -H "x-api-key: your-api-key"`}</code>
                </pre>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Response Example</h4>
                <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                  <code className="text-sm">{`{
  "creator": {
    "profile": { "id", "name", "email", ... },
    "onboarding": { ... },
    "persona": { "stage_name", "description", ... },
    "boundaries": { "hard_limits", "soft_limits", ... },
    "style_preferences": { ... },
    "content_preferences": [ ... ],
    "voice_files": [ ... ]
  }
}`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* POST /external-content-upload */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline">POST</Badge>
                  /external-content-upload
                </CardTitle>
              </div>
              <CardDescription>Upload content to creator's library</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Request Body</h4>
                <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                  <code className="text-sm">{`{
  "creator_id": "uuid",
  "type": "text|caption|image|video|script|hook",
  "content": "content string or URL",
  "metadata": {
    "title": "Optional title",
    "description": "Optional description"
  }
}`}</code>
                </pre>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Request Example</h4>
                <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                  <code className="text-sm">{`curl -X POST \\
  ${API_BASE_URL}/external-content-upload \\
  -H "x-api-key: your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "creator_id": "uuid",
    "type": "text",
    "content": "Sample content"
  }'`}</code>
                </pre>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Response Example</h4>
                <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                  <code className="text-sm">{`{
  "success": true,
  "id": "uuid",
  "message": "Content uploaded successfully"
}`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* POST /external-voice-upload */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline">POST</Badge>
                  /external-voice-upload
                </CardTitle>
              </div>
              <CardDescription>Upload voice samples or models</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Request Body</h4>
                <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                  <code className="text-sm">{`{
  "creator_id": "uuid",
  "file_url": "https://...",
  "type": "raw_sample|approved_sample|final_model",
  "metadata": {
    "title": "Optional title",
    "description": "Optional description",
    "file_name": "Optional file name"
  }
}`}</code>
                </pre>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Request Example</h4>
                <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                  <code className="text-sm">{`curl -X POST \\
  ${API_BASE_URL}/external-voice-upload \\
  -H "x-api-key: your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "creator_id": "uuid",
    "file_url": "https://...",
    "type": "raw_sample"
  }'`}</code>
                </pre>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Response Example</h4>
                <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                  <code className="text-sm">{`{
  "success": true,
  "id": "uuid",
  "file_url": "https://...",
  "message": "Voice file uploaded successfully"
}`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Responses */}
        <Card>
          <CardHeader>
            <CardTitle>Error Responses</CardTitle>
            <CardDescription>Standard error format for all endpoints</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Badge variant="destructive">401 Unauthorized</Badge>
              <pre className="mt-2 p-3 bg-muted rounded-lg">
                <code className="text-sm">{`{ "error": "Invalid API key", "status": 401 }`}</code>
              </pre>
            </div>
            <div>
              <Badge variant="destructive">404 Not Found</Badge>
              <pre className="mt-2 p-3 bg-muted rounded-lg">
                <code className="text-sm">{`{ "error": "Creator not found", "status": 404 }`}</code>
              </pre>
            </div>
            <div>
              <Badge variant="destructive">400 Bad Request</Badge>
              <pre className="mt-2 p-3 bg-muted rounded-lg">
                <code className="text-sm">{`{ "error": "Missing required fields", "status": 400 }`}</code>
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Key Management */}
        <Card>
          <CardHeader>
            <CardTitle>Key Management</CardTitle>
            <CardDescription>How to manage and rotate API keys</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <h4 className="font-semibold mb-1">Generating Keys</h4>
              <p>Generate new API keys in the <a href="/dashboard/admin/api-keys" className="text-primary hover:underline">API Key Management</a> page. Each key is shown only once upon creation.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Revoking Keys</h4>
              <p>Revoke compromised keys immediately. Revoked keys cannot be reactivated.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Key Rotation</h4>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Generate a new API key</li>
                <li>Update all services to use the new key</li>
                <li>Monitor usage to ensure old key is no longer used</li>
                <li>Revoke the old key</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

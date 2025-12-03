import React, { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserRoleProvider } from "@/contexts/UserRoleContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SessionTimeoutWarning } from "@/components/SessionTimeoutWarning";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const Contact = lazy(() => import("./pages/Contact"));
const Terms = lazy(() => import("./pages/Terms"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const About = lazy(() => import("./pages/About"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const CompleteSetup = lazy(() => import("./pages/CompleteSetup"));

// Role-specific dashboards
const AdminDashboard = lazy(() => import("./pages/dashboard/AdminDashboard"));
const ManagerDashboard = lazy(() => import("./pages/dashboard/ManagerDashboard"));
const CreatorDashboard = lazy(() => import("./pages/dashboard/CreatorDashboard"));
const ChatDashboard = lazy(() => import("./pages/dashboard/ChatDashboard"));
const MarketingDashboard = lazy(() => import("./pages/dashboard/MarketingDashboard"));
const StudioDashboard = lazy(() => import("./pages/dashboard/StudioDashboard"));
const ChatTeamDashboard = lazy(() => import("./pages/dashboard/ChatTeamDashboard"));
const MarketingTeamDashboard = lazy(() => import("./pages/dashboard/MarketingTeamDashboard"));
const StudioTeamDashboard = lazy(() => import("./pages/dashboard/StudioTeamDashboard"));

// Dev-only pages
const DevLogin = lazy(() => import("./pages/DevLogin"));

// Admin sub-pages
const ApiKeyManagement = lazy(() => import("./pages/admin/ApiKeyManagement"));
const ApiDocumentation = lazy(() => import("./pages/admin/ApiDocumentation"));

// Creator sub-pages
const CreatorTools = lazy(() => import("./pages/creator/CreatorTools"));
const ContentPreferencesWizard = lazy(() => import("./pages/creator/ContentPreferencesWizard"));
const ApiSettings = lazy(() => import("./pages/creator/ApiSettings"));

// Import enhanced VoiceTrainingWizard component
import { VoiceTrainingWizard } from "@/components/creator/VoiceTrainingWizard";

// BB Integration pages
const BBCreatorsList = lazy(() => import("./pages/bb/CreatorsList"));
const BBCreatorDetail = lazy(() => import("./pages/bb/CreatorDetail"));

// Legacy pages (for backward compatibility)
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreatorDetail = lazy(() => import("./pages/CreatorDetail"));
const Users = lazy(() => import("./pages/Users"));
const UserDetail = lazy(() => import("./pages/UserDetail"));

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <SessionTimeoutWarning />
          <UserRoleProvider>
            <Suspense fallback={
              <div className="min-h-screen bg-background flex items-center justify-center">
                <LoadingSpinner />
              </div>
            }>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/complete-setup" element={<CompleteSetup />} />
                
                {/* Dev-only route for testing */}
                <Route path="/dev-login/:email" element={<DevLogin />} />

                {/* Role-Based Dashboard Routes */}
                <Route path="/dashboard/admin/api-keys" element={
                  <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                    <ApiKeyManagement />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/admin/api-docs" element={
                  <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                    <ApiDocumentation />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/admin/*" element={<AdminDashboard />} />
                <Route path="/dashboard/manager/*" element={<ManagerDashboard />} />
                <Route path="/dashboard/creator/tools/voice-training" element={
                  <ProtectedRoute allowedRoles={['creator', 'admin', 'super_admin']}>
                    <VoiceTrainingWizard />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/creator/tools/content-preferences" element={<ContentPreferencesWizard />} />
                <Route path="/dashboard/creator/tools" element={<CreatorTools />} />
                <Route path="/dashboard/creator/*" element={<CreatorDashboard />} />
                <Route path="/dashboard/api-settings" element={<ApiSettings />} />
                <Route path="/dashboard/creators" element={<BBCreatorsList />} />
                <Route path="/dashboard/creators/:id" element={<BBCreatorDetail />} />
                <Route path="/dashboard/chat/*" element={<ChatDashboard />} />
                <Route path="/dashboard/marketing/*" element={<MarketingDashboard />} />
                <Route path="/dashboard/studio/*" element={<StudioDashboard />} />
                <Route path="/dashboard/chat-team/*" element={
                  <ProtectedRoute allowedRoles={['chat_team', 'admin', 'super_admin', 'manager']}>
                    <ChatTeamDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/marketing-team/*" element={
                  <ProtectedRoute allowedRoles={['marketing_team', 'admin', 'super_admin', 'manager']}>
                    <MarketingTeamDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/studio-team/*" element={
                  <ProtectedRoute allowedRoles={['studio_team', 'admin', 'super_admin', 'manager']}>
                    <StudioTeamDashboard />
                  </ProtectedRoute>
                } />

                {/* Legacy Routes (for backward compatibility) */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/manager" element={<ManagerDashboard />} />
                <Route path="/creator/:id" element={<CreatorDetail />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/:id" element={<UserDetail />} />

                {/* Catch All */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </UserRoleProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;

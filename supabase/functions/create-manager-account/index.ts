import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.83.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateManagerRequest {
  email: string;
  fullName: string;
  role: 'manager' | 'admin';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT and get user from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: No authorization header' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create authenticated client to verify user
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get authenticated user
    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser();
    if (userError || !user) {
      console.log("Authentication failed");
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid token' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user has admin or super_admin role
    const { data: roles, error: roleError } = await supabaseAuth
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .in('role', ['admin', 'super_admin']);

    if (roleError || !roles || roles.length === 0) {
      console.log("Insufficient permissions for user");
      return new Response(
        JSON.stringify({ error: 'Forbidden: Only admins can create manager accounts' }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Authenticated admin processing manager account creation");

    const { email, fullName, role }: CreateManagerRequest = await req.json();

    // Validate input
    if (!email || !fullName || !role) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: email, fullName, and role" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate role
    if (role !== 'manager' && role !== 'admin') {
      return new Response(
        JSON.stringify({ error: "Invalid role. Must be 'manager' or 'admin'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create admin client with service role key for privileged operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    console.log(`Creating ${role} account for:`, email);

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users.find(u => u.email === email);

    if (existingUser) {
      console.log("User already exists with this email");
      return new Response(
        JSON.stringify({ error: "A user with this email already exists" }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create the user account with email confirmed
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
      },
    });

    if (authError || !authUser.user) {
      console.error("Error creating user:", authError);
      return new Response(
        JSON.stringify({ error: `Failed to create user account: ${authError?.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = authUser.user.id;
    console.log("Created user successfully:", userId);

    // Assign the requested role
    const { error: roleInsertError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: role });

    if (roleInsertError) {
      console.error("Error assigning role:", roleInsertError);
      // Try to clean up the created user
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return new Response(
        JSON.stringify({ error: "Failed to assign role to user" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`${role} role assigned successfully`);

    // Get expiration duration from admin settings
    const { data: expirationSetting } = await supabaseAdmin
      .from("admin_settings")
      .select("setting_value")
      .eq("setting_key", "password_reset_expiration_hours")
      .single();

    const expirationHours = expirationSetting?.setting_value as number || 72;
    const expirationMinutes = expirationHours * 60;

    console.log(`Creating invitation token with ${expirationHours} hours expiration`);

    // Create invitation token for password setup
    const invitationToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);

    const { error: tokenError } = await supabaseAdmin
      .from("invitation_tokens")
      .insert({
        token: invitationToken,
        user_id: userId,
        expires_at: expiresAt.toISOString(),
      });

    if (tokenError) {
      console.error("Error creating invitation token:", tokenError);
      return new Response(
        JSON.stringify({ error: "Failed to create invitation token" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get app origin from request headers
    const referer = req.headers.get('referer') || req.headers.get('origin') || '';
    const appOrigin = referer ? new URL(referer).origin : '';

    // Generate invitation URL
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const invitationUrl = `${supabaseUrl}/functions/v1/complete-invitation?token=${invitationToken}`;
    const loginUrl = `${appOrigin}/login`;
    
    console.log("Invitation token created successfully");

    // Send welcome email
    try {
      await supabaseAdmin.functions.invoke("send-manager-welcome", {
        body: {
          email: email,
          fullName: fullName,
          role: role,
          loginUrl: loginUrl,
          invitationUrl: invitationUrl,
          userId: userId,
          expiresAt: expiresAt.toISOString(),
          expirationMinutes: expirationMinutes,
        },
      });
      console.log("Welcome email sent successfully");
    } catch (error) {
      console.error("Error sending welcome email:", error);
      // Don't fail the request if email fails
    }

    console.log(`${role} account created successfully`);

    return new Response(
      JSON.stringify({
        success: true,
        userId,
        email,
        fullName,
        role,
        invitationUrl,
        expiresAt: expiresAt.toISOString(),
        message: `${role === 'manager' ? 'Manager' : 'Admin'} account created successfully`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in create-manager-account:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);

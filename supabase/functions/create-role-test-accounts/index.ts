import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.83.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TestAccount {
  email: string;
  password: string;
  fullName: string;
  role: 'admin' | 'manager' | 'chatter' | 'marketing' | 'studio';
}

const TEST_ACCOUNTS: TestAccount[] = [
  {
    email: "admin@test.com",
    password: "TestPass123!",
    fullName: "Admin Test User",
    role: "admin"
  },
  {
    email: "manager@test.com",
    password: "TestPass123!",
    fullName: "Manager Test User",
    role: "manager"
  },
  {
    email: "chatter@test.com",
    password: "TestPass123!",
    fullName: "Chatter Test User",
    role: "chatter"
  },
  {
    email: "marketing@test.com",
    password: "TestPass123!",
    fullName: "Marketing Test User",
    role: "marketing"
  },
  {
    email: "studio@test.com",
    password: "TestPass123!",
    fullName: "Studio Test User",
    role: "studio"
  }
];

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user is admin
    const { data: roles } = await supabaseAuth
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .in('role', ['admin', 'super_admin']);

    if (!roles || roles.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: Only admins can create test accounts' }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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

    const createdAccounts = [];
    const errors = [];

    for (const account of TEST_ACCOUNTS) {
      try {
        // Check if user already exists
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = existingUsers?.users.find(u => u.email === account.email);

        if (existingUser) {
          // Delete existing test user
          await supabaseAdmin.auth.admin.deleteUser(existingUser.id);
          console.log(`Deleted existing test user: ${account.email}`);
        }

        // Create new user
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: account.email,
          password: account.password,
          email_confirm: true,
          user_metadata: {
            full_name: account.fullName,
          },
        });

        if (authError || !authUser.user) {
          errors.push({ email: account.email, error: authError?.message });
          continue;
        }

        const userId = authUser.user.id;

        // Assign role
        const { error: roleError } = await supabaseAdmin
          .from("user_roles")
          .insert({ user_id: userId, role: account.role });

        if (roleError) {
          errors.push({ email: account.email, error: roleError.message });
          await supabaseAdmin.auth.admin.deleteUser(userId);
          continue;
        }

        createdAccounts.push({
          email: account.email,
          password: account.password,
          fullName: account.fullName,
          role: account.role,
          userId: userId
        });

        console.log(`Created test account: ${account.email} with role: ${account.role}`);
      } catch (error: any) {
        errors.push({ email: account.email, error: error.message });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Created ${createdAccounts.length} test accounts`,
        accounts: createdAccounts,
        errors: errors.length > 0 ? errors : undefined
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in create-role-test-accounts:", error);
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

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const bootstrapAdmin = {
      email: 'bootstrap@admin.com',
      password: 'TestPassword123!',
      fullName: 'Bootstrap Admin'
    };

    // Check if bootstrap admin already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUser?.users?.some(u => u.email === bootstrapAdmin.email);

    if (userExists) {
      // Delete existing bootstrap admin
      const userToDelete = existingUser?.users?.find(u => u.email === bootstrapAdmin.email);
      if (userToDelete) {
        await supabaseAdmin.auth.admin.deleteUser(userToDelete.id);
        console.log(`Deleted existing bootstrap admin: ${bootstrapAdmin.email}`);
      }
    }

    // Create new bootstrap admin
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: bootstrapAdmin.email,
      password: bootstrapAdmin.password,
      email_confirm: true,
      user_metadata: {
        full_name: bootstrapAdmin.fullName
      }
    });

    if (userError) {
      console.error('Error creating user:', userError);
      throw userError;
    }

    if (!user.user) {
      throw new Error('User creation returned no user data');
    }

    console.log(`Created bootstrap admin user: ${user.user.email} (${user.user.id})`);

    // Assign admin role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: user.user.id,
        role: 'admin'
      });

    if (roleError) {
      console.error('Error assigning role:', roleError);
      throw roleError;
    }

    console.log(`Assigned admin role to ${user.user.email}`);

    return new Response(
      JSON.stringify({
        success: true,
        account: {
          email: bootstrapAdmin.email,
          password: bootstrapAdmin.password,
          fullName: bootstrapAdmin.fullName,
          userId: user.user.id,
          role: 'admin'
        },
        message: 'Bootstrap admin created successfully. Use this account to login and access the test account generator.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error('Error in create-bootstrap-admin:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

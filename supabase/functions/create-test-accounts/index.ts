import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.83.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TEST_PASSWORD = 'TestBB2025!';

const TEST_ACCOUNTS = [
  {
    email: 'test-admin@bureauboudoir.com',
    full_name: 'Test Admin',
    roles: ['admin'],
  },
  {
    email: 'test-manager@bureauboudoir.com',
    full_name: 'Test Manager Lisa',
    roles: ['manager'],
  },
  {
    email: 'test-creator-1@bureauboudoir.com',
    full_name: 'Test Creator Emma',
    roles: ['creator'],
    onboarding: {
      personal_full_name: 'Emma Smith',
      personal_date_of_birth: '1995-06-15',
      personal_location: 'Amsterdam, Netherlands',
      personal_email: 'test-creator-1@bureauboudoir.com',
      persona_stage_name: 'Emma Rose',
      persona_description: 'Elegant and sophisticated',
      is_completed: true,
      completed_steps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
  },
  {
    email: 'test-creator-2@bureauboudoir.com',
    full_name: 'Test Creator Sophie',
    roles: ['creator'],
    onboarding: {
      personal_full_name: 'Sophie Anderson',
      personal_date_of_birth: '1997-03-22',
      personal_location: 'Amsterdam, Netherlands',
      personal_email: 'test-creator-2@bureauboudoir.com',
      is_completed: false,
      completed_steps: [1, 2, 3],
    },
  },
  {
    email: 'test-creator-3@bureauboudoir.com',
    full_name: 'Test Creator Julia',
    roles: ['creator'],
    onboarding: {
      is_completed: false,
      completed_steps: [],
    },
  },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action } = await req.json();

    if (action === 'cleanup') {
      console.log('🧹 Cleaning up test accounts...');

      // Get all test account user IDs
      const testEmails = TEST_ACCOUNTS.map(acc => acc.email);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')
        .in('email', testEmails);

      if (profiles && profiles.length > 0) {
        const userIds = profiles.map(p => p.id);

        // Delete from auth.users (will cascade to other tables)
        for (const userId of userIds) {
          await supabase.auth.admin.deleteUser(userId);
        }
      }

      console.log(`✅ Deleted ${profiles?.length || 0} test accounts`);

      return new Response(
        JSON.stringify({
          success: true,
          message: `Deleted ${profiles?.length || 0} test accounts`,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Create test accounts
    console.log('🔧 Creating test accounts...');
    const createdAccounts = [];

    for (const account of TEST_ACCOUNTS) {
      try {
        // Create user in auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: account.email,
          password: TEST_PASSWORD,
          email_confirm: true,
          user_metadata: {
            full_name: account.full_name,
          },
        });

        if (authError) {
          console.error(`Failed to create ${account.email}:`, authError);
          continue;
        }

        const userId = authData.user.id;

        // Update profile
        await supabase
          .from('profiles')
          .update({ full_name: account.full_name })
          .eq('id', userId);

        // Assign roles
        for (const role of account.roles) {
          await supabase
            .from('user_roles')
            .insert({ user_id: userId, role });
        }

        // Create onboarding data if creator
        if (account.onboarding) {
          await supabase
            .from('onboarding_data')
            .update(account.onboarding)
            .eq('user_id', userId);
        }

        // Grant full access for creators
        if (account.roles.includes('creator')) {
          await supabase
            .from('creator_access_levels')
            .insert({
              user_id: userId,
              access_level: 'full_access',
              granted_at: new Date().toISOString(),
            });
        }

        createdAccounts.push({
          email: account.email,
          password: TEST_PASSWORD,
          roles: account.roles,
          full_name: account.full_name,
        });

        console.log(`✅ Created: ${account.email}`);
      } catch (error) {
        console.error(`Error creating ${account.email}:`, error);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        accounts: createdAccounts,
        message: `Created ${createdAccounts.length} test accounts`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('❌ Error managing test accounts:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

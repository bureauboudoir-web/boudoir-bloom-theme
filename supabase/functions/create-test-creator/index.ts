import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Creating test creator account...')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    const testEmail = 'creator@test.com'
    const testPassword = 'Test1234!'
    const testName = 'Test Creator'

    // Delete existing user if found
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers()
    const userToDelete = existingUser?.users.find(u => u.email === testEmail)
    
    if (userToDelete) {
      console.log('Deleting existing user:', testEmail)
      await supabaseAdmin.auth.admin.deleteUser(userToDelete.id)
    }

    // Create new user
    console.log('Creating new user:', testEmail)
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: {
        full_name: testName
      }
    })

    if (createError) {
      console.error('Error creating user:', createError)
      throw createError
    }

    console.log('User created:', newUser.user.id)

    // Assign creator role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: newUser.user.id,
        role: 'creator'
      })

    if (roleError) {
      console.error('Error assigning role:', roleError)
      throw roleError
    }

    console.log('Role assigned successfully')

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Test creator account created successfully',
        credentials: {
          email: testEmail,
          password: testPassword,
          userId: newUser.user.id
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in create-test-creator:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
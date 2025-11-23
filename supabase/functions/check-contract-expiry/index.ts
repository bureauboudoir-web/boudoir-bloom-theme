import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔔 Checking contract expiry notifications...');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get all contracts that are:
    // 1. Signed
    // 2. Not yet expired
    // 3. Expiring within 30 days
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const { data: contracts, error: contractsError } = await supabaseClient
      .from('creator_contracts')
      .select(`
        id,
        user_id,
        contract_signed,
        contract_data,
        profiles!creator_contracts_user_id_fkey(email, full_name)
      `)
      .eq('contract_signed', true)
      .not('contract_data', 'is', null);

    if (contractsError) {
      throw contractsError;
    }

    console.log(`📋 Found ${contracts?.length || 0} signed contracts to check`);

    const expiringContracts: any[] = [];
    const expiredContracts: any[] = [];

    for (const contract of contracts || []) {
      const contractData = contract.contract_data as any;
      if (!contractData?.contract_end_date) continue;

      const endDate = new Date(contractData.contract_end_date);
      
      // Check if expired
      if (endDate < today) {
        expiredContracts.push({
          ...contract,
          endDate,
          daysOverdue: Math.floor((today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24)),
        });
      }
      // Check if expiring within 30 days
      else if (endDate <= thirtyDaysFromNow) {
        expiringContracts.push({
          ...contract,
          endDate,
          daysUntilExpiry: Math.floor((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
        });
      }
    }

    console.log(`⏰ ${expiringContracts.length} contracts expiring soon`);
    console.log(`⚠️ ${expiredContracts.length} contracts expired`);

    // Create notifications for expiring contracts
    for (const contract of expiringContracts) {
      const { error: notificationError } = await supabaseClient
        .from('notification_history')
        .insert({
          user_id: contract.user_id,
          title: 'Contract Expiring Soon',
          description: `Your contract with Bureau Boudoir expires in ${contract.daysUntilExpiry} days (${contract.endDate.toLocaleDateString()}). Please contact your manager to discuss renewal.`,
          notification_type: 'contract_expiring',
          priority: contract.daysUntilExpiry <= 7 ? 'high' : 'normal',
        });

      if (notificationError) {
        console.error(`❌ Failed to create notification for contract ${contract.id}:`, notificationError);
      } else {
        console.log(`✅ Notification created for contract ${contract.id}`);
      }
    }

    // Create notifications for expired contracts
    for (const contract of expiredContracts) {
      const { error: notificationError } = await supabaseClient
        .from('notification_history')
        .insert({
          user_id: contract.user_id,
          title: 'Contract Expired',
          description: `Your contract with Bureau Boudoir expired ${contract.daysOverdue} days ago (${contract.endDate.toLocaleDateString()}). Please contact your manager immediately to renew or conclude cooperation.`,
          notification_type: 'contract_expired',
          priority: 'high',
        });

      if (notificationError) {
        console.error(`❌ Failed to create notification for expired contract ${contract.id}:`, notificationError);
      } else {
        console.log(`✅ Expiry notification created for contract ${contract.id}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Contract expiry check completed',
        summary: {
          total_checked: contracts?.length || 0,
          expiring_soon: expiringContracts.length,
          expired: expiredContracts.length,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ Error checking contract expiry:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
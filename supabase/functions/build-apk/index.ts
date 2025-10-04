import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const buildData = await req.json();
    console.log('Received build request:', buildData);

    // Insert build request into database
    const { data: build, error: insertError } = await supabaseClient
      .from('apk_builds')
      .insert({
        user_id: user.id,
        app_name: buildData.appName,
        package_name: buildData.packageName,
        version: buildData.version,
        domain: buildData.domain,
        port: buildData.port,
        ui_type: buildData.uiType,
        web_url: buildData.webUrl,
        welcome_text: buildData.welcomeText,
        apk_size: buildData.apkSize,
        theme: buildData.theme,
        splash_duration: buildData.splashDuration,
        permissions: buildData.permissions,
        status: 'processing'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to create build request' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Build request created:', build.id);

    // Start background build process (simulated)
    (async () => {
      try {
        // Simulate build steps
        const steps = [
          { progress: 10, message: 'Initializing build environment...' },
          { progress: 25, message: 'Configuring app settings...' },
          { progress: 40, message: 'Generating resources...' },
          { progress: 55, message: 'Compiling application...' },
          { progress: 70, message: 'Optimizing APK size...' },
          { progress: 85, message: 'Signing APK...' },
          { progress: 95, message: 'Finalizing build...' },
        ];

        for (const step of steps) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          console.log(`Build ${build.id}: ${step.progress}% - ${step.message}`);
        }

        // Mark as completed with download URL
        const downloadUrl = `https://example.com/downloads/${build.id}.apk`;
        
        await supabaseClient
          .from('apk_builds')
          .update({ 
            status: 'completed',
            download_url: downloadUrl 
          })
          .eq('id', build.id);

        console.log(`Build ${build.id} completed successfully`);
      } catch (err) {
        const error = err as Error;
        console.error(`Build ${build.id} failed:`, error);
        await supabaseClient
          .from('apk_builds')
          .update({ 
            status: 'failed',
            error_message: error.message 
          })
          .eq('id', build.id);
      }
    })();

    return new Response(
      JSON.stringify({ 
        success: true, 
        buildId: build.id,
        message: 'Build started successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    const error = err as Error;
    console.error('Error in build-apk function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
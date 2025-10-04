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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const buildData = await req.json();

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
      console.error('Insert error:', insertError);
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Simulate APK build process (in real app, this would call Android build service)
    console.log('Building APK for:', buildData);
    
    // In production, you would:
    // 1. Call an Android build service API
    // 2. Upload source files to build server
    // 3. Monitor build progress
    // 4. Get download URL when complete
    
    // For now, simulate a build completion after a delay
    setTimeout(async () => {
      const { error: updateError } = await supabaseClient
        .from('apk_builds')
        .update({
          status: 'completed',
          download_url: `https://example.com/builds/${build.id}.apk`
        })
        .eq('id', build.id);

      if (updateError) {
        console.error('Update error:', updateError);
      }
    }, 30000); // 30 seconds

    return new Response(JSON.stringify({ 
      success: true, 
      buildId: build.id,
      message: 'Build started successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in build-apk function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
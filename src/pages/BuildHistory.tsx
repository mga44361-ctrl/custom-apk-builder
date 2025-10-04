import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface BuildHistoryProps {
  language: string;
}

interface Build {
  id: string;
  app_name: string;
  package_name: string;
  version: string;
  status: string;
  download_url: string | null;
  error_message: string | null;
  created_at: string;
}

export default function BuildHistory({ language }: BuildHistoryProps) {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBuilds();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('build-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'apk_builds'
        },
        () => {
          loadBuilds();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadBuilds = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error(language === "ar" ? "يجب تسجيل الدخول أولاً" : "Please login first");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('apk_builds')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading builds:', error);
        toast.error(language === "ar" ? "فشل في تحميل السجل" : "Failed to load history");
      } else {
        setBuilds(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    if (language === "ar") {
      switch (status) {
        case 'completed': return 'مكتمل';
        case 'failed': return 'فشل';
        case 'processing': return 'جاري المعالجة';
        default: return 'في الانتظار';
      }
    } else {
      switch (status) {
        case 'completed': return 'Completed';
        case 'failed': return 'Failed';
        case 'processing': return 'Processing';
        default: return 'Pending';
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {language === "ar" ? "سجل البناءات" : "Build History"}
        </h2>
        <Badge variant="secondary">
          {builds.length} {language === "ar" ? "بناء" : "builds"}
        </Badge>
      </div>

      {builds.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            {language === "ar" ? "لا توجد بناءات سابقة" : "No previous builds"}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {builds.map((build) => (
            <Card key={build.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(build.status)}
                    <h3 className="text-lg font-semibold">{build.app_name}</h3>
                    <Badge variant={build.status === 'completed' ? 'default' : build.status === 'failed' ? 'destructive' : 'secondary'}>
                      {getStatusText(build.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">
                        {language === "ar" ? "الحزمة:" : "Package:"}
                      </span> {build.package_name}
                    </div>
                    <div>
                      <span className="font-medium">
                        {language === "ar" ? "الإصدار:" : "Version:"}
                      </span> {build.version}
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium">
                        {language === "ar" ? "التاريخ:" : "Date:"}
                      </span> {formatDate(build.created_at)}
                    </div>
                  </div>

                  {build.error_message && (
                    <div className="p-3 bg-destructive/10 rounded-md text-sm text-destructive">
                      {build.error_message}
                    </div>
                  )}
                </div>

                {build.status === 'completed' && build.download_url && (
                  <Button
                    onClick={() => window.open(build.download_url!, '_blank')}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    {language === "ar" ? "تحميل" : "Download"}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Download, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface BuildProgressProps {
  language: string;
}

const buildSteps = [
  { progress: 5, messageAr: 'تهيئة بيئة البناء...', messageEn: 'Initializing build environment...' },
  { progress: 10, messageAr: 'استخراج بنية APK الأساسية...', messageEn: 'Extracting base APK structure...' },
  { progress: 15, messageAr: 'تكوين AndroidManifest.xml...', messageEn: 'Configuring AndroidManifest.xml...' },
  { progress: 25, messageAr: 'AAPT2: تجميع الموارد...', messageEn: 'AAPT2: Compiling resources...' },
  { progress: 35, messageAr: 'AAPT2: ربط الموارد...', messageEn: 'AAPT2: Linking resources...' },
  { progress: 45, messageAr: 'حقن البيانات والإعدادات...', messageEn: 'Injecting payload and configuration...' },
  { progress: 55, messageAr: 'APKEditor: تعديل بنية APK...', messageEn: 'APKEditor: Modifying APK structure...' },
  { progress: 65, messageAr: 'zipalign: تحسين محاذاة APK...', messageEn: 'zipalign: Optimizing APK alignment...' },
  { progress: 75, messageAr: 'إنشاء مفتاح التوقيع...', messageEn: 'Generating signing key...' },
  { progress: 85, messageAr: 'apksigner: توقيع APK بنظام V1+V2...', messageEn: 'apksigner: Signing APK with V1+V2 scheme...' },
  { progress: 90, messageAr: 'signapk: التحقق من التوقيع...', messageEn: 'signapk: Verifying signature...' },
  { progress: 95, messageAr: 'التحقق النهائي والتعبئة...', messageEn: 'Final validation and packaging...' },
  { progress: 100, messageAr: 'اكتمل البناء بنجاح!', messageEn: 'Build completed successfully!' },
];

export default function BuildProgress({ language }: BuildProgressProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const buildId = searchParams.get('id');
  
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState<'processing' | 'completed' | 'failed'>('processing');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [buildInfo, setBuildInfo] = useState<any>(null);

  useEffect(() => {
    if (!buildId) {
      navigate('/');
      return;
    }

    let progressInterval: NodeJS.Timeout;
    let statusInterval: NodeJS.Timeout;

    // Simulate smooth progress animation
    progressInterval = setInterval(() => {
      setProgress((prev) => {
        const nextStepIndex = buildSteps.findIndex(s => s.progress > prev);
        if (nextStepIndex !== -1 && nextStepIndex > currentStep) {
          setCurrentStep(nextStepIndex);
        }
        
        if (prev >= 95 || status !== 'processing') {
          clearInterval(progressInterval);
          return prev;
        }
        return Math.min(prev + 2, 95);
      });
    }, 800);

    // Poll for build status
    statusInterval = setInterval(async () => {
      const { data: build } = await supabase
        .from('apk_builds')
        .select('*')
        .eq('id', buildId)
        .single();

      if (build) {
        setBuildInfo(build);
        
        if (build.status === 'completed') {
          clearInterval(progressInterval);
          clearInterval(statusInterval);
          setProgress(100);
          setCurrentStep(buildSteps.length - 1);
          setStatus('completed');
          setDownloadUrl(build.download_url);
          
          // Auto download
          if (build.download_url) {
            toast.success(language === "ar" ? "جاري تنزيل التطبيق..." : "Downloading app...");
            const link = document.createElement('a');
            link.href = build.download_url;
            link.download = `${build.app_name}.apk`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        } else if (build.status === 'failed') {
          clearInterval(progressInterval);
          clearInterval(statusInterval);
          setStatus('failed');
          setErrorMessage(build.error_message);
          toast.error(language === "ar" ? "فشل البناء" : "Build failed");
        }
      }
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(statusInterval);
    };
  }, [buildId, navigate, status, currentStep, language]);

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${buildInfo?.app_name || 'app'}.apk`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(language === "ar" ? "جاري التنزيل..." : "Downloading...");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            {status === 'processing' && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
            {status === 'completed' && <CheckCircle2 className="h-6 w-6 text-green-500" />}
            {status === 'failed' && <XCircle className="h-6 w-6 text-destructive" />}
            {language === "ar" ? "عملية بناء التطبيق" : "App Build Process"}
          </CardTitle>
          <CardDescription>
            {buildInfo?.app_name && `${buildInfo.app_name} - v${buildInfo.version}`}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {language === "ar" ? "التقدم" : "Progress"}
              </span>
              <span className="font-semibold">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Current Step */}
          {status === 'processing' && currentStep < buildSteps.length && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <p className="text-sm font-medium flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {language === "ar" ? buildSteps[currentStep]?.messageAr : buildSteps[currentStep]?.messageEn}
              </p>
            </div>
          )}

          {/* Build Steps List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {buildSteps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                  index < currentStep
                    ? "bg-green-500/10 text-green-600"
                    : index === currentStep
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                ) : index === currentStep ? (
                  <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 flex-shrink-0" />
                )}
                <span className="text-sm">
                  {language === "ar" ? step.messageAr : step.messageEn}
                </span>
              </div>
            ))}
          </div>

          {/* Success State */}
          {status === 'completed' && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 space-y-3">
              <p className="text-green-600 font-medium flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                {language === "ar" ? "تم بناء التطبيق بنجاح!" : "App built successfully!"}
              </p>
              <Button onClick={handleDownload} className="w-full gap-2">
                <Download className="h-4 w-4" />
                {language === "ar" ? "تنزيل التطبيق" : "Download App"}
              </Button>
            </div>
          )}

          {/* Error State */}
          {status === 'failed' && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-destructive font-medium flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                {language === "ar" ? "فشل البناء" : "Build Failed"}
              </p>
              {errorMessage && (
                <p className="text-sm text-muted-foreground mt-2">{errorMessage}</p>
              )}
            </div>
          )}

          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="w-full gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {language === "ar" ? "العودة إلى لوحة التحكم" : "Back to Dashboard"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

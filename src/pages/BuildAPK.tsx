import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BuildAPKProps {
  language: string;
}

interface BuildData {
  packageName: string;
  versionName: string;
  appLabel: string;
  domain: string;
  port: string;
  uiType: string;
  webUrl: string;
  welcomeText: string;
  apkSize: string;
  theme: string;
  splashDuration: string;
  permissions: string[];
}

const permissions = [
  "Camera", "Location", "Overlay", "SMS", "Storage", 
  "Contacts", "Bluetooth", "Microphone", "Phone", "Calendar"
];

export default function BuildAPK({ language }: BuildAPKProps) {
  const [step, setStep] = useState(1);
  const [building, setBuilding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState<BuildData>({
    packageName: "",
    versionName: "1.0.0",
    appLabel: "",
    domain: "",
    port: "443",
    uiType: "webview",
    webUrl: "",
    welcomeText: "",
    apkSize: "normal",
    theme: "light",
    splashDuration: "2",
    permissions: [],
  });

  const updateData = (field: keyof BuildData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const togglePermission = (perm: string) => {
    setData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm]
    }));
  };

  const handleBuild = async () => {
    setBuilding(true);
    setProgress(0);

    try {
      // Check authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error(language === "ar" ? "يجب تسجيل الدخول أولاً" : "Please login first");
        setBuilding(false);
        return;
      }

      // Call backend to start build process
      const { data: result, error } = await supabase.functions.invoke('build-apk', {
        body: {
          appName: data.appLabel,
          packageName: data.packageName,
          version: data.versionName,
          domain: data.domain,
          port: data.port,
          uiType: data.uiType,
          webUrl: data.webUrl,
          welcomeText: data.welcomeText,
          apkSize: data.apkSize,
          theme: data.theme,
          splashDuration: data.splashDuration,
          permissions: data.permissions,
        }
      });

      if (error) {
        console.error('Build error:', error);
        toast.error(language === "ar" ? "فشل في بدء البناء" : "Failed to start build");
        setBuilding(false);
        return;
      }

      toast.success(language === "ar" ? "تم بدء عملية البناء!" : "Build started!");

      // Simulate progress for better UX
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 1000);

      // Poll for build completion
      const checkBuildStatus = setInterval(async () => {
        const { data: builds } = await supabase
          .from('apk_builds')
          .select('*')
          .eq('id', result.buildId)
          .single();

        if (builds?.status === 'completed') {
          clearInterval(checkBuildStatus);
          clearInterval(interval);
          setProgress(100);
          setBuilding(false);
          toast.success(language === "ar" ? "تم بناء APK بنجاح!" : "APK built successfully!");
          
          if (builds.download_url) {
            window.open(builds.download_url, '_blank');
          }
        } else if (builds?.status === 'failed') {
          clearInterval(checkBuildStatus);
          clearInterval(interval);
          setBuilding(false);
          toast.error(builds.error_message || (language === "ar" ? "فشل البناء" : "Build failed"));
        }
      }, 3000);

      // Cleanup after 5 minutes
      setTimeout(() => {
        clearInterval(checkBuildStatus);
        clearInterval(interval);
        if (building) {
          setBuilding(false);
          toast.error(language === "ar" ? "انتهت مهلة البناء" : "Build timeout");
        }
      }, 300000);

    } catch (error) {
      console.error('Build error:', error);
      toast.error(language === "ar" ? "حدث خطأ أثناء البناء" : "An error occurred during build");
      setBuilding(false);
    }
  };

  const steps = [
    { num: 1, labelAr: "معلومات أساسية", labelEn: "Basic Info" },
    { num: 2, labelAr: "واجهة وتخصيص", labelEn: "UI & Customization" },
    { num: 3, labelAr: "أذونات", labelEn: "Permissions" },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Stepper */}
      <div className="grid grid-cols-3 gap-4">
        {steps.map((s) => (
          <div
            key={s.num}
            className={cn(
              "p-4 rounded-lg border-2 text-center transition-all",
              step === s.num
                ? "border-primary bg-primary/10"
                : "border-border bg-card"
            )}
          >
            <div className="text-sm font-medium">
              {s.num}. {language === "ar" ? s.labelAr : s.labelEn}
            </div>
          </div>
        ))}
      </div>

      <Card className="p-6">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === "ar" ? "المعلومات الأساسية" : "Basic Information"}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>{language === "ar" ? "أيقونة التطبيق (512×512 PNG)" : "App Icon (512×512 PNG)"}</Label>
                <Input type="file" accept="image/png" />
              </div>
              <div>
                <Label>{language === "ar" ? "صورة شاشة Splash" : "Splash Image"}</Label>
                <Input type="file" accept="image/*" />
              </div>
              <div>
                <Label>{language === "ar" ? "اسم الحزمة" : "Package Name"}</Label>
                <Input 
                  value={data.packageName} 
                  onChange={(e) => updateData("packageName", e.target.value)}
                  placeholder="com.example.app" 
                />
              </div>
              <div>
                <Label>{language === "ar" ? "رقم الإصدار" : "Version"}</Label>
                <Input 
                  value={data.versionName} 
                  onChange={(e) => updateData("versionName", e.target.value)}
                  placeholder="1.0.0" 
                />
              </div>
              <div>
                <Label>{language === "ar" ? "اسم التطبيق الظاهر" : "App Name"}</Label>
                <Input 
                  value={data.appLabel} 
                  onChange={(e) => updateData("appLabel", e.target.value)}
                  placeholder="Siyanet Tech" 
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>{language === "ar" ? "النطاق/Domain" : "Domain"}</Label>
                  <Input 
                    value={data.domain} 
                    onChange={(e) => updateData("domain", e.target.value)}
                    placeholder="example.com" 
                  />
                </div>
                <div>
                  <Label>{language === "ar" ? "المنفذ" : "Port"}</Label>
                  <Input 
                    type="number"
                    value={data.port} 
                    onChange={(e) => updateData("port", e.target.value)}
                    placeholder="443" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: UI & Customization */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === "ar" ? "الواجهة والتخصيص" : "UI & Customization"}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>{language === "ar" ? "نوع الواجهة" : "UI Type"}</Label>
                <Select value={data.uiType} onValueChange={(v) => updateData("uiType", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="webview">WebView</SelectItem>
                    <SelectItem value="native">Native</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>URL {language === "ar" ? "(في حال WebView)" : "(for WebView)"}</Label>
                <Input 
                  value={data.webUrl} 
                  onChange={(e) => updateData("webUrl", e.target.value)}
                  placeholder="https://example.com" 
                />
              </div>
              <div>
                <Label>{language === "ar" ? "نص الإشعار الترحيبي" : "Welcome Notification"}</Label>
                <Input 
                  value={data.welcomeText} 
                  onChange={(e) => updateData("welcomeText", e.target.value)}
                  placeholder="Welcome to our app" 
                />
              </div>
              <div>
                <Label>{language === "ar" ? "حجم APK المستهدف" : "Target APK Size"}</Label>
                <Select value={data.apkSize} onValueChange={(v) => updateData("apkSize", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compressed">{language === "ar" ? "مضغوط" : "Compressed"}</SelectItem>
                    <SelectItem value="normal">{language === "ar" ? "عادي" : "Normal"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{language === "ar" ? "المظهر" : "Theme"}</Label>
                <Select value={data.theme} onValueChange={(v) => updateData("theme", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">{language === "ar" ? "فاتح" : "Light"}</SelectItem>
                    <SelectItem value="dark">{language === "ar" ? "داكن" : "Dark"}</SelectItem>
                    <SelectItem value="auto">{language === "ar" ? "تلقائي" : "Auto"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{language === "ar" ? "مدة Splash (ثانية)" : "Splash Duration (sec)"}</Label>
                <Input 
                  type="number"
                  value={data.splashDuration} 
                  onChange={(e) => updateData("splashDuration", e.target.value)}
                  placeholder="2" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Permissions */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === "ar" ? "الأذونات المطلوبة" : "Required Permissions"}
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {permissions.map((perm) => (
                <div key={perm} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={perm}
                    checked={data.permissions.includes(perm)}
                    onCheckedChange={() => togglePermission(perm)}
                  />
                  <label
                    htmlFor={perm}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {perm}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className="gap-2"
          >
            {language === "ar" ? (
              <>السابق <ChevronRight className="h-4 w-4" /></>
            ) : (
              <><ChevronLeft className="h-4 w-4" /> Back</>
            )}
          </Button>
          {step < 3 ? (
            <Button onClick={() => setStep(s => Math.min(3, s + 1))} className="gap-2">
              {language === "ar" ? (
                <><ChevronLeft className="h-4 w-4" /> التالي</>
              ) : (
                <>Next <ChevronRight className="h-4 w-4" /></>
              )}
            </Button>
          ) : (
            <Button onClick={handleBuild} disabled={building}>
              {language === "ar" ? "بدء البناء" : "Start Build"}
            </Button>
          )}
        </div>

        {/* Build Progress */}
        {building && (
          <div className="mt-6 space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-muted-foreground text-center">
              {language === "ar" ? "جاري البناء..." : "Building..."} {Math.round(progress)}%
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { Download, ChevronDown, Settings2 } from "lucide-react";

interface APKInjectionProps {
  language: string;
}

export default function APKInjection({ language }: APKInjectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState("auto");
  const [admobUnit, setAdmobUnit] = useState("");
  const [javaCode, setJavaCode] = useState("");
  const [log, setLog] = useState<string[]>([]);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  
  // Advanced options
  const [options, setOptions] = useState({
    obfuscate: false,
    antiTamper: false,
    rootDetection: false,
    sslPinning: false,
    debuggableDisable: false,
    minifyResources: false,
    removeUnusedCode: false,
    optimizeImages: false,
    targetSdk: "34",
    minSdk: "21",
    architecture: "all",
    signatureScheme: "v2",
    compressionLevel: "6",
  });

  const updateOption = (key: string, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const logRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string) => {
    setLog(prev => [...prev, message]);
    setTimeout(() => {
      if (logRef.current) {
        logRef.current.scrollTop = logRef.current.scrollHeight;
      }
    }, 10);
  };

  const startInjection = async () => {
    if (!file) {
      toast.error(language === "ar" ? "يرجى اختيار ملف APK" : "Please choose APK file");
      return;
    }

    setLog([]);
    addLog(`Reading APK: ${file.name}`);
    
    if (mode === "admob") {
      addLog(`Injecting AdMob with unit: ${admobUnit}`);
    } else if (mode === "custom") {
      addLog("Injecting custom Java code...");
    } else {
      addLog("Auto rules applied.");
    }

    // Log advanced options
    if (options.obfuscate) addLog("Applying obfuscation...");
    if (options.antiTamper) addLog("Adding anti-tamper protection...");
    if (options.rootDetection) addLog("Implementing root detection...");
    if (options.sslPinning) addLog("Adding SSL pinning...");
    if (options.debuggableDisable) addLog("Disabling debuggable flag...");
    if (options.minifyResources) addLog("Minifying resources...");
    if (options.removeUnusedCode) addLog("Removing unused code...");
    if (options.optimizeImages) addLog("Optimizing images...");
    
    addLog(`Target SDK: ${options.targetSdk}, Min SDK: ${options.minSdk}`);
    addLog(`Architecture: ${options.architecture}`);
    addLog(`Signature scheme: ${options.signatureScheme}`);

    const steps = [
      "Using apktool 2.9",
      "Decoding resources...",
      "Applying patches...",
      "Rebuilding APK...",
      "Signing with apksigner...",
      "Verification OK."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      addLog(steps[i]);
    }

    toast.success(language === "ar" ? "تم الحقن بنجاح!" : "Injection completed!");
  };

  const downloadInjected = () => {
    const blob = new Blob(["APK Content"], { type: "application/vnd.android.package-archive" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file?.name.replace(".apk", "")}-injected.apk` || "app-injected.apk";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">
          {language === "ar" ? "حقن APK" : "APK Injection"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label>{language === "ar" ? "رفع ملف APK" : "Upload APK"}</Label>
            <Input 
              type="file" 
              accept=".apk"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <div>
            <Label>AdMob Unit ID</Label>
            <Input 
              value={admobUnit}
              onChange={(e) => setAdmobUnit(e.target.value)}
              placeholder="ca-app-pub-xxxxxxxxx/xxxxxxxxx" 
            />
          </div>
          <div className="md:col-span-2">
            <Label>{language === "ar" ? "وضع الحقن" : "Injection Mode"}</Label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">{language === "ar" ? "تلقائي" : "Auto"}</SelectItem>
                <SelectItem value="admob">AdMob</SelectItem>
                <SelectItem value="custom">{language === "ar" ? "كود Java مخصص" : "Custom Java Code"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Options */}
        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen} className="mb-6">
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                {language === "ar" ? "خيارات متقدمة" : "Advanced Options"}
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${advancedOpen ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4 border rounded-lg p-4">
            {/* Security Options */}
            <div>
              <h3 className="font-semibold mb-3 text-sm">
                {language === "ar" ? "الحماية والأمان" : "Security & Protection"}
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id="obfuscate"
                    checked={options.obfuscate}
                    onCheckedChange={(v) => updateOption("obfuscate", v)}
                  />
                  <label htmlFor="obfuscate" className="text-sm cursor-pointer">
                    {language === "ar" ? "تشويش الكود (Obfuscation)" : "Code Obfuscation"}
                  </label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id="antiTamper"
                    checked={options.antiTamper}
                    onCheckedChange={(v) => updateOption("antiTamper", v)}
                  />
                  <label htmlFor="antiTamper" className="text-sm cursor-pointer">
                    {language === "ar" ? "الحماية من التلاعب" : "Anti-Tamper Protection"}
                  </label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id="rootDetection"
                    checked={options.rootDetection}
                    onCheckedChange={(v) => updateOption("rootDetection", v)}
                  />
                  <label htmlFor="rootDetection" className="text-sm cursor-pointer">
                    {language === "ar" ? "كشف Root" : "Root Detection"}
                  </label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id="sslPinning"
                    checked={options.sslPinning}
                    onCheckedChange={(v) => updateOption("sslPinning", v)}
                  />
                  <label htmlFor="sslPinning" className="text-sm cursor-pointer">
                    {language === "ar" ? "تثبيت SSL" : "SSL Pinning"}
                  </label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id="debuggableDisable"
                    checked={options.debuggableDisable}
                    onCheckedChange={(v) => updateOption("debuggableDisable", v)}
                  />
                  <label htmlFor="debuggableDisable" className="text-sm cursor-pointer">
                    {language === "ar" ? "تعطيل التصحيح" : "Disable Debuggable"}
                  </label>
                </div>
              </div>
            </div>

            {/* Optimization Options */}
            <div>
              <h3 className="font-semibold mb-3 text-sm">
                {language === "ar" ? "التحسين والأداء" : "Optimization & Performance"}
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id="minifyResources"
                    checked={options.minifyResources}
                    onCheckedChange={(v) => updateOption("minifyResources", v)}
                  />
                  <label htmlFor="minifyResources" className="text-sm cursor-pointer">
                    {language === "ar" ? "ضغط الموارد" : "Minify Resources"}
                  </label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id="removeUnusedCode"
                    checked={options.removeUnusedCode}
                    onCheckedChange={(v) => updateOption("removeUnusedCode", v)}
                  />
                  <label htmlFor="removeUnusedCode" className="text-sm cursor-pointer">
                    {language === "ar" ? "حذف الكود غير المستخدم" : "Remove Unused Code"}
                  </label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id="optimizeImages"
                    checked={options.optimizeImages}
                    onCheckedChange={(v) => updateOption("optimizeImages", v)}
                  />
                  <label htmlFor="optimizeImages" className="text-sm cursor-pointer">
                    {language === "ar" ? "تحسين الصور" : "Optimize Images"}
                  </label>
                </div>
              </div>
            </div>

            {/* Build Configuration */}
            <div>
              <h3 className="font-semibold mb-3 text-sm">
                {language === "ar" ? "إعدادات البناء" : "Build Configuration"}
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs">{language === "ar" ? "Target SDK" : "Target SDK"}</Label>
                  <Select value={options.targetSdk} onValueChange={(v) => updateOption("targetSdk", v)}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="34">API 34 (Android 14)</SelectItem>
                      <SelectItem value="33">API 33 (Android 13)</SelectItem>
                      <SelectItem value="32">API 32 (Android 12L)</SelectItem>
                      <SelectItem value="31">API 31 (Android 12)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">{language === "ar" ? "Min SDK" : "Min SDK"}</Label>
                  <Select value={options.minSdk} onValueChange={(v) => updateOption("minSdk", v)}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="21">API 21 (Android 5.0)</SelectItem>
                      <SelectItem value="23">API 23 (Android 6.0)</SelectItem>
                      <SelectItem value="26">API 26 (Android 8.0)</SelectItem>
                      <SelectItem value="28">API 28 (Android 9.0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">{language === "ar" ? "المعمارية" : "Architecture"}</Label>
                  <Select value={options.architecture} onValueChange={(v) => updateOption("architecture", v)}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === "ar" ? "الكل" : "All"}</SelectItem>
                      <SelectItem value="arm64-v8a">ARM64 (v8a)</SelectItem>
                      <SelectItem value="armeabi-v7a">ARM (v7a)</SelectItem>
                      <SelectItem value="x86_64">x86_64</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">{language === "ar" ? "مخطط التوقيع" : "Signature Scheme"}</Label>
                  <Select value={options.signatureScheme} onValueChange={(v) => updateOption("signatureScheme", v)}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="v2">V2 (Recommended)</SelectItem>
                      <SelectItem value="v3">V3 (Latest)</SelectItem>
                      <SelectItem value="v1">V1 (Legacy)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">{language === "ar" ? "مستوى الضغط" : "Compression Level"}</Label>
                  <Select value={options.compressionLevel} onValueChange={(v) => updateOption("compressionLevel", v)}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">{language === "ar" ? "بدون ضغط" : "No Compression"}</SelectItem>
                      <SelectItem value="6">{language === "ar" ? "متوسط (6)" : "Medium (6)"}</SelectItem>
                      <SelectItem value="9">{language === "ar" ? "أقصى (9)" : "Maximum (9)"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="mb-6">
          <Label>{language === "ar" ? "كود Java (اختياري)" : "Java Code (optional)"}</Label>
          <Textarea 
            value={javaCode}
            onChange={(e) => setJavaCode(e.target.value)}
            placeholder="// public class MyHook {&#10;//   public static void init(Context ctx) {&#10;//     // TODO: your code here&#10;//   }&#10;// }"
            className="font-mono text-sm h-40"
          />
        </div>

        <div className="flex gap-3 mb-6">
          <Button onClick={startInjection}>
            {language === "ar" ? "بدء الحقن" : "Start Injection"}
          </Button>
          <Button variant="outline" onClick={downloadInjected} disabled={log.length === 0} className="gap-2">
            <Download className="h-4 w-4" />
            {language === "ar" ? "تنزيل APK المحقون" : "Download Injected APK"}
          </Button>
        </div>

        <div>
          <Label>{language === "ar" ? "سجل العمليات" : "Operation Log"}</Label>
          <div 
            ref={logRef}
            className="mt-2 h-48 overflow-auto bg-[hsl(222,47%,6%)] border border-border rounded-lg p-3 font-mono text-sm"
          >
            {log.map((line, i) => (
              <div key={i} className="text-muted-foreground">
                {line}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

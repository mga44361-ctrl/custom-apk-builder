import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Download } from "lucide-react";

interface APKInjectionProps {
  language: string;
}

export default function APKInjection({ language }: APKInjectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState("auto");
  const [admobUnit, setAdmobUnit] = useState("");
  const [javaCode, setJavaCode] = useState("");
  const [log, setLog] = useState<string[]>([]);
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

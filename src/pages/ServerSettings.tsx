import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

interface ServerSettingsProps {
  language: string;
}

export default function ServerSettings({ language }: ServerSettingsProps) {
  const [settings, setSettings] = useState({
    serverUrl: "",
    apiKey: "",
    jwtToken: "",
    smtpHost: "",
    smtpUser: "",
    smtpPassword: "",
    smtpPort: "465",
    smtpSecure: "true",
  });

  const updateSetting = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const testConnection = () => {
    toast.success(
      language === "ar" 
        ? "تم الاتصال بنجاح!" 
        : "Connection successful!",
      { icon: <CheckCircle2 className="h-5 w-5 text-success" /> }
    );
  };

  const saveSettings = () => {
    localStorage.setItem("siyanet:server-config", JSON.stringify(settings));
    toast.success(
      language === "ar" 
        ? "تم حفظ الإعدادات بنجاح" 
        : "Settings saved successfully"
    );
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">
          {language === "ar" ? "إعدادات الخادم الخارجي" : "External Server Settings"}
        </h2>

        <div className="space-y-6">
          {/* API Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {language === "ar" ? "إعدادات API" : "API Settings"}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Server URL</Label>
                <Input 
                  value={settings.serverUrl}
                  onChange={(e) => updateSetting("serverUrl", e.target.value)}
                  placeholder="https://api.siyanet.tech" 
                />
              </div>
              <div>
                <Label>API Key</Label>
                <Input 
                  value={settings.apiKey}
                  onChange={(e) => updateSetting("apiKey", e.target.value)}
                  placeholder="xxxxxxxx" 
                />
              </div>
              <div className="md:col-span-2">
                <Label>JWT Token</Label>
                <Input 
                  value={settings.jwtToken}
                  onChange={(e) => updateSetting("jwtToken", e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." 
                />
              </div>
            </div>
          </div>

          {/* SMTP Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {language === "ar" ? "إعدادات SMTP" : "SMTP Settings"}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>SMTP Host</Label>
                <Input 
                  value={settings.smtpHost}
                  onChange={(e) => updateSetting("smtpHost", e.target.value)}
                  placeholder="smtp.mailprovider.com" 
                />
              </div>
              <div>
                <Label>SMTP Username</Label>
                <Input 
                  value={settings.smtpUser}
                  onChange={(e) => updateSetting("smtpUser", e.target.value)}
                  placeholder="user@mail.com" 
                />
              </div>
              <div>
                <Label>SMTP Password</Label>
                <Input 
                  type="password"
                  value={settings.smtpPassword}
                  onChange={(e) => updateSetting("smtpPassword", e.target.value)}
                  placeholder="••••••••" 
                />
              </div>
              <div>
                <Label>SMTP Port</Label>
                <Input 
                  type="number"
                  value={settings.smtpPort}
                  onChange={(e) => updateSetting("smtpPort", e.target.value)}
                  placeholder="465" 
                />
              </div>
              <div className="md:col-span-2">
                <Label>{language === "ar" ? "نوع التشفير" : "Encryption Type"}</Label>
                <Select 
                  value={settings.smtpSecure} 
                  onValueChange={(v) => updateSetting("smtpSecure", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">SSL/TLS</SelectItem>
                    <SelectItem value="false">STARTTLS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={testConnection}>
            {language === "ar" ? "اختبار الاتصال" : "Test Connection"}
          </Button>
          <Button onClick={saveSettings}>
            {language === "ar" ? "حفظ الإعدادات" : "Save Settings"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wifi, Smartphone } from "lucide-react";
import { toast } from "sonner";

interface RepairProps {
  language: string;
  onOpenRepair: () => void;
}

export default function Repair({ language, onOpenRepair }: RepairProps) {
  const handleQuickAction = (action: string) => {
    toast.success(
      language === "ar" 
        ? `تم تنفيذ الإصلاح: ${action}` 
        : `Repair executed: ${action}`
    );
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Wifi className="h-6 w-6 text-primary" />
          {language === "ar" ? "الإصلاح السريع" : "Quick Repair"}
        </h2>
        <p className="text-muted-foreground mb-6">
          {language === "ar" 
            ? "استخدم مركز الإصلاح لإجراءات مفصلة أو اختر إجراء سريعاً" 
            : "Use Repair Center for detailed actions or pick a quick action"}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={onOpenRepair}>
            {language === "ar" ? "فتح مركز الإصلاح" : "Open Repair Center"}
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleQuickAction("network")}
            className="gap-2"
          >
            <Wifi className="h-4 w-4" />
            {language === "ar" ? "إصلاح الشبكة تلقائياً" : "Auto Network Repair"}
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleQuickAction("system")}
            className="gap-2"
          >
            <Smartphone className="h-4 w-4" />
            {language === "ar" ? "إصلاح النظام تلقائياً" : "Auto System Repair"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

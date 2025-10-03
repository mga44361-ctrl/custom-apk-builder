import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wifi, Smartphone, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface RepairModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: string;
}

export default function RepairModal({ open, onOpenChange, language }: RepairModalProps) {
  const handleAction = (action: string) => {
    toast.success(
      language === "ar" 
        ? `تم تنفيذ: ${action}` 
        : `Executed: ${action}`
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {language === "ar" ? "مركز الإصلاح" : "Repair Center"}
          </DialogTitle>
          <DialogDescription>
            {language === "ar" 
              ? "اختر الإجراء المناسب لحل المشكلة" 
              : "Choose the appropriate action to fix the issue"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Network Repair */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">
                {language === "ar" ? "إصلاح الشبكة" : "Network Repair"}
              </h3>
            </div>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start text-sm"
                onClick={() => handleAction("wipe-network")}
              >
                {language === "ar" ? "مسح ذاكرة الشبكة" : "Wipe Network Memory"}
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-sm"
                onClick={() => handleAction("reset-apn")}
              >
                {language === "ar" ? "إعادة ضبط APN" : "Reset APN"}
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-sm"
                onClick={() => handleAction("fix-imsi")}
              >
                {language === "ar" ? "إصلاح IMSI" : "Fix IMSI"}
              </Button>
            </div>
          </Card>

          {/* Android System Repair */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">
                {language === "ar" ? "إصلاح نظام أندرويد" : "Android System"}
              </h3>
            </div>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start text-sm"
                onClick={() => handleAction("wipe-cache")}
              >
                {language === "ar" ? "مسح ذاكرة التخزين" : "Wipe Cache"}
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-sm"
                onClick={() => handleAction("fix-root")}
              >
                {language === "ar" ? "إصلاح الجذر" : "Fix Root"}
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-sm"
                onClick={() => handleAction("soft-reset")}
              >
                {language === "ar" ? "إعادة ضبط ناعم" : "Soft Reset"}
              </Button>
            </div>
          </Card>

          {/* SIM Card Repair */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">
                {language === "ar" ? "إصلاح بطاقة SIM" : "SIM Card Repair"}
              </h3>
            </div>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start text-sm"
                onClick={() => handleAction("check-pin-puk")}
              >
                {language === "ar" ? "فحص PIN/PUK" : "Check PIN/PUK"}
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-sm"
                onClick={() => handleAction("reinit-sim")}
              >
                {language === "ar" ? "إعادة تهيئة البطاقة" : "Reinitialize SIM"}
              </Button>
            </div>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {language === "ar" ? "إغلاق" : "Close"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

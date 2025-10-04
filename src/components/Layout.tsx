import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Wrench, 
  Package, 
  Server, 
  Syringe, 
  Users,
  Menu,
  X,
  History
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  onViewChange: (view: string) => void;
  onOpenRepair: () => void;
  language: string;
  onLanguageChange: (lang: string) => void;
}

const navItems = [
  { id: "repair", icon: Wrench, labelAr: "إصلاح", labelEn: "Repair" },
  { id: "build", icon: Package, labelAr: "بناء APK", labelEn: "Build APK" },
  { id: "history", icon: History, labelAr: "سجل البناءات", labelEn: "Build History" },
  { id: "server", icon: Server, labelAr: "إعدادات الخادم", labelEn: "Server Settings" },
  { id: "inject", icon: Syringe, labelAr: "حقن APK", labelEn: "APK Injection" },
  { id: "clients", icon: Users, labelAr: "العملاء", labelEn: "Clients" },
];

export default function Layout({ 
  children, 
  activeView, 
  onViewChange, 
  onOpenRepair,
  language,
  onLanguageChange 
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:static inset-y-0 start-0 z-50",
          "w-72 lg:w-80",
          "bg-gradient-to-b from-sidebar-background to-[hsl(215,33%,10%)]",
          "border-e border-border",
          "flex flex-col",
          "transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-[hsl(185,84%,45%)] bg-clip-text text-transparent">
            صيانة تيك
          </h1>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => onLanguageChange("ar")}
                className={cn(
                  "px-3 py-1 text-xs transition-colors",
                  language === "ar" ? "bg-secondary text-secondary-foreground" : "hover:bg-secondary/50"
                )}
              >
                العربية
              </button>
              <button
                onClick={() => onLanguageChange("en")}
                className={cn(
                  "px-3 py-1 text-xs transition-colors",
                  language === "en" ? "bg-secondary text-secondary-foreground" : "hover:bg-secondary/50"
                )}
              >
                EN
              </button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  setSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg",
                  "transition-all duration-200",
                  "border border-border",
                  activeView === item.id
                    ? "bg-primary/20 border-primary text-primary"
                    : "hover:bg-secondary hover:border-primary/50"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {language === "ar" ? item.labelAr : item.labelEn}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            v1.0.0 • Siyanet Tech Platform
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-card px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-semibold">
              {language === "ar" ? "لوحة التحكم" : "Dashboard"}
            </h2>
          </div>
          <Button onClick={onOpenRepair} className="gap-2">
            <Wrench className="h-4 w-4" />
            {language === "ar" ? "مركز الإصلاح" : "Repair Center"}
          </Button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

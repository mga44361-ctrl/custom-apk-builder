import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import Layout from "@/components/Layout";
import RepairModal from "@/components/RepairModal";
import Repair from "@/pages/Repair";
import BuildAPK from "@/pages/BuildAPK";
import BuildHistory from "@/pages/BuildHistory";
import ServerSettings from "@/pages/ServerSettings";
import APKInjection from "@/pages/APKInjection";
import Clients from "@/pages/Clients";

const Index = () => {
  const [activeView, setActiveView] = useState("repair");
  const [repairModalOpen, setRepairModalOpen] = useState(false);
  const [language, setLanguage] = useState("ar");
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const renderView = () => {
    switch (activeView) {
      case "repair":
        return <Repair language={language} onOpenRepair={() => setRepairModalOpen(true)} />;
      case "build":
        return <BuildAPK language={language} />;
      case "history":
        return <BuildHistory language={language} />;
      case "server":
        return <ServerSettings language={language} />;
      case "inject":
        return <APKInjection language={language} />;
      case "clients":
        return <Clients language={language} />;
      default:
        return <Repair language={language} onOpenRepair={() => setRepairModalOpen(true)} />;
    }
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };

  return (
    <>
      <Layout
        activeView={activeView}
        onViewChange={setActiveView}
        onOpenRepair={() => setRepairModalOpen(true)}
        language={language}
        onLanguageChange={handleLanguageChange}
      >
        {renderView()}
      </Layout>

      <RepairModal
        open={repairModalOpen}
        onOpenChange={setRepairModalOpen}
        language={language}
      />
    </>
  );
};

export default Index;

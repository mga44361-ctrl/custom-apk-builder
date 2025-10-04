import { useState } from "react";
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

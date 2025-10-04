import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, MoreVertical, FolderOpen, Archive, Ungroup, Users, MessageSquare, ScreenShare } from "lucide-react";
import { toast } from "sonner";

interface ClientsProps {
  language: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  device: string;
  apps: string[];
  lastSeen: string;
}

// Sample data
const sampleClients: Client[] = [
  {
    id: "1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    device: "Samsung Galaxy S21",
    apps: ["App1", "App2"],
    lastSeen: "2025-01-10 14:30"
  },
  {
    id: "2",
    name: "فاطمة علي",
    email: "fatima@example.com",
    device: "Xiaomi Redmi Note 10",
    apps: ["App1"],
    lastSeen: "2025-01-09 10:15"
  },
];

export default function Clients({ language }: ClientsProps) {
  const [clients] = useState<Client[]>(sampleClients);
  const [filter, setFilter] = useState("");

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(filter.toLowerCase()) ||
    c.email.toLowerCase().includes(filter.toLowerCase()) ||
    c.device.toLowerCase().includes(filter.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ["ID", "Name", "Email", "Device", "Apps", "Last Seen"];
    const rows = filteredClients.map(c => [
      c.id, c.name, c.email, c.device, c.apps.join("; "), c.lastSeen
    ]);
    
    const csv = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clients.csv";
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(language === "ar" ? "تم تصدير CSV" : "CSV exported");
  };

  const exportXLSX = () => {
    toast.info(language === "ar" ? "سيتم دعم XLSX قريباً" : "XLSX support coming soon");
  };

  const handleClientAction = (action: string, clientName: string) => {
    const actions: Record<string, { ar: string; en: string }> = {
      files: { ar: "فتح الملفات", en: "Open Files" },
      zip: { ar: "ضغط الملفات", en: "Zip Files" },
      unzip: { ar: "فك الضغط", en: "Unzip Files" },
      contacts: { ar: "جهات الاتصال", en: "Contacts" },
      messages: { ar: "الرسائل", en: "Messages" },
      screen: { ar: "مشاركة الشاشة", en: "Screen Share" },
    };
    
    const actionName = actions[action];
    toast.success(
      language === "ar" 
        ? `${actionName.ar} - ${clientName}` 
        : `${actionName.en} - ${clientName}`
    );
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold">
            {language === "ar" ? "العملاء" : "Clients"}
          </h2>
          <div className="flex gap-3 w-full md:w-auto">
            <Input 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder={language === "ar" ? "بحث فوري..." : "Instant search..."}
              className="md:w-64"
            />
            <Button variant="outline" onClick={exportCSV} disabled={clients.length === 0} className="gap-2">
              <Download className="h-4 w-4" />
              CSV
            </Button>
            <Button variant="outline" onClick={exportXLSX} disabled={clients.length === 0} className="gap-2">
              <Download className="h-4 w-4" />
              Excel
            </Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === "ar" ? "المعرف" : "ID"}</TableHead>
                <TableHead>{language === "ar" ? "الاسم" : "Name"}</TableHead>
                <TableHead>{language === "ar" ? "البريد" : "Email"}</TableHead>
                <TableHead>{language === "ar" ? "الجهاز" : "Device"}</TableHead>
                <TableHead>{language === "ar" ? "التطبيقات" : "Apps"}</TableHead>
                <TableHead>{language === "ar" ? "آخر اتصال" : "Last Seen"}</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-mono">{client.id}</TableCell>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.device}</TableCell>
                    <TableCell>{client.apps.join(", ")}</TableCell>
                    <TableCell className="text-muted-foreground">{client.lastSeen}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleClientAction('files', client.name)} className="gap-2">
                            <FolderOpen className="h-4 w-4" />
                            {language === "ar" ? "الملفات" : "Files"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleClientAction('zip', client.name)} className="gap-2">
                            <Archive className="h-4 w-4" />
                            {language === "ar" ? "ضغط الملفات (Zip)" : "Zip Files"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleClientAction('unzip', client.name)} className="gap-2">
                            <Ungroup className="h-4 w-4" />
                            {language === "ar" ? "فك الضغط (Unzip)" : "Unzip Files"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleClientAction('contacts', client.name)} className="gap-2">
                            <Users className="h-4 w-4" />
                            {language === "ar" ? "جهات الاتصال" : "Contacts"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleClientAction('messages', client.name)} className="gap-2">
                            <MessageSquare className="h-4 w-4" />
                            {language === "ar" ? "الرسائل" : "Messages"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleClientAction('screen', client.name)} className="gap-2">
                            <ScreenShare className="h-4 w-4" />
                            {language === "ar" ? "مشاركة الشاشة" : "Screen Share"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    {language === "ar" ? "لا توجد بيانات" : "No data"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

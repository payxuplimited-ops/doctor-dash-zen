import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { NotificationBell } from "@/components/NotificationBell";
import { UserProfile } from "@/components/UserProfile";
import { useIsMobile } from "@/hooks/use-mobile";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();
const App = () => {
  return <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>;
};
const AppLayout = () => {
  const isMobile = useIsMobile();
  return <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b bg-background mx-0 px-[16px]">
            <div className="flex items-center">
              {!isMobile}
              <div className={isMobile ? "ml-0" : "ml-4"}>
                <h2 className={`font-semibold ${isMobile ? "text-sm" : ""}`}>
                  {isMobile ? "Gestión Médica" : "Sistema de Gestión Médica"}
                </h2>
              </div>
            </div>
            <div className={`flex items-center ${isMobile ? "gap-1" : "gap-2"}`}>
              <NotificationBell />
              <UserProfile />
            </div>
          </header>
          <main className={`flex-1 bg-muted/20 ${isMobile ? "p-2" : "p-6"}`}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/appointments" element={<Appointments />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>;
};
export default App;
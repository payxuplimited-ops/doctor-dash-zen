import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { NotificationBell } from "@/components/NotificationBell";
import { UserProfile } from "@/components/UserProfile";
import { useIsMobile } from "@/hooks/use-mobile";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import { LoginForm } from "@/components/LoginForm";

const queryClient = new QueryClient();

// Este es el componente principal que gestiona el estado de autenticación.
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verifica si hay un token válido en el localStorage al cargar la página.
    // Una vez que el login sea exitoso, el token se guardará aquí.
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Si no está autenticado, solo renderiza el formulario de login.
  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <LoginForm onLoginSuccess={() => window.location.reload()} />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Si está autenticado, renderiza toda la aplicación con sus rutas.
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// Componente que renderiza el diseño de la aplicación y el enrutamiento.
const AppLayout = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload(); 
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b bg-background px-4">
            <div className="flex items-center">
              {!isMobile && <SidebarTrigger />}
              <div className={isMobile ? "ml-0" : "ml-4"}>
                <h2 className={`font-semibold ${isMobile ? "text-sm" : ""}`}>
                  {isMobile ? "Gestión Médica" : "Sistema de Gestión Médica"}
                </h2>
              </div>
            </div>
            <div className={`flex items-center ${isMobile ? "gap-1" : "gap-2"}`}>
              <NotificationBell />
              <UserProfile onLogout={handleLogout} />
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
    </SidebarProvider>
  );
};

export default App;

import { useState } from "react";
import { User, Settings, LogOut, Shield, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface UserData {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export function UserProfile() {
  const { toast } = useToast();
  
  // Mock user data - in a real app this would come from authentication context
  const [user] = useState<UserData>({
    name: "Dr. María González",
    email: "maria.gonzalez@clinic.com",
    role: "Médico Principal",
    avatar: undefined // Will use fallback initials
  });

  const handleProfileAction = (action: string) => {
    toast({
      title: "Acción de Perfil",
      description: `${action} - Funcionalidad disponible próximamente`,
    });
  };

  const handleLogout = () => {
    toast({
      title: "Cerrando Sesión",
      description: "Has cerrado sesión exitosamente",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-0" align="end" forceMount>
        <div className="flex items-center space-x-2 p-4 border-b">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.role}
            </p>
          </div>
        </div>
        
        <div className="p-1">
          <DropdownMenuLabel className="px-2 py-1.5 text-sm text-muted-foreground">
            Mi Cuenta
          </DropdownMenuLabel>
          
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => handleProfileAction("Ver Perfil")}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Ver Perfil</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => handleProfileAction("Configuración")}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Configuración</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => handleProfileAction("Privacidad")}
          >
            <Shield className="mr-2 h-4 w-4" />
            <span>Privacidad</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => handleProfileAction("Ayuda")}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Ayuda y Soporte</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar Sesión</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
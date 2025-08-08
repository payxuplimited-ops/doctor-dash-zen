import { useEffect, useState } from "react";
import axios from "axios";
import { Clock, User, Phone, CalendarCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Appointment {
  id: string;
  patientName: string;
  time: string;
  type: string;
  status: "confirmada" | "pendiente" | "completada" | "cancelada";
  phone?: string;
  date: string;
}

const statusColors = {
  confirmada: "success",
  pendiente: "warning",
  completada: "default",
  cancelada: "destructive",
} as const;

export function AppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Obtenemos el token del localStorage para evitar el error 401 recurrente
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("No se encontró el token de autenticación.");
        }

        const response = await axios.get("/api/citas", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const allAppointments = response.data;

        // Modificación: calculamos la fecha de hoy sin problemas de zona horaria
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const today = `${year}-${month}-${day}`;

        // Filtra las citas para el día de hoy
        const appointmentsToday = allAppointments.filter((app: any) => {
            const appointmentDate = app.dia_y_hora.slice(0, 10);
            return appointmentDate === today;
        });

        // Mapea los datos del backend al formato que el frontend espera
        const mappedAppointments = appointmentsToday.map((app: any) => ({
            id: app.id,
            patientName: app.paciente_nombre,
            time: app.dia_y_hora.slice(11, 16),
            type: "Consulta General",
            status: app.estado.toLowerCase() as "confirmada" | "pendiente" | "completada" | "cancelada",
            date: app.dia_y_hora.slice(0, 10),
            phone: "N/A",
        }));

        setAppointments(mappedAppointments);
      } catch (err) {
        setError("Error al cargar las citas.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Cargando citas...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (appointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Citas de Hoy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">No hay citas programadas para hoy.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Citas de Hoy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-center justify-center w-16 h-16 bg-primary/10 rounded-lg">
                  <span className="text-sm font-medium text-primary">{appointment.time}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{appointment.patientName}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {appointment.type}
                  </p>
                  {appointment.phone && (
                    <div className="flex items-center gap-1 mt-1">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{appointment.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={statusColors[appointment.status]}>
                  {appointment.status}
                </Badge>
                <Button variant="outline" size="sm">
                  Ver
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

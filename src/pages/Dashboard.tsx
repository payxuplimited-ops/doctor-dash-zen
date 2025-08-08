import { useEffect, useState } from "react";
import axios from "axios";
import { AppointmentsList } from "@/components/AppointmentsList";
import { Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface Appointment {
  id: string;
  patientName: string;
  time: string;
  type: string;
  status: "confirmada" | "pendiente" | "completada" | "cancelada";
  phone?: string;
  date: string;
}

function Dashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate("/login"); 
          return;
        }

        const response = await axios.get("http://localhost:3000/api/citas", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const allAppointments = response.data;

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const today = `${year}-${month}-${day}`;

        const appointmentsToday = allAppointments.filter((app: any) => {
            const appointmentDate = app.dia_y_hora.slice(0, 10);
            return appointmentDate === today;
        });

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
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          // Si el error es 401, el token es inválido. Borra el token y redirige.
          localStorage.removeItem("token");
          // La recarga se maneja en App.tsx, por lo que aquí solo informamos del error
          setError("Tu sesión ha expirado, por favor inicia sesión de nuevo.");
          window.location.reload(); // Fuerza la recarga para que App.tsx detecte el cambio de token
        } else {
          setError("Error al cargar las citas.");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [navigate]);

  if (loading) {
    return <p className="text-center text-gray-500">Cargando citas...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Citas de Hoy
          </CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length > 0 ? (
            <AppointmentsList appointments={appointments} />
          ) : (
            <p className="text-center text-gray-500">No hay citas programadas para hoy.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;

import { Clock, User, Phone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Appointment {
  id: string
  patientName: string
  time: string
  type: string
  status: "confirmada" | "pendiente" | "completada" | "cancelada"
  phone?: string
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "María González",
    time: "09:00",
    type: "Consulta General",
    status: "confirmada",
    phone: "+52 555 0123"
  },
  {
    id: "2", 
    patientName: "Carlos Ruiz",
    time: "10:30",
    type: "Seguimiento",
    status: "pendiente",
    phone: "+52 555 0124"
  },
  {
    id: "3",
    patientName: "Ana López",
    time: "11:15",
    type: "Chequeo Preventivo",
    status: "confirmada",
    phone: "+52 555 0125"
  },
  {
    id: "4",
    patientName: "Roberto Silva",
    time: "14:00",
    type: "Consulta Especializada",
    status: "completada",
    phone: "+52 555 0126"
  }
]

const statusColors = {
  confirmada: "success",
  pendiente: "warning",
  completada: "default",
  cancelada: "destructive"
} as const

export function AppointmentsList() {
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
          {mockAppointments.map((appointment) => (
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
  )
}
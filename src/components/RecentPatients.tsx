import { User, Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface Patient {
  id: string
  name: string
  lastVisit: string
  nextAppointment?: string
  condition: string
  initials: string
}

const mockPatients: Patient[] = [
  {
    id: "1",
    name: "María González",
    lastVisit: "2024-01-15",
    nextAppointment: "2024-01-22",
    condition: "Hipertensión",
    initials: "MG"
  },
  {
    id: "2",
    name: "Carlos Ruiz", 
    lastVisit: "2024-01-14",
    condition: "Diabetes Tipo 2",
    initials: "CR"
  },
  {
    id: "3",
    name: "Ana López",
    lastVisit: "2024-01-13",
    nextAppointment: "2024-01-20",
    condition: "Chequeo Preventivo",
    initials: "AL"
  },
  {
    id: "4",
    name: "Roberto Silva",
    lastVisit: "2024-01-12",
    condition: "Consulta General",
    initials: "RS"
  }
]

export function RecentPatients() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Pacientes Recientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockPatients.map((patient) => (
            <div
              key={patient.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {patient.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-sm text-muted-foreground">{patient.condition}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Última: {new Date(patient.lastVisit).toLocaleDateString()}
                      </span>
                    </div>
                    {patient.nextAppointment && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-success" />
                        <span className="text-xs text-success">
                          Próxima: {new Date(patient.nextAppointment).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Ver
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
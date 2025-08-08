import { 
  Users, 
  Calendar, 
  Stethoscope, 
  TrendingUp, 
  Activity,
  Clock
} from "lucide-react"
import { StatCard } from "@/components/StatCard"
import { AppointmentsList } from "@/components/AppointmentsList"
import { RecentPatients } from "@/components/RecentPatients"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen de la actividad del consultorio médico
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pacientes Totales"
          value="1,284"
          icon={Users}
          description="Pacientes registrados"
          trend={{ value: 12, isPositive: true }}
          variant="default"
        />
        <StatCard
          title="Citas Hoy"
          value="8"
          icon={Calendar}
          description="Citas programadas"
          variant="success"
        />
        <StatCard
          title="Consultas del Mes"
          value="156"
          icon={Stethoscope}
          description="Consultas realizadas"
          trend={{ value: 8, isPositive: true }}
          variant="default"
        />
        <StatCard
          title="Tasa de Asistencia"
          value="94%"
          icon={TrendingUp}
          description="Promedio mensual"
          trend={{ value: 2, isPositive: true }}
          variant="success"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <AppointmentsList />
        <RecentPatients />
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Tiempo Promedio"
          value="25 min"
          icon={Clock}
          description="Por consulta"
          variant="default"
        />
        <StatCard
          title="Pacientes Nuevos"
          value="23"
          icon={Users}
          description="Este mes"
          trend={{ value: 15, isPositive: true }}
          variant="success"
        />
        <StatCard
          title="Seguimientos"
          value="45"
          icon={Activity}
          description="Pendientes"
          variant="warning"
        />
      </div>
    </div>
  )
}
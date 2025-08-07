import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import { Plus, Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppointmentEvent extends EventInput {
  id: string;
  title: string;
  start: string;
  end?: string;
  patientName?: string;
  description?: string;
  phone?: string;
}

const initialEvents: AppointmentEvent[] = [
  {
    id: '1',
    title: 'Juan Pérez - Consulta General',
    start: '2024-12-10T09:00:00',
    end: '2024-12-10T09:30:00',
    patientName: 'Juan Pérez',
    description: 'Consulta de rutina',
    phone: '+1234567890'
  },
  {
    id: '2',
    title: 'María García - Seguimiento',
    start: '2024-12-10T14:00:00',
    end: '2024-12-10T14:30:00',
    patientName: 'María García',
    description: 'Seguimiento post-cirugía',
    phone: '+0987654321'
  },
  {
    id: '3',
    title: 'Carlos Rodríguez - Control',
    start: '2024-12-11T10:00:00',
    end: '2024-12-11T10:30:00',
    patientName: 'Carlos Rodríguez',
    description: 'Control de presión arterial',
    phone: '+1122334455'
  }
];

export default function Appointments() {
  const [events, setEvents] = useState<AppointmentEvent[]>(initialEvents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    phone: '',
    description: '',
    date: '',
    time: ''
  });
  
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const selectedDateTime = selectInfo.start.toISOString().split('T')[0];
    setSelectedDate(selectedDateTime);
    setNewAppointment(prev => ({
      ...prev,
      date: selectedDateTime,
      time: '09:00'
    }));
    setIsDialogOpen(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    toast({
      title: "Cita Seleccionada",
      description: `${event.title} - ${event.start?.toLocaleString()}`,
    });
  };

  const handleAddAppointment = () => {
    if (!newAppointment.patientName || !newAppointment.date || !newAppointment.time) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    const startDateTime = `${newAppointment.date}T${newAppointment.time}:00`;
    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + 30);

    const newEvent: AppointmentEvent = {
      id: Date.now().toString(),
      title: `${newAppointment.patientName} - Consulta`,
      start: startDateTime,
      end: endDateTime.toISOString(),
      patientName: newAppointment.patientName,
      description: newAppointment.description,
      phone: newAppointment.phone
    };

    setEvents(prev => [...prev, newEvent]);
    setIsDialogOpen(false);
    setNewAppointment({
      patientName: '',
      phone: '',
      description: '',
      date: '',
      time: ''
    });

    toast({
      title: "Cita Agendada",
      description: `Cita para ${newAppointment.patientName} creada exitosamente`,
    });
  };

  const openNewAppointmentDialog = () => {
    const today = new Date().toISOString().split('T')[0];
    setNewAppointment(prev => ({
      ...prev,
      date: today,
      time: '09:00'
    }));
    setIsDialogOpen(true);
  };

  return (
    <div className={`${isMobile ? 'space-y-3' : 'space-y-6'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between ${isMobile ? 'flex-col gap-3' : ''}`}>
        <div className={isMobile ? 'text-center' : ''}>
          <h1 className={`font-bold tracking-tight ${isMobile ? 'text-xl' : 'text-3xl'}`}>
            {isMobile ? 'Citas' : 'Citas Médicas'}
          </h1>
          <p className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>
            {isMobile ? 'Gestiona citas' : 'Gestiona y programa las citas del consultorio'}
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewAppointmentDialog} className={`gap-2 ${isMobile ? 'text-sm px-3 py-2' : ''}`}>
              <Plus className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
              {isMobile ? 'Nueva' : 'Nueva Cita'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Agendar Nueva Cita</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="patientName" className="text-right">
                  Paciente *
                </Label>
                <Input
                  id="patientName"
                  value={newAppointment.patientName}
                  onChange={(e) => setNewAppointment(prev => ({
                    ...prev,
                    patientName: e.target.value
                  }))}
                  className="col-span-3"
                  placeholder="Nombre del paciente"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  value={newAppointment.phone}
                  onChange={(e) => setNewAppointment(prev => ({
                    ...prev,
                    phone: e.target.value
                  }))}
                  className="col-span-3"
                  placeholder="Número de teléfono"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Fecha *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) => setNewAppointment(prev => ({
                    ...prev,
                    date: e.target.value
                  }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Hora *
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={newAppointment.time}
                  onChange={(e) => setNewAppointment(prev => ({
                    ...prev,
                    time: e.target.value
                  }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Descripción
                </Label>
                <Textarea
                  id="description"
                  value={newAppointment.description}
                  onChange={(e) => setNewAppointment(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  className="col-span-3"
                  placeholder="Motivo de la consulta"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddAppointment}>
                Agendar Cita
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar Card */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendario de Citas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className={`w-full calendar-container ${isMobile ? 'p-2' : 'p-4'}`}>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={isMobile ? {
                left: 'prev,next',
                center: 'title',
                right: 'today'
              } : {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              initialView="dayGridMonth"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={isMobile ? 2 : true}
              weekends={true}
              events={events}
              select={handleDateSelect}
              eventClick={handleEventClick}
              height="auto"
              locale="es"
              buttonText={{
                today: 'Hoy',
                month: 'Mes',
                week: 'Semana',
                day: 'Día'
              }}
              slotMinTime="08:00:00"
              slotMaxTime="20:00:00"
              businessHours={{
                daysOfWeek: [1, 2, 3, 4, 5, 6],
                startTime: '08:00',
                endTime: '18:00'
              }}
              eventColor="hsl(var(--primary))"
              eventBackgroundColor="hsl(var(--primary))"
              eventBorderColor="hsl(var(--primary))"
              eventTextColor="hsl(var(--primary-foreground))"
              aspectRatio={isMobile ? 1.0 : 1.35}
              contentHeight={isMobile ? "auto" : undefined}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
        <Card>
          <CardContent className={`flex items-center ${isMobile ? 'p-4' : 'p-6'}`}>
            <Calendar className={`text-primary ${isMobile ? 'h-6 w-6' : 'h-8 w-8'}`} />
            <div className={isMobile ? 'ml-3' : 'ml-4'}>
              <p className={`font-medium text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>Citas Hoy</p>
              <p className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'}`}>{events.filter(event => {
                const today = new Date().toISOString().split('T')[0];
                return event.start?.includes(today);
              }).length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className={`flex items-center ${isMobile ? 'p-4' : 'p-6'}`}>
            <Clock className={`text-success ${isMobile ? 'h-6 w-6' : 'h-8 w-8'}`} />
            <div className={isMobile ? 'ml-3' : 'ml-4'}>
              <p className={`font-medium text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>Esta Semana</p>
              <p className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'}`}>{events.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className={`flex items-center ${isMobile ? 'p-4' : 'p-6'}`}>
            <User className={`text-warning ${isMobile ? 'h-6 w-6' : 'h-8 w-8'}`} />
            <div className={isMobile ? 'ml-3' : 'ml-4'}>
              <p className={`font-medium text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>Pacientes Únicos</p>
              <p className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'}`}>{new Set(events.map(e => e.patientName)).size}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
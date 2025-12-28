import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { HealthAIChatbot } from '@/components/chat/HealthAIChatbot';
import {
  Stethoscope,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  MessageCircle,
  Star,
  Wifi,
  Bot
} from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  available: boolean;
  experience: string;
}

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: Date;
  time: string;
  status: 'confirmed' | 'pending' | 'completed';
}

const demoDoctors: Doctor[] = [
  { id: 'doc-001', name: 'Dr. Sarah Wanjiku', specialty: 'General Practitioner', rating: 4.8, available: true, experience: '12 years' },
  { id: 'doc-002', name: 'Dr. James Ochieng', specialty: 'Pediatrician', rating: 4.9, available: true, experience: '8 years' },
  { id: 'doc-003', name: 'Dr. Fatima Hassan', specialty: 'Nutritionist', rating: 4.7, available: false, experience: '6 years' },
  { id: 'doc-004', name: 'Dr. Peter Kimani', specialty: 'Mental Health', rating: 4.9, available: true, experience: '15 years' },
];

const availableTimes = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'];

export default function Consultation() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(demoDoctors[0]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 'apt-001', doctorName: 'Dr. James Ochieng', specialty: 'Pediatrician', date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), time: '10:00 AM', status: 'confirmed' },
  ]);

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      toast({ title: "Missing Information", description: "Please select a doctor, date, and time", variant: "destructive" });
      return;
    }
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      date: selectedDate,
      time: selectedTime,
      status: 'confirmed',
    };
    setAppointments(prev => [...prev, newAppointment]);
    toast({ title: "✅ Appointment Booked!", description: `${selectedDoctor.name} on ${selectedDate.toLocaleDateString()} at ${selectedTime}` });
    setSelectedDate(undefined);
    setSelectedTime('');
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
              <Stethoscope className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Virtual Consultation</h1>
              <p className="text-muted-foreground">AI Health Assistant & Doctor Booking</p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1 bg-success/10 text-success border-success/30">
            <Wifi className="w-3 h-3" />
            Online
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="chat" className="flex flex-col gap-1 py-3">
              <Bot className="w-4 h-4" />
              <span className="text-xs">AI Health Chat</span>
            </TabsTrigger>
            <TabsTrigger value="book" className="flex flex-col gap-1 py-3">
              <CalendarIcon className="w-4 h-4" />
              <span className="text-xs">Book Doctor</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex flex-col gap-1 py-3">
              <Clock className="w-4 h-4" />
              <span className="text-xs">Appointments</span>
            </TabsTrigger>
          </TabsList>

          {/* AI Health Chat Tab */}
          <TabsContent value="chat" className="mt-4">
            <div className="h-[600px]">
              <HealthAIChatbot />
            </div>
          </TabsContent>

          {/* Book Appointment Tab */}
          <TabsContent value="book" className="space-y-4 mt-4">
            <Card className="border-0 shadow-elegant">
              <CardHeader>
                <CardTitle className="text-lg">Select a Doctor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {demoDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedDoctor.id === doctor.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    } ${!doctor.available ? 'opacity-50' : ''}`}
                    onClick={() => doctor.available && setSelectedDoctor(doctor)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {doctor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">{doctor.name}</h4>
                        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="w-3 h-3 fill-warning text-warning" />
                          <span className="text-xs">{doctor.rating}</span>
                        </div>
                      </div>
                      {selectedDoctor.id === doctor.id && <CheckCircle className="w-5 h-5 text-primary" />}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-0 shadow-elegant">
                <CardHeader><CardTitle className="text-lg">Select Date</CardTitle></CardHeader>
                <CardContent>
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} disabled={(date) => date < new Date() || date.getDay() === 0} className="rounded-md border" />
                </CardContent>
              </Card>
              <Card className="border-0 shadow-elegant">
                <CardHeader><CardTitle className="text-lg">Select Time</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {availableTimes.map((time) => (
                      <Button key={time} variant={selectedTime === time ? 'default' : 'outline'} className="w-full" onClick={() => setSelectedTime(time)}>{time}</Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button className="w-full h-14 text-lg" onClick={handleBookAppointment} disabled={!selectedDate || !selectedTime}>
              <CalendarIcon className="w-5 h-5 mr-2" />Book Appointment
            </Button>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-4 mt-4">
            {appointments.length === 0 ? (
              <Card className="border-0 shadow-elegant">
                <CardContent className="p-8 text-center">
                  <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No Appointments</h3>
                  <p className="text-muted-foreground">Book your first appointment</p>
                </CardContent>
              </Card>
            ) : (
              appointments.map((apt) => (
                <Card key={apt.id} className="border-0 shadow-elegant">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Stethoscope className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{apt.doctorName}</h4>
                        <p className="text-sm text-muted-foreground">{apt.specialty}</p>
                        <p className="text-sm">{apt.date.toLocaleDateString()} at {apt.time}</p>
                      </div>
                      <Badge className="bg-success/10 text-success border-success/30">{apt.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

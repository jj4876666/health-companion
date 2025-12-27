import { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import {
  Stethoscope,
  Send,
  Video,
  Phone,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  User,
  MessageCircle,
  Star,
  Wifi,
  WifiOff,
  Bot,
  Loader2
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'doctor';
  content: string;
  timestamp: Date;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  available: boolean;
  image?: string;
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
  {
    id: 'doc-001',
    name: 'Dr. Sarah Wanjiku',
    specialty: 'General Practitioner',
    rating: 4.8,
    available: true,
    experience: '12 years',
  },
  {
    id: 'doc-002',
    name: 'Dr. James Ochieng',
    specialty: 'Pediatrician',
    rating: 4.9,
    available: true,
    experience: '8 years',
  },
  {
    id: 'doc-003',
    name: 'Dr. Fatima Hassan',
    specialty: 'Nutritionist',
    rating: 4.7,
    available: false,
    experience: '6 years',
  },
  {
    id: 'doc-004',
    name: 'Dr. Peter Kimani',
    specialty: 'Mental Health',
    rating: 4.9,
    available: true,
    experience: '15 years',
  },
];

const doctorResponses = [
  "I understand your concern. Can you tell me more about when these symptoms started?",
  "That's helpful information. Have you noticed any patterns, like certain times of day when it's worse?",
  "Based on what you've described, I'd recommend staying hydrated and getting plenty of rest. If symptoms persist for more than 3 days, please visit a health facility.",
  "It's important to monitor your symptoms. Keep track of any changes and don't hesitate to seek emergency care if you experience severe symptoms.",
  "I'm glad you reached out. For this type of concern, I'd suggest scheduling an in-person appointment for a proper examination.",
  "That's a good question! Maintaining a balanced diet and regular exercise can help with that. Would you like some specific recommendations?",
  "Remember to take any prescribed medications as directed. Is there anything else you'd like to discuss today?",
];

export default function Consultation() {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'doctor',
      content: "Hello! I'm Dr. Sarah Wanjiku. How can I help you today? Please describe your symptoms or health concerns.",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(demoDoctors[0]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'apt-001',
      doctorName: 'Dr. James Ochieng',
      specialty: 'Pediatrician',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      time: '10:00 AM',
      status: 'confirmed',
    },
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isOnline] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate doctor typing delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));

    const doctorResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'doctor',
      content: doctorResponses[Math.floor(Math.random() * doctorResponses.length)],
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, doctorResponse]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const availableTimes = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '2:00 PM', '2:30 PM', '3:00 PM',
    '3:30 PM', '4:00 PM',
  ];

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime || !selectedDoctor) {
      toast({
        title: "Missing Information",
        description: "Please select a doctor, date, and time",
        variant: "destructive",
      });
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
    toast({
      title: "✅ Appointment Booked!",
      description: `${selectedDoctor.name} on ${selectedDate.toLocaleDateString()} at ${selectedTime}`,
    });
    setSelectedDate(undefined);
    setSelectedTime('');
  };

  const handleVideoCall = () => {
    toast({
      title: "📹 Video Call",
      description: "Starting video consultation... (Simulated for demo)",
    });
  };

  const handleVoiceCall = () => {
    toast({
      title: "📞 Voice Call",
      description: "Connecting to doctor... (Simulated for demo)",
    });
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
              <p className="text-muted-foreground">Connect with healthcare professionals</p>
            </div>
          </div>
          <Badge variant="outline" className={`gap-1 ${isOnline ? 'bg-success/10 text-success border-success/30' : 'bg-muted'}`}>
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
        </div>

        {/* Demo Banner */}
        <Badge variant="outline" className="bg-warning/10 text-warning-foreground border-warning/30">
          Demo Mode – Simulated doctor responses for demonstration
        </Badge>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="chat" className="flex flex-col gap-1 py-3">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="book" className="flex flex-col gap-1 py-3">
              <CalendarIcon className="w-4 h-4" />
              <span className="text-xs">Book</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex flex-col gap-1 py-3">
              <Clock className="w-4 h-4" />
              <span className="text-xs">My Appointments</span>
            </TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-4">
            {/* Doctor Info */}
            <Card className="border-0 shadow-elegant">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border-2 border-success">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {selectedDoctor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{selectedDoctor.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedDoctor.specialty}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 fill-warning text-warning" />
                        <span className="text-xs">{selectedDoctor.rating}</span>
                        <Badge variant="outline" className="text-xs ml-2 bg-success/10 text-success border-success/30">
                          Online
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="outline" onClick={handleVoiceCall}>
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="outline" onClick={handleVideoCall}>
                      <Video className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chat Messages */}
            <Card className="border-0 shadow-elegant">
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-4 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-br-md'
                            : 'bg-muted rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-2xl rounded-bl-md p-4">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm text-muted-foreground">Dr. {selectedDoctor.name.split(' ')[1]} is typing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Describe your symptoms..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isTyping}
                  />
                  <Button onClick={handleSendMessage} disabled={isTyping || !inputMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Book Appointment Tab */}
          <TabsContent value="book" className="space-y-4">
            {/* Select Doctor */}
            <Card className="border-0 shadow-elegant">
              <CardHeader>
                <CardTitle className="text-lg">Select a Doctor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {demoDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedDoctor.id === doctor.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
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
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{doctor.name}</h4>
                          {!doctor.available && (
                            <Badge variant="secondary" className="text-xs">Unavailable</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="w-3 h-3 fill-warning text-warning" />
                          <span className="text-xs">{doctor.rating}</span>
                          <span className="text-xs text-muted-foreground">• {doctor.experience}</span>
                        </div>
                      </div>
                      {selectedDoctor.id === doctor.id && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Select Date & Time */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-lg">Select Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-lg">Select Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {availableTimes.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? 'default' : 'outline'}
                        className="w-full"
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Book Button */}
            <Button
              className="w-full h-14 text-lg"
              onClick={handleBookAppointment}
              disabled={!selectedDate || !selectedTime}
            >
              <CalendarIcon className="w-5 h-5 mr-2" />
              Book Appointment
            </Button>
          </TabsContent>

          {/* My Appointments Tab */}
          <TabsContent value="appointments" className="space-y-4">
            {appointments.length === 0 ? (
              <Card className="border-0 shadow-elegant">
                <CardContent className="p-8 text-center">
                  <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No Appointments</h3>
                  <p className="text-muted-foreground">Book your first appointment with a doctor</p>
                </CardContent>
              </Card>
            ) : (
              appointments.map((apt) => (
                <Card key={apt.id} className="border-0 shadow-elegant">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Stethoscope className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{apt.doctorName}</h4>
                          <p className="text-sm text-muted-foreground">{apt.specialty}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <CalendarIcon className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs">{apt.date.toLocaleDateString()}</span>
                            <Clock className="w-3 h-3 text-muted-foreground ml-2" />
                            <span className="text-xs">{apt.time}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={`${
                        apt.status === 'confirmed' 
                          ? 'bg-success/10 text-success border-success/30' 
                          : apt.status === 'completed'
                            ? 'bg-muted text-muted-foreground'
                            : 'bg-warning/10 text-warning-foreground border-warning/30'
                      }`}>
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </Badge>
                    </div>
                    {apt.status === 'confirmed' && (
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" className="flex-1" onClick={handleVoiceCall}>
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                        <Button className="flex-1" onClick={handleVideoCall}>
                          <Video className="w-4 h-4 mr-2" />
                          Video Call
                        </Button>
                      </div>
                    )}
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
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Calendar,
  Droplets,
  AlertTriangle,
  Pill,
  Stethoscope,
  FileText,
  Shield,
  QrCode,
  Hospital,
  CheckCircle
} from 'lucide-react';

interface MedicalRecordProps {
  patient: {
    name: string;
    emecId: string;
    age: number;
    gender?: string;
    bloodGroup: string;
    allergies: string[];
    medications: string[];
    medicalConditions: string[];
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
    isVerified?: boolean;
  };
  facilityName?: string;
  recordDate?: Date;
}

export function MedicalRecordCard({ patient, facilityName = "EMEC Health System", recordDate = new Date() }: MedicalRecordProps) {
  return (
    <Card className="border-2 border-primary/20 overflow-hidden bg-gradient-to-b from-background to-muted/20">
      {/* Official Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Hospital className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">MEDICAL RECORD</h2>
              <p className="text-sm opacity-90">Electronic Medical & Education Companion</p>
            </div>
          </div>
          <div className="text-right">
            <Badge className="bg-white/20 text-white border-0">
              <Shield className="w-3 h-3 mr-1" />
              OFFICIAL
            </Badge>
          </div>
        </div>
      </div>

      <CardContent className="p-0">
        {/* Patient ID Section */}
        <div className="p-4 bg-muted/30 border-b flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg border-2 border-primary/30 bg-background flex items-center justify-center">
              <QrCode className="w-10 h-10 text-primary/50" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">EMEC Patient ID</p>
              <p className="font-mono text-xl font-bold text-primary">{patient.emecId}</p>
              {patient.isVerified && (
                <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30 mt-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified Patient
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right text-sm">
            <p className="text-muted-foreground">Record Date</p>
            <p className="font-medium">{recordDate.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}</p>
          </div>
        </div>

        {/* Patient Details */}
        <div className="p-4 space-y-4">
          {/* Basic Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <User className="w-4 h-4" />
                <span className="text-xs uppercase">Full Name</span>
              </div>
              <p className="font-semibold">{patient.name}</p>
            </div>
            
            <div className="p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs uppercase">Age</span>
              </div>
              <p className="font-semibold">{patient.age} Years</p>
            </div>
            
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-center gap-2 text-destructive mb-1">
                <Droplets className="w-4 h-4" />
                <span className="text-xs uppercase">Blood Group</span>
              </div>
              <p className="font-bold text-xl text-destructive">{patient.bloodGroup}</p>
            </div>
            
            <div className="p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <FileText className="w-4 h-4" />
                <span className="text-xs uppercase">Gender</span>
              </div>
              <p className="font-semibold">{patient.gender || 'Not Specified'}</p>
            </div>
          </div>

          <Separator />

          {/* Allergies Section */}
          <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <h3 className="font-bold text-destructive uppercase text-sm">Known Allergies</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {patient.allergies.length > 0 ? (
                patient.allergies.map((allergy) => (
                  <Badge key={allergy} variant="destructive" className="text-sm py-1 px-3">
                    {allergy}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline" className="text-muted-foreground">No Known Allergies</Badge>
              )}
            </div>
          </div>

          {/* Medical Conditions */}
          <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
            <div className="flex items-center gap-2 mb-3">
              <Stethoscope className="w-5 h-5 text-warning" />
              <h3 className="font-bold text-warning uppercase text-sm">Medical Conditions</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {patient.medicalConditions.length > 0 ? (
                patient.medicalConditions.map((condition) => (
                  <Badge key={condition} variant="secondary" className="text-sm py-1 px-3 bg-warning/10 text-warning-foreground">
                    {condition}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline" className="text-muted-foreground">No Known Conditions</Badge>
              )}
            </div>
          </div>

          {/* Current Medications */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Pill className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-primary uppercase text-sm">Current Medications</h3>
            </div>
            <div className="space-y-2">
              {patient.medications.length > 0 ? (
                patient.medications.map((med, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded bg-background/50">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Pill className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium">{med}</span>
                  </div>
                ))
              ) : (
                <Badge variant="outline" className="text-muted-foreground">No Current Medications</Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Emergency Contact */}
          <div className="p-4 rounded-lg bg-muted/50 border-2 border-dashed border-destructive/30">
            <h3 className="font-bold text-sm uppercase mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-destructive" />
              Emergency Contact
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-semibold">{patient.emergencyContact.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Relationship</p>
                <p className="font-semibold">{patient.emergencyContact.relationship}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-semibold text-primary">{patient.emergencyContact.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-muted/30 border-t text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Issued by {facilityName} • EMEC Health System
          </p>
          <p className="text-xs text-muted-foreground">
            This record is electronically generated and verified. For official use only.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <Badge variant="outline" className="text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Encrypted
            </Badge>
            <Badge variant="outline" className="text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              HIPAA Compliant
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

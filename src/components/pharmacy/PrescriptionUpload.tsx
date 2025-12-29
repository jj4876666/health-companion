import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, FileImage, CheckCircle, AlertTriangle, 
  X, Camera, File, Shield, Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PrescriptionUploadProps {
  onUploadComplete: (fileUrl: string) => void;
  onSkip?: () => void;
}

export function PrescriptionUpload({ onUploadComplete, onSkip }: PrescriptionUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const lang = (localStorage.getItem('emec-language') || 'en') as 'en' | 'sw' | 'fr';

  const handleFileSelect = (file: File) => {
    if (!file.type.match(/image\/(jpeg|png|jpg)|application\/pdf/)) {
      toast({
        title: lang === 'sw' ? 'Aina isiyo sahihi ya faili' : lang === 'fr' ? 'Type de fichier invalide' : 'Invalid file type',
        description: lang === 'sw' ? 'Tafadhali pakia picha (JPG, PNG) au PDF' : lang === 'fr' ? 'Veuillez télécharger une image (JPG, PNG) ou PDF' : 'Please upload an image (JPG, PNG) or PDF',
        variant: 'destructive'
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: lang === 'sw' ? 'Faili kubwa sana' : lang === 'fr' ? 'Fichier trop volumineux' : 'File too large',
        description: lang === 'sw' ? 'Ukubwa wa juu ni 10MB' : lang === 'fr' ? 'La taille maximale est de 10 Mo' : 'Maximum size is 10MB',
        variant: 'destructive'
      });
      return;
    }

    setUploadedFile(file);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }

    // Simulate upload progress
    simulateUpload(file);
  };

  const simulateUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(i);
    }

    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsVerified(true);
    setIsUploading(false);

    // In production, this would be the actual file URL from storage
    const demoUrl = `prescription-${Date.now()}.${file.name.split('.').pop()}`;
    onUploadComplete(demoUrl);

    toast({
      title: lang === 'sw' ? 'Dawa imethibitishwa!' : lang === 'fr' ? 'Ordonnance vérifiée!' : 'Prescription verified!',
      description: lang === 'sw' ? 'Unaweza kuendelea na agizo lako' : lang === 'fr' ? 'Vous pouvez continuer votre commande' : 'You can proceed with your order'
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    setIsVerified(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="border-0 shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileImage className="w-5 h-5" />
          {lang === 'sw' ? 'Pakia Dawa' : lang === 'fr' ? 'Télécharger l\'ordonnance' : 'Upload Prescription'}
        </CardTitle>
        <CardDescription>
          {lang === 'sw' 
            ? 'Pakia picha wazi ya dawa yako kutoka kwa daktari aliyesajiliwa'
            : lang === 'fr'
            ? 'Téléchargez une image claire de votre ordonnance d\'un médecin agréé'
            : 'Upload a clear image of your prescription from a registered doctor'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!uploadedFile ? (
          <>
            {/* Upload Zone */}
            <div
              className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg,application/pdf"
                onChange={handleFileInput}
                className="hidden"
              />
              
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              
              <p className="font-medium mb-2">
                {lang === 'sw' ? 'Buruta na uachie hapa' : lang === 'fr' ? 'Glisser-déposer ici' : 'Drag and drop here'}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {lang === 'sw' ? 'au bonyeza kuchagua faili' : lang === 'fr' ? 'ou cliquez pour sélectionner' : 'or click to select a file'}
              </p>
              
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <Badge variant="outline">JPG</Badge>
                <Badge variant="outline">PNG</Badge>
                <Badge variant="outline">PDF</Badge>
                <Badge variant="outline" className="text-xs">Max 10MB</Badge>
              </div>
            </div>

            {/* Camera Option for Mobile */}
            <Button 
              variant="outline" 
              className="w-full gap-2"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.capture = 'environment';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) handleFileSelect(file);
                };
                input.click();
              }}
            >
              <Camera className="w-4 h-4" />
              {lang === 'sw' ? 'Piga Picha' : lang === 'fr' ? 'Prendre une photo' : 'Take Photo'}
            </Button>

            {/* Skip Option */}
            {onSkip && (
              <Button variant="ghost" className="w-full" onClick={onSkip}>
                {lang === 'sw' ? 'Ruka kwa Dawa zisizohitaji Dawa' : lang === 'fr' ? 'Passer aux médicaments sans ordonnance' : 'Skip for OTC Medications'}
              </Button>
            )}
          </>
        ) : (
          <>
            {/* Uploaded File Preview */}
            <div className="relative rounded-xl overflow-hidden bg-muted">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Prescription preview" 
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center">
                  <File className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
              
              {/* Remove Button */}
              {!isUploading && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={removeFile}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}

              {/* Verification Badge */}
              {isVerified && (
                <div className="absolute bottom-2 right-2">
                  <Badge className="bg-success text-success-foreground gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {lang === 'sw' ? 'Imethibitishwa' : lang === 'fr' ? 'Vérifié' : 'Verified'}
                  </Badge>
                </div>
              )}
            </div>

            {/* File Info */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <FileImage className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm truncate max-w-48">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {isVerified && <CheckCircle className="w-5 h-5 text-success" />}
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {uploadProgress < 100 
                      ? (lang === 'sw' ? 'Inapakia...' : lang === 'fr' ? 'Téléchargement...' : 'Uploading...')
                      : (lang === 'sw' ? 'Inathibitisha...' : lang === 'fr' ? 'Vérification...' : 'Verifying...')}
                  </span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </>
        )}

        {/* Security Notice */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            {lang === 'sw' 
              ? 'Dawa yako imehifadhiwa kwa usalama na inakaguliwa na wataalamu wa afya wa EMEC. Habari zako za afya zinalindwa.'
              : lang === 'fr'
              ? 'Votre ordonnance est stockée en toute sécurité et examinée par des professionnels de santé EMEC. Vos informations de santé sont protégées.'
              : 'Your prescription is securely stored and reviewed by EMEC healthcare professionals. Your health information is protected.'}
          </p>
        </div>

        {/* Warning for prescription meds */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/30">
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <p className="text-xs">
            {lang === 'sw' 
              ? 'Dawa zinazohitaji dawa ya daktari zitawasilishwa tu baada ya kuthibitishwa na mfamasia.'
              : lang === 'fr'
              ? 'Les médicaments sur ordonnance ne seront livrés qu\'après vérification par un pharmacien.'
              : 'Prescription medications will only be delivered after pharmacist verification.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

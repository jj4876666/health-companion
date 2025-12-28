import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Pill, Truck, MapPin, Clock, Package, Shield, 
  CreditCard, CheckCircle, AlertTriangle, Building2,
  Phone, Search, Star, Crown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Pharmacy {
  id: string;
  name: string;
  distance: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  isPartner: boolean;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  price: number;
  inStock: boolean;
  requiresPrescription: boolean;
}

const demoPharmacies: Pharmacy[] = [
  { id: 'pharm-001', name: 'HealthPlus Pharmacy', distance: '1.2 km', rating: 4.8, deliveryTime: '30-45 min', deliveryFee: 150, isPartner: true },
  { id: 'pharm-002', name: 'Nairobi Chemist', distance: '2.5 km', rating: 4.5, deliveryTime: '45-60 min', deliveryFee: 200, isPartner: true },
  { id: 'pharm-003', name: 'MediCare Express', distance: '3.1 km', rating: 4.7, deliveryTime: '60-90 min', deliveryFee: 250, isPartner: false },
];

const demoMedications: Medication[] = [
  { id: 'med-001', name: 'Paracetamol 500mg', dosage: '30 tablets', price: 250, inStock: true, requiresPrescription: false },
  { id: 'med-002', name: 'Amoxicillin 250mg', dosage: '21 capsules', price: 450, inStock: true, requiresPrescription: true },
  { id: 'med-003', name: 'Loratadine 10mg', dosage: '14 tablets', price: 350, inStock: true, requiresPrescription: false },
  { id: 'med-004', name: 'Omeprazole 20mg', dosage: '28 capsules', price: 520, inStock: false, requiresPrescription: true },
  { id: 'med-005', name: 'Vitamin C 1000mg', dosage: '60 tablets', price: 680, inStock: true, requiresPrescription: false },
  { id: 'med-006', name: 'Ibuprofen 400mg', dosage: '24 tablets', price: 280, inStock: true, requiresPrescription: false },
];

interface DrugDeliveryProps {
  isPremium: boolean;
}

export function DrugDelivery({ isPremium }: DrugDeliveryProps) {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [cart, setCart] = useState<{ medication: Medication; quantity: number }[]>([]);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const filteredMedications = demoMedications.filter(med => 
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (medication: Medication) => {
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Drug delivery is only available for premium members",
        variant: "destructive",
      });
      return;
    }

    const existing = cart.find(item => item.medication.id === medication.id);
    if (existing) {
      setCart(cart.map(item => 
        item.medication.id === medication.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { medication, quantity: 1 }]);
    }
    toast({ title: "Added to cart", description: medication.name });
  };

  const removeFromCart = (medicationId: string) => {
    setCart(cart.filter(item => item.medication.id !== medicationId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.medication.price * item.quantity), 0);
  const deliveryFee = selectedPharmacy?.deliveryFee || 0;
  const grandTotal = cartTotal + deliveryFee;

  const handlePlaceOrder = () => {
    if (!selectedPharmacy || cart.length === 0 || !deliveryAddress) {
      toast({
        title: "Missing Information",
        description: "Please select a pharmacy, add items, and enter delivery address",
        variant: "destructive",
      });
      return;
    }

    // Simulate order placement
    toast({
      title: "Order Placed! 🎉",
      description: `Your order will arrive in ${selectedPharmacy.deliveryTime}`,
    });
    setOrderPlaced(true);
  };

  if (!isPremium) {
    return (
      <Card className="border-0 shadow-elegant bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
        <CardContent className="p-8 text-center">
          <Crown className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h3 className="text-xl font-bold mb-2">Premium Feature</h3>
          <p className="text-muted-foreground mb-4">
            Drug delivery service is exclusively available for EMEC Premium members.
            Upgrade now to order medications from partner pharmacies!
          </p>
          <Badge className="bg-yellow-500 text-white">
            <Shield className="w-4 h-4 mr-1" />
            Premium Only
          </Badge>
        </CardContent>
      </Card>
    );
  }

  if (orderPlaced) {
    return (
      <Card className="border-0 shadow-elegant overflow-hidden">
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-8 text-white text-center">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 animate-bounce-soft">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
          <p className="text-white/80">Your medications are on the way</p>
        </div>
        <CardContent className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-muted/50">
            <div className="flex items-center gap-3 mb-3">
              <Truck className="w-5 h-5 text-primary" />
              <span className="font-semibold">Delivery Details</span>
            </div>
            <p className="text-sm"><strong>Pharmacy:</strong> {selectedPharmacy?.name}</p>
            <p className="text-sm"><strong>ETA:</strong> {selectedPharmacy?.deliveryTime}</p>
            <p className="text-sm"><strong>Address:</strong> {deliveryAddress}</p>
            <p className="text-sm"><strong>EMEC ID:</strong> {currentUser?.emecId}</p>
          </div>
          
          <div className="p-4 rounded-xl border-2 border-dashed border-primary/30">
            <p className="text-sm text-center text-muted-foreground">
              <Shield className="w-4 h-4 inline mr-1" />
              Show your EMEC ID to the delivery person for verification
            </p>
          </div>

          <Button onClick={() => { setOrderPlaced(false); setCart([]); }} className="w-full">
            Place Another Order
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
          <Truck className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Drug Delivery</h2>
          <p className="text-sm text-muted-foreground">Order medications to your doorstep</p>
        </div>
        <Badge className="ml-auto bg-yellow-500 text-white">
          <Crown className="w-3 h-3 mr-1" />
          Premium
        </Badge>
      </div>

      {/* Pharmacy Selection */}
      <Card className="border-0 shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Select Pharmacy
          </CardTitle>
          <CardDescription>Choose a partner pharmacy near you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {demoPharmacies.map(pharmacy => (
            <div
              key={pharmacy.id}
              onClick={() => setSelectedPharmacy(pharmacy)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedPharmacy?.id === pharmacy.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-transparent bg-muted/50 hover:border-primary/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{pharmacy.name}</h4>
                    {pharmacy.isPartner && (
                      <Badge variant="secondary" className="text-xs">Partner</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {pharmacy.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {pharmacy.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {pharmacy.deliveryTime}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">KES {pharmacy.deliveryFee}</p>
                  <p className="text-xs text-muted-foreground">Delivery</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Search & Medications */}
      <Card className="border-0 shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5" />
            Search Medications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for medications..."
              className="pl-10"
            />
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredMedications.map(medication => (
              <div
                key={medication.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{medication.name}</p>
                    {medication.requiresPrescription && (
                      <Badge variant="outline" className="text-xs bg-warning/10 text-warning-foreground">
                        Rx
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{medication.dosage}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-semibold">KES {medication.price}</p>
                  <Button
                    size="sm"
                    disabled={!medication.inStock}
                    onClick={() => addToCart(medication)}
                  >
                    {medication.inStock ? 'Add' : 'Out'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cart */}
      {cart.length > 0 && (
        <Card className="border-0 shadow-elegant border-2 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Your Cart ({cart.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.map(item => (
              <div key={item.medication.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.medication.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-semibold">KES {item.medication.price * item.quantity}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => removeFromCart(item.medication.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>KES {cartTotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>KES {deliveryFee}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">KES {grandTotal}</span>
              </div>
            </div>

            <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full h-12" disabled={!selectedPharmacy}>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Proceed to Checkout
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delivery Details</DialogTitle>
                  <DialogDescription>
                    Enter your delivery address and complete your order
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>EMEC ID (for verification)</Label>
                    <Input value={currentUser?.emecId || 'DEMO-ID'} readOnly className="bg-muted font-mono" />
                  </div>
                  <div className="space-y-2">
                    <Label>Delivery Address</Label>
                    <Textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter your full delivery address..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Delivery Notes (optional)</Label>
                    <Input
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      placeholder="e.g., Call when arriving"
                    />
                  </div>
                  <div className="p-3 rounded-lg bg-warning/10 border border-warning/30">
                    <p className="text-sm text-warning-foreground">
                      <AlertTriangle className="w-4 h-4 inline mr-1" />
                      Payment will be collected on delivery (Cash or M-Pesa)
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setOrderDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={() => { handlePlaceOrder(); setOrderDialogOpen(false); }} className="flex-1">
                    <Truck className="w-4 h-4 mr-2" />
                    Place Order
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}

      {/* Info */}
      <Card className="border-0 shadow-elegant bg-muted/50">
        <CardContent className="p-4">
          <p className="text-xs text-center text-muted-foreground">
            <Shield className="w-4 h-4 inline mr-1" />
            Demo Mode – Orders are simulated. In production, orders connect to real pharmacies.
            Prescription medications require valid prescriptions from registered health facilities.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DrugDelivery } from "@/components/pharmacy/DrugDelivery";
import { usePremium } from "@/contexts/PremiumContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Lock, Pill, Truck, Shield, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Pharmacy() {
  const { isPremium } = usePremium();
  const navigate = useNavigate();

  if (!isPremium) {
    return (
      <DashboardLayout>
        <div className="min-h-[80vh] flex items-center justify-center p-4">
          <Card className="max-w-lg w-full text-center border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
            <CardHeader className="pb-4">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Crown className="w-6 h-6 text-yellow-500" />
                Premium Feature
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Drug Delivery is an exclusive premium feature. Upgrade to access:
              </p>
              
              <div className="grid grid-cols-1 gap-3 text-left">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                  <Pill className="w-5 h-5 text-primary" />
                  <span className="text-sm">Order medications from verified pharmacies</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                  <Truck className="w-5 h-5 text-primary" />
                  <span className="text-sm">Fast delivery to your location</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-sm">EMEC ID verification for safety</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-sm">Track orders in real-time</span>
                </div>
              </div>

              <Button 
                onClick={() => navigate('/donations')} 
                className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80"
                size="lg"
              >
                <Crown className="w-5 h-5" />
                Upgrade to Premium
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DrugDelivery isPremium={isPremium} />
    </DashboardLayout>
  );
}

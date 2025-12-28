import { Link, useLocation } from "react-router-dom";
import { Home, Calculator, Heart, AlertTriangle, Menu, X, Video, Pill, HandHeart, Gamepad2, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { usePremium } from "@/contexts/PremiumContext";

const navItems = [
  { name: "Home", path: "/dashboard", icon: Home },
  { name: "Consultation", path: "/consultation", icon: Video },
  { name: "Calculators", path: "/calculators", icon: Calculator },
  { name: "Games", path: "/games", icon: Gamepad2 },
  { name: "First Aid", path: "/first-aid", icon: Heart },
  { name: "Emergency", path: "/emergency", icon: AlertTriangle },
  { name: "Pharmacy", path: "/pharmacy", icon: Pill, premium: true },
  { name: "Donations", path: "/donations", icon: HandHeart },
];

export function Navigation() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { isPremium } = usePremium();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">EMC Health</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const showPremiumBadge = (item as any).premium && !isPremium;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "gap-2 relative",
                      isActive && "bg-secondary text-secondary-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                    {showPremiumBadge && (
                      <Crown className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1" />
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                const showPremiumBadge = (item as any).premium && !isPremium;
                return (
                  <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-2 relative",
                        isActive && "bg-secondary text-secondary-foreground"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                      {showPremiumBadge && (
                        <Crown className="w-3 h-3 text-yellow-500 ml-auto" />
                      )}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

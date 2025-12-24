import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageLayout } from "@/components/layout/PageLayout";
import { BookOpen, Calculator, Heart, AlertTriangle, ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-health.jpg";

const features = [
  {
    icon: BookOpen,
    title: "Health Education",
    description: "Learn essential health tips and wellness practices",
    path: "/education",
    delay: "100ms",
  },
  {
    icon: Calculator,
    title: "Health Calculators",
    description: "Calculate BMR, BMI and other health metrics",
    path: "/calculators",
    delay: "200ms",
  },
  {
    icon: Heart,
    title: "First Aid Guide",
    description: "Quick reference for emergency first aid procedures",
    path: "/first-aid",
    delay: "300ms",
  },
  {
    icon: AlertTriangle,
    title: "Emergency Contacts",
    description: "Important emergency numbers and resources",
    path: "/emergency",
    delay: "400ms",
  },
];

const Index = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Your Health Companion
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Take Control of Your{" "}
              <span className="text-primary">Health</span> Journey
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              Access health education, calculators, first aid guides, and emergency resources all in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/education">
                <Button variant="hero" size="lg">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/calculators">
                <Button variant="outline" size="lg">
                  Try Calculator
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="absolute inset-0 gradient-primary rounded-3xl blur-3xl opacity-20" />
            <img
              src={heroImage}
              alt="Health and wellness illustration"
              className="relative rounded-3xl shadow-elegant w-full object-cover aspect-video"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive health tools and resources at your fingertips
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.path} to={feature.path}>
                <Card 
                  variant="interactive" 
                  className="h-full animate-fade-in"
                  style={{ animationDelay: feature.delay }}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-14 h-14 mx-auto rounded-2xl gradient-primary flex items-center justify-center">
                      <Icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;

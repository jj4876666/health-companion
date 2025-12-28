import { useState } from 'react';
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Flame, 
  Droplet, 
  Wind, 
  Heart, 
  Bone, 
  Zap,
  AlertCircle,
  ThermometerSun,
  Play,
  ExternalLink,
  BookOpen,
  Video,
  FileText,
  ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const firstAidGuides = [
  {
    icon: Flame,
    title: "Burns",
    severity: "Common",
    steps: [
      "Cool the burn under cool running water for at least 10 minutes",
      "Remove jewelry or tight clothing near the burn",
      "Cover with a sterile, non-fluffy bandage",
      "Do NOT apply ice, butter, or toothpaste",
      "Seek medical help for severe burns",
    ],
    color: "from-orange-500 to-red-500",
    videoUrl: "https://www.youtube.com/watch?v=EaJmzB8YgS0",
    resources: [
      { name: "Mayo Clinic - Burns", url: "https://www.mayoclinic.org/first-aid/first-aid-burns/basics/art-20056649" },
      { name: "Red Cross Guide", url: "https://www.redcross.org/take-a-class/first-aid/performing-first-aid/first-aid-steps" },
    ],
  },
  {
    icon: Droplet,
    title: "Bleeding",
    severity: "Urgent",
    steps: [
      "Apply direct pressure with a clean cloth",
      "Keep the injured area elevated if possible",
      "Maintain pressure for at least 10 minutes",
      "If bleeding continues, add more cloth without removing the first",
      "Call emergency services for severe bleeding",
    ],
    color: "from-red-500 to-rose-500",
    videoUrl: "https://www.youtube.com/watch?v=NxO5LvgqZe0",
    resources: [
      { name: "Stop the Bleed", url: "https://www.stopthebleed.org/" },
      { name: "WHO Guidelines", url: "https://www.who.int/news-room/fact-sheets/detail/first-aid" },
    ],
  },
  {
    icon: Wind,
    title: "Choking",
    severity: "Emergency",
    steps: [
      "Ask 'Are you choking?' If they can't speak, act fast",
      "Give 5 back blows between shoulder blades",
      "Give 5 abdominal thrusts (Heimlich maneuver)",
      "Repeat back blows and thrusts until object is dislodged",
      "Call emergency if person becomes unconscious",
    ],
    color: "from-blue-500 to-indigo-500",
    videoUrl: "https://www.youtube.com/watch?v=7CgtIgSyAiU",
    resources: [
      { name: "American Red Cross", url: "https://www.redcross.org/take-a-class/first-aid/performing-first-aid/first-aid-steps" },
      { name: "NHS Choking Guide", url: "https://www.nhs.uk/conditions/choking/" },
    ],
  },
  {
    icon: Heart,
    title: "CPR",
    severity: "Emergency",
    steps: [
      "Check responsiveness and call emergency services",
      "Place heel of hand on center of chest",
      "Push hard and fast - 100-120 compressions per minute",
      "Give 2 rescue breaths after every 30 compressions",
      "Continue until help arrives or person recovers",
    ],
    color: "from-pink-500 to-red-500",
    videoUrl: "https://www.youtube.com/watch?v=cosVBV96E2g",
    resources: [
      { name: "American Heart Association", url: "https://cpr.heart.org/en/resources/what-is-cpr" },
      { name: "British Heart Foundation", url: "https://www.bhf.org.uk/how-you-can-help/how-to-save-a-life/how-to-do-cpr" },
    ],
  },
  {
    icon: Bone,
    title: "Fractures",
    severity: "Urgent",
    steps: [
      "Keep the injured area still and supported",
      "Apply ice wrapped in cloth to reduce swelling",
      "Do NOT try to realign the bone",
      "Immobilize the limb with a splint if trained",
      "Seek immediate medical attention",
    ],
    color: "from-gray-500 to-slate-600",
    videoUrl: "https://www.youtube.com/watch?v=2v8vlXgGXwE",
    resources: [
      { name: "OrthoInfo - Fractures", url: "https://orthoinfo.aaos.org/en/diseases--conditions/fractures-broken-bones" },
      { name: "Cleveland Clinic", url: "https://my.clevelandclinic.org/health/diseases/15241-bone-fractures" },
    ],
  },
  {
    icon: Zap,
    title: "Electric Shock",
    severity: "Emergency",
    steps: [
      "Do NOT touch the person until power is off",
      "Turn off the power source or use a non-conductive object",
      "Check for breathing and pulse",
      "Begin CPR if necessary",
      "Call emergency services immediately",
    ],
    color: "from-yellow-500 to-amber-500",
    videoUrl: "https://www.youtube.com/watch?v=ZMQbHMgK2rw",
    resources: [
      { name: "Mayo Clinic", url: "https://www.mayoclinic.org/first-aid/first-aid-electrical-shock/basics/art-20056695" },
      { name: "Healthline", url: "https://www.healthline.com/health/electric-shock" },
    ],
  },
  {
    icon: AlertCircle,
    title: "Allergic Reaction",
    severity: "Emergency",
    steps: [
      "Identify and remove the allergen if possible",
      "Help the person use their epinephrine auto-injector if available",
      "Call emergency services for severe reactions",
      "Keep the person calm and lying down",
      "Monitor breathing and be ready to perform CPR",
    ],
    color: "from-purple-500 to-violet-500",
    videoUrl: "https://www.youtube.com/watch?v=OG7oJp4vB8s",
    resources: [
      { name: "FARE - Anaphylaxis", url: "https://www.foodallergy.org/resources/anaphylaxis" },
      { name: "Allergy UK", url: "https://www.allergyuk.org/" },
    ],
  },
  {
    icon: ThermometerSun,
    title: "Heat Stroke",
    severity: "Urgent",
    steps: [
      "Move the person to a cool, shaded area",
      "Remove excess clothing",
      "Cool them with water, ice packs, or wet cloths",
      "Fan the person while misting with water",
      "Call emergency services if temperature doesn't drop",
    ],
    color: "from-amber-500 to-orange-500",
    videoUrl: "https://www.youtube.com/watch?v=tkCTWnl7X8M",
    resources: [
      { name: "CDC Heat Stress", url: "https://www.cdc.gov/niosh/topics/heatstress/" },
      { name: "WebMD", url: "https://www.webmd.com/fitness-exercise/heat-exhaustion" },
    ],
  },
];

const videoTutorials = [
  {
    title: "Complete First Aid Training",
    duration: "45 min",
    source: "Red Cross",
    url: "https://www.youtube.com/watch?v=ea1RJUOiNfQ",
    thumbnail: "🏥",
  },
  {
    title: "CPR for Adults and Children",
    duration: "12 min",
    source: "American Heart Association",
    url: "https://www.youtube.com/watch?v=cosVBV96E2g",
    thumbnail: "❤️",
  },
  {
    title: "Choking Response Demo",
    duration: "8 min",
    source: "St John Ambulance",
    url: "https://www.youtube.com/watch?v=7CgtIgSyAiU",
    thumbnail: "🫁",
  },
  {
    title: "Wound Care Basics",
    duration: "10 min",
    source: "NHS",
    url: "https://www.youtube.com/watch?v=NxO5LvgqZe0",
    thumbnail: "🩹",
  },
];

const credibleSources = [
  { name: "World Health Organization", url: "https://www.who.int/", description: "Global health authority", icon: "🌍" },
  { name: "Mayo Clinic", url: "https://www.mayoclinic.org/", description: "Medical expertise", icon: "🏥" },
  { name: "American Red Cross", url: "https://www.redcross.org/", description: "Emergency response training", icon: "✚" },
  { name: "CDC", url: "https://www.cdc.gov/", description: "Disease control and prevention", icon: "🔬" },
  { name: "NHS UK", url: "https://www.nhs.uk/", description: "Health information", icon: "🇬🇧" },
  { name: "WebMD", url: "https://www.webmd.com/", description: "Health resources", icon: "📚" },
];

const FirstAid = () => {
  const { toast } = useToast();
  const [selectedGuide, setSelectedGuide] = useState<typeof firstAidGuides[0] | null>(null);

  const handleOpenResource = (url: string, name: string) => {
    toast({
      title: "🔗 Opening External Link",
      description: `Redirecting to ${name}... (Demo: Opens in new tab)`,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            First Aid Guide
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Quick reference with videos and links to credible medical sources.
          </p>
        </div>

        {/* Emergency Reminder */}
        <Card variant="emergency" className="mb-8 animate-fade-in">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">In case of emergency</h3>
              <p className="text-muted-foreground">
                Always prioritize calling emergency services (999). These guides are for reference only.
              </p>
            </div>
            <Button 
              variant="destructive" 
              onClick={() => handleOpenResource('/emergency', 'Emergency')}
              asChild
            >
              <a href="/emergency">
                <AlertCircle className="w-4 h-4 mr-2" />
                Emergency
              </a>
            </Button>
          </CardContent>
        </Card>

        <Tabs defaultValue="guides" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="guides" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Guides
            </TabsTrigger>
            <TabsTrigger value="videos" className="gap-2">
              <Video className="w-4 h-4" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="sources" className="gap-2">
              <FileText className="w-4 h-4" />
              Resources
            </TabsTrigger>
          </TabsList>

          {/* Guides Tab */}
          <TabsContent value="guides">
            {selectedGuide ? (
              <div className="animate-fade-in">
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedGuide(null)} 
                  className="mb-4"
                >
                  ← Back to all guides
                </Button>
                
                <Card className="border-0 shadow-elegant overflow-hidden">
                  <div className={`bg-gradient-to-br ${selectedGuide.color} p-6 text-white`}>
                    <div className="flex items-center gap-4">
                      <selectedGuide.icon className="w-12 h-12" />
                      <div>
                        <h2 className="text-2xl font-bold">{selectedGuide.title}</h2>
                        <Badge className="bg-white/20 text-white mt-1">
                          {selectedGuide.severity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6 space-y-6">
                    {/* Steps */}
                    <div>
                      <h3 className="font-semibold mb-4">Step-by-Step Instructions</h3>
                      <ol className="space-y-3">
                        {selectedGuide.steps.map((step, index) => (
                          <li key={index} className="flex gap-3">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                              {index + 1}
                            </span>
                            <span className="pt-1">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Video */}
                    <div className="p-4 rounded-xl bg-muted/50">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Video className="w-5 h-5 text-primary" />
                        Watch Video Tutorial
                      </h3>
                      <Button 
                        className="w-full gap-2"
                        onClick={() => handleOpenResource(selectedGuide.videoUrl, 'Video Tutorial')}
                      >
                        <Play className="w-4 h-4" />
                        Open Video on YouTube
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </Button>
                    </div>

                    {/* Resources */}
                    <div>
                      <h3 className="font-semibold mb-3">Credible Resources</h3>
                      <div className="space-y-2">
                        {selectedGuide.resources.map((resource, i) => (
                          <Button
                            key={i}
                            variant="outline"
                            className="w-full justify-between"
                            onClick={() => handleOpenResource(resource.url, resource.name)}
                          >
                            <span className="italic underline">{resource.name}</span>
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {firstAidGuides.map((guide, index) => {
                  const Icon = guide.icon;
                  return (
                    <Card 
                      key={guide.title} 
                      variant="elevated"
                      className="animate-fade-in overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => setSelectedGuide(guide)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${guide.color} flex items-center justify-center`}>
                              <Icon className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <CardTitle className="text-xl">{guide.title}</CardTitle>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            guide.severity === "Emergency" 
                              ? "bg-destructive/10 text-destructive" 
                              : guide.severity === "Urgent"
                              ? "bg-warning/10 text-warning"
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {guide.severity}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          {guide.steps[0]}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <Badge variant="secondary" className="text-xs">
                              <Video className="w-3 h-3 mr-1" />
                              Video
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              <FileText className="w-3 h-3 mr-1" />
                              {guide.resources.length} sources
                            </Badge>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos">
            <div className="grid md:grid-cols-2 gap-6">
              {videoTutorials.map((video, index) => (
                <Card 
                  key={video.title}
                  className="border-0 shadow-elegant cursor-pointer hover:shadow-lg transition-all animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => handleOpenResource(video.url, video.title)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-3xl">
                        {video.thumbnail}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{video.title}</h3>
                        <p className="text-sm text-muted-foreground">{video.source}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            <Play className="w-3 h-3 mr-1" />
                            {video.duration}
                          </Badge>
                        </div>
                      </div>
                      <ExternalLink className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-6 border-0 shadow-elegant">
              <CardContent className="p-6 text-center">
                <Video className="w-12 h-12 mx-auto text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">More Training Videos</h3>
                <p className="text-muted-foreground mb-4">
                  Access free first aid training from certified organizations
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button variant="outline" onClick={() => handleOpenResource('https://www.youtube.com/redcross', 'Red Cross YouTube')}>
                    Red Cross YouTube
                  </Button>
                  <Button variant="outline" onClick={() => handleOpenResource('https://www.youtube.com/user/StJohnAmbulance', 'St John Ambulance')}>
                    St John Ambulance
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="sources">
            <div className="space-y-4">
              <Card className="border-0 shadow-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Credible Health Sources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {credibleSources.map((source) => (
                    <div 
                      key={source.name}
                      className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                      onClick={() => handleOpenResource(source.url, source.name)}
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                        {source.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold italic underline">{source.name}</h3>
                        <p className="text-sm text-muted-foreground">{source.description}</p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-muted-foreground" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">📚 Note on Resources</h3>
                  <p className="text-sm text-muted-foreground">
                    All links direct to official, medically verified sources. In demo mode, 
                    links will open in a new tab. Always verify information with healthcare professionals.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default FirstAid;

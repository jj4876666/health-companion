import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDemo } from '@/contexts/DemoContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ParentUser, ChildUser } from '@/types/emec';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { EmbeddedAIChat } from '@/components/chat/EmbeddedAIChat';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, Bell, Clock, CheckCircle, XCircle, Eye, 
  Shield, Activity, BookOpen, Trophy, AlertTriangle,
  FileText, Heart, User, Stethoscope, Pill, Bot
} from 'lucide-react';

// Get child objects from IDs - returns empty for now (real data loaded from DB)
const getChildrenFromIds = (_ids: string[]): ChildUser[] => {
  return [];
};

export function ParentDashboard() {
  const { currentUser, addAuditEntry } = useAuth();
  const { setSelectedAgeCategory, getContentAccess } = useDemo();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const parent = (currentUser as ParentUser) || { linkedChildren: [], pendingApprovals: [] } as unknown as ParentUser;
  const linkedChildren = getChildrenFromIds(parent.linkedChildren || ['child-001']);
  const pendingApprovals = parent.pendingApprovals?.filter(a => a.status === 'pending') || [];

  const getAgeCategory = (age: number) => {
    if (age <= 2) return 'infant';
    if (age <= 12) return 'child';
    if (age <= 17) return 'teen';
    return 'adult';
  };

  const handleViewAsChild = (child: ChildUser) => {
    setSelectedAgeCategory(getAgeCategory(child.age) as 'infant' | 'child' | 'teen' | 'adult');
  };

  const getContentAccessSummary = (age: number) => {
    const access = getContentAccess(age);
    const total = Object.keys(access).length;
    const unlocked = Object.values(access).filter(Boolean).length;
    return { unlocked, total, percentage: Math.round((unlocked / total) * 100) };
  };

  const handleApproveRequest = (id: string) => {
    toast({ title: 'Request approved', description: 'Change has been approved' });
    addAuditEntry({
      userId: parent.id,
      userName: parent.name,
      userRole: 'parent',
      action: 'APPROVE_REQUEST',
      target: id,
      details: 'Approved pending request',
    });
  };

  const handleRejectRequest = (id: string) => {
    toast({ title: 'Request rejected', description: 'Change has been rejected' });
    addAuditEntry({
      userId: parent.id,
      userName: parent.name,
      userRole: 'parent',
      action: 'REJECT_REQUEST',
      target: id,
      details: 'Rejected pending request',
    });
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl p-6 gradient-primary text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {t('dashboard.welcome')}, {parent.name.split(' ')[0]}!
              </h1>
              <p className="text-white/80">Parent/Guardian Dashboard</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20">
              <Users className="w-4 h-4" />
              <span>{linkedChildren.length} Linked Children</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20">
              <Bell className="w-4 h-4" />
              <span>{pendingApprovals.length} Pending Approvals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Label */}
      <div className="text-center">
        <Badge variant="outline" className="bg-warning/10 text-warning-foreground border-warning/30">
          Demo Data – Editable for Presentation
        </Badge>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="children" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="children" className="gap-2">
            <Users className="w-4 h-4" />
            Children
          </TabsTrigger>
          <TabsTrigger value="ai" className="gap-2">
            <Bot className="w-4 h-4" />
            AI Chat
          </TabsTrigger>
          <TabsTrigger value="approvals" className="gap-2">
            <Bell className="w-4 h-4" />
            Approvals
            {pendingApprovals.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {pendingApprovals.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2">
            <FileText className="w-4 h-4" />
            Audit Log
          </TabsTrigger>
        </TabsList>

        {/* Children Tab */}
        <TabsContent value="children" className="space-y-4 mt-4">
          {linkedChildren.map((child) => {
            const accessSummary = getContentAccessSummary(child.age);
            const ageCategory = getAgeCategory(child.age);
            
            return (
              <Card key={child.id} className="border-0 shadow-elegant">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16 border-2 border-primary/20">
                      <AvatarFallback className="text-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        {child.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold">{child.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Age {child.age}</span>
                            <Badge variant="secondary" className="text-xs capitalize">{ageCategory}</Badge>
                            <span>• {child.bloodGroup}</span>
                          </div>
                        </div>
                        <Badge variant="outline">{child.points} pts</Badge>
                      </div>
                      
                      {/* Allergies */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {child.allergies.map((allergy) => (
                          <Badge key={allergy} variant="destructive" className="text-xs">
                            {allergy}
                          </Badge>
                        ))}
                      </div>

                      {/* Content Access Progress */}
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <BookOpen className="w-4 h-4" />
                            Content Unlocked
                          </span>
                          <span className="font-medium">{accessSummary.unlocked}/{accessSummary.total}</span>
                        </div>
                        <Progress value={accessSummary.percentage} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-6">
                    <Button variant="outline" className="gap-2" onClick={() => handleViewAsChild(child)}>
                      <Eye className="w-4 h-4" />
                      View as Child
                    </Button>
                    <Button variant="outline" className="gap-2" asChild>
                      <Link to="/education">
                        <BookOpen className="w-4 h-4" />
                        Education
                      </Link>
                    </Button>
                    <Button variant="outline" className="gap-2" asChild>
                      <Link to="/medications">
                        <Pill className="w-4 h-4" />
                        Medications
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* AI Chat Tab */}
        <TabsContent value="ai" className="space-y-4 mt-4">
          <EmbeddedAIChat 
            title="AI Health Assistant"
            placeholder="Ask about child health, vaccinations, nutrition, development..."
            maxHeight="500px"
            context="Parent/Guardian dashboard - focus on child health, development milestones, vaccinations, and parenting health advice"
          />
        </TabsContent>

        {/* Approvals Tab */}
        <TabsContent value="approvals" className="space-y-4 mt-4">
          {pendingApprovals.length === 0 ? (
            <Card className="border-0 shadow-elegant">
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
                <h3 className="font-semibold text-lg">All caught up!</h3>
                <p className="text-muted-foreground">No pending approvals at the moment.</p>
              </CardContent>
            </Card>
          ) : (
            pendingApprovals.map((approval) => (
              <Card key={approval.id} className="border-0 shadow-elegant">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      approval.type === 'content_access' ? 'bg-blue-500/20 text-blue-500' :
                      approval.type === 'admin_change' ? 'bg-orange-500/20 text-orange-500' :
                      'bg-purple-500/20 text-purple-500'
                    }`}>
                      {approval.type === 'content_access' ? <Eye className="w-5 h-5" /> :
                       approval.type === 'admin_change' ? <Shield className="w-5 h-5" /> :
                       <Activity className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs capitalize">
                          {approval.type.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {new Date(approval.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="font-medium">{approval.description}</p>
                      <p className="text-sm text-muted-foreground">
                        For: {linkedChildren.find(c => c.id === approval.childId)?.name || 'Child'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      className="flex-1 gap-2"
                      onClick={() => handleRejectRequest(approval.id)}
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </Button>
                    <Button
                      className="flex-1 gap-2"
                      onClick={() => handleApproveRequest(approval.id)}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="audit" className="space-y-4 mt-4">
          <Card className="border-0 shadow-elegant">
            <CardHeader>
              <CardTitle className="text-lg">{t('dashboard.auditLog')}</CardTitle>
              <CardDescription>Recent activity for your linked accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-blue-500/20 text-blue-500">
                  P
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{parent.name}</span>
                    <Badge variant="outline" className="text-xs">LOGIN</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">Session started</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
          <Link to="/emergency">
            <AlertTriangle className="w-6 h-6 text-destructive" />
            <span>Emergency</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
          <Link to="/consultation">
            <Stethoscope className="w-6 h-6 text-primary" />
            <span>Consult</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
          <Link to="/donations">
            <Heart className="w-6 h-6 text-pink-500" />
            <span>Donate</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}

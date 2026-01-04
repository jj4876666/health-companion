import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { ChildDashboard } from '@/components/dashboards/ChildDashboard';
import { TeenDashboard } from '@/components/dashboards/TeenDashboard';
import { ParentDashboard } from '@/components/dashboards/ParentDashboard';
import { AdminDashboard } from '@/components/dashboards/AdminDashboard';
import { AdultDashboard } from '@/components/dashboards/AdultDashboard';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ChildUser } from '@/types/emec';

export default function Dashboard() {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  const renderDashboard = () => {
    // Check if child is actually a teen (age 13-17)
    if (currentUser.role === 'child') {
      const childUser = currentUser as ChildUser;
      if (childUser.age >= 13) {
        return <TeenDashboard />;
      }
      return <ChildDashboard />;
    }

    switch (currentUser.role) {
      case 'parent':
        return <ParentDashboard />;
      case 'adult':
        return <AdultDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <ChildDashboard />;
    }
  };

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
}

import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { ChildDashboard } from '@/components/dashboards/ChildDashboard';
import { ParentDashboard } from '@/components/dashboards/ParentDashboard';
import { AdminDashboard } from '@/components/dashboards/AdminDashboard';
import { AdultDashboard } from '@/components/dashboards/AdultDashboard';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function Dashboard() {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'child':
        return <ChildDashboard />;
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

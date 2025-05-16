import { Navigate, Outlet } from 'react-router-dom';

interface RoleBasedRoutesProps {
  allowedRoles: string[];
}

export default function RoleBasedRoutes({ allowedRoles }: RoleBasedRoutesProps) {
  const userRole = localStorage.getItem('userRole');
  const isAuthenticated = !!localStorage.getItem('userPhone');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
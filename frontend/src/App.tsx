import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import theme from './theme';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Settings from './pages/Settings';
import Login from './pages/Login';
import RegisterPage from './pages/Register'; // Importar RegisterPage
import MedicalHistory from './pages/MedicalHistory';
import AIAnalysis from './pages/AIAnalysis';
import Appointments from './pages/Appointments';
import Help from './pages/Help';
import RoleBasedRoutes from './components/RoleBasedRoutes';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} /> {/* Añadir esta ruta */}

          {/* Rutas protegidas para todos los usuarios autenticados */}
          <Route element={<RoleBasedRoutes allowedRoles={['patient', 'doctor', 'admin']} />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
          </Route>

          {/* Rutas protegidas para pacientes */}
          <Route element={<RoleBasedRoutes allowedRoles={['patient']} />}>
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/my-medical-history" element={<MedicalHistory />} />
            <Route path="/my-doctors" element={<div>Mis Doctores</div>} />
          </Route>

          {/* Rutas protegidas para doctores */}
          <Route element={<RoleBasedRoutes allowedRoles={['doctor']} />}>
            <Route path="/my-patients" element={<div>Mis Pacientes</div>} />
            <Route path="/doctor-appointments" element={<div>Calendario de Citas</div>} />
            <Route path="/medical-history" element={<MedicalHistory />} />
            <Route path="/ai-analysis" element={<AIAnalysis />} />
          </Route>

          {/* Rutas protegidas para administradores */}
          <Route element={<RoleBasedRoutes allowedRoles={['admin']} />}>
            <Route path="/users" element={<div>Gestión de Usuarios</div>} />
            <Route path="/register-doctor" element={<div>Registro de Doctores</div>} />
            <Route path="/statistics" element={<div>Estadísticas</div>} />
          </Route>

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
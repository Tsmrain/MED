import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  useTheme,
  ListItemButton,
  Fade,
  Typography,
  Button,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import PsychologyIcon from '@mui/icons-material/Psychology';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface MenuItem {
  text: string;
  icon: JSX.Element;
  path: string;
  description: string;
  roles?: string[];
  divider?: boolean;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem('userRole') || '';
  
  const menuItems: MenuItem[] = [
    // Menú común para todos los usuarios
    { 
      text: 'Inicio', 
      icon: <QuestionAnswerIcon />, 
      path: '/',
      description: 'Consulta con el asistente virtual',
      divider: true
    },
    { 
      text: 'Historial de Chats', 
      icon: <HistoryIcon />, 
      path: '/history',
      description: 'Ver conversaciones anteriores'
    },

    // Menú específico para pacientes
    { 
      text: 'Mis Citas', 
      icon: <CalendarTodayIcon />, 
      path: '/appointments',
      description: 'Gestiona tus citas médicas',
      roles: ['patient'],
      divider: true
    },
    { 
      text: 'Mi Historial Médico', 
      icon: <MedicalInformationIcon />, 
      path: '/my-medical-history',
      description: 'Ver mi historial médico',
      roles: ['patient']
    },
    { 
      text: 'Mis Doctores', 
      icon: <LocalHospitalIcon />, 
      path: '/my-doctors',
      description: 'Lista de médicos asignados',
      roles: ['patient']
    },

    // Menú específico para doctores
    { 
      text: 'Mis Pacientes', 
      icon: <PeopleIcon />, 
      path: '/my-patients',
      description: 'Gestionar lista de pacientes',
      roles: ['doctor'],
      divider: true
    },
    { 
      text: 'Calendario de Citas', 
      icon: <CalendarTodayIcon />, 
      path: '/doctor-appointments',
      description: 'Ver y gestionar citas',
      roles: ['doctor']
    },
    { 
      text: 'Historiales Médicos', 
      icon: <HealthAndSafetyIcon />, 
      path: '/medical-history',
      description: 'Acceder a historiales médicos',
      roles: ['doctor']
    },
    { 
      text: 'Análisis IA', 
      icon: <PsychologyIcon />, 
      path: '/ai-analysis',
      description: 'Herramientas de diagnóstico IA',
      roles: ['doctor']
    },

    // Menú específico para administradores
    { 
      text: 'Gestión de Usuarios', 
      icon: <PeopleIcon />, 
      path: '/users',
      description: 'Administrar usuarios del sistema',
      roles: ['admin'],
      divider: true
    },
    { 
      text: 'Registro de Doctores', 
      icon: <PersonAddIcon />, 
      path: '/register-doctor',
      description: 'Dar de alta nuevos médicos',
      roles: ['admin']
    },
    { 
      text: 'Estadísticas', 
      icon: <DataUsageIcon />, 
      path: '/statistics',
      description: 'Métricas del sistema',
      roles: ['admin']
    },

    // Menú común para todos los usuarios (parte final)
    { 
      text: 'Ayuda', 
      icon: <HelpIcon />, 
      path: '/help',
      description: 'Centro de ayuda',
      divider: true
    },
    { 
      text: 'Configuración', 
      icon: <SettingsIcon />, 
      path: '/settings',
      description: 'Personaliza tu experiencia'
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const filteredMenuItems = menuItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant="temporary"
      sx={{
        width: { xs: '100%', sm: 320 },
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 320 },
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
          transition: theme.transitions.create(['width', 'transform'], {
            duration: theme.transitions.duration.standard,
          }),
        },
      }}
      PaperProps={{
        sx: {
          borderRight: `1px solid ${theme.palette.divider}`
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            {userRole === 'patient' ? 'Menú del Paciente' : 
             userRole === 'doctor' ? 'Menú del Doctor' : 
             userRole === 'admin' ? 'Menú de Administración' : 'Menú'}
          </Typography>
          <IconButton 
            onClick={onClose}
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <List sx={{ 
          p: 2,
          flex: 1,
          overflowY: 'auto'
        }}>
          {filteredMenuItems.map((item, index) => (
            <Box key={item.text}>
              <Fade 
                in={open} 
                timeout={(index + 1) * 200}
              >
                <ListItem 
                  disablePadding
                  sx={{ mb: 1 }}
                >
                  <ListItemButton
                    onClick={() => {
                      navigate(item.path);
                      onClose();
                    }}
                    selected={location.pathname === item.path}
                    sx={{
                      borderRadius: 1,
                      py: 1.5,
                      px: 2,
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.primary.main + '14',
                        '&:hover': {
                          backgroundColor: theme.palette.primary.main + '1F',
                        }
                      }
                    }}
                  >
                    <ListItemIcon sx={{ 
                      minWidth: 40,
                      color: location.pathname === item.path ? 
                        theme.palette.primary.main : 
                        theme.palette.text.secondary
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    <Box>
                      <ListItemText 
                        primary={item.text} 
                        secondary={item.description}
                        primaryTypographyProps={{
                          fontSize: '0.95rem',
                          fontWeight: 500,
                          color: location.pathname === item.path ? 
                            theme.palette.primary.main : 
                            theme.palette.text.primary
                        }}
                        secondaryTypographyProps={{
                          fontSize: '0.8rem',
                          lineHeight: 1.3
                        }}
                      />
                    </Box>
                  </ListItemButton>
                </ListItem>
              </Fade>
              {item.divider && (
                <Divider sx={{ my: 2 }} />
              )}
            </Box>
          ))}
        </List>

        <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ mb: 2 }}
          >
            Cerrar sesión
          </Button>
          <Typography 
            variant="caption" 
            color="text.secondary"
            component="div"
            align="center"
          >
            {userRole === 'patient' ? 'Cuenta de Paciente' : 
             userRole === 'doctor' ? 'Cuenta de Doctor' : 
             userRole === 'admin' ? 'Cuenta de Administrador' : ''}
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}
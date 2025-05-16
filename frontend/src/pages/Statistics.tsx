import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from '@mui/material';
import Layout from '../components/Layout';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MessageIcon from '@mui/icons-material/Message';

// Datos de ejemplo
const mockStats = {
  totalUsers: 1250,
  activeUsers: 980,
  totalDoctors: 45,
  totalPatients: 1200,
  totalAppointments: 320,
  completedAppointments: 280,
  totalChats: 890,
  activeChats: 25,
};

// Componente para las tarjetas de estadísticas
const StatCard = ({ 
  title, 
  mainStat, 
  secondaryStat, 
  icon: Icon,
  color 
}: { 
  title: string; 
  mainStat: string | number; 
  secondaryStat?: string; 
  icon: any;
  color: string;
}) => (
  <Card sx={{ height: '100%' }}>
    <CardHeader
      avatar={
        <Box
          sx={{
            backgroundColor: color + '15',
            borderRadius: 2,
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon sx={{ color: color }} />
        </Box>
      }
      title={title}
      titleTypographyProps={{
        variant: 'subtitle2',
        color: 'text.secondary'
      }}
    />
    <CardContent>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
        {mainStat}
      </Typography>
      {secondaryStat && (
        <Typography variant="body2" color="text.secondary">
          {secondaryStat}
        </Typography>
      )}
    </CardContent>
  </Card>
);

export default function Statistics() {
  return (
    <Layout>
      <Box sx={{ 
        maxWidth: '1200px', 
        width: '100%', 
        mx: 'auto', 
        p: { xs: 2, sm: 3 } 
      }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Estadísticas del Sistema
        </Typography>

        <Grid container spacing={3}>
          {/* Estadísticas de usuarios */}
          <Grid item xs={12} md={6} lg={3}>
            <StatCard
              title="Total Usuarios"
              mainStat={mockStats.totalUsers}
              secondaryStat={`${mockStats.activeUsers} usuarios activos`}
              icon={PeopleIcon}
              color={theme => theme.palette.primary.main}
            />
          </Grid>

          {/* Estadísticas de doctores */}
          <Grid item xs={12} md={6} lg={3}>
            <StatCard
              title="Doctores Registrados"
              mainStat={mockStats.totalDoctors}
              secondaryStat={`${mockStats.totalPatients} pacientes registrados`}
              icon={LocalHospitalIcon}
              color={theme => theme.palette.success.main}
            />
          </Grid>

          {/* Estadísticas de citas */}
          <Grid item xs={12} md={6} lg={3}>
            <StatCard
              title="Citas Médicas"
              mainStat={mockStats.totalAppointments}
              secondaryStat={`${mockStats.completedAppointments} citas completadas`}
              icon={CalendarTodayIcon}
              color={theme => theme.palette.warning.main}
            />
          </Grid>

          {/* Estadísticas de chats */}
          <Grid item xs={12} md={6} lg={3}>
            <StatCard
              title="Conversaciones"
              mainStat={mockStats.totalChats}
              secondaryStat={`${mockStats.activeChats} chats activos`}
              icon={MessageIcon}
              color={theme => theme.palette.info.main}
            />
          </Grid>
        </Grid>

        {/* Aquí se pueden agregar más secciones de estadísticas como gráficos o tablas */}
        <Paper sx={{ mt: 3, p: 3, borderRadius: 1 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Próximamente: Gráficos y Análisis Detallado
          </Typography>
          <Typography color="text.secondary">
            Esta sección incluirá gráficos detallados de actividad, tendencias de uso,
            y métricas de rendimiento del sistema.
          </Typography>
        </Paper>
      </Box>
    </Layout>
  );
}
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  useTheme
} from '@mui/material';
import Layout from '../components/Layout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MessageIcon from '@mui/icons-material/Message';
import { useNavigate } from 'react-router-dom';

// Datos de ejemplo
const mockAppointments = [
  {
    id: 1,
    patientName: 'Carlos Rodríguez',
    date: '2025-05-04',
    time: '09:00',
    reason: 'Control mensual',
    status: 'pendiente'
  },
  {
    id: 2,
    patientName: 'Ana López',
    date: '2025-05-04',
    time: '10:30',
    reason: 'Primera consulta',
    status: 'confirmada'
  },
  {
    id: 3,
    patientName: 'Luis Martinez',
    date: '2025-05-04',
    time: '11:30',
    reason: 'Seguimiento',
    status: 'cancelada'
  }
];

export default function DoctorAppointments() {
  const theme = useTheme();
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'warning';
      case 'confirmada':
        return 'success';
      case 'cancelada':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Layout>
      <Box sx={{ 
        maxWidth: '1000px', 
        width: '100%', 
        mx: 'auto', 
        p: { xs: 2, sm: 3 } 
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3 
        }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Calendario de Citas
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {/* TODO: Implementar creación de cita */}}
          >
            Nueva Cita
          </Button>
        </Box>

        <Paper sx={{ width: '100%', borderRadius: 1 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Paciente</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Hora</TableCell>
                  <TableCell>Motivo</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockAppointments.map((appointment) => (
                  <TableRow
                    key={appointment.id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      backgroundColor: 
                        appointment.status === 'cancelada' 
                          ? theme.palette.action.hover 
                          : 'inherit'
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {appointment.patientName}
                    </TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.reason}</TableCell>
                    <TableCell>
                      <Chip
                        label={appointment.status}
                        color={getStatusColor(appointment.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => navigate('/')}
                        sx={{ mr: 1 }}
                      >
                        <MessageIcon fontSize="small" />
                      </IconButton>
                      {appointment.status === 'pendiente' && (
                        <>
                          <IconButton
                            size="small"
                            color="success"
                            sx={{ mr: 1 }}
                          >
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                          >
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Layout>
  );
}
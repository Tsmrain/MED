import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText, 
  Divider,
  IconButton,
  Paper,
  Button
} from '@mui/material';
import Layout from '../components/Layout';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MessageIcon from '@mui/icons-material/Message';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useNavigate } from 'react-router-dom';

// Datos de ejemplo
const mockDoctors = [
  {
    id: 1,
    name: 'Dr. Juan Pérez',
    specialty: 'Medicina General',
    availability: 'Lun-Vie 9:00-17:00',
    avatar: null
  },
  {
    id: 2,
    name: 'Dra. María García',
    specialty: 'Cardiología',
    availability: 'Mar-Jue 10:00-18:00',
    avatar: null
  },
];

export default function MyDoctors() {
  const navigate = useNavigate();

  return (
    <Layout>
      <Box sx={{ 
        maxWidth: '800px', 
        width: '100%', 
        mx: 'auto', 
        p: { xs: 2, sm: 3 } 
      }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Mis Doctores
        </Typography>

        <Paper sx={{ borderRadius: 1, mb: 3 }}>
          <List>
            {mockDoctors.map((doctor, index) => (
              <Box key={doctor.id}>
                <ListItem
                  secondaryAction={
                    <Box>
                      <IconButton 
                        edge="end" 
                        aria-label="message"
                        onClick={() => navigate('/')}
                        sx={{ mr: 1 }}
                      >
                        <MessageIcon />
                      </IconButton>
                      <IconButton 
                        edge="end" 
                        aria-label="schedule"
                        onClick={() => navigate('/appointments')}
                      >
                        <CalendarTodayIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <LocalHospitalIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={doctor.name}
                    secondary={
                      <>
                        <Typography variant="body2" component="span" display="block">
                          {doctor.specialty}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Disponible: {doctor.availability}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < mockDoctors.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </Paper>

        <Button
          variant="outlined"
          startIcon={<LocalHospitalIcon />}
          fullWidth
          onClick={() => {/* TODO: Implementar búsqueda de doctores */}}
        >
          Buscar Nuevos Doctores
        </Button>
      </Box>
    </Layout>
  );
}
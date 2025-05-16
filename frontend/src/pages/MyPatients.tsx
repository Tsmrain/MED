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
  TextField,
  InputAdornment,
  Chip
} from '@mui/material';
import Layout from '../components/Layout';
import SearchIcon from '@mui/icons-material/Search';
import MessageIcon from '@mui/icons-material/Message';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Datos de ejemplo
const mockPatients = [
  {
    id: 1,
    name: 'Carlos Rodríguez',
    age: 45,
    lastVisit: '2025-04-28',
    condition: 'Hipertensión',
    status: 'En tratamiento'
  },
  {
    id: 2,
    name: 'Ana López',
    age: 32,
    lastVisit: '2025-05-01',
    condition: 'Control prenatal',
    status: 'Seguimiento'
  },
];

export default function MyPatients() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <Box sx={{ 
        maxWidth: '800px', 
        width: '100%', 
        mx: 'auto', 
        p: { xs: 2, sm: 3 } 
      }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Mis Pacientes
        </Typography>

        <TextField
          fullWidth
          placeholder="Buscar pacientes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <Paper sx={{ borderRadius: 1 }}>
          <List>
            {filteredPatients.map((patient, index) => (
              <Box key={patient.id}>
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
                        aria-label="medical history"
                        onClick={() => navigate('/medical-history')}
                      >
                        <DescriptionIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {patient.name}
                        <Chip 
                          label={patient.status} 
                          size="small"
                          color={patient.status === 'En tratamiento' ? 'primary' : 'default'}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" component="span" display="block">
                          {patient.condition}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Edad: {patient.age} años • Última visita: {patient.lastVisit}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < filteredPatients.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </Paper>

        {filteredPatients.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
            <Typography variant="body1">
              No se encontraron pacientes
            </Typography>
          </Box>
        )}
      </Box>
    </Layout>
  );
}
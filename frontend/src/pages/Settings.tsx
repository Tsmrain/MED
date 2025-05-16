import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Divider
} from '@mui/material';
import Layout from '../components/Layout';
import { useState } from 'react';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('es');
  const [notifications, setNotifications] = useState(true);

  return (
    <Layout>
      <Box
        sx={{
          maxWidth: '800px',
          width: '100%',
          mx: 'auto',
          p: { xs: 2, sm: 3 }
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Configuración
        </Typography>

        <Paper sx={{ borderRadius: 1 }}>
          <List>
            <ListItem>
              <ListItemText 
                primary="Modo Oscuro" 
                secondary="Cambiar entre tema claro y oscuro"
              />
              <Switch
                edge="end"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
            </ListItem>
            
            <Divider />
            
            <ListItem>
              <FormControl fullWidth>
                <InputLabel id="language-select-label">Idioma</InputLabel>
                <Select
                  labelId="language-select-label"
                  value={language}
                  label="Idioma"
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <MenuItem value="es">Español</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="pt">Português</MenuItem>
                </Select>
              </FormControl>
            </ListItem>

            <Divider />

            <ListItem>
              <ListItemText 
                primary="Notificaciones" 
                secondary="Recibir notificaciones de nuevos mensajes"
              />
              <Switch
                edge="end"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
            </ListItem>

            <Divider />

            <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Versión de la aplicación
              </Typography>
              <Typography variant="body2">
                1.0.0
              </Typography>
            </ListItem>
          </List>
        </Paper>
      </Box>
    </Layout>
  );
}
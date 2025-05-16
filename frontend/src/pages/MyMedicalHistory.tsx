import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Button,
  IconButton
} from '@mui/material';
import Layout from '../components/Layout';
import { useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

// Datos de ejemplo
const mockMedicalHistory = {
  generalInfo: {
    bloodType: 'A+',
    height: '175 cm',
    weight: '70 kg',
    allergies: ['Penicilina', 'Polen'],
    chronicConditions: ['Hipertensión']
  },
  consultations: [
    {
      id: 1,
      date: '2025-05-01',
      doctor: 'Dr. Juan Pérez',
      reason: 'Control de presión arterial',
      diagnosis: 'Presión arterial controlada',
      prescription: 'Continuar con medicación actual'
    },
    {
      id: 2,
      date: '2025-04-15',
      doctor: 'Dra. María García',
      reason: 'Dolor de cabeza',
      diagnosis: 'Migraña',
      prescription: 'Sumatriptán 50mg'
    }
  ],
  medications: [
    {
      name: 'Enalapril',
      dose: '10mg',
      frequency: 'Una vez al día',
      startDate: '2024-01-15',
      endDate: null
    },
    {
      name: 'Sumatriptán',
      dose: '50mg',
      frequency: 'Según necesidad',
      startDate: '2025-04-15',
      endDate: '2025-05-15'
    }
  ]
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`medical-history-tabpanel-${index}`}
      aria-labelledby={`medical-history-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function MyMedicalHistory() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Layout>
      <Box sx={{ 
        maxWidth: '800px', 
        width: '100%', 
        mx: 'auto', 
        p: { xs: 2, sm: 3 } 
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
          gap: 2,
          flexWrap: 'wrap'
        }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Mi Historial Médico
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={() => {/* TODO: Implementar compartir */}}
            >
              Compartir
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => {/* TODO: Implementar descarga */}}
            >
              Descargar
            </Button>
          </Box>
        </Box>

        <Paper sx={{ borderRadius: 1 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Información General" />
            <Tab label="Consultas" />
            <Tab label="Medicamentos" />
          </Tabs>

          <TabPanel value={currentTab} index={0}>
            <List>
              <ListItem>
                <ListItemText
                  primary="Tipo de Sangre"
                  secondary={mockMedicalHistory.generalInfo.bloodType}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Altura"
                  secondary={mockMedicalHistory.generalInfo.height}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Peso"
                  secondary={mockMedicalHistory.generalInfo.weight}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Alergias"
                  secondary={
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      {mockMedicalHistory.generalInfo.allergies.map((allergy) => (
                        <Chip
                          key={allergy}
                          label={allergy}
                          color="warning"
                          size="small"
                        />
                      ))}
                    </Box>
                  }
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Condiciones Crónicas"
                  secondary={
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      {mockMedicalHistory.generalInfo.chronicConditions.map((condition) => (
                        <Chip
                          key={condition}
                          label={condition}
                          color="error"
                          size="small"
                        />
                      ))}
                    </Box>
                  }
                />
              </ListItem>
            </List>
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <List>
              {mockMedicalHistory.consultations.map((consultation, index) => (
                <Box key={consultation.id}>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" aria-label="compartir">
                        <ShareIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="subtitle1">
                            {consultation.reason}
                          </Typography>
                          <Chip
                            icon={<LocalHospitalIcon />}
                            label={consultation.doctor}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            Fecha: {consultation.date}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Diagnóstico: {consultation.diagnosis}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Prescripción: {consultation.prescription}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < mockMedicalHistory.consultations.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            <List>
              {mockMedicalHistory.medications.map((medication, index) => (
                <Box key={medication.name}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">
                            {medication.name}
                          </Typography>
                          <Chip
                            label={medication.endDate ? 'Completado' : 'Activo'}
                            color={medication.endDate ? 'default' : 'success'}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Dosis: {medication.dose}
                          </Typography>
                          <Typography variant="body2">
                            Frecuencia: {medication.frequency}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Desde: {medication.startDate}
                            {medication.endDate && ` • Hasta: ${medication.endDate}`}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < mockMedicalHistory.medications.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </TabPanel>
        </Paper>
      </Box>
    </Layout>
  );
}
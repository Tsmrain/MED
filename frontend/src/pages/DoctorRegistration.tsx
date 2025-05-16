import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
  FormHelperText
} from '@mui/material';
import { useState } from 'react';
import Layout from '../components/Layout';

const specialties = [
  'Medicina General',
  'Cardiología',
  'Dermatología',
  'Pediatría',
  'Ginecología',
  'Traumatología',
  'Psiquiatría',
  'Neurología'
];

const schedules = [
  'Mañana (8:00 - 14:00)',
  'Tarde (14:00 - 20:00)',
  'Jornada Completa (8:00 - 20:00)'
];

interface DoctorForm {
  name: string;
  email: string;
  phone: string;
  specialty: string;
  license: string;
  schedule: string;
  password: string;
  confirmPassword: string;
}

export default function DoctorRegistration() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<DoctorForm>({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    license: '',
    schedule: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Partial<DoctorForm>>({});
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const steps = [
    'Información Personal',
    'Información Profesional',
    'Credenciales'
  ];

  const validateStep = (step: number) => {
    const newErrors: Partial<DoctorForm> = {};

    if (step === 0) {
      if (!formData.name) newErrors.name = 'El nombre es requerido';
      if (!formData.email) newErrors.email = 'El email es requerido';
      if (!formData.phone) newErrors.phone = 'El teléfono es requerido';
    }

    if (step === 1) {
      if (!formData.specialty) newErrors.specialty = 'La especialidad es requerida';
      if (!formData.license) newErrors.license = 'La licencia médica es requerida';
      if (!formData.schedule) newErrors.schedule = 'El horario es requerido';
    }

    if (step === 2) {
      if (!formData.password) newErrors.password = 'La contraseña es requerida';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep === steps.length - 1) {
        handleSubmit();
      } else {
        setActiveStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (validateStep(activeStep)) {
      // TODO: Implementar registro en backend
      console.log('Form submitted:', formData);
      setSubmitSuccess(true);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.specialty}>
                <InputLabel>Especialidad</InputLabel>
                <Select
                  value={formData.specialty}
                  label="Especialidad"
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                >
                  {specialties.map((specialty) => (
                    <MenuItem key={specialty} value={specialty}>
                      {specialty}
                    </MenuItem>
                  ))}
                </Select>
                {errors.specialty && (
                  <FormHelperText>{errors.specialty}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Número de Licencia Médica"
                value={formData.license}
                onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                error={!!errors.license}
                helperText={errors.license}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.schedule}>
                <InputLabel>Horario de Atención</InputLabel>
                <Select
                  value={formData.schedule}
                  label="Horario de Atención"
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                >
                  {schedules.map((schedule) => (
                    <MenuItem key={schedule} value={schedule}>
                      {schedule}
                    </MenuItem>
                  ))}
                </Select>
                {errors.schedule && (
                  <FormHelperText>{errors.schedule}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirmar Contraseña"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <Box sx={{ 
        maxWidth: '800px', 
        width: '100%', 
        mx: 'auto', 
        p: { xs: 2, sm: 3 } 
      }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Registro de Doctor
        </Typography>

        <Paper sx={{ p: 3, borderRadius: 1 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {submitSuccess ? (
            <Alert severity="success" sx={{ mb: 3 }}>
              Doctor registrado exitosamente
            </Alert>
          ) : (
            <>
              {submitError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {submitError}
                </Alert>
              )}

              <Box sx={{ mb: 3 }}>
                {renderStepContent(activeStep)}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  Atrás
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  {activeStep === steps.length - 1 ? 'Registrar' : 'Siguiente'}
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Layout>
  );
}
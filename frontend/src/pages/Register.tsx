import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FieldValues } from 'react-hook-form';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { authService } from '../services/authService';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Alert,
  Autocomplete,
  CircularProgress,
  Link as MuiLink,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  AutocompleteRenderOptionState,
  TextFieldProps
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ReactCountryFlag from 'react-country-flag';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const SUPPORTED_COUNTRIES = [
  { code: 'BO', name: 'Bolivia', flag: 'BO', dialCode: '+591' },
  { code: 'AR', name: 'Argentina', flag: 'AR', dialCode: '+54' },
  { code: 'PE', name: 'Perú', flag: 'PE', dialCode: '+51' }
] as const;

type Country = typeof SUPPORTED_COUNTRIES[number];

interface RegisterFormData {
  firstName: string;
  lastName: string;
  country: Country;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  role: 'patient' | 'doctor';
  verificationCode?: string;
}

// Esquema de validación para el registro inicial
const registerSchema = yup.object().shape({
  firstName: yup.string().required('El nombre es obligatorio'),
  lastName: yup.string().required('El apellido es obligatorio'),
  country: yup.mixed<Country>()
    .oneOf([...SUPPORTED_COUNTRIES], 'Debes seleccionar un país válido de la lista.')
    .required('Debes seleccionar un país.'),
  phoneNumber: yup.string()
    .required('El número de teléfono es obligatorio')
    .matches(/^[0-9]+$/, 'Solo números permitidos')
    .min(8, 'Número muy corto')
    .max(15, 'Número muy largo'),
  role: yup.string()
    .oneOf(['patient', 'doctor'], 'Selecciona un tipo de usuario válido')
    .required('Selecciona el tipo de usuario'),
  password: yup.string()
    .required('La contraseña es obligatoria.')
    .min(6, 'La contraseña debe tener al menos 6 caracteres.'),
  confirmPassword: yup.string()
    .required('Debes confirmar tu contraseña.')
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden.'),
});

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const methods = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      country: SUPPORTED_COUNTRIES[0],
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      role: 'patient',
      verificationCode: ''
    }
  });

  const { control, handleSubmit, formState: { errors }, watch } = methods;

  const [showVerification, setShowVerification] = useState(false);
  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      console.log('Form data:', data);
      
      const registerData = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: `${data.country.dialCode}${data.phoneNumber}`,
        password: data.password,
        role: data.role
      };

      console.log('Submitting registration data:', registerData);

      const response = await authService.register(registerData);
      console.log('Registration response:', response);

      if (response.success) {
        setSuccess('Código de verificación enviado a tu teléfono');
        setShowVerification(true);
      } else {
        throw new Error(response.message || 'Error en el registro');
      }
    } catch (err: any) {
      console.error("Error detallado en registro:", err);
      setError(err.message || 'Error en el registro. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (code: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const phoneNumber = `${watch('country').dialCode}${watch('phoneNumber')}`;
      
      const response = await authService.verifyCode(phoneNumber, code);
      console.log('Verification response:', response);
      
      if (response.success) {
        setSuccess('¡Registro completado exitosamente!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        throw new Error(response.message || 'Error al verificar el código');
      }
    } catch (err: any) {
      setError(err.message || 'Error al verificar el código');
    } finally {
      setIsLoading(false);
    }
  };

  if (showVerification) {
    return (
      <Container maxWidth="sm">
        <Box sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}>
          <Paper elevation={2} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3
            }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                Verificación
              </Typography>
              
              {error && (
                <Alert severity="error" sx={{ width: '100%' }} onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ width: '100%' }}>
                  {success}
                </Alert>
              )}

              <Typography>
                Por favor, introduce el código de verificación enviado a tu teléfono
              </Typography>

              <Controller
                name="verificationCode"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Código de verificación"
                    margin="normal"
                    onChange={(e) => {
                      field.onChange(e);
                      if (e.target.value.length === 6) {
                        handleVerifyCode(e.target.value);
                      }
                    }}
                  />
                )}
              />

              <Typography variant="caption" color="textSecondary">
                El código tiene 6 dígitos y expira en 10 minutos
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}>
        <Paper
          elevation={2}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3
          }}>
            <Box
              component="img"
              src="/diagnosia-logo.svg"
              alt="DIAGNOSIA"
              sx={{ height: 48, width: 'auto', mb: 2 }}
            />
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Registro de Nuevo Usuario
            </Typography>
            {error && (
              <Alert severity="error" sx={{ width: '100%' }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ width: '100%' }}>
                {success}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)} sx={{ width: '100%' }}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Nombre"
                    margin="normal"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />

              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Apellidos"
                    margin="normal"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />

              <Controller
                name="country"
                control={control}
                defaultValue={SUPPORTED_COUNTRIES[0]}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete<Country>
                    options={SUPPORTED_COUNTRIES}
                    value={value}
                    getOptionLabel={(option) => `${option.name} (${option.dialCode})`}
                    isOptionEqualToValue={(option, value) => 
                      option?.code === value?.code
                    }
                    onChange={(_, newValue) => onChange(newValue)}
                    renderOption={(props, option) => (
                      <Box 
                        component="li" 
                        sx={{ '& > img': { mr: 2, flexShrink: 0 } }} 
                        {...props}
                      >
                        <ReactCountryFlag
                          countryCode={option.code}
                          svg
                          style={{ marginRight: '8px' }}
                        />
                        {option.name} ({option.dialCode})
                      </Box>
                    )}
                    renderInput={(params: TextFieldProps) => (
                      <TextField
                        {...params}
                        label="País"
                        margin="normal"
                        error={!!errors.country}
                        helperText={errors.country?.message}
                      />
                    )}
                  />
                )}
              />

              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Número de teléfono"
                    margin="normal"
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {watch('country')?.dialCode}
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth margin="normal" error={!!errors.role}>
                    <InputLabel>Tipo de Usuario</InputLabel>
                    <Select {...field} label="Tipo de Usuario">
                      <MenuItem value="patient">Paciente</MenuItem>
                      <MenuItem value="doctor">Doctor</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Confirmar Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    margin="normal"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    InputProps={{ // No es necesario el toggle aquí si el de arriba controla ambos, pero es buena práctica tenerlo individual
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)} // O una segunda variable de estado si quieres control individual
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={isLoading}
                sx={{ mt: 3, mb: 2 }}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Registrar'}
              </Button>
              <MuiLink
                component="button"
                type="button"
                onClick={() => navigate('/login')}
                sx={{ display: 'block', textAlign: 'center', mt: 2 }}
              >
                ¿Ya tienes una cuenta? Inicia sesión
              </MuiLink>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
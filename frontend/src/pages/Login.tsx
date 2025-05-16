import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ReactCountryFlag from 'react-country-flag';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Container,
  IconButton,
  InputAdornment,
  Alert,
  Link,
  Autocomplete,
  CircularProgress
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { loginSchema, LoginFormData } from '../validations/loginSchema';
import { authService } from '../services/authService';

const SUPPORTED_COUNTRIES = [
  { code: 'BO', name: 'Bolivia', flag: 'BO', dialCode: '+591' },
  { code: 'AR', name: 'Argentina', flag: 'AR', dialCode: '+54' },
  { code: 'PE', name: 'Perú', flag: 'PE', dialCode: '+51' }
] as const;

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors }, watch, getValues } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      country: SUPPORTED_COUNTRIES[0], // Bolivia by default
      phoneNumber: '',
      password: ''
    }
  });

  useEffect(() => {
    // Check if user is already logged in
    const savedPhone = localStorage.getItem('userPhone');
    const savedRole = localStorage.getItem('userRole');
    if (savedPhone && savedRole) {
      navigate('/');
    }
  }, [navigate]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const fullPhoneNumber = `${data.country.dialCode}${data.phoneNumber}`;
      const response = await authService.login(fullPhoneNumber, data.password);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      // Login successful
      if (!response.data) {
        throw new Error('Respuesta inválida del servidor');
      }
      const { phoneNumber, role, username } = response.data;
      localStorage.setItem('userPhone', phoneNumber || '');
      localStorage.setItem('userRole', role || '');
      localStorage.setItem('username', username || '');
      navigate('/');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { country, phoneNumber } = getValues();
      const fullPhoneNumber = `${country.dialCode}${phoneNumber}`;
      
      const response = await authService.sendResetCode(fullPhoneNumber);
      if (response.success && response.data) {
        navigate('/reset-password', { 
          state: { 
            phoneNumber: fullPhoneNumber,
            resetToken: response.data.resetToken 
          }
        });
      }
    } catch (error: any) {
      setError('Error al enviar el código de verificación');
    } finally {
      setIsLoading(false);
    }
  };

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
              Iniciar sesión
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: '100%' }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={SUPPORTED_COUNTRIES}
                    getOptionLabel={(option) => `${option.name} (${option.dialCode})`}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        <ReactCountryFlag
                          countryCode={option.code}
                          svg
                          style={{ marginRight: '8px' }}
                        />
                        {option.name} ({option.dialCode})
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="País"
                        error={!!errors.country}
                        helperText={errors.country?.message}
                        fullWidth
                      />
                    )}
                    onChange={(_, data) => field.onChange(data)}
                  />
                )}
              />

              <Box sx={{ mt: 2 }}>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Número de teléfono"
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
              </Box>

              <Box sx={{ mt: 2 }}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type={showPassword ? 'text' : 'password'}
                      label="Contraseña"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Box>

              <Link
                component="button"
                type="button"
                onClick={handleForgotPassword}
                sx={{ mt: 1, display: 'block', textAlign: 'left' }}
              >
                ¿Olvidaste tu contraseña?
              </Link>

              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={isLoading}
                sx={{ mt: 3, mb: 2 }}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Iniciar Sesión'}
              </Button>

              <Button
                fullWidth
                variant="text"
                onClick={() => navigate('/register')}
              >
                ¿No tienes cuenta? Regístrate
              </Button>
            </form>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
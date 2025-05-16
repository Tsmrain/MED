import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
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
  CircularProgress
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { authService } from '../services/authService';

interface LocationState {
  phoneNumber: string;
  resetToken: string;
}

const resetSchema = yup.object({
  code: yup.string()
    .required('Ingresa el código de verificación')
    .matches(/^\d{6}$/, 'El código debe tener 6 dígitos'),
  newPassword: yup.string()
    .required('Ingresa tu nueva contraseña')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: yup.string()
    .required('Confirma tu nueva contraseña')
    .oneOf([yup.ref('newPassword')], 'Las contraseñas no coinciden')
}).required();

type ResetFormData = yup.InferType<typeof resetSchema>;

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if no reset token
  if (!state?.resetToken || !state?.phoneNumber) {
    navigate('/login');
    return null;
  }

  const { control, handleSubmit, formState: { errors } } = useForm<ResetFormData>({
    resolver: yupResolver(resetSchema),
    defaultValues: {
      code: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: ResetFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.resetPassword(state.resetToken, data.newPassword);
      if (response.success) {
        navigate('/login', { 
          state: { message: 'Tu contraseña ha sido actualizada. Por favor inicia sesión.' }
        });
      }
    } catch (error: any) {
      setError('Error al actualizar la contraseña');
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
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Restablecer Contraseña
            </Typography>

            <Typography variant="body2" color="text.secondary" textAlign="center">
              Hemos enviado un código de verificación al número {state.phoneNumber}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: '100%' }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Código de verificación"
                    error={!!errors.code}
                    helperText={errors.code?.message}
                    sx={{ mb: 2 }}
                  />
                )}
              />

              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    label="Nueva contraseña"
                    error={!!errors.newPassword}
                    helperText={errors.newPassword?.message}
                    sx={{ mb: 2 }}
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

              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    label="Confirmar contraseña"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    sx={{ mb: 3 }}
                  />
                )}
              />

              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Actualizar Contraseña'}
              </Button>

              <Button
                fullWidth
                variant="text"
                onClick={() => navigate('/login')}
                sx={{ mt: 2 }}
              >
                Volver al inicio de sesión
              </Button>
            </form>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

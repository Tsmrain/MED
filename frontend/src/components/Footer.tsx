import { Box, Typography, useTheme } from '@mui/material';

export default function Footer() {
  const theme = useTheme();
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        backgroundColor: theme.palette.primary.main,
        color: '#fff',
        padding: '1rem',
        textAlign: 'center',
        mt: 'auto'
      }}
    >
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} DIAGNOSIA. All rights reserved.
      </Typography>
    </Box>
  );
}
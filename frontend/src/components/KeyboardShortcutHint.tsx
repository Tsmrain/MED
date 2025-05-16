import { Box, Typography, Fade } from '@mui/material';

interface KeyboardShortcutHintProps {
  visible?: boolean;
}

export default function KeyboardShortcutHint({ visible = false }: KeyboardShortcutHintProps) {
  return (
    <Fade in={visible} timeout={200}>
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: 'flex',
          gap: 2,
          padding: '8px 12px',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          borderRadius: '6px',
          color: '#fff',
          fontSize: '0.875rem',
          opacity: 0.8,
          pointerEvents: 'none',
          zIndex: 1000,
        }}
      >
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box component="span" sx={{ 
            padding: '2px 6px', 
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            fontSize: '0.75rem'
          }}>
            Ctrl + Enter
          </Box>
          to submit
        </Typography>
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box component="span" sx={{ 
            padding: '2px 6px', 
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            fontSize: '0.75rem'
          }}>
            Esc
          </Box>
          to clear
        </Typography>
      </Box>
    </Fade>
  );
}
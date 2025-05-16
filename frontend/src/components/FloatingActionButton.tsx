import { Fab, Zoom, useTheme, useScrollTrigger } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

export default function FloatingActionButton() {
  const theme = useTheme();
  const navigate = useNavigate();
  const trigger = useScrollTrigger({
    threshold: 100,
    disableHysteresis: true
  });

  return (
    <Zoom in={trigger}>
      <Fab
        color="primary"
        aria-label="nueva conversación"
        onClick={() => navigate('/')}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', sm: 'none' },
          backgroundColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          }
        }}
      >
        <AddIcon />
      </Fab>
    </Zoom>
  );
}
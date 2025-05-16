import { AppBar, Toolbar, IconButton, Box, useTheme, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const theme = useTheme();

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        zIndex: theme.zIndex.drawer + 1
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{ 
            color: theme.palette.text.primary,
            marginRight: 2 
          }}
        >
          <MenuIcon />
        </IconButton>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 2,
          flexGrow: 1
        }}>
          <Box
            component="img"
            src="/diagnosia-logo.svg"
            alt="DIAGNOSIA"
            sx={{ 
              height: 32,
              width: 'auto'
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              color: theme.palette.primary.main,
              display: { xs: 'none', sm: 'block' }
            }}
          >
            DIAGNOSIA
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
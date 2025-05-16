import { Box, useTheme } from '@mui/material';
import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import FloatingActionButton from './FloatingActionButton';
import { useSwipeGesture } from '../hooks/useSwipeGesture';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const theme = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useSwipeGesture({
    onSwipeRight: () => setIsSidebarOpen(true),
    onSwipeLeft: () => setIsSidebarOpen(false),
    threshold: 50
  });

  return (
    <Box sx={{ 
      display: 'flex',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.default,
      WebkitOverflowScrolling: 'touch',
    }}>
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar 
        open={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          width: '100%',
          overflow: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          pt: { xs: '56px', sm: '64px' },
          pb: { xs: '72px', sm: 0 },
        }}
      >
        {children}
      </Box>
      <FloatingActionButton />
    </Box>
  );
}
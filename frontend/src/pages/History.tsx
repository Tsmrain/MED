import { Box, Typography, List, ListItem, ListItemText, ListItemButton, IconButton, useTheme } from '@mui/material';
import Layout from '../components/Layout';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatIcon from '@mui/icons-material/Chat';

const mockHistory = [
  {
    id: '1',
    title: 'Consulta sobre medicación',
    date: '2 May 2025',
    preview: 'Discusión sobre efectos secundarios...'
  },
  {
    id: '2',
    title: 'Programación de cita',
    date: '1 May 2025',
    preview: 'Coordinación de horarios para...'
  }
];

export default function History() {
  const theme = useTheme();

  return (
    <Layout>
      <Box
        sx={{
          maxWidth: '800px',
          width: '100%',
          mx: 'auto',
          p: { xs: 2, sm: 3 }
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Historial de Conversaciones
        </Typography>

        <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 1 }}>
          {mockHistory.map((item) => (
            <ListItem
              key={item.id}
              disablePadding
              secondaryAction={
                <IconButton edge="end" aria-label="delete" sx={{ color: theme.palette.text.secondary }}>
                  <DeleteIcon />
                </IconButton>
              }
              sx={{
                borderBottom: `1px solid ${theme.palette.divider}`,
                '&:last-child': {
                  borderBottom: 'none'
                }
              }}
            >
              <ListItemButton sx={{ py: 2 }}>
                <ChatIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
                <ListItemText
                  primary={item.title}
                  secondary={
                    <Box component="span" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        {item.preview}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.date}
                      </Typography>
                    </Box>
                  }
                  primaryTypographyProps={{
                    variant: 'subtitle1',
                    fontWeight: 500,
                    gutterBottom: true
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {mockHistory.length === 0 && (
          <Box sx={{ textAlign: 'center', my: 4, color: 'text.secondary' }}>
            <Typography variant="body1">
              No hay conversaciones en el historial
            </Typography>
          </Box>
        )}
      </Box>
    </Layout>
  );
}
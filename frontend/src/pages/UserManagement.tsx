import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import Layout from '../components/Layout';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';

// Datos de ejemplo
const mockUsers = [
  {
    id: 1,
    name: 'Dr. Juan Pérez',
    email: 'juan.perez@diagnosia.com',
    role: 'doctor',
    specialty: 'Medicina General',
    status: 'activo'
  },
  {
    id: 2,
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@gmail.com',
    role: 'patient',
    status: 'activo'
  },
  {
    id: 3,
    name: 'Ana García',
    email: 'ana.garcia@diagnosia.com',
    role: 'admin',
    status: 'activo'
  }
];

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, userId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
  };

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'doctor':
        return 'primary';
      case 'admin':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Layout>
      <Box sx={{ 
        maxWidth: '1200px', 
        width: '100%', 
        mx: 'auto', 
        p: { xs: 2, sm: 3 } 
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
          gap: 2,
          flexWrap: 'wrap'
        }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Gestión de Usuarios
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {/* TODO: Implementar registro de paciente */}}
            >
              Nuevo Paciente
            </Button>
            <Button
              variant="contained"
              onClick={() => {/* TODO: Implementar registro de doctor */}}
            >
              Nuevo Doctor
            </Button>
          </Box>
        </Box>

        <TextField
          fullWidth
          placeholder="Buscar usuarios..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <Paper sx={{ width: '100%', borderRadius: 1 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {user.name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={getRoleColor(user.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={user.status === 'activo' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, user.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Editar</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <BlockIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Suspender</ListItemText>
            </MenuItem>
            <MenuItem 
              onClick={handleMenuClose}
              sx={{ color: 'error.main' }}
            >
              <ListItemIcon>
                <DeleteIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Eliminar</ListItemText>
            </MenuItem>
          </Menu>
        </Paper>

        {filteredUsers.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
            <Typography variant="body1">
              No se encontraron usuarios
            </Typography>
          </Box>
        )}
      </Box>
    </Layout>
  );
}
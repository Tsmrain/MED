import { 
  Box, 
  TextField, 
  IconButton, 
  Paper,
  Tooltip,
  useTheme,
  InputAdornment,
  Slide,
  useMediaQuery
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import ImageIcon from '@mui/icons-material/Image';
import { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const textFieldRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textFieldRef.current) {
      textFieldRef.current.style.height = 'auto';
      textFieldRef.current.style.height = `${textFieldRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
      if (textFieldRef.current) {
        textFieldRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderAttachmentButtons = () => (
    <>
      <Tooltip title="Adjuntar imagen">
        <IconButton 
          disabled={disabled}
          sx={{ 
            color: theme.palette.text.secondary,
            '&:hover': {
              backgroundColor: theme.palette.action.hover
            }
          }}
        >
          <ImageIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Usar voz">
        <IconButton 
          disabled={disabled}
          sx={{ 
            color: theme.palette.text.secondary,
            '&:hover': {
              backgroundColor: theme.palette.action.hover
            }
          }}
        >
          <MicIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  return (
    <Slide direction="up" in={true} mountOnEnter unmountOnExit>
      <Paper
        elevation={2}
        sx={{
          p: { xs: 1, sm: 2 },
          maxWidth: '800px',
          width: '100%',
          mx: 'auto',
          position: 'sticky',
          bottom: 0,
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'flex-end',
          }}
        >
          {/* Botones de adjuntar para móvil */}
          {isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {renderAttachmentButtons()}
            </Box>
          )}

          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder={isMobile ? "Escribe un mensaje..." : "Mensaje a Copilot..."}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            disabled={disabled}
            inputRef={textFieldRef}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    color="primary"
                    onClick={handleSend}
                    disabled={disabled || !message.trim()}
                    sx={{
                      transition: 'transform 0.2s',
                      '&:active': {
                        transform: 'scale(0.95)'
                      }
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.background.paper,
                borderRadius: '12px',
                transition: 'all 0.2s ease-in-out',
                '& fieldset': {
                  borderWidth: '1px',
                  borderColor: theme.palette.divider,
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
                '&.Mui-focused fieldset': {
                  borderWidth: '2px',
                },
                padding: { xs: 1, sm: 1.5 }
              },
              '& textarea': {
                fontSize: { xs: '1rem', sm: '1rem' },
                lineHeight: '1.5',
              }
            }}
          />
          
          {/* Botones de adjuntar para escritorio */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {renderAttachmentButtons()}
            </Box>
          )}
        </Box>
      </Paper>
    </Slide>
  );
}
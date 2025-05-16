import { Box, Typography, useTheme, Fab, Zoom } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Layout from '../components/Layout';
import ChatInput from '../components/ChatInput';
import LoadingIndicator from '../components/LoadingIndicator';
import { useChatScroll } from '../hooks/useChatScroll';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export default function Dashboard() {
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { showScrollButton, scrollToBottom } = useChatScroll({
    containerRef: chatContainerRef,
    threshold: 100
  });

  useEffect(() => {
    scrollToBottom('auto');
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    setIsProcessing(true);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Esta es una respuesta de ejemplo. En una implementación real, aquí iría la respuesta del asistente.',
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <Layout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          maxWidth: '800px',
          width: '100%',
          mx: 'auto',
          position: 'relative'
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              px: 2,
              gap: 2
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1.5rem', sm: '2rem' },
                mb: 2
              }}
            >
              ¿En qué puedo ayudarte hoy?
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ maxWidth: '600px' }}
            >
              Soy tu asistente médico virtual. Puedo ayudarte con consultas, programación de citas y más.
            </Typography>
          </Box>
        ) : (
          <Box
            ref={chatContainerRef}
            sx={{
              flex: 1,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              p: { xs: 2, sm: 3 },
              scrollBehavior: 'smooth'
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                <Box
                  sx={{
                    maxWidth: '80%',
                    backgroundColor: message.sender === 'user' 
                      ? theme.palette.primary.main 
                      : theme.palette.background.paper,
                    color: message.sender === 'user' 
                      ? theme.palette.primary.contrastText 
                      : theme.palette.text.primary,
                    borderRadius: 2,
                    p: 2,
                    boxShadow: theme.shadows[1],
                    wordBreak: 'break-word'
                  }}
                >
                  <Typography variant="body1">
                    {message.text}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: 'block',
                      mt: 1,
                      opacity: 0.8
                    }}
                  >
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Typography>
                </Box>
              </Box>
            ))}
            
            {isProcessing && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  mb: 2
                }}
              >
                <LoadingIndicator />
              </Box>
            )}
          </Box>
        )}

        <Box sx={{ 
          position: 'sticky', 
          bottom: 0, 
          width: '100%',
          mt: 'auto' 
        }}>
          <ChatInput 
            onSend={handleSendMessage} 
            disabled={isProcessing}
          />
        </Box>

        <Zoom in={showScrollButton}>
          <Fab
            size="small"
            color="primary"
            aria-label="scroll to bottom"
            onClick={() => scrollToBottom()}
            sx={{
              position: 'absolute',
              right: theme.spacing(2),
              bottom: theme.spacing(10),
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              boxShadow: theme.shadows[2],
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }}
          >
            <KeyboardArrowDownIcon />
          </Fab>
        </Zoom>
      </Box>
    </Layout>
  );
}
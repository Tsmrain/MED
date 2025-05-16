import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Divider,
  TextField,
  Alert
} from '@mui/material';
import Layout from '../components/Layout';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpIcon from '@mui/icons-material/Help';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useState } from 'react';

// FAQ data
const faqData = [
  {
    question: '¿Cómo puedo agendar una cita médica?',
    answer: `Para agendar una cita médica, dirígete a la sección "Mis Citas" en el menú principal. 
             Allí podrás ver la disponibilidad de los doctores y seleccionar el horario que mejor te convenga.`
  },
  {
    question: '¿Cómo funciona la consulta con el asistente virtual?',
    answer: `El asistente virtual utiliza inteligencia artificial para responder tus consultas médicas básicas. 
             Puedes acceder desde la página principal y escribir tu consulta. El asistente te guiará y, si es necesario, 
             te recomendará agendar una cita con un doctor.`
  },
  {
    question: '¿Es segura mi información médica?',
    answer: `Sí, tu información médica está protegida con los más altos estándares de seguridad. 
             Utilizamos encriptación de extremo a extremo y cumplimos con todas las regulaciones de 
             protección de datos médicos.`
  },
  {
    question: '¿Cómo puedo ver mi historial médico?',
    answer: `Tu historial médico está disponible en la sección "Mi Historial Médico". 
             Allí encontrarás todas tus consultas anteriores, recetas, y documentos médicos.`
  },
  {
    question: '¿Puedo compartir mi historial médico con mi doctor?',
    answer: `Sí, puedes compartir tu historial médico directamente con tu doctor desde la 
             plataforma. En la sección de historial médico encontrarás un botón para compartir 
             la información de forma segura.`
  }
];

export default function Help() {
  const [supportMessage, setSupportMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar envío de mensaje de soporte
    setShowSuccessMessage(true);
    setSupportMessage('');
    setTimeout(() => setShowSuccessMessage(false), 5000);
  };

  return (
    <Layout>
      <Box sx={{ 
        maxWidth: '800px', 
        width: '100%', 
        mx: 'auto', 
        p: { xs: 2, sm: 3 } 
      }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Centro de Ayuda
        </Typography>

        {/* Sección de contacto rápido */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 1 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Contacto Rápido
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<WhatsAppIcon />}
              onClick={() => window.open('https://wa.me/59171234567', '_blank')}
            >
              WhatsApp
            </Button>
            <Button
              variant="outlined"
              startIcon={<EmailIcon />}
              onClick={() => window.open('mailto:soporte@diagnosia.com')}
            >
              Email
            </Button>
          </Box>
        </Paper>

        {/* Preguntas frecuentes */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Preguntas Frecuentes
        </Typography>
        <Paper sx={{ mb: 3, borderRadius: 1 }}>
          {faqData.map((faq, index) => (
            <Accordion key={index} disableGutters>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  '&.Mui-expanded': {
                    minHeight: 48,
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HelpIcon color="primary" sx={{ fontSize: 20 }} />
                  <Typography>{faq.question}</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>

        {/* Formulario de soporte */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Contáctanos
        </Typography>
        <Paper sx={{ p: 3, borderRadius: 1 }}>
          {showSuccessMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.
            </Alert>
          )}
          <form onSubmit={handleSupportSubmit}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="¿En qué podemos ayudarte?"
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              placeholder="Describe tu consulta y te responderemos lo antes posible..."
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={!supportMessage.trim()}
            >
              Enviar Mensaje
            </Button>
          </form>
        </Paper>
      </Box>
    </Layout>
  );
}
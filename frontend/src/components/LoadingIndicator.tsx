import { Box, useTheme, keyframes } from '@mui/material';

const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
`;

export default function LoadingIndicator() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        p: 2,
        maxWidth: '80px',
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: theme.shadows[1],
      }}
    >
      {[0, 1, 2].map((index) => (
        <Box
          key={index}
          sx={{
            width: 8,
            height: 8,
            backgroundColor: theme.palette.primary.main,
            borderRadius: '50%',
            animation: `${bounce} 1.4s infinite ease-in-out both`,
            animationDelay: `${index * 0.16}s`,
          }}
        />
      ))}
    </Box>
  );
}
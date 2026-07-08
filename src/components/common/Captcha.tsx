import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import ImageIcon from '@mui/icons-material/Image';

interface CaptchaProps {
  onCodeGenerated: (code: string) => void;
}

type CaptchaMode = 'visual' | 'math';

export const Captcha: React.FC<CaptchaProps> = ({ onCodeGenerated }) => {
  const [mode, setMode] = useState<CaptchaMode>('visual');
  const [mathQuestion, setMathQuestion] = useState('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ariaNotification, setAriaNotification] = useState('');

  // Keep callback reference updated without triggering dependency updates
  const onCodeGeneratedRef = useRef(onCodeGenerated);
  useEffect(() => {
    onCodeGeneratedRef.current = onCodeGenerated;
  }, [onCodeGenerated]);

  // Generate random alphanumeric string
  const generateAlphanumeric = useCallback((): string => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz'; // Exclude ambiguous chars like 1, l, 0, O
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }, []);

  // Generate math expression
  const generateMath = useCallback((): { question: string; answer: string } => {
    const num1 = Math.floor(Math.random() * 10) + 1; // 1-10
    const num2 = Math.floor(Math.random() * 10) + 1; // 1-10
    const isPlus = Math.random() > 0.5;
    
    if (isPlus) {
      return {
        question: `What is ${num1} + ${num2}?`,
        answer: (num1 + num2).toString(),
      };
    } else {
      // Ensure no negative results for simplicity
      const max = Math.max(num1, num2);
      const min = Math.min(num1, num2);
      return {
        question: `What is ${max} - ${min}?`,
        answer: (max - min).toString(),
      };
    }
  }, []);

  // Main generator function
  const refreshCaptcha = useCallback(() => {
    if (mode === 'visual') {
      const code = generateAlphanumeric();
      onCodeGeneratedRef.current(code);
      drawVisual(code);
      setAriaNotification('New visual captcha image generated. Focus the text field to verify.');
    } else {
      const { question, answer } = generateMath();
      setMathQuestion(question);
      onCodeGeneratedRef.current(answer);
      setAriaNotification(`New math captcha challenge generated: ${question}`);
    }
  }, [mode, generateAlphanumeric, generateMath]);

  // Drawing the visual captcha onto canvas
  const drawVisual = (code: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background color
    ctx.fillStyle = '#EBF2ED'; // Light soft green background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw random noise lines in the background
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = `rgba(74, 107, 83, ${Math.random() * 0.4 + 0.1})`;
      ctx.lineWidth = Math.random() * 2 + 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Draw random noise dots
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(140, 98, 57, ${Math.random() * 0.3 + 0.1})`;
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw text characters with distortion
    ctx.textBaseline = 'middle';
    const charWidth = canvas.width / (code.length + 1);

    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      // Randomize font size
      const fontSize = Math.floor(Math.random() * 6) + 22; // 22-28px
      ctx.font = `bold ${fontSize}px "Outfit", "Arial"`;
      
      // Randomize character color (Matcha or Oolong shade)
      const colors = ['#2E4C37', '#8C6239', '#4A6B53', '#5C3C1A'];
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];

      // Random position with slight offset
      const x = (i + 0.7) * charWidth + (Math.random() * 4 - 2);
      const y = canvas.height / 2 + (Math.random() * 6 - 3);

      // Random rotation angle (-20deg to 20deg)
      const angle = (Math.random() * 40 - 20) * Math.PI / 180;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillText(char, -8, 0);
      ctx.restore();
    }
  };

  // Re-draw when mode changes or mounts
  useEffect(() => {
    refreshCaptcha();
  }, [mode, refreshCaptcha]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'visual' ? 'math' : 'visual'));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
      {/* Aria Live Region for accessibility announcements */}
      <Box
        role="status"
        aria-live="polite"
        sx={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {ariaNotification}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {/* Captcha Area */}
        <Box
          sx={{
            flex: 1,
            height: '48px',
            borderRadius: '12px',
            border: '1px solid rgba(228, 222, 214, 0.8)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FCFBFA',
          }}
        >
          {mode === 'visual' ? (
            <canvas
              ref={canvasRef}
              width={160}
              height={46}
              aria-label="Visual Captcha Image. If you cannot read it, click the accessibility button to switch to math challenge."
              style={{ display: 'block', width: '100%', height: '100%', cursor: 'pointer' }}
              onClick={refreshCaptcha}
            />
          ) : (
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: '#2A332C',
                letterSpacing: '0.05em',
                fontFamily: '"Outfit", sans-serif',
                userSelect: 'none',
              }}
            >
              {mathQuestion}
            </Typography>
          )}
        </Box>

        {/* Buttons Panel */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {/* Refresh Button */}
          <Tooltip title="Generate New Captcha">
            <IconButton
              onClick={refreshCaptcha}
              aria-label="Refresh security code"
              sx={{
                border: '1px solid rgba(228, 222, 214, 0.8)',
                borderRadius: '10px',
                color: '#5A6B5E',
                '&:hover': {
                  backgroundColor: 'rgba(74, 107, 83, 0.05)',
                  color: '#4A6B53',
                },
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Toggle Accessibility Mode */}
          <Tooltip title={mode === 'visual' ? 'Switch to Accessibility Math Challenge' : 'Switch to Alphanumeric Image'}>
            <IconButton
              onClick={toggleMode}
              aria-label={mode === 'visual' ? 'Switch to math question verification' : 'Switch to alphanumeric image verification'}
              sx={{
                border: '1px solid rgba(228, 222, 214, 0.8)',
                borderRadius: '10px',
                color: '#8C6239',
                '&:hover': {
                  backgroundColor: 'rgba(140, 98, 57, 0.05)',
                  color: '#5C3C1A',
                },
              }}
            >
              {mode === 'visual' ? <AccessibilityNewIcon fontSize="small" /> : <ImageIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

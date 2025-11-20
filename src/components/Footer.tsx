'use client';

import { Box, Container, Typography, Link } from '@mui/material';
import Image from 'next/image';
import { theyColors } from '@/theme/theme';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theyColors.blue,
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Image
              src="/they-logo.ico"
              alt="they logo"
              width={24}
              height={24}
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <Typography variant="body2">
              they prototype - Recycling Management System
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
            © {new Date().getFullYear()} they. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}


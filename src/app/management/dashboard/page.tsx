'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, CircularProgress, Box } from '@mui/material';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to facility selection page
    router.push('/management/facilities');
  }, [router]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    </Container>
  );
}


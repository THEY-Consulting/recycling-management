'use client';

import { Container, Typography, Box, Card, CardContent, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import RecyclingIcon from '@mui/icons-material/Recycling';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <RecyclingIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to the Recycling Management System
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Choose your interface to get started
        </Typography>
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: user?.role === 'customer' ? '1fr' : '1fr 1fr'
        },
        gap: 4,
        mt: 4,
        maxWidth: user?.role === 'customer' ? '500px' : '1000px',
        mx: 'auto'
      }}>
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: 6,
            },
          }}
        >
          <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
            <PersonIcon sx={{ fontSize: 60, color: '#F7B85A', mb: 2 }} />
            <Typography variant="h4" component="h2" gutterBottom>
              Customer Interface
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Book appointments, view facility utilization, and get your personalized waste disposal route.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push('/customer/facilities')}
                fullWidth
                sx={{
                  bgcolor: '#F7B85A',
                  '&:hover': { bgcolor: '#e5a749' }
                }}
              >
                Go to Customer Portal
              </Button>
            </Box>
          </CardContent>
        </Card>

        {user?.role !== 'customer' && (
          <Card
            sx={{
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 6,
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
              <BusinessIcon sx={{ fontSize: 60, color: '#164656', mb: 2 }} />
              <Typography variant="h4" component="h2" gutterBottom>
                Management Interface
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                View statistics, monitor waste levels, and schedule container maintenance.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => router.push('/management/facilities')}
                  fullWidth
                  sx={{
                    bgcolor: '#164656',
                    '&:hover': { bgcolor: '#0d2f3a' }
                  }}
                >
                  Go to Management Portal
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
}

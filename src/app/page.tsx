'use client';

import { Container, Typography, Box, Grid, Card, CardContent, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import RecyclingIcon from '@mui/icons-material/Recycling';

export default function Home() {
  const router = useRouter();

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

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
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
              <PersonIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h4" component="h2" gutterBottom>
                Customer Interface
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Book appointments, view facility utilization, and get your personalized waste disposal route.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => router.push('/customer/booking')}
                  fullWidth
                >
                  Go to Customer Portal
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
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
              <BusinessIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" component="h2" gutterBottom>
                Management Interface
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                View statistics, monitor waste levels, and schedule container maintenance.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => router.push('/management/dashboard')}
                  fullWidth
                >
                  Go to Management Portal
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

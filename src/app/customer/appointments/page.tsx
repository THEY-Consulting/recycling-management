'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  Alert,
} from '@mui/material';
import { format } from 'date-fns';
import EventIcon from '@mui/icons-material/Event';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useAuth } from '@/contexts/AuthContext';
import { bookingsApi, facilitiesApi } from '@/services/api';
import { Booking, RecyclingCenter } from '@/types';

export default function AppointmentsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [facilities, setFacilities] = useState<RecyclingCenter[]>([]);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadData();
  }, [isAuthenticated, router]);

  const loadData = async () => {
    try {
      // Load all facilities
      const allFacilities = await facilitiesApi.getAll();
      setFacilities(allFacilities);

      // Load all bookings for this customer
      if (user) {
        const allBookings = await bookingsApi.getByCustomerId(user.id);
        setUserBookings(allBookings.sort((a, b) => a.timeSlot.start.getTime() - b.timeSlot.start.getTime()));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await bookingsApi.cancel(bookingId);
      loadData(); // Reload data after cancellation
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  const handleViewRoute = (booking: Booking) => {
    router.push(`/customer/facility/${booking.facilityId}/route?bookingId=${booking.id}`);
  };

  const getFacilityForBooking = (booking: Booking): RecyclingCenter | undefined => {
    return facilities.find(f => f.id === booking.facilityId);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EventIcon /> My Appointments
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/customer/facilities')}
          sx={{ bgcolor: '#164656', '&:hover': { bgcolor: '#0d2f3a' } }}
        >
          Book New Appointment
        </Button>
      </Box>

      {userBookings.length === 0 ? (
        <Alert severity="info">
          You don't have any appointments yet.{' '}
          <Button color="inherit" onClick={() => router.push('/customer/facilities')}>
            Book Now
          </Button>
        </Alert>
      ) : (
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          },
          gap: 3,
        }}>
          {userBookings.map((booking) => {
            const facility = getFacilityForBooking(booking);
            if (!facility) return null;

            return (
              <Card key={booking.id} sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Box>
                      <Typography variant="h6">
                        {format(booking.timeSlot.start, 'EEEE, MMMM d, yyyy')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {format(booking.timeSlot.start, 'HH:mm')} - {format(booking.timeSlot.end, 'HH:mm')}
                      </Typography>
                    </Box>
                    <Chip
                      label={booking.status.toUpperCase()}
                      color={getStatusColor(booking.status) as any}
                      size="small"
                    />
                  </Box>

                  {/* Facility Information */}
                  <Box
                    sx={{
                      mb: 2,
                      p: 1.5,
                      bgcolor: '#f5f5f5',
                      borderRadius: 1,
                      borderLeft: '3px solid #164656'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                      <LocationOnIcon sx={{ fontSize: 16, color: '#164656' }} />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: '#164656',
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                        onClick={() => router.push(`/customer/facility/${facility.id}/booking`)}
                      >
                        {facility.name}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 2.5 }}>
                      {facility.address}
                    </Typography>
                  </Box>

                  <Typography variant="subtitle2" gutterBottom>
                    Waste Items:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {booking.wasteItems.map((item) => {
                      const wasteType = facility.wasteTypes.find((wt) => wt.id === item.wasteTypeId);
                      return (
                        <Chip
                          key={item.wasteTypeId}
                          label={`${wasteType?.name}: ${item.amount} kg`}
                          size="small"
                          sx={{ bgcolor: wasteType?.color, color: 'white' }}
                        />
                      );
                    })}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewRoute(booking)}
                    >
                      View Route
                    </Button>
                    {booking.status === 'pending' || booking.status === 'confirmed' ? (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel
                      </Button>
                    ) : null}
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}
    </Container>
  );
}


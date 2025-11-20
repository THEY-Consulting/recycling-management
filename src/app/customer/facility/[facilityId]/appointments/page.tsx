'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import { format } from 'date-fns';
import EventIcon from '@mui/icons-material/Event';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useAuth } from '@/contexts/AuthContext';
import { bookingsApi, facilitiesApi } from '@/services/api';
import { Booking, WasteType, RecyclingCenter } from '@/types';

export default function AppointmentsPage() {
  const router = useRouter();
  const params = useParams();
  const facilityId = params.facilityId as string;
  const { user, isAuthenticated } = useAuth();
  const [facility, setFacility] = useState<RecyclingCenter | null>(null);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadFacility();
  }, [isAuthenticated, facilityId, router]);

  useEffect(() => {
    if (user && facility) {
      loadBookings();
    }
  }, [user, facility]);

  const loadFacility = async () => {
    try {
      const facilityData = await facilitiesApi.getById(facilityId);
      if (!facilityData) {
        router.push('/customer/facilities');
        return;
      }
      setFacility(facilityData);
    } catch (error) {
      console.error('Error loading facility:', error);
      router.push('/customer/facilities');
    }
  };

  const loadBookings = async () => {
    if (!user || !facility) return;
    
    try {
      // Get all bookings for this customer at this facility
      const allBookings = await bookingsApi.getByCustomerId(user.id);
      const facilityBookings = allBookings.filter(b => b.facilityId === facilityId);
      setUserBookings(facilityBookings.sort((a, b) => a.timeSlot.start.getTime() - b.timeSlot.start.getTime()));
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await bookingsApi.cancel(bookingId);
      loadBookings(); // Reload bookings after cancellation
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  const handleViewRoute = (booking: Booking) => {
    setSelectedBooking(booking);
    router.push(`/customer/facility/${facilityId}/route?bookingId=${booking.id}`);
  };

  if (!isAuthenticated || !user || !facility) {
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

  // Calculate route for selected booking
  const calculateRoute = (booking: Booking) => {
    const wasteTypeIds = booking.wasteItems.map((item) => item.wasteTypeId);
    const containers = facility.wasteTypes.filter((wt) => wasteTypeIds.includes(wt.id));
    return containers.sort((a, b) => {
      if (a.position.y !== b.position.y) return a.position.y - b.position.y;
      return a.position.x - b.position.x;
    });
  };

  const selectedRoute = selectedBooking ? calculateRoute(selectedBooking) : [];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EventIcon /> My Appointments
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <LocationOnIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h6" color="primary">
            {facility.name}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {facility.address}
        </Typography>
        <Button
          variant="text"
          size="small"
          onClick={() => router.push('/customer/facilities')}
          sx={{ mt: 1 }}
        >
          Change Facility
        </Button>
      </Box>

      {userBookings.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          You don't have any appointments at this facility yet.{' '}
          <Button color="inherit" onClick={() => router.push(`/customer/facility/${facilityId}/booking`)}>
            Book Now
          </Button>
        </Alert>
      ) : (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {userBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
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

                    <Box sx={{ display: 'flex', gap: 1 }}>
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
              ))}
            </Box>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}


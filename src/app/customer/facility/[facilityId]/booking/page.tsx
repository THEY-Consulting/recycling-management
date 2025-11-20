'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Chip,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { bookingsApi, maintenanceApi, timeSlotsApi, facilitiesApi } from '@/services/api';
import { WasteItem, TimeSlot, Booking, MaintenanceSlot, RecyclingCenter } from '@/types';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const facilityId = params.facilityId as string;
  const { user, isAuthenticated } = useAuth();
  const [facility, setFacility] = useState<RecyclingCenter | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [wasteItems, setWasteItems] = useState<WasteItem[]>([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [maintenanceSlots, setMaintenanceSlots] = useState<MaintenanceSlot[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadFacility();
  }, [isAuthenticated, facilityId, router]);

  useEffect(() => {
    if (facility) {
      loadData();
    }
  }, [facility]);

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

  const loadData = async () => {
    if (!facility) return;

    try {
      const [bookingsData, maintenanceData, timeSlotsData] = await Promise.all([
        bookingsApi.getByFacilityId(facility.id),
        maintenanceApi.getByFacilityId(facility.id),
        timeSlotsApi.getByFacilityId(facility.id),
      ]);
      setBookings(bookingsData);
      setMaintenanceSlots(maintenanceData);
      setTimeSlots(timeSlotsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const facilityWasteTypes = facility?.wasteTypes || [];

  if (!facility) {
    return null;
  }

  const availableDates = Array.from(
    new Set(timeSlots.map(slot => format(slot.start, 'yyyy-MM-dd')))
  );

  const slotsForSelectedDate = selectedDate
    ? timeSlots.filter(slot => format(slot.start, 'yyyy-MM-dd') === selectedDate)
    : [];

  const addWasteItem = () => {
    setWasteItems([...wasteItems, { wasteTypeId: '', amount: 0 }]);
  };

  const removeWasteItem = (index: number) => {
    setWasteItems(wasteItems.filter((_, i) => i !== index));
  };

  const updateWasteItem = (index: number, field: 'wasteTypeId' | 'amount', value: string | number) => {
    const updated = [...wasteItems];
    updated[index] = { ...updated[index], [field]: value };
    setWasteItems(updated);
  };

  const calculateProjectedWasteLevels = (slot: TimeSlot): { [wasteTypeId: string]: number } => {
    const levels: { [wasteTypeId: string]: number } = {};

    // Initialize with current levels
    facilityWasteTypes.forEach(wt => {
      levels[wt.id] = wt.currentLevel;
    });

    // Add all bookings up to and including this slot for this facility
    bookings
      .filter(b => b.timeSlot.start <= slot.start && b.status !== 'cancelled')
      .forEach(booking => {
        booking.wasteItems.forEach(item => {
          const wasteType = facilityWasteTypes.find(wt => wt.id === item.wasteTypeId);
          if (wasteType) {
            levels[item.wasteTypeId] = (levels[item.wasteTypeId] || 0) + (item.amount / wasteType.capacity) * 100;
          }
        });
      });

    return levels;
  };

  const isSlotUnderMaintenance = (slot: TimeSlot): boolean => {
    return maintenanceSlots.some(
      ms => ms.status !== 'completed' &&
      ((ms.start <= slot.start && ms.end > slot.start) ||
       (ms.start < slot.end && ms.end >= slot.end))
    );
  };

  const isSlotAvailable = (slot: TimeSlot, wasteToCheck: WasteItem[] = []): boolean => {
    // Check if slot is at capacity
    if (slot.currentBookings >= slot.maxCapacity) {
      return false;
    }

    // Check if there's maintenance scheduled
    if (isSlotUnderMaintenance(slot)) {
      return false;
    }

    // Check if any waste containers would be at 100%
    if (wasteToCheck.length > 0) {
      const projectedLevels = calculateProjectedWasteLevels(slot);
      for (const item of wasteToCheck) {
        const currentLevel = projectedLevels[item.wasteTypeId] || 0;
        const wasteType = facilityWasteTypes.find(wt => wt.id === item.wasteTypeId);
        if (wasteType) {
          const additionalLevel = (item.amount / wasteType.capacity) * 100;
          if (currentLevel + additionalLevel >= 100) {
            return false;
          }
        }
      }
    }

    return true;
  };

  const validateBooking = (): boolean => {
    if (!selectedSlot) {
      setBookingError('Please select a time slot');
      return false;
    }
    if (wasteItems.length === 0) {
      setBookingError('Please add at least one waste type');
      return false;
    }
    if (wasteItems.some(item => !item.wasteTypeId || item.amount <= 0)) {
      setBookingError('Please complete all waste items');
      return false;
    }

    // Check if slot is still available with the selected waste
    if (!isSlotAvailable(selectedSlot, wasteItems)) {
      setBookingError('This time slot is no longer available for the selected waste types');
      return false;
    }

    return true;
  };

  const handleBooking = async () => {
    setBookingError('');
    if (validateBooking() && user && selectedSlot) {
      try {
        // Create booking via API
        const newBooking = await bookingsApi.create({
          facilityId: facility.id,
          customerId: user.id,
          customerName: user.name,
          timeSlot: selectedSlot,
          wasteItems: [...wasteItems],
          status: 'confirmed' as const,
        });

        selectedSlot.currentBookings += 1;

        setBookingSuccess(true);
        setTimeout(() => {
          setBookingSuccess(false);
          setWasteItems([]);
          setSelectedSlot(null);
          setSelectedDate('');
          router.push(`/customer/facility/${facilityId}/appointments`);
        }, 2000);
      } catch (error) {
        console.error('Error creating booking:', error);
        setBookingError('Failed to create booking. Please try again.');
      }
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Book Your Appointment
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

      {bookingSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Booking confirmed! Redirecting to your appointments...
        </Alert>
      )}

      {bookingError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {bookingError}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Card sx={{ width: '100%' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Select Date & Time
            </Typography>

              <FormControl sx={{ mb: 3, minWidth: 300, maxWidth: 400 }}>
                <InputLabel>Select Date</InputLabel>
                <Select
                  value={selectedDate}
                  label="Select Date"
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSlot(null);
                  }}
                >
                  {availableDates.map(date => (
                    <MenuItem key={date} value={date}>
                      {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedDate && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
                    Morning Slots (AM)
                  </Typography>
                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(12, 1fr)',
                    gap: 1.5,
                    mb: 4,
                    '@media (max-width: 1400px)': {
                      gridTemplateColumns: 'repeat(6, 1fr)',
                    },
                    '@media (max-width: 900px)': {
                      gridTemplateColumns: 'repeat(4, 1fr)',
                    },
                    '@media (max-width: 600px)': {
                      gridTemplateColumns: 'repeat(2, 1fr)',
                    },
                  }}>
                    {slotsForSelectedDate
                      .filter(slot => slot.start.getHours() < 12)
                      .map(slot => {
                        const available = isSlotAvailable(slot, wasteItems);
                        const underMaintenance = isSlotUnderMaintenance(slot);
                        const utilization = (slot.currentBookings / slot.maxCapacity) * 100;

                        return (
                          <Card
                            key={slot.start.toISOString()}
                            variant="outlined"
                            sx={{
                              cursor: available ? 'pointer' : 'not-allowed',
                              opacity: available ? 1 : 0.6,
                              border: selectedSlot === slot ? 2 : 1,
                              borderColor: selectedSlot === slot ? 'primary.main' : 'divider',
                              transition: 'all 0.2s',
                              '&:hover': available ? {
                                borderColor: 'primary.main',
                                boxShadow: 1,
                              } : {},
                            }}
                            onClick={() => available && setSelectedSlot(slot)}
                          >
                            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                              <Typography variant="body2" fontWeight="medium" sx={{ mb: 0.5, whiteSpace: 'nowrap' }}>
                                {format(slot.start, 'h:mm a')}
                              </Typography>
                              <Chip
                                label={underMaintenance ? 'Maintenance' : available ? 'Available' : 'Full'}
                                color={underMaintenance ? 'warning' : available ? 'success' : 'error'}
                                size="small"
                                sx={{ width: '100%', fontSize: '0.7rem' }}
                              />
                              <LinearProgress
                                variant="determinate"
                                value={utilization}
                                sx={{ mt: 1, height: 4, borderRadius: 2 }}
                                color={utilization > 80 ? 'error' : utilization > 50 ? 'warning' : 'success'}
                              />
                            </CardContent>
                          </Card>
                        );
                      })}
                  </Box>

                  <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
                    Afternoon Slots (PM)
                  </Typography>
                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(12, 1fr)',
                    gap: 1.5,
                    '@media (max-width: 1400px)': {
                      gridTemplateColumns: 'repeat(6, 1fr)',
                    },
                    '@media (max-width: 900px)': {
                      gridTemplateColumns: 'repeat(4, 1fr)',
                    },
                    '@media (max-width: 600px)': {
                      gridTemplateColumns: 'repeat(2, 1fr)',
                    },
                  }}>
                    {slotsForSelectedDate
                      .filter(slot => slot.start.getHours() >= 12)
                      .map(slot => {
                        const available = isSlotAvailable(slot, wasteItems);
                        const underMaintenance = isSlotUnderMaintenance(slot);
                        const utilization = (slot.currentBookings / slot.maxCapacity) * 100;

                        return (
                          <Card
                            key={slot.start.toISOString()}
                            variant="outlined"
                            sx={{
                              cursor: available ? 'pointer' : 'not-allowed',
                              opacity: available ? 1 : 0.6,
                              border: selectedSlot === slot ? 2 : 1,
                              borderColor: selectedSlot === slot ? 'primary.main' : 'divider',
                              transition: 'all 0.2s',
                              '&:hover': available ? {
                                borderColor: 'primary.main',
                                boxShadow: 1,
                              } : {},
                            }}
                            onClick={() => available && setSelectedSlot(slot)}
                          >
                            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                              <Typography variant="body2" fontWeight="medium" sx={{ mb: 0.5, whiteSpace: 'nowrap' }}>
                                {format(slot.start, 'h:mm a')}
                              </Typography>
                              <Chip
                                label={underMaintenance ? 'Maintenance' : available ? 'Available' : 'Full'}
                                color={underMaintenance ? 'warning' : available ? 'success' : 'error'}
                                size="small"
                                sx={{ width: '100%', fontSize: '0.7rem' }}
                              />
                              <LinearProgress
                                variant="determinate"
                                value={utilization}
                                sx={{ mt: 1, height: 4, borderRadius: 2 }}
                                color={utilization > 80 ? 'error' : utilization > 50 ? 'warning' : 'success'}
                              />
                            </CardContent>
                          </Card>
                        );
                      })}
                  </Box>
                </Box>
              )}
            </CardContent>
        </Card>

        <Card sx={{ width: '100%' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Waste Items
            </Typography>

            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 2,
              mb: 3,
              '@media (max-width: 1200px)': {
                gridTemplateColumns: 'repeat(3, 1fr)',
              },
              '@media (max-width: 900px)': {
                gridTemplateColumns: 'repeat(2, 1fr)',
              },
              '@media (max-width: 600px)': {
                gridTemplateColumns: '1fr',
              },
            }}>
              {wasteItems.map((item, index) => (
                <Box key={index} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>Waste Type</InputLabel>
                    <Select
                      value={item.wasteTypeId}
                      label="Waste Type"
                      onChange={(e) => updateWasteItem(index, 'wasteTypeId', e.target.value)}
                    >
                      {facilityWasteTypes.map(wt => (
                        <MenuItem key={wt.id} value={wt.id}>
                          {wt.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    type="number"
                    label="Amount (kg)"
                    value={item.amount || ''}
                    onChange={(e) => updateWasteItem(index, 'amount', parseFloat(e.target.value) || 0)}
                    inputProps={{ min: 0, step: 0.1 }}
                  />

                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => removeWasteItem(index)}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
            </Box>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addWasteItem}
                sx={{ mb: 3 }}
              >
                Add Waste Item
              </Button>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleBooking}
                disabled={!selectedSlot || wasteItems.length === 0}
              >
                Confirm Booking
              </Button>
            </CardContent>
        </Card>
      </Box>
    </Container>
  );
}


'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
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
import { mockRecyclingCenter, mockTimeSlots, mockWasteTypes } from '@/data/mockData';
import { WasteItem, TimeSlot } from '@/types';
import { format } from 'date-fns';

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [wasteItems, setWasteItems] = useState<WasteItem[]>([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const availableDates = Array.from(
    new Set(mockTimeSlots.map(slot => format(slot.start, 'yyyy-MM-dd')))
  );

  const slotsForSelectedDate = selectedDate
    ? mockTimeSlots.filter(slot => format(slot.start, 'yyyy-MM-dd') === selectedDate)
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

  const validateBooking = (): boolean => {
    if (!customerName.trim()) {
      setBookingError('Please enter your name');
      return false;
    }
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

    // Check if slot is full
    if (selectedSlot.currentBookings >= selectedSlot.maxCapacity) {
      setBookingError('This time slot is fully booked');
      return false;
    }

    // Check waste capacity
    for (const item of wasteItems) {
      const wasteType = mockWasteTypes.find(w => w.id === item.wasteTypeId);
      if (wasteType) {
        const projectedLevel = wasteType.currentLevel + (item.amount / wasteType.capacity) * 100;
        if (projectedLevel > 100) {
          setBookingError(`Cannot accept ${wasteType.name} - container will be full`);
          return false;
        }
      }
    }

    return true;
  };

  const handleBooking = () => {
    setBookingError('');
    if (validateBooking()) {
      // In a real app, this would make an API call
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setCustomerName('');
        setWasteItems([]);
        setSelectedSlot(null);
        setSelectedDate('');
      }, 3000);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Book Your Appointment
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Select a time slot and specify the waste you'll be bringing
      </Typography>

      {bookingSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Booking confirmed! You will receive a confirmation email shortly.
        </Alert>
      )}

      {bookingError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setBookingError('')}>
          {bookingError}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Booking Details
              </Typography>

              <Box sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="Your Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  sx={{ mb: 3 }}
                />

                <FormControl fullWidth sx={{ mb: 3 }}>
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
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Available Time Slots
                    </Typography>
                    <Grid container spacing={1}>
                      {slotsForSelectedDate.map(slot => {
                        const utilization = (slot.currentBookings / slot.maxCapacity) * 100;
                        const isAvailable = slot.currentBookings < slot.maxCapacity;

                        return (
                          <Grid item xs={6} sm={4} md={3} key={slot.id}>
                            <Button
                              fullWidth
                              variant={selectedSlot?.id === slot.id ? 'contained' : 'outlined'}
                              color={isAvailable ? 'primary' : 'error'}
                              disabled={!isAvailable}
                              onClick={() => setSelectedSlot(slot)}
                              sx={{ flexDirection: 'column', py: 1.5 }}
                            >
                              <Typography variant="body2">
                                {format(slot.start, 'HH:mm')}
                              </Typography>
                              <Typography variant="caption">
                                {slot.currentBookings}/{slot.maxCapacity}
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={utilization}
                                sx={{ width: '100%', mt: 0.5 }}
                                color={utilization > 80 ? 'error' : utilization > 50 ? 'warning' : 'success'}
                              />
                            </Button>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                )}

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Waste Items
                </Typography>
                {wasteItems.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <FormControl sx={{ flex: 2 }}>
                      <InputLabel>Waste Type</InputLabel>
                      <Select
                        value={item.wasteTypeId}
                        label="Waste Type"
                        onChange={(e) => updateWasteItem(index, 'wasteTypeId', e.target.value)}
                      >
                        {mockWasteTypes.map(type => (
                          <MenuItem key={type.id} value={type.id}>
                            {type.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      sx={{ flex: 1 }}
                      label="Amount (kg)"
                      type="number"
                      value={item.amount || ''}
                      onChange={(e) => updateWasteItem(index, 'amount', parseFloat(e.target.value) || 0)}
                    />
                    <IconButton color="error" onClick={() => removeWasteItem(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={addWasteItem}
                  variant="outlined"
                  sx={{ mt: 1 }}
                >
                  Add Waste Type
                </Button>

                <Box sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    fullWidth
                    onClick={handleBooking}
                  >
                    Confirm Booking
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Waste Levels
              </Typography>
              {mockWasteTypes.map(type => (
                <Box key={type.id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">{type.name}</Typography>
                    <Typography variant="body2">{type.currentLevel}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={type.currentLevel}
                    color={type.currentLevel > 80 ? 'error' : type.currentLevel > 50 ? 'warning' : 'success'}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Facility Information
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Address:</strong><br />
                {mockRecyclingCenter.address}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Slot Duration:</strong> {mockRecyclingCenter.slotDuration} minutes
              </Typography>
              <Typography variant="body2">
                <strong>Opening Hours:</strong>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Core hours: 08:00 - 16:00<br />
                Appointment only: 06:00 - 08:00, 16:00 - 20:00
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}


'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  LinearProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { maintenanceApi, facilitiesApi } from '@/services/api';
import { MaintenanceSlot, RecyclingCenter } from '@/types';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

export default function MaintenancePage() {
  const router = useRouter();
  const params = useParams();
  const facilityId = params.facilityId as string;
  const { user, isAuthenticated } = useAuth();
  const [facility, setFacility] = useState<RecyclingCenter | null>(null);
  const [maintenanceSlots, setMaintenanceSlots] = useState<MaintenanceSlot[]>([]);
  const [selectedWasteType, setSelectedWasteType] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [duration, setDuration] = useState(2); // hours
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.role !== 'management') {
      router.push('/');
      return;
    }
    loadFacility();
  }, [isAuthenticated, user, facilityId, router]);

  useEffect(() => {
    if (facility) {
      loadMaintenanceSlots();
    }
  }, [facility]);

  const loadFacility = async () => {
    try {
      const facilityData = await facilitiesApi.getById(facilityId);
      if (!facilityData) {
        router.push('/management/facilities');
        return;
      }
      setFacility(facilityData);
    } catch (error) {
      console.error('Error loading facility:', error);
      router.push('/management/facilities');
    }
  };

  const loadMaintenanceSlots = async () => {
    if (!facility) return;

    try {
      const slots = await maintenanceApi.getByFacilityId(facility.id);
      setMaintenanceSlots(slots);
    } catch (error) {
      console.error('Error loading maintenance slots:', error);
    }
  };

  if (!isAuthenticated || user?.role !== 'management' || !facility) {
    return null;
  }

  const facilityWasteTypes = facility.wasteTypes;

  const handleScheduleMaintenance = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!selectedWasteType || !startDateTime) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    const start = new Date(startDateTime);
    const end = new Date(start);
    end.setHours(end.getHours() + duration);

    try {
      await maintenanceApi.create({
        facilityId: facility.id,
        start,
        end,
        wasteTypeId: selectedWasteType,
        status: 'scheduled',
      });

      setSuccessMessage('Maintenance slot scheduled successfully');
      setSelectedWasteType('');
      setStartDateTime('');
      setDuration(2);

      // Reload maintenance slots
      loadMaintenanceSlots();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error scheduling maintenance:', error);
      setErrorMessage('Failed to schedule maintenance. Please try again.');
    }
  };

  const handleDeleteSlot = async (id: string) => {
    try {
      await maintenanceApi.delete(id);
      loadMaintenanceSlots(); // Reload after deletion
    } catch (error) {
      console.error('Error deleting maintenance slot:', error);
      setErrorMessage('Failed to delete maintenance slot. Please try again.');
    }
  };

  const getStatusColor = (status: MaintenanceSlot['status']) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'in-progress':
        return 'warning';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Container Maintenance Scheduling
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
          onClick={() => router.push('/management/facilities')}
          sx={{ mt: 1 }}
        >
          Change Facility
        </Button>
      </Box>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      )}

      {/* Container Status - First Row */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Current Waste Container Status
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, mt: 2, flexWrap: 'wrap' }}>
            {facilityWasteTypes.map(type => (
              <Box
                key={type.id}
                sx={{
                  flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: `1 1 calc(${100 / facilityWasteTypes.length}% - 24px)` },
                  minWidth: 0
                }}
              >
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold" noWrap>
                        {type.name}
                      </Typography>
                      <Chip
                        label={`${type.currentLevel}%`}
                        size="small"
                        color={type.currentLevel > 80 ? 'error' : type.currentLevel > 50 ? 'warning' : 'success'}
                      />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={type.currentLevel}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: type.color,
                        },
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {((type.currentLevel / 100) * type.capacity).toFixed(0)} kg
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {type.capacity} kg
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Form and Table Side by Side */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 3
      }}>
        {/* Schedule New Maintenance Form */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Schedule New Maintenance
            </Typography>

            <Box sx={{ mt: 3 }}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Waste Container</InputLabel>
                <Select
                  value={selectedWasteType}
                  label="Waste Container"
                  onChange={(e) => setSelectedWasteType(e.target.value)}
                >
                  {facilityWasteTypes.map(type => (
                    <MenuItem key={type.id} value={type.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: type.color,
                          }}
                        />
                        {type.name} ({type.currentLevel}% full)
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Start Date & Time"
                type="datetime-local"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Duration (hours)"
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value) || 2)}
                inputProps={{ min: 0.5, max: 8, step: 0.5 }}
                sx={{ mb: 3 }}
              />

              <Alert severity="info" sx={{ mb: 3 }}>
                During maintenance, customer bookings will be blocked for this time period.
              </Alert>

              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                startIcon={<AddIcon />}
                onClick={handleScheduleMaintenance}
              >
                Schedule Maintenance
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Scheduled Maintenance Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Scheduled Maintenance
            </Typography>

            <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Container</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>End Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {maintenanceSlots.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                          No maintenance slots scheduled
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    maintenanceSlots
                      .sort((a, b) => a.start.getTime() - b.start.getTime())
                      .map(slot => {
                        const wasteType = facilityWasteTypes.find(w => w.id === slot.wasteTypeId);
                        return (
                          <TableRow key={slot.id}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: '50%',
                                    backgroundColor: wasteType?.color,
                                  }}
                                />
                                {wasteType?.name}
                              </Box>
                            </TableCell>
                            <TableCell>
                              {format(slot.start, 'MMM dd, yyyy HH:mm')}
                            </TableCell>
                            <TableCell>
                              {format(slot.end, 'MMM dd, yyyy HH:mm')}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={slot.status}
                                size="small"
                                color={getStatusColor(slot.status)}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteSlot(slot.id)}
                                disabled={slot.status === 'completed'}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

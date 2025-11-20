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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { mockMaintenanceSlots, mockWasteTypes } from '@/data/mockData';
import { MaintenanceSlot } from '@/types';
import { format } from 'date-fns';

export default function MaintenancePage() {
  const [maintenanceSlots, setMaintenanceSlots] = useState<MaintenanceSlot[]>(mockMaintenanceSlots);
  const [selectedWasteType, setSelectedWasteType] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [duration, setDuration] = useState(2); // hours
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleScheduleMaintenance = () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!selectedWasteType || !startDateTime) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    const start = new Date(startDateTime);
    const end = new Date(start);
    end.setHours(end.getHours() + duration);

    const newSlot: MaintenanceSlot = {
      id: `maint-${Date.now()}`,
      start,
      end,
      wasteTypeId: selectedWasteType,
      status: 'scheduled',
    };

    setMaintenanceSlots([...maintenanceSlots, newSlot]);
    setSuccessMessage('Maintenance slot scheduled successfully');
    setSelectedWasteType('');
    setStartDateTime('');
    setDuration(2);

    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDeleteSlot = (id: string) => {
    setMaintenanceSlots(maintenanceSlots.filter(slot => slot.id !== id));
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
      <Typography variant="h3" component="h1" gutterBottom>
        Container Maintenance Scheduling
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Schedule container emptying and maintenance appointments
      </Typography>

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

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
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
                    {mockWasteTypes.map(type => (
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

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Container Status
              </Typography>
              {mockWasteTypes
                .sort((a, b) => b.currentLevel - a.currentLevel)
                .map(type => (
                  <Box key={type.id} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            backgroundColor: type.color,
                          }}
                        />
                        <Typography variant="body2">{type.name}</Typography>
                      </Box>
                      <Chip
                        label={`${type.currentLevel}%`}
                        size="small"
                        color={type.currentLevel > 80 ? 'error' : type.currentLevel > 50 ? 'warning' : 'success'}
                      />
                    </Box>
                  </Box>
                ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
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
                          const wasteType = mockWasteTypes.find(w => w.id === slot.wasteTypeId);
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
        </Grid>
      </Grid>
    </Container>
  );
}

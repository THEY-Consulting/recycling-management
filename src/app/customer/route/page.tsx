'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
} from '@mui/material';
import { mockRecyclingCenter, mockWasteTypes } from '@/data/mockData';
import { WasteType } from '@/types';
import RoomIcon from '@mui/icons-material/Room';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function RoutePage() {
  const [selectedWasteTypes, setSelectedWasteTypes] = useState<string[]>([]);

  // Calculate optimal route based on selected waste types
  const calculateRoute = () => {
    const selectedTypes = mockWasteTypes.filter(w => selectedWasteTypes.includes(w.id));
    
    // Sort by position to create an efficient route
    const sorted = [...selectedTypes].sort((a, b) => {
      // Sort by y first, then by x
      if (Math.abs(a.position.y - b.position.y) > 50) {
        return a.position.y - b.position.y;
      }
      return a.position.x - b.position.x;
    });

    return sorted;
  };

  const route = calculateRoute();
  const layout = mockRecyclingCenter.facilityLayout;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Your Disposal Route
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Select the waste types you're bringing to see your optimal route
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Facility Layout
              </Typography>
              
              <Paper
                sx={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: `${(layout.height / layout.width) * 100}%`,
                  backgroundColor: '#f0f0f0',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                >
                  {/* Entrance */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: `${(layout.entrance.x / layout.width) * 100}%`,
                      top: `${(layout.entrance.y / layout.height) * 100}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <Chip
                      icon={<RoomIcon />}
                      label="Entrance"
                      color="primary"
                      size="small"
                    />
                  </Box>

                  {/* Exit */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: `${(layout.exit.x / layout.width) * 100}%`,
                      top: `${(layout.exit.y / layout.height) * 100}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <Chip
                      icon={<RoomIcon />}
                      label="Exit"
                      color="secondary"
                      size="small"
                    />
                  </Box>

                  {/* Waste containers */}
                  {mockWasteTypes.map((wasteType, index) => {
                    const isSelected = selectedWasteTypes.includes(wasteType.id);
                    const routeIndex = route.findIndex(r => r.id === wasteType.id);
                    
                    return (
                      <Box
                        key={wasteType.id}
                        sx={{
                          position: 'absolute',
                          left: `${(wasteType.position.x / layout.width) * 100}%`,
                          top: `${(wasteType.position.y / layout.height) * 100}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            backgroundColor: wasteType.color,
                            border: isSelected ? '4px solid #000' : '2px solid #fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 2,
                            opacity: isSelected ? 1 : 0.5,
                          }}
                        >
                          {routeIndex >= 0 && (
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                              {routeIndex + 1}
                            </Typography>
                          )}
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            position: 'absolute',
                            top: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            whiteSpace: 'nowrap',
                            mt: 0.5,
                            fontWeight: isSelected ? 'bold' : 'normal',
                          }}
                        >
                          {wasteType.name}
                        </Typography>
                      </Box>
                    );
                  })}

                  {/* Draw route lines */}
                  {route.length > 1 && (
                    <svg
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                      }}
                    >
                      {/* Line from entrance to first container */}
                      <line
                        x1={`${(layout.entrance.x / layout.width) * 100}%`}
                        y1={`${(layout.entrance.y / layout.height) * 100}%`}
                        x2={`${(route[0].position.x / layout.width) * 100}%`}
                        y2={`${(route[0].position.y / layout.height) * 100}%`}
                        stroke="#000"
                        strokeWidth="3"
                        strokeDasharray="5,5"
                      />

                      {/* Lines between containers */}
                      {route.map((wasteType, index) => {
                        if (index === route.length - 1) return null;
                        const next = route[index + 1];
                        return (
                          <line
                            key={`line-${index}`}
                            x1={`${(wasteType.position.x / layout.width) * 100}%`}
                            y1={`${(wasteType.position.y / layout.height) * 100}%`}
                            x2={`${(next.position.x / layout.width) * 100}%`}
                            y2={`${(next.position.y / layout.height) * 100}%`}
                            stroke="#000"
                            strokeWidth="3"
                            strokeDasharray="5,5"
                          />
                        );
                      })}

                      {/* Line from last container to exit */}
                      <line
                        x1={`${(route[route.length - 1].position.x / layout.width) * 100}%`}
                        y1={`${(route[route.length - 1].position.y / layout.height) * 100}%`}
                        x2={`${(layout.exit.x / layout.width) * 100}%`}
                        y2={`${(layout.exit.y / layout.height) * 100}%`}
                        stroke="#000"
                        strokeWidth="3"
                        strokeDasharray="5,5"
                      />
                    </svg>
                  )}
                </Box>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Select Waste Types
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Waste Types</InputLabel>
                <Select
                  multiple
                  value={selectedWasteTypes}
                  label="Waste Types"
                  onChange={(e) => setSelectedWasteTypes(e.target.value as string[])}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const wasteType = mockWasteTypes.find(w => w.id === value);
                        return (
                          <Chip
                            key={value}
                            label={wasteType?.name}
                            size="small"
                            sx={{ backgroundColor: wasteType?.color, color: 'white' }}
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {mockWasteTypes.map((type) => (
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
                        {type.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>

          {route.length > 0 && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Route Instructions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RoomIcon color="primary" />
                    <Typography variant="body2">Start at Entrance</Typography>
                  </Box>

                  {route.map((wasteType, index) => (
                    <Box key={wasteType.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <ArrowForwardIcon fontSize="small" />
                        <Typography variant="body2" fontWeight="bold">
                          Step {index + 1}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 4 }}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            backgroundColor: wasteType.color,
                          }}
                        />
                        <Typography variant="body2">{wasteType.name}</Typography>
                      </Box>
                    </Box>
                  ))}

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RoomIcon color="secondary" />
                    <Typography variant="body2">Exit at Exit Point</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}


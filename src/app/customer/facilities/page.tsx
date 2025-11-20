'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useFacility } from '@/contexts/FacilityContext';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RecyclingIcon from '@mui/icons-material/Recycling';
import ViewListIcon from '@mui/icons-material/ViewList';
import MapIcon from '@mui/icons-material/Map';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const FacilityMap = dynamic(() => import('@/components/FacilityMap'), {
  ssr: false,
  loading: () => <Box sx={{ height: { xs: '400px', md: '600px' }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading map...</Box>,
});

export default function CustomerFacilitiesPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { facilities, setSelectedFacility } = useFacility();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleSelectFacility = (facility: any) => {
    setSelectedFacility(facility);
    router.push(`/customer/facility/${facility.id}/booking`);
  };

  const getOpeningHoursText = (facility: any) => {
    const weekdayHours = facility.openingHours.find((h: any) => h.dayOfWeek === 1);
    if (!weekdayHours) return 'See details';
    return `${weekdayHours.coreStart} - ${weekdayHours.coreEnd}`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1">
          Select a Recycling Facility
        </Typography>

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, newMode) => newMode && setViewMode(newMode)}
          aria-label="view mode"
          size="small"
        >
          <ToggleButton value="list" aria-label="list view">
            <ViewListIcon sx={{ mr: 1 }} />
            List
          </ToggleButton>
          <ToggleButton value="map" aria-label="map view">
            <MapIcon sx={{ mr: 1 }} />
            Map
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {viewMode === 'map' ? (
        <FacilityMap
          facilities={facilities}
          onSelectFacility={handleSelectFacility}
        />
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
        {facilities.map((facility) => (
            <Card key={facility.id} sx={{ display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <RecyclingIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h6" component="div">
                    {facility.name}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <LocationOnIcon sx={{ fontSize: 20, color: 'text.secondary', mr: 1, mt: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {facility.address}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccessTimeIcon sx={{ fontSize: 20, color: 'text.secondary', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {getOpeningHoursText(facility)}
                  </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                    Available waste types:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                    {facility.wasteTypes.slice(0, 4).map((type) => (
                      <Chip
                        key={type.id}
                        label={type.name}
                        size="small"
                        sx={{
                          backgroundColor: type.color,
                          color: '#fff',
                          fontSize: '0.7rem',
                        }}
                      />
                    ))}
                    {facility.wasteTypes.length > 4 && (
                      <Chip
                        label={`+${facility.wasteTypes.length - 4} more`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Max {facility.maxConcurrentVisitors} visitors at a time
                  </Typography>
                </Box>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleSelectFacility(facility)}
                  sx={{
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  }}
                >
                  Select Facility
                </Button>
              </CardActions>
            </Card>
        ))}
        </Box>
      )}

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="outlined"
          onClick={() => {
            // Get the first facility ID to redirect to appointments
            if (facilities.length > 0) {
              router.push(`/customer/facility/${facilities[0].id}/appointments`);
            }
          }}
        >
          View My Appointments
        </Button>
      </Box>
    </Container>
  );
}


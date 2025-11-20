'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useFacility } from '@/contexts/FacilityContext';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Chip,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RecyclingIcon from '@mui/icons-material/Recycling';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BuildIcon from '@mui/icons-material/Build';
import { useEffect } from 'react';

export default function ManagementFacilitiesPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { facilities, setSelectedFacility } = useFacility();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.role !== 'management') {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user || user.role !== 'management') {
    return null;
  }

  const handleSelectFacility = (facility: any, view: 'dashboard' | 'maintenance') => {
    setSelectedFacility(facility);
    router.push(`/management/facility/${facility.id}/${view}`);
  };

  const getOpeningHoursText = (facility: any) => {
    const weekdayHours = facility.openingHours.find((h: any) => h.dayOfWeek === 1);
    if (!weekdayHours) return 'See details';
    return `${weekdayHours.coreStart} - ${weekdayHours.coreEnd}`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Select a Facility to Manage
      </Typography>

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
                    Waste types managed:
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
                    Capacity: {facility.maxConcurrentVisitors} visitors
                  </Typography>
                </Box>
              </CardContent>

              <Box sx={{ px: 2, pb: 2, pt: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<DashboardIcon />}
                  onClick={() => handleSelectFacility(facility, 'dashboard')}
                  sx={{
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  }}
                >
                  View Dashboard
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<BuildIcon />}
                  onClick={() => handleSelectFacility(facility, 'maintenance')}
                >
                  Manage Maintenance
                </Button>
              </Box>
            </Card>
        ))}
      </Box>
    </Container>
  );
}


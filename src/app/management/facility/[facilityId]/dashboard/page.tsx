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
  Tabs,
  Tab,
  LinearProgress,
  Chip,
  Alert,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { statsApi, facilitiesApi } from '@/services/api';
import { FacilityStats, WasteStats, RecyclingCenter } from '@/types';
import { format } from 'date-fns';
import PeopleIcon from '@mui/icons-material/People';
import DeleteIcon from '@mui/icons-material/Delete';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const router = useRouter();
  const params = useParams();
  const facilityId = params.facilityId as string;
  const { user, isAuthenticated } = useAuth();
  const [facility, setFacility] = useState<RecyclingCenter | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [facilityStats, setFacilityStats] = useState<FacilityStats[]>([]);
  const [wasteStats, setWasteStats] = useState<WasteStats[]>([]);
  const [loading, setLoading] = useState(true);

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
      loadStats();
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

  const loadStats = async () => {
    if (!facility) return;

    setLoading(true);
    try {
      const [facilityData, wasteData] = await Promise.all([
        statsApi.getFacilityStats(facility.id),
        statsApi.getWasteStats(facility.id),
      ]);
      setFacilityStats(facilityData);
      setWasteStats(wasteData);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'management' || !facility) {
    return null;
  }

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  const facilityWasteTypes = facility.wasteTypes;

  // Prepare data for visitor chart
  const visitorChartData = facilityStats.map(stat => ({
    date: format(stat.date, 'MM/dd'),
    actual: stat.totalVisitors,
    projected: stat.projectedVisitors,
  }));

  // Prepare data for waste level chart
  const wasteChartData = wasteStats
    .reduce((acc, stat) => {
      const dateKey = format(stat.date, 'MM/dd');
      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey };
      }
      const wasteType = facilityWasteTypes.find(w => w.id === stat.wasteTypeId);
      if (wasteType) {
        acc[dateKey][wasteType.name] = stat.level || stat.projected;
      }
      return acc;
    }, {} as Record<string, any>);

  const wasteChartArray = Object.values(wasteChartData);

  // Calculate current statistics
  const currentVisitors = facilityStats.find(s => {
    const today = new Date();
    return format(s.date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  })?.currentVisitors || 0;

  const avgWasteLevel = facilityWasteTypes.reduce((sum, w) => sum + w.currentLevel, 0) / facilityWasteTypes.length;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Management Dashboard
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

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Current Visitors
                  </Typography>
                  <Typography variant="h4">
                    {currentVisitors}
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Max Capacity
                  </Typography>
                  <Typography variant="h4">
                    {facility.maxConcurrentVisitors}
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 48, color: 'secondary.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Avg Waste Level
                  </Typography>
                  <Typography variant="h4">
                    {avgWasteLevel.toFixed(0)}%
                  </Typography>
                </Box>
                <DeleteIcon sx={{ fontSize: 48, color: avgWasteLevel > 70 ? 'error.main' : 'success.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Waste Types
                  </Typography>
                  <Typography variant="h4">
                    {facilityWasteTypes.length}
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Container Status - Right after key metrics */}
      <Card sx={{ mt: 3 }}>
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

      {/* Visitor Utilization Chart */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Visitor Utilization
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Past 30 days and 7-day projection
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={visitorChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#164656"
                strokeWidth={2}
                name="Actual Visitors"
              />
              <Line
                type="monotone"
                dataKey="projected"
                stroke="#F7B85A"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Projected Visitors"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Waste Levels Trend Chart */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Waste Levels Trend
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Past 7 days and 7-day projection
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={wasteChartArray}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {facilityWasteTypes.map(type => (
                <Line
                  key={type.id}
                  type="monotone"
                  dataKey={type.name}
                  stroke={type.color}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Container>
  );
}

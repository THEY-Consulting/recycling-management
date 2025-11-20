'use client';

import { useState } from 'react';
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
import { mockFacilityStats, mockWasteStats, mockWasteTypes, mockRecyclingCenter } from '@/data/mockData';
import { format } from 'date-fns';
import PeopleIcon from '@mui/icons-material/People';
import DeleteIcon from '@mui/icons-material/Delete';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function DashboardPage() {
  const [tabValue, setTabValue] = useState(0);

  // Prepare data for visitor chart
  const visitorChartData = mockFacilityStats.map(stat => ({
    date: format(stat.date, 'MM/dd'),
    actual: stat.totalVisitors,
    projected: stat.projectedVisitors,
  }));

  // Prepare data for waste level chart
  const wasteChartData = mockWasteStats
    .filter(stat => {
      const today = new Date();
      const statDate = new Date(stat.date);
      const daysDiff = Math.floor((statDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff >= -7 && daysDiff <= 7;
    })
    .reduce((acc, stat) => {
      const dateKey = format(stat.date, 'MM/dd');
      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey };
      }
      const wasteType = mockWasteTypes.find(w => w.id === stat.wasteTypeId);
      if (wasteType) {
        acc[dateKey][wasteType.name] = stat.level || stat.projected;
      }
      return acc;
    }, {} as Record<string, any>);

  const wasteChartArray = Object.values(wasteChartData);

  // Calculate current statistics
  const currentVisitors = mockFacilityStats.find(s => {
    const today = new Date();
    return format(s.date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  })?.currentVisitors || 0;

  const avgWasteLevel = mockWasteTypes.reduce((sum, w) => sum + w.currentLevel, 0) / mockWasteTypes.length;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Management Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Monitor facility operations and waste levels
      </Typography>

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
                    {mockRecyclingCenter.maxConcurrentVisitors}
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
                    {mockWasteTypes.length}
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Visitor Utilization
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Past 30 days and 7-day projection
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
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
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Waste Levels Trend
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Past 7 days and 7-day projection
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={wasteChartArray}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {mockWasteTypes.map(type => (
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
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Waste Container Status
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {mockWasteTypes.map(type => (
                  <Grid item xs={12} sm={6} md={4} key={type.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
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
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

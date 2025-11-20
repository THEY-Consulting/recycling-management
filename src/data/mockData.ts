import {
  RecyclingCenter,
  WasteType,
  Booking,
  MaintenanceSlot,
  FacilityStats,
  WasteStats,
  TimeSlot,
} from '@/types';

// Mock waste types
export const mockWasteTypes: WasteType[] = [
  {
    id: 'paper',
    name: 'Paper & Cardboard',
    color: '#4CAF50',
    icon: 'Description',
    currentLevel: 65,
    capacity: 5000,
    position: { x: 100, y: 150 },
  },
  {
    id: 'plastic',
    name: 'Plastic',
    color: '#2196F3',
    icon: 'LocalDrink',
    currentLevel: 45,
    capacity: 3000,
    position: { x: 300, y: 150 },
  },
  {
    id: 'glass',
    name: 'Glass',
    color: '#9C27B0',
    icon: 'WineBar',
    currentLevel: 80,
    capacity: 4000,
    position: { x: 500, y: 150 },
  },
  {
    id: 'metal',
    name: 'Metal',
    color: '#FF9800',
    icon: 'Build',
    currentLevel: 30,
    capacity: 2500,
    position: { x: 100, y: 350 },
  },
  {
    id: 'wood',
    name: 'Wood',
    color: '#795548',
    icon: 'Carpenter',
    currentLevel: 90,
    capacity: 6000,
    position: { x: 300, y: 350 },
  },
  {
    id: 'electronics',
    name: 'Electronics',
    color: '#607D8B',
    icon: 'Devices',
    currentLevel: 55,
    capacity: 1500,
    position: { x: 500, y: 350 },
  },
];

// Mock recycling center
export const mockRecyclingCenter: RecyclingCenter = {
  id: 'center-1',
  name: 'Central Recycling Facility',
  address: '123 Green Street, Eco City, 12345',
  slotDuration: 30,
  maxConcurrentVisitors: 10,
  openingHours: [
    {
      dayOfWeek: 1, // Monday
      coreStart: '08:00',
      coreEnd: '16:00',
      appointmentOnlyStart: '06:00',
      appointmentOnlyEnd: '20:00',
    },
    {
      dayOfWeek: 2, // Tuesday
      coreStart: '08:00',
      coreEnd: '16:00',
      appointmentOnlyStart: '06:00',
      appointmentOnlyEnd: '20:00',
    },
    {
      dayOfWeek: 3, // Wednesday
      coreStart: '08:00',
      coreEnd: '16:00',
      appointmentOnlyStart: '06:00',
      appointmentOnlyEnd: '20:00',
    },
    {
      dayOfWeek: 4, // Thursday
      coreStart: '08:00',
      coreEnd: '16:00',
      appointmentOnlyStart: '06:00',
      appointmentOnlyEnd: '20:00',
    },
    {
      dayOfWeek: 5, // Friday
      coreStart: '08:00',
      coreEnd: '16:00',
      appointmentOnlyStart: '06:00',
      appointmentOnlyEnd: '20:00',
    },
    {
      dayOfWeek: 6, // Saturday
      coreStart: '09:00',
      coreEnd: '14:00',
      appointmentOnlyStart: '07:00',
      appointmentOnlyEnd: '17:00',
    },
  ],
  wasteTypes: mockWasteTypes,
  facilityLayout: {
    width: 600,
    height: 500,
    entrance: { x: 50, y: 250 },
    exit: { x: 550, y: 250 },
  },
};

// Generate time slots for the next 7 days
export const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const now = new Date();
  
  for (let day = 0; day < 7; day++) {
    const date = new Date(now);
    date.setDate(date.getDate() + day);
    const dayOfWeek = date.getDay();
    
    const hours = mockRecyclingCenter.openingHours.find(h => h.dayOfWeek === dayOfWeek);
    if (!hours) continue;
    
    // Generate slots for appointment-only hours (morning)
    if (hours.appointmentOnlyStart) {
      const [startHour, startMin] = hours.appointmentOnlyStart.split(':').map(Number);
      const [coreStartHour] = hours.coreStart.split(':').map(Number);
      
      for (let hour = startHour; hour < coreStartHour; hour += 0.5) {
        const slotStart = new Date(date);
        slotStart.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + mockRecyclingCenter.slotDuration);
        
        slots.push({
          id: `slot-${date.toISOString()}-${hour}`,
          start: slotStart,
          end: slotEnd,
          isMaintenanceSlot: false,
          currentBookings: Math.floor(Math.random() * 5),
          maxCapacity: mockRecyclingCenter.maxConcurrentVisitors,
        });
      }
    }

    // Generate slots for core hours
    const [coreStartHour, coreStartMin] = hours.coreStart.split(':').map(Number);
    const [coreEndHour] = hours.coreEnd.split(':').map(Number);

    for (let hour = coreStartHour; hour < coreEndHour; hour += 0.5) {
      const slotStart = new Date(date);
      slotStart.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + mockRecyclingCenter.slotDuration);

      slots.push({
        id: `slot-${date.toISOString()}-${hour}`,
        start: slotStart,
        end: slotEnd,
        isMaintenanceSlot: false,
        currentBookings: Math.floor(Math.random() * 8),
        maxCapacity: mockRecyclingCenter.maxConcurrentVisitors,
      });
    }

    // Generate slots for appointment-only hours (evening)
    if (hours.appointmentOnlyEnd) {
      const [endHour] = hours.appointmentOnlyEnd.split(':').map(Number);

      for (let hour = coreEndHour; hour < endHour; hour += 0.5) {
        const slotStart = new Date(date);
        slotStart.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + mockRecyclingCenter.slotDuration);

        slots.push({
          id: `slot-${date.toISOString()}-${hour}`,
          start: slotStart,
          end: slotEnd,
          isMaintenanceSlot: false,
          currentBookings: Math.floor(Math.random() * 4),
          maxCapacity: mockRecyclingCenter.maxConcurrentVisitors,
        });
      }
    }
  }

  return slots;
};

export const mockTimeSlots = generateTimeSlots();

// Mock bookings
export const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    customerId: 'customer-1',
    customerName: 'John Doe',
    timeSlot: mockTimeSlots[5],
    wasteItems: [
      { wasteTypeId: 'paper', amount: 25 },
      { wasteTypeId: 'plastic', amount: 15 },
    ],
    status: 'confirmed',
    createdAt: new Date('2025-11-19'),
  },
  {
    id: 'booking-2',
    customerId: 'customer-2',
    customerName: 'Jane Smith',
    timeSlot: mockTimeSlots[8],
    wasteItems: [
      { wasteTypeId: 'glass', amount: 30 },
      { wasteTypeId: 'metal', amount: 20 },
    ],
    status: 'confirmed',
    createdAt: new Date('2025-11-19'),
  },
];

// Mock maintenance slots
export const mockMaintenanceSlots: MaintenanceSlot[] = [
  {
    id: 'maint-1',
    start: new Date('2025-11-22T10:00:00'),
    end: new Date('2025-11-22T12:00:00'),
    wasteTypeId: 'wood',
    status: 'scheduled',
  },
];

// Generate facility stats for the past 30 days and next 7 days
export const generateFacilityStats = (): FacilityStats[] => {
  const stats: FacilityStats[] = [];
  const now = new Date();

  // Past 30 days
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    stats.push({
      date,
      totalVisitors: Math.floor(Math.random() * 50) + 30,
      currentVisitors: i === 0 ? Math.floor(Math.random() * 10) : 0,
      projectedVisitors: 0,
    });
  }

  // Next 7 days (projections)
  for (let i = 1; i <= 7; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    stats.push({
      date,
      totalVisitors: 0,
      currentVisitors: 0,
      projectedVisitors: Math.floor(Math.random() * 40) + 25,
    });
  }

  return stats;
};

export const mockFacilityStats = generateFacilityStats();

// Generate waste stats
export const generateWasteStats = (): WasteStats[] => {
  const stats: WasteStats[] = [];
  const now = new Date();

  mockWasteTypes.forEach(wasteType => {
    // Past 30 days
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      stats.push({
        wasteTypeId: wasteType.id,
        date,
        level: Math.min(100, Math.max(0, wasteType.currentLevel + (Math.random() - 0.5) * 20)),
        deposited: Math.floor(Math.random() * 500) + 100,
        projected: 0,
      });
    }

    // Next 7 days (projections)
    for (let i = 1; i <= 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      stats.push({
        wasteTypeId: wasteType.id,
        date,
        level: 0,
        deposited: 0,
        projected: Math.floor(Math.random() * 400) + 150,
      });
    }
  });

  return stats;
};

export const mockWasteStats = generateWasteStats();


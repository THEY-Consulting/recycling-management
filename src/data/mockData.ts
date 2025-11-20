import {
  RecyclingCenter,
  WasteType,
  Booking,
  MaintenanceSlot,
  FacilityStats,
  WasteStats,
  TimeSlot,
  User,
} from '@/types';

// Mock recycling centers
export const mockRecyclingCenters: RecyclingCenter[] = [
  {
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
    wasteTypes: [
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
    ],
    facilityLayout: {
      width: 600,
      height: 500,
      entrance: { x: 50, y: 250 },
      exit: { x: 550, y: 250 },
    },
  },
  {
    id: 'center-2',
    name: 'North Side Recycling Center',
    address: '456 Eco Avenue, Green Valley, 54321',
    slotDuration: 30,
    maxConcurrentVisitors: 8,
    openingHours: [
      {
        dayOfWeek: 1,
        coreStart: '09:00',
        coreEnd: '17:00',
        appointmentOnlyStart: '07:00',
        appointmentOnlyEnd: '19:00',
      },
      {
        dayOfWeek: 2,
        coreStart: '09:00',
        coreEnd: '17:00',
        appointmentOnlyStart: '07:00',
        appointmentOnlyEnd: '19:00',
      },
      {
        dayOfWeek: 3,
        coreStart: '09:00',
        coreEnd: '17:00',
        appointmentOnlyStart: '07:00',
        appointmentOnlyEnd: '19:00',
      },
      {
        dayOfWeek: 4,
        coreStart: '09:00',
        coreEnd: '17:00',
        appointmentOnlyStart: '07:00',
        appointmentOnlyEnd: '19:00',
      },
      {
        dayOfWeek: 5,
        coreStart: '09:00',
        coreEnd: '17:00',
        appointmentOnlyStart: '07:00',
        appointmentOnlyEnd: '19:00',
      },
    ],
    wasteTypes: [
      {
        id: 'paper',
        name: 'Paper & Cardboard',
        color: '#4CAF50',
        icon: 'Description',
        currentLevel: 40,
        capacity: 4000,
        position: { x: 120, y: 180 },
      },
      {
        id: 'plastic',
        name: 'Plastic',
        color: '#2196F3',
        icon: 'LocalDrink',
        currentLevel: 55,
        capacity: 2500,
        position: { x: 320, y: 180 },
      },
      {
        id: 'glass',
        name: 'Glass',
        color: '#9C27B0',
        icon: 'WineBar',
        currentLevel: 70,
        capacity: 3500,
        position: { x: 480, y: 180 },
      },
      {
        id: 'metal',
        name: 'Metal',
        color: '#FF9800',
        icon: 'Build',
        currentLevel: 25,
        capacity: 2000,
        position: { x: 220, y: 320 },
      },
    ],
    facilityLayout: {
      width: 600,
      height: 500,
      entrance: { x: 50, y: 250 },
      exit: { x: 550, y: 250 },
    },
  },
  {
    id: 'center-3',
    name: 'Westside Waste Management',
    address: '789 Sustainability Road, Eco Park, 67890',
    slotDuration: 45,
    maxConcurrentVisitors: 12,
    openingHours: [
      {
        dayOfWeek: 1,
        coreStart: '07:00',
        coreEnd: '18:00',
      },
      {
        dayOfWeek: 2,
        coreStart: '07:00',
        coreEnd: '18:00',
      },
      {
        dayOfWeek: 3,
        coreStart: '07:00',
        coreEnd: '18:00',
      },
      {
        dayOfWeek: 4,
        coreStart: '07:00',
        coreEnd: '18:00',
      },
      {
        dayOfWeek: 5,
        coreStart: '07:00',
        coreEnd: '18:00',
      },
      {
        dayOfWeek: 6,
        coreStart: '08:00',
        coreEnd: '15:00',
      },
      {
        dayOfWeek: 0, // Sunday
        coreStart: '10:00',
        coreEnd: '14:00',
      },
    ],
    wasteTypes: [
      {
        id: 'paper',
        name: 'Paper & Cardboard',
        color: '#4CAF50',
        icon: 'Description',
        currentLevel: 50,
        capacity: 6000,
        position: { x: 80, y: 120 },
      },
      {
        id: 'plastic',
        name: 'Plastic',
        color: '#2196F3',
        icon: 'LocalDrink',
        currentLevel: 35,
        capacity: 3500,
        position: { x: 280, y: 120 },
      },
      {
        id: 'glass',
        name: 'Glass',
        color: '#9C27B0',
        icon: 'WineBar',
        currentLevel: 60,
        capacity: 4500,
        position: { x: 480, y: 120 },
      },
      {
        id: 'metal',
        name: 'Metal',
        color: '#FF9800',
        icon: 'Build',
        currentLevel: 45,
        capacity: 3000,
        position: { x: 80, y: 280 },
      },
      {
        id: 'wood',
        name: 'Wood',
        color: '#795548',
        icon: 'Carpenter',
        currentLevel: 75,
        capacity: 7000,
        position: { x: 280, y: 280 },
      },
      {
        id: 'electronics',
        name: 'Electronics',
        color: '#607D8B',
        icon: 'Devices',
        currentLevel: 40,
        capacity: 2000,
        position: { x: 480, y: 280 },
      },
      {
        id: 'organic',
        name: 'Organic Waste',
        color: '#8BC34A',
        icon: 'Eco',
        currentLevel: 85,
        capacity: 5000,
        position: { x: 180, y: 400 },
      },
      {
        id: 'hazardous',
        name: 'Hazardous Materials',
        color: '#F44336',
        icon: 'Warning',
        currentLevel: 20,
        capacity: 1000,
        position: { x: 380, y: 400 },
      },
    ],
    facilityLayout: {
      width: 600,
      height: 500,
      entrance: { x: 50, y: 250 },
      exit: { x: 550, y: 250 },
    },
  },
];

// Legacy export for backward compatibility
export const mockRecyclingCenter = mockRecyclingCenters[0];
export const mockWasteTypes = mockRecyclingCenter.wasteTypes;

// Generate time slots for the next 7 days for a specific facility
export const generateTimeSlots = (facility: RecyclingCenter): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const now = new Date();

  for (let day = 0; day < 7; day++) {
    const date = new Date(now);
    date.setDate(date.getDate() + day);
    const dayOfWeek = date.getDay();

    const hours = facility.openingHours.find(h => h.dayOfWeek === dayOfWeek);
    if (!hours) continue;
    
    // Generate slots for appointment-only hours (morning)
    if (hours.appointmentOnlyStart) {
      const [startHour, startMin] = hours.appointmentOnlyStart.split(':').map(Number);
      const [coreStartHour] = hours.coreStart.split(':').map(Number);
      
      for (let hour = startHour; hour < coreStartHour; hour += 0.5) {
        const slotStart = new Date(date);
        slotStart.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + facility.slotDuration);

        slots.push({
          id: `slot-${facility.id}-${date.toISOString()}-${hour}`,
          start: slotStart,
          end: slotEnd,
          isMaintenanceSlot: false,
          currentBookings: Math.floor(Math.random() * 5),
          maxCapacity: facility.maxConcurrentVisitors,
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
      slotEnd.setMinutes(slotEnd.getMinutes() + facility.slotDuration);

      slots.push({
        id: `slot-${facility.id}-${date.toISOString()}-${hour}`,
        start: slotStart,
        end: slotEnd,
        isMaintenanceSlot: false,
        currentBookings: Math.floor(Math.random() * 8),
        maxCapacity: facility.maxConcurrentVisitors,
      });
    }

    // Generate slots for appointment-only hours (evening)
    if (hours.appointmentOnlyEnd) {
      const [endHour] = hours.appointmentOnlyEnd.split(':').map(Number);

      for (let hour = coreEndHour; hour < endHour; hour += 0.5) {
        const slotStart = new Date(date);
        slotStart.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + facility.slotDuration);

        slots.push({
          id: `slot-${facility.id}-${date.toISOString()}-${hour}`,
          start: slotStart,
          end: slotEnd,
          isMaintenanceSlot: false,
          currentBookings: Math.floor(Math.random() * 4),
          maxCapacity: facility.maxConcurrentVisitors,
        });
      }
    }
  }

  return slots;
};

// Generate time slots for all facilities
export const mockTimeSlots = generateTimeSlots(mockRecyclingCenter);

// Helper function to create bookings for a facility
const createFacilityBookings = (facility: RecyclingCenter, startIndex: number): Booking[] => {
  const slots = generateTimeSlots(facility);
  const bookings: Booking[] = [];
  const now = new Date();

  // Create bookings for the past week
  for (let dayOffset = -7; dayOffset <= 7; dayOffset++) {
    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() + dayOffset);

    // Find slots for this day
    const daySlots = slots.filter(slot => {
      const slotDate = new Date(slot.start);
      return slotDate.toDateString() === targetDate.toDateString();
    });

    // Create 2-4 random bookings per day
    const numBookings = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < Math.min(numBookings, daySlots.length); i++) {
      const slot = daySlots[Math.floor(Math.random() * daySlots.length)];
      const wasteTypes = facility.wasteTypes;

      // Select 1-3 random waste types
      const numWasteTypes = Math.floor(Math.random() * 3) + 1;
      const selectedWasteTypes = [...wasteTypes]
        .sort(() => Math.random() - 0.5)
        .slice(0, numWasteTypes);

      bookings.push({
        id: `booking-${facility.id}-${startIndex + bookings.length}`,
        facilityId: facility.id,
        customerId: `user-cust-${(startIndex + i) % 2 + 1}`,
        customerName: (startIndex + i) % 2 === 0 ? 'John Doe' : 'Jane Smith',
        timeSlot: slot,
        wasteItems: selectedWasteTypes.map(wt => ({
          wasteTypeId: wt.id,
          amount: Math.floor(Math.random() * 30) + 10,
        })),
        status: dayOffset < 0 ? 'completed' : 'confirmed',
        createdAt: new Date(now.getTime() - (7 - dayOffset) * 24 * 60 * 60 * 1000),
      });
    }
  }

  return bookings;
};

// Mock bookings for all facilities
export const mockBookings: Booking[] = [
  ...createFacilityBookings(mockRecyclingCenters[0], 0),
  ...createFacilityBookings(mockRecyclingCenters[1], 100),
  ...createFacilityBookings(mockRecyclingCenters[2], 200),
];

// Helper function to create maintenance slots for a facility
const createFacilityMaintenance = (facility: RecyclingCenter): MaintenanceSlot[] => {
  const slots: MaintenanceSlot[] = [];
  const now = new Date();

  // Create 2-3 maintenance slots per facility
  facility.wasteTypes.slice(0, 3).forEach((wasteType, index) => {
    const start = new Date(now);
    start.setDate(start.getDate() + index * 3 + 1);
    start.setHours(10, 0, 0, 0);

    const end = new Date(start);
    end.setHours(12, 0, 0, 0);

    slots.push({
      id: `maint-${facility.id}-${index}`,
      facilityId: facility.id,
      start,
      end,
      wasteTypeId: wasteType.id,
      status: index === 0 ? 'scheduled' : 'scheduled',
    });
  });

  return slots;
};

// Mock maintenance slots for all facilities
export const mockMaintenanceSlots: MaintenanceSlot[] = [
  ...mockRecyclingCenters.flatMap(createFacilityMaintenance),
];

// Note: Facility stats and waste stats are now generated dynamically via the API
// See src/services/api.ts for the statsApi implementation

// Mock users - one management user and some customer users
export const mockUsers: User[] = [
  {
    id: 'user-mgmt-1',
    email: 'admin@they.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'management',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'user-cust-1',
    email: 'john@example.com',
    password: 'password123',
    name: 'John Doe',
    role: 'customer',
    licensePlate: 'ABC-123',
    phone: '+49 123 456789',
    createdAt: new Date('2024-10-15'),
  },
  {
    id: 'user-cust-2',
    email: 'jane@example.com',
    password: 'password123',
    name: 'Jane Smith',
    role: 'customer',
    licensePlate: 'XYZ-789',
    phone: '+49 987 654321',
    createdAt: new Date('2024-10-20'),
  },
];


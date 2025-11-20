/**
 * Mock API Service
 * This file simulates backend API calls with in-memory data storage.
 * When a real backend is implemented, only this file needs to be updated.
 */

import {
  RecyclingCenter,
  Booking,
  MaintenanceSlot,
  FacilityStats,
  WasteStats,
  User,
  TimeSlot,
} from '@/types';
import {
  mockRecyclingCenters,
  mockBookings,
  mockMaintenanceSlots,
  mockUsers,
  generateTimeSlots,
} from '@/data/mockData';

// In-memory data stores (persistent during app runtime)
let facilities: RecyclingCenter[] = [...mockRecyclingCenters];
let bookings: Booking[] = [...mockBookings];
let maintenanceSlots: MaintenanceSlot[] = [...mockMaintenanceSlots];
let users: User[] = [...mockUsers];

// Simulate network delay
const delay = (ms: number = 100) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================================
// FACILITIES API
// ============================================================================

export const facilitiesApi = {
  async getAll(): Promise<RecyclingCenter[]> {
    await delay();
    return [...facilities];
  },

  async getById(id: string): Promise<RecyclingCenter | null> {
    await delay();
    return facilities.find(f => f.id === id) || null;
  },
};

// ============================================================================
// BOOKINGS API
// ============================================================================

export const bookingsApi = {
  async getAll(): Promise<Booking[]> {
    await delay();
    return [...bookings];
  },

  async getByCustomerId(customerId: string): Promise<Booking[]> {
    await delay();
    return bookings.filter(b => b.customerId === customerId);
  },

  async getByFacilityId(facilityId: string): Promise<Booking[]> {
    await delay();
    return bookings.filter(b => b.facilityId === facilityId);
  },

  async create(booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
    await delay();
    const newBooking: Booking = {
      ...booking,
      id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };
    bookings.push(newBooking);
    return newBooking;
  },

  async cancel(bookingId: string): Promise<boolean> {
    await delay();
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = 'cancelled';
      return true;
    }
    return false;
  },
};

// ============================================================================
// MAINTENANCE API
// ============================================================================

export const maintenanceApi = {
  async getAll(): Promise<MaintenanceSlot[]> {
    await delay();
    return [...maintenanceSlots];
  },

  async getByFacilityId(facilityId: string): Promise<MaintenanceSlot[]> {
    await delay();
    return maintenanceSlots.filter(m => m.facilityId === facilityId);
  },

  async create(slot: Omit<MaintenanceSlot, 'id'>): Promise<MaintenanceSlot> {
    await delay();
    const newSlot: MaintenanceSlot = {
      ...slot,
      id: `maint-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    maintenanceSlots.push(newSlot);
    return newSlot;
  },

  async delete(slotId: string): Promise<boolean> {
    await delay();
    const index = maintenanceSlots.findIndex(m => m.id === slotId);
    if (index !== -1) {
      maintenanceSlots.splice(index, 1);
      return true;
    }
    return false;
  },

  async updateStatus(slotId: string, status: MaintenanceSlot['status']): Promise<boolean> {
    await delay();
    const slot = maintenanceSlots.find(m => m.id === slotId);
    if (slot) {
      slot.status = status;
      return true;
    }
    return false;
  },
};

// ============================================================================
// TIME SLOTS API
// ============================================================================

export const timeSlotsApi = {
  async getByFacilityId(facilityId: string): Promise<TimeSlot[]> {
    await delay();
    const facility = facilities.find(f => f.id === facilityId);
    if (!facility) return [];
    return generateTimeSlots(facility);
  },
};

// ============================================================================
// STATISTICS API
// ============================================================================

export const statsApi = {
  async getFacilityStats(facilityId: string): Promise<FacilityStats[]> {
    await delay();
    const stats: FacilityStats[] = [];
    const now = new Date();

    // Past 30 days
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      // Count actual bookings for this date
      const dayBookings = bookings.filter(b => {
        const bookingDate = new Date(b.timeSlot.start);
        return b.facilityId === facilityId &&
               bookingDate.toDateString() === date.toDateString();
      });

      stats.push({
        facilityId,
        date,
        totalVisitors: i === 0 ? dayBookings.length : Math.floor(Math.random() * 50) + 30,
        currentVisitors: i === 0 ? Math.floor(Math.random() * 10) : 0,
        projectedVisitors: 0,
      });
    }

    // Next 7 days (projections)
    for (let i = 1; i <= 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);

      // Count projected bookings
      const projectedBookings = bookings.filter(b => {
        const bookingDate = new Date(b.timeSlot.start);
        return b.facilityId === facilityId &&
               bookingDate.toDateString() === date.toDateString() &&
               b.status !== 'cancelled';
      });

      stats.push({
        facilityId,
        date,
        totalVisitors: 0,
        currentVisitors: 0,
        projectedVisitors: projectedBookings.length + Math.floor(Math.random() * 20) + 10,
      });
    }

    return stats;
  },

  async getWasteStats(facilityId: string): Promise<WasteStats[]> {
    await delay();
    const facility = facilities.find(f => f.id === facilityId);
    if (!facility) return [];

    const stats: WasteStats[] = [];
    const now = new Date();

    facility.wasteTypes.forEach(wasteType => {
      // Past 7 days
      for (let i = 7; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        // Calculate deposited amount from bookings
        const dayBookings = bookings.filter(b => {
          const bookingDate = new Date(b.timeSlot.start);
          return b.facilityId === facilityId &&
                 bookingDate.toDateString() === date.toDateString() &&
                 b.status !== 'cancelled';
        });

        const deposited = dayBookings.reduce((sum, booking) => {
          const wasteItem = booking.wasteItems.find(item => item.wasteTypeId === wasteType.id);
          return sum + (wasteItem?.amount || 0);
        }, 0);

        stats.push({
          facilityId,
          wasteTypeId: wasteType.id,
          date,
          level: Math.min(100, Math.max(0, wasteType.currentLevel + (Math.random() - 0.5) * 20)),
          deposited: i === 0 ? deposited : Math.floor(Math.random() * 500) + 100,
          projected: 0,
        });
      }

      // Next 7 days (projections)
      for (let i = 1; i <= 7; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() + i);

        // Calculate projected amount from future bookings
        const futureBookings = bookings.filter(b => {
          const bookingDate = new Date(b.timeSlot.start);
          return b.facilityId === facilityId &&
                 bookingDate.toDateString() === date.toDateString() &&
                 b.status !== 'cancelled';
        });

        const projected = futureBookings.reduce((sum, booking) => {
          const wasteItem = booking.wasteItems.find(item => item.wasteTypeId === wasteType.id);
          return sum + (wasteItem?.amount || 0);
        }, 0);

        stats.push({
          facilityId,
          wasteTypeId: wasteType.id,
          date,
          level: 0,
          deposited: 0,
          projected: projected + Math.floor(Math.random() * 200) + 100,
        });
      }
    });

    return stats;
  },
};

// ============================================================================
// USERS API
// ============================================================================

export const usersApi = {
  async authenticate(email: string, password: string): Promise<User | null> {
    await delay();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    }
    return null;
  },

  async create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    await delay();
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };
    users.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword as User;
  },

  async update(userId: string, updates: Partial<User>): Promise<User | null> {
    await delay();
    const user = users.find(u => u.id === userId);
    if (user) {
      Object.assign(user, updates);
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    }
    return null;
  },

  async getById(userId: string): Promise<User | null> {
    await delay();
    const user = users.find(u => u.id === userId);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    }
    return null;
  },
};


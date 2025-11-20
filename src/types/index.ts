// Data models for the recycling management system

export interface WasteType {
  id: string;
  name: string;
  color: string;
  icon: string;
  currentLevel: number; // percentage 0-100
  capacity: number; // in kg
  position: { x: number; y: number }; // position in facility layout
}

export interface OpeningHours {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  coreStart: string; // HH:mm format
  coreEnd: string; // HH:mm format
  appointmentOnlyStart?: string; // HH:mm format
  appointmentOnlyEnd?: string; // HH:mm format
}

export interface TimeSlot {
  id: string;
  start: Date;
  end: Date;
  isMaintenanceSlot: boolean;
  currentBookings: number;
  maxCapacity: number;
}

export interface WasteItem {
  wasteTypeId: string;
  amount: number; // in kg
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  timeSlot: TimeSlot;
  wasteItems: WasteItem[];
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface MaintenanceSlot {
  id: string;
  start: Date;
  end: Date;
  wasteTypeId: string;
  status: 'scheduled' | 'in-progress' | 'completed';
}

export interface FacilityStats {
  date: Date;
  totalVisitors: number;
  currentVisitors: number;
  projectedVisitors: number;
}

export interface WasteStats {
  wasteTypeId: string;
  date: Date;
  level: number; // percentage
  deposited: number; // kg deposited that day
  projected: number; // projected kg for future dates
}

export interface RecyclingCenter {
  id: string;
  name: string;
  address: string;
  slotDuration: number; // in minutes
  maxConcurrentVisitors: number;
  openingHours: OpeningHours[];
  wasteTypes: WasteType[];
  facilityLayout: {
    width: number;
    height: number;
    entrance: { x: number; y: number };
    exit: { x: number; y: number };
  };
}

export interface Route {
  wasteTypeId: string;
  order: number;
  position: { x: number; y: number };
}


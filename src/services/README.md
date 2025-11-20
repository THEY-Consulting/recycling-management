# API Service Layer

This directory contains the mock API service layer that simulates backend API calls. All data operations go through this layer, making it easy to replace with real backend calls in the future.

## Architecture

The API layer provides a clean separation between the frontend components and data storage:

```
Components → API Service → In-Memory Data Store
```

When a real backend is implemented, only the files in this directory need to be updated. The component code remains unchanged.

## Available APIs

### `facilitiesApi`
- `getAll()` - Get all recycling centers
- `getById(id)` - Get a specific facility by ID

### `bookingsApi`
- `getAll()` - Get all bookings
- `getByCustomerId(customerId)` - Get bookings for a specific customer
- `getByFacilityId(facilityId)` - Get bookings for a specific facility
- `create(booking)` - Create a new booking
- `cancel(bookingId)` - Cancel a booking

### `maintenanceApi`
- `getAll()` - Get all maintenance slots
- `getByFacilityId(facilityId)` - Get maintenance slots for a specific facility
- `create(slot)` - Create a new maintenance slot
- `delete(slotId)` - Delete a maintenance slot
- `updateStatus(slotId, status)` - Update maintenance slot status

### `timeSlotsApi`
- `getByFacilityId(facilityId)` - Get available time slots for a facility

### `statsApi`
- `getFacilityStats(facilityId)` - Get visitor statistics for a facility (past 30 days + 7 day projection)
- `getWasteStats(facilityId)` - Get waste level statistics for a facility (past 7 days + 7 day projection)

### `usersApi`
- `authenticate(email, password)` - Authenticate a user
- `create(userData)` - Create a new user
- `update(userId, updates)` - Update user information
- `getById(userId)` - Get user by ID

## Data Persistence

All data is stored in-memory during the app runtime:
- Bookings persist when created via `bookingsApi.create()`
- Maintenance slots persist when created via `maintenanceApi.create()`
- User data persists when created/updated via `usersApi`

The data is initialized from `src/data/mockData.ts` on app startup.

## Usage Example

```typescript
import { bookingsApi, facilitiesApi } from '@/services/api';

// In a component
const MyComponent = () => {
  const [bookings, setBookings] = useState([]);
  
  useEffect(() => {
    loadBookings();
  }, []);
  
  const loadBookings = async () => {
    const data = await bookingsApi.getByFacilityId('center-1');
    setBookings(data);
  };
  
  const createBooking = async (bookingData) => {
    const newBooking = await bookingsApi.create(bookingData);
    loadBookings(); // Reload to get updated list
  };
  
  // ...
};
```

## Migrating to a Real Backend

When implementing a real backend:

1. Update the API functions in `src/services/api.ts` to make HTTP requests instead of accessing in-memory data
2. Replace the `delay()` simulation with actual network calls
3. Add proper error handling for network failures
4. Add authentication headers as needed
5. Component code remains unchanged!

Example migration:

```typescript
// Before (mock)
export const bookingsApi = {
  async getAll(): Promise<Booking[]> {
    await delay();
    return [...bookings];
  },
};

// After (real backend)
export const bookingsApi = {
  async getAll(): Promise<Booking[]> {
    const response = await fetch('/api/bookings', {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return response.json();
  },
};
```

## Network Delay Simulation

All API calls include a simulated network delay (100ms by default) to mimic real-world conditions and test loading states in the UI.


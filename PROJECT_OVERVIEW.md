# Recycling Management System - they Prototype

A comprehensive web application for managing recycling center operations with separate customer and management interfaces.

## Features

### Customer Interface

#### 1. Booking System (`/customer/booking`)
- **Time Slot Selection**: Browse available time slots across multiple days
- **Waste Type Input**: Add multiple waste types with amounts (kg)
- **Real-time Validation**: 
  - Checks container capacity before booking
  - Prevents overbooking of time slots
  - Validates waste container availability
- **Utilization Visualization**: See current and projected facility usage
- **Current Waste Levels**: View real-time fill levels of all containers

#### 2. Facility Route (`/customer/route`)
- **Interactive Facility Map**: Visual layout of all waste containers
- **Optimal Route Planning**: Automatically calculates the best path
- **Step-by-Step Instructions**: Clear directions from entrance to exit
- **Visual Route Display**: Dotted lines showing the optimal path

### Management Interface

#### 1. Dashboard (`/management/dashboard`)
- **Key Metrics**:
  - Current visitor count
  - Maximum facility capacity
  - Average waste levels
  - Total waste types
- **Visitor Utilization Chart**: Past 30 days + 7-day projection
- **Waste Levels Trend**: Multi-line chart showing all container levels
- **Container Status Cards**: Real-time fill levels with color-coded alerts

#### 2. Maintenance Scheduling (`/management/maintenance`)
- **Schedule Container Emptying**: Set date, time, and duration
- **Container Status Overview**: Sorted by fill level
- **Maintenance Calendar**: View all scheduled maintenance
- **Booking Blocking**: Automatically blocks customer bookings during maintenance

## Technical Stack

- **Framework**: Next.js 16 with TypeScript
- **UI Library**: Material-UI (MUI) v6
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Styling**: Emotion (CSS-in-JS)

## Design System

### Colors
- **Primary (they-blue)**: `#164656` - Navigation, primary buttons
- **Secondary (they-yellow)**: `#F7B85A` - Accent, secondary buttons
- **Error (they-red)**: `#EA5837` - Alerts, warnings

### Typography
- **Font Family**: Roboto, Helvetica, Arial, sans-serif

### Responsive Design
- **Desktop**: Full layout with all features
- **Tablet/iPad**: Optimized grid layouts
- **Mobile**: Stacked layouts with touch-friendly controls

## Data Model

### Core Entities

1. **RecyclingCenter**
   - Facility information
   - Opening hours (core + appointment-only)
   - Waste types
   - Facility layout

2. **WasteType**
   - Name, color, icon
   - Current fill level (%)
   - Capacity (kg)
   - Position in facility

3. **Booking**
   - Customer information
   - Time slot
   - Waste items with amounts
   - Status tracking

4. **MaintenanceSlot**
   - Container being serviced
   - Start/end time
   - Status (scheduled/in-progress/completed)

5. **Statistics**
   - Facility stats (visitor counts, projections)
   - Waste stats (levels, deposits, projections)

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build
```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── customer/          # Customer interface pages
│   │   ├── booking/       # Booking system
│   │   └── route/         # Facility route viewer
│   ├── management/        # Management interface pages
│   │   ├── dashboard/     # Statistics dashboard
│   │   └── maintenance/   # Maintenance scheduler
│   ├── layout.tsx         # Root layout with theme
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── Footer.tsx         # Branded footer
│   ├── Navigation.tsx     # Main navigation
│   └── ThemeRegistry.tsx  # MUI theme provider
├── data/                  # Mock data
│   └── mockData.ts        # Hardcoded data for prototype
├── theme/                 # Theme configuration
│   └── theme.ts           # MUI theme with custom colors
└── types/                 # TypeScript definitions
    └── index.ts           # All type definitions
```

## Mock Data

All backend interactions are mocked with hardcoded data:
- 6 waste types (Paper, Plastic, Glass, Metal, Wood, Electronics)
- 7 days of time slots
- 30 days of historical statistics
- 7 days of projected data

## Future Enhancements

- Backend API integration
- User authentication
- Real-time updates via WebSockets
- Mobile app (React Native)
- Email/SMS notifications
- Payment processing
- Multi-language support
- Accessibility improvements (WCAG 2.1 AA)

## License

Proprietary - they prototype


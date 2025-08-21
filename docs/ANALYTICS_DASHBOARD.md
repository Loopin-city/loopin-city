# Analytics Dashboard

A clean, simple, and focused analytics dashboard for the admin panel that provides essential insights into event performance, subscriber behavior, and user interests.

## Features

### 1. Dashboard Overview (Home)
- **Total Events**: Number card showing total event count
- **Total Clicks**: Number card showing total click count
- **Monthly Event Creations**: Bar chart displaying event creation trends by month
- **Click Trend Over Time**: Line chart showing click patterns over time

### 2. Events Performance
- Table with event name, total clicks, and status
- Action buttons for each event:
  - View details
  - Export clicks CSV
  - Mark event completed
  - Mark event cancelled

### 3. Events Registration Analysis
- **Event Registrations by Month**: Bar chart showing registration trends over time
- **Event Registrations by City**: Bar chart displaying registrations by city
- **Top Performing Events**: Table showing events with highest registrations

### 4. Subscribers Analysis
- **Subscribers by City**: Bar chart showing subscriber distribution across cities
- **New Subscribers Over Time**: Line chart tracking subscriber growth trends
- **Top Cities by Subscriber Count**: Table ranking cities by subscriber numbers

### 5. Event Interests Analysis
- **Registration Clicks by Event Type**: Bar chart showing interest by event category
- **Registration Clicks by City**: Bar chart displaying click patterns by location
- **Top Events by Registration Interest**: Table showing most engaging events

### 6. Export & Reports
- **Event Registrations Report**: Download registration data by month and city
- **Subscribers Report**: Download subscriber data by city and time trends
- **Event Interests Report**: Download interest data by type, city, and time

## Components

### DashboardOverview
- Displays key metrics in clean number cards
- Shows monthly event creation trends
- Displays click trends over time

### EventsPerformance
- Interactive table with event performance data
- Action buttons for event management
- Clean, organized layout

### EventsRegistrationAnalysis
- Monthly registration trends visualization
- City-based registration analysis
- Top-performing events identification

### SubscribersAnalysis
- City-based subscriber distribution
- Time-based subscriber growth trends
- Top cities ranking by subscriber count

### EventInterestsAnalysis
- Event type interest analysis
- Geographic interest patterns
- Most engaging events identification

### ExportReports
- Simple export interface for all three analysis types
- CSV and PDF download options
- Clear descriptions for each report type

## Data Structure

The dashboard uses the following data sources:
- `realTimeMetrics`: Total events and clicks
- `clickAnalytics`: Event-specific click data and trends
- `enhancedSubscriptionStats`: Subscriber data and trends
- Simulated event type data for demonstration

## Usage

1. Navigate to the Admin Panel
2. Select the "Analytics" tab
3. Use filters to narrow down data by date range, city, or event type
4. View charts and tables for insights
5. Export reports as needed
6. Take actions on events using the performance table

## Design Principles

- **Clean**: Minimal visual clutter, focused on data
- **Simple**: Easy to understand and navigate
- **Functional**: Only essential features included
- **Responsive**: Works on all device sizes
- **Consistent**: Uniform styling and interaction patterns
- **Reliable**: Based on actual data sources, not assumptions

## Analysis Focus Areas

### 1. **Events Registration Analysis**
- Tracks how many people register for events over time
- Identifies which cities have highest event engagement
- Shows top-performing events by registration count

### 2. **Subscribers Analysis**
- Monitors subscriber growth across different cities
- Tracks subscription trends over time
- Identifies cities with highest subscriber engagement

### 3. **Event Interests Analysis**
- Analyzes registration button clicks on different events
- Shows interest patterns by event type and city
- Tracks user engagement with event content over time

## Future Enhancements

- Real-time data updates
- More detailed event type categorization
- Advanced filtering options
- Custom date range selection
- Automated report generation
- Email alert system for significant trends

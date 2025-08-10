# Event Alerts System

## Overview
The Event Alerts System allows users to subscribe to email notifications for new tech events in their selected cities. When an event is approved by an admin, all subscribers in that city automatically receive an email alert.

## How It Works

### 1. User Subscription
- Users visit `/alerts` page
- Enter their email address
- Select one or more cities they're interested in
- Submit the form to subscribe

### 2. Data Storage
- Subscriptions are stored in the `event_subscriptions` table
- Each subscription includes:
  - Email address
  - City ID and name
  - State
  - Active status
  - Creation and update timestamps

### 3. Event Approval Process
- When an admin approves an event in the admin panel
- The system automatically triggers alerts for all subscribers in that city
- Email notifications are sent to all active subscribers

## Database Schema

```sql
CREATE TABLE public.event_subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email character varying(255) NOT NULL,
  city_id character varying(50) NOT NULL,
  city_name character varying(100) NOT NULL,
  state character varying(100) NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT event_subscriptions_pkey PRIMARY KEY (id),
  CONSTRAINT event_subscriptions_email_city_id_key UNIQUE (email, city_id)
);
```

## API Functions

### `subscribeToEventAlerts(data)`
- Subscribes a user to event alerts for selected cities
- Uses upsert to handle duplicate subscriptions gracefully
- Returns array of created subscriptions

### `getSubscriptionsByEmail(email)`
- Retrieves all active subscriptions for a given email
- Used for user management

### `getActiveSubscriptionsByCity(cityId)`
- Gets all active subscribers for a specific city
- Used when sending event alerts

### `sendEventAlertToSubscribers(cityId, eventTitle, eventDate, eventUrl)`
- Sends email alerts to all subscribers in a city
- Currently logs to console (email integration pending)

## Email Integration (TODO)
The system is set up to integrate with Brevo email service. Currently, alerts are logged to the console. To enable actual email sending:

1. Configure Brevo API credentials
2. Create email templates
3. Update `sendEventAlertToSubscribers` function to use Brevo API

## Usage Examples

### Subscribe to Alerts
```typescript
import { subscribeToEventAlerts } from '../api/alerts';

await subscribeToEventAlerts({
  email: 'user@example.com',
  cities: [
    { id: 'MH1', name: 'Mumbai', state: 'Maharashtra' },
    { id: 'DL1', name: 'New Delhi', state: 'Delhi' }
  ]
});
```

### Send Event Alert
```typescript
import { sendEventAlertToSubscribers } from '../api/alerts';

await sendEventAlertToSubscribers(
  'MH1', // cityId
  'React Workshop', // eventTitle
  '2024-01-15', // eventDate
  'https://example.com/event' // eventUrl
);
```

## Admin Panel Integration
The admin panel automatically triggers alerts when events are approved:
- Event approval calls `sendEventAlertToSubscribers`
- Alerts are sent to all active subscribers in the event's city
- Failed alerts don't prevent event approval

## Future Enhancements
- Email template customization
- Unsubscribe functionality
- Alert frequency controls
- Event type filtering
- Push notifications 
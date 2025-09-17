import { format, isToday, isTomorrow } from 'date-fns';


export function formatDateTime(dateString: string): string {
  // Extract date and time parts directly from string to avoid timezone issues
  const dateTimeParts = dateString.replace('T', ' T ');
  const [datePart, timePart] = dateTimeParts.split(' T ');
  
  if (!timePart) {
    return datePart;
  }
  
  // Format as "YYYY-MM-DD T HH:MM:SS"
  return `${datePart} T ${timePart.substring(0, 8)}`;
}


export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  if (isToday(date)) {
    return 'Today';
  }
  
  if (isTomorrow(date)) {
    return 'Tomorrow';
  }
  
  return format(date, 'MMM d, yyyy');
}


export function formatDateRange(startDate: string, endDate?: string): string {
  if (!endDate) {
    return formatDateTime(startDate);
  }
  
  const startFormatted = formatDateTime(startDate);
  const endFormatted = formatDateTime(endDate);
  
  // Check if same date (first 10 characters)
  if (startDate.substring(0, 10) === endDate.substring(0, 10)) {
    return startFormatted;
  }
  
  return `${startFormatted} to ${endFormatted}`;
}


export function getEventTypeColor(eventType: string): string {
  switch (eventType) {
    case 'Hackathon':
      return 'bg-purple-100 text-purple-800';
    case 'Workshop':
      return 'bg-blue-100 text-blue-800';
    case 'Meetup':
      return 'bg-green-100 text-green-800';
    case 'Talk':
      return 'bg-yellow-100 text-yellow-800';
    case 'Conference':
      return 'bg-pink-100 text-pink-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
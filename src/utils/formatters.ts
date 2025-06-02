import { format, isToday, isTomorrow } from 'date-fns';


export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  
  if (isToday(date)) {
    return `Today at ${format(date, 'h:mm a')}`;
  }
  
  if (isTomorrow(date)) {
    return `Tomorrow at ${format(date, 'h:mm a')}`;
  }
  
  return format(date, 'MMM d, yyyy \'at\' h:mm a');
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
    return formatDate(startDate);
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  
  if (format(start, 'yyyy-MM-dd') === format(end, 'yyyy-MM-dd')) {
    return formatDate(startDate);
  }
  
  return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
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
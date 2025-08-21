import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  LineChart, Line
} from 'recharts';
import { Calendar, Target, Users, TrendingUp, Download, Eye, CheckCircle, XCircle } from 'lucide-react';

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon,
  color
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Chart Components
interface ChartProps {
  data: any[];
  title: string;
  height?: number;
}

export const BarChartComponent: React.FC<ChartProps> = ({ data, title, height = 300 }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const LineChartComponent: React.FC<ChartProps> = ({ data, title, height = 300 }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

// Data Table Component
interface DataTableProps {
  data: any[];
  columns: Array<{ key: string; label: string; render?: (value: any, row: any) => React.ReactNode }>;
  title: string;
  maxHeight?: number;
}

export const DataTable: React.FC<DataTableProps> = ({ data, columns, title, maxHeight = 400 }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
    </div>
    <div className="overflow-x-auto" style={{ maxHeight }}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Dashboard Overview Component
interface DashboardOverviewProps {
  totalEvents: number;
  totalClicks: number;
  monthlyEventCreations: Array<{ month: string; count: number; monthLabel: string }>;
  clickTrendOverTime: Array<{ date: string; clicks: number; dateLabel: string }>;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  totalEvents,
  totalClicks,
  monthlyEventCreations,
  clickTrendOverTime
}) => (
  <div className="space-y-6">
    {/* Metric Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <MetricCard
        title="Total Events"
        value={totalEvents}
        icon={<Calendar className="h-6 w-6 text-blue-600" />}
        color="blue"
      />
      <MetricCard
        title="Total Clicks"
        value={totalClicks}
        icon={<Target className="h-6 w-6 text-green-600" />}
        color="green"
      />
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <BarChartComponent
        title="Monthly Event Creations"
        data={monthlyEventCreations.map(item => ({
          name: item.monthLabel,
          value: item.count
        }))}
        height={300}
      />
      <LineChartComponent
        title="Click Trend Over Time"
        data={clickTrendOverTime.map(item => ({
          name: item.dateLabel,
          value: item.clicks
        }))}
        height={300}
      />
    </div>
  </div>
);

// Events Performance Component
interface EventPerformanceProps {
  events: Array<{
    id: string;
    title: string;
    totalClicks: number;
    status: string;
  }>;
  onViewDetails: (eventId: string) => void;
  onExportClicks: (eventId: string) => void;
  onMarkCompleted: (eventId: string) => void;
  onMarkCancelled: (eventId: string) => void;
}

export const EventsPerformance: React.FC<EventPerformanceProps> = ({
  events,
  onViewDetails,
  onExportClicks,
  onMarkCompleted,
  onMarkCancelled
}) => (
  <DataTable
    title="Events Performance"
    data={events}
    columns={[
      { key: 'title', label: 'Event Name' },
      { key: 'totalClicks', label: 'Total Clicks' },
      { key: 'status', label: 'Status' },
      {
        key: 'actions',
        label: 'Actions',
        render: (_, row) => (
          <div className="flex gap-2">
            <button
              onClick={() => onViewDetails(row.id)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => onExportClicks(row.id)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
              title="Export Clicks CSV"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              onClick={() => onMarkCompleted(row.id)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
              title="Mark Completed"
            >
              <CheckCircle className="h-4 w-4" />
            </button>
            <button
              onClick={() => onMarkCancelled(row.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Mark Cancelled"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        )
      }
    ]}
  />
);

// Events Registration Analysis Component
interface EventsRegistrationAnalysisProps {
  monthlyRegistrations: Array<{ month: string; registrations: number; monthLabel: string }>;
  cityRegistrations: Array<{ city: string; state: string; registrations: number; eventCount: number }>;
  topPerformingEvents: Array<{ title: string; registrations: number; city: string; date: string }>;
}

export const EventsRegistrationAnalysis: React.FC<EventsRegistrationAnalysisProps> = ({
  monthlyRegistrations,
  cityRegistrations,
  topPerformingEvents
}) => (
  <div className="space-y-6">
    {/* Monthly Registrations Chart */}
    <BarChartComponent
      title="Event Registrations by Month"
      data={monthlyRegistrations.map(item => ({
        name: item.monthLabel,
        value: item.registrations
      }))}
      height={300}
    />

    {/* City Registrations Chart */}
    <BarChartComponent
      title="Event Registrations by City"
      data={cityRegistrations.slice(0, 10).map(item => ({
        name: `${item.city}, ${item.state}`,
        value: item.registrations
      }))}
      height={300}
    />

    {/* Top Performing Events Table */}
    <DataTable
      title="Top Performing Events by Registrations"
      data={topPerformingEvents}
      columns={[
        { key: 'title', label: 'Event Title' },
        { key: 'city', label: 'City' },
        { key: 'registrations', label: 'Registrations' },
        { 
          key: 'date', 
          label: 'Date', 
          render: (value) => new Date(value).toLocaleDateString() 
        }
      ]}
    />
  </div>
);

// Subscribers Analysis Component
interface SubscribersAnalysisProps {
  citySubscribers: Array<{ city: string; state: string; subscribers: number; growthRate: number }>;
  monthlySubscribers: Array<{ month: string; newSubscribers: number; monthLabel: string }>;
  topCities: Array<{ city: string; state: string; subscribers: number; percentage: number }>;
}

export const SubscribersAnalysis: React.FC<SubscribersAnalysisProps> = ({
  citySubscribers,
  monthlySubscribers,
  topCities
}) => (
  <div className="space-y-6">
    {/* City Subscribers Chart */}
    <BarChartComponent
      title="Subscribers by City"
      data={citySubscribers.slice(0, 10).map(item => ({
        name: `${item.city}, ${item.state}`,
        value: item.subscribers
      }))}
      height={300}
    />

    {/* Monthly Subscribers Trend */}
    <LineChartComponent
      title="New Subscribers Over Time"
      data={monthlySubscribers.map(item => ({
        name: item.monthLabel,
        value: item.newSubscribers
      }))}
      height={300}
    />

    {/* Top Cities Table */}
    <DataTable
      title="Top Cities by Subscriber Count"
      data={topCities}
      columns={[
        { key: 'city', label: 'City' },
        { key: 'state', label: 'State' },
        { key: 'subscribers', label: 'Subscribers' },
        { key: 'percentage', label: 'Percentage', render: (value) => `${value}%` }
      ]}
    />
  </div>
);

// Event Interests Analysis Component
interface EventInterestsAnalysisProps {
  registrationClicksByEvent: Array<{ eventTitle: string; clicks: number; city: string; eventType: string }>;
  clicksByCity: Array<{ city: string; state: string; clicks: number; eventCount: number }>;
  clicksByEventType: Array<{ eventType: string; clicks: number; eventCount: number }>;
  topInterestedEvents: Array<{ title: string; clicks: number; city: string; eventType: string; date: string }>;
}

export const EventInterestsAnalysis: React.FC<EventInterestsAnalysisProps> = ({
  registrationClicksByEvent,
  clicksByCity,
  clicksByEventType,
  topInterestedEvents
}) => (
  <div className="space-y-6">
    {/* Registration Clicks by Event Type */}
    <BarChartComponent
      title="Registration Clicks by Event Type"
      data={clicksByEventType.map(item => ({
        name: item.eventType,
        value: item.clicks
      }))}
      height={300}
    />

    {/* Registration Clicks by City */}
    <BarChartComponent
      title="Registration Clicks by City"
      data={clicksByCity.slice(0, 10).map(item => ({
        name: `${item.city}, ${item.state}`,
        value: item.clicks
      }))}
      height={300}
    />

    {/* Top Interested Events Table */}
    <DataTable
      title="Top Events by Registration Interest"
      data={topInterestedEvents}
      columns={[
        { key: 'title', label: 'Event Title' },
        { key: 'eventType', label: 'Event Type' },
        { key: 'city', label: 'City' },
        { key: 'clicks', label: 'Registration Clicks' },
        { 
          key: 'date', 
          label: 'Date', 
          render: (value) => new Date(value).toLocaleDateString() 
        }
      ]}
    />
  </div>
);

// Export & Reports Component
interface ExportReportsProps {
  onExportEventReport: (format: 'csv' | 'pdf') => void;
  onExportSubscriberReport: (format: 'csv' | 'pdf') => void;
  onExportInterestReport: (format: 'csv' | 'pdf') => void;
}

export const ExportReports: React.FC<ExportReportsProps> = ({
  onExportEventReport,
  onExportSubscriberReport,
  onExportInterestReport
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-700 mb-4">Export & Reports</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 border border-gray-200 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Event Registrations Report</h4>
        <p className="text-sm text-gray-600 mb-3">
          Download event registration data by month and city
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onExportEventReport('csv')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            CSV
          </button>
          <button
            onClick={() => onExportEventReport('pdf')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            PDF
          </button>
        </div>
      </div>

      <div className="p-4 border border-gray-200 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Subscribers Report</h4>
        <p className="text-sm text-gray-600 mb-3">
          Download subscriber data by city and time trends
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onExportSubscriberReport('csv')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            CSV
          </button>
          <button
            onClick={() => onExportSubscriberReport('pdf')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            PDF
          </button>
        </div>
      </div>

      <div className="p-4 border border-gray-200 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Event Interests Report</h4>
        <p className="text-sm text-gray-600 mb-3">
          Download event interest data by type, city, and time
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onExportInterestReport('csv')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            CSV
          </button>
          <button
            onClick={() => onExportInterestReport('pdf')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            PDF
          </button>
        </div>
      </div>
    </div>
  </div>
);

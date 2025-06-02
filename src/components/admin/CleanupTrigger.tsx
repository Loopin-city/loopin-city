import React, { useState, useEffect } from 'react';
import { triggerManualCleanup, getLastCleanupTime, getCleanupHistory } from '../../utils/cleanup';
import { Trash2, RotateCcw, CheckCircle, AlertCircle, Clock, Server } from 'lucide-react';

const CleanupTrigger: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastCleanup, setLastCleanup] = useState<any>(null);
  const [cleanupHistory, setCleanupHistory] = useState<any[]>([]);

  
  useEffect(() => {
    loadCleanupStatus();
  }, []);

  const loadCleanupStatus = async () => {
    try {
      const [lastCleanupData, historyData] = await Promise.all([
        getLastCleanupTime(),
        getCleanupHistory(5)
      ]);
      setLastCleanup(lastCleanupData);
      setCleanupHistory(historyData || []);
    } catch (err) {
      console.error('Failed to load cleanup status:', err);
    }
  };

  const handleManualCleanup = async () => {
    setIsRunning(true);
    setError(null);
    setResult(null);

    try {
      const cleanupResult = await triggerManualCleanup();
      setResult(cleanupResult);
      
      await loadCleanupStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsRunning(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Server className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Edge Function Cleanup</h3>
          <p className="text-sm text-gray-600">Server-side event cleanup and point awarding</p>
        </div>
      </div>

      {lastCleanup && (
        <div className={`mb-4 p-3 rounded-lg border ${
          lastCleanup.status === 'success' 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <Clock className={`h-4 w-4 ${
              lastCleanup.status === 'success' ? 'text-green-600' : 'text-red-600'
            }`} />
            <span className={`text-sm font-medium ${
              lastCleanup.status === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              Last cleanup: {lastCleanup.hoursAgo} hours ago
            </span>
          </div>
          <p className={`text-xs ${
            lastCleanup.status === 'success' ? 'text-green-700' : 'text-red-700'
          }`}>
            {lastCleanup.status === 'success' 
              ? `✅ Processed ${lastCleanup.result?.deletedEvents || 0} events, awarded points to ${lastCleanup.result?.updatedCommunities || 0} communities`
              : `❌ Failed: ${lastCleanup.error}`
            }
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">What the Edge Function does:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Runs automatically every 24 hours on Supabase servers</li>
            <li>• Removes events that ended more than 24 hours ago</li>
            <li>• Awards points to communities and venues for successful events</li>
            <li>• Updates leaderboard rankings automatically</li>
            <li>• Logs all activity for monitoring and debugging</li>
          </ul>
        </div>

        <button
          onClick={handleManualCleanup}
          disabled={isRunning}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            isRunning
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          {isRunning ? (
            <>
              <RotateCcw className="h-4 w-4 animate-spin" />
              Triggering Edge Function...
            </>
          ) : (
            <>
              <Server className="h-4 w-4" />
              Trigger Manual Cleanup
            </>
          )}
        </button>

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h4 className="font-medium text-green-800">Edge Function Executed Successfully</h4>
            </div>
            <div className="text-sm text-green-700 space-y-1">
              <p>• Deleted {result.deletedEvents || 0} expired events</p>
              <p>• Processed {result.successfulEvents || 0} successful events</p>
              <p>• Updated {result.updatedCommunities || 0} community event counts</p>
              <p>• Updated {result.updatedVenues || 0} venue event counts</p>
              <p>• Duration: {result.duration}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <h4 className="font-medium text-red-800">Edge Function Failed</h4>
            </div>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {cleanupHistory.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Recent Cleanup History</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {cleanupHistory.map((log, index) => (
                <div key={log.id || index} className="flex items-center justify-between text-xs bg-white rounded px-2 py-1">
                  <span className="text-gray-600">{formatDate(log.executed_at)}</span>
                  <span className={`font-medium ${log.error ? 'text-red-600' : 'text-green-600'}`}>
                    {log.error ? '❌ Failed' : '✅ Success'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p>
            <strong>Note:</strong> Automatic cleanup runs every 24 hours via Supabase Edge Functions. 
            Manual trigger is for testing or immediate maintenance needs only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CleanupTrigger; 
import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';

interface DuplicateRecord {
  id: string;
  original_community_id: string;
  original_community_name: string;
  duplicate_community_id: string;
  duplicate_community_name: string;
  similarity_score: number;
  score_breakdown: any;
  admin_status: string;
  admin_notes: string;
  detected_at: string;
  website_match: boolean;
  organizer_email_match: boolean;
  organizer_phone_match: boolean;
  social_media_match: boolean;
}

interface CommunityDetails {
  id: string;
  name: string;
  website: string;
  social_links: string[];
  size: number;
  year_founded: number;
  verification_status: string;
  event_count: number;
}

const DuplicateCommunityManager: React.FC = () => {
  const [duplicates, setDuplicates] = useState<DuplicateRecord[]>([]);
  const [selectedDuplicate, setSelectedDuplicate] = useState<DuplicateRecord | null>(null);
  const [communityDetails, setCommunityDetails] = useState<{
    original: CommunityDetails | null;
    duplicate: CommunityDetails | null;
  }>({ original: null, duplicate: null });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPendingDuplicates();
  }, []);

  const fetchPendingDuplicates = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_community_duplicates')
        .select('*')
        .eq('admin_status', 'pending')
        .order('similarity_score', { ascending: false });

      if (error) throw error;
      setDuplicates(data || []);
    } catch (error) {
      console.error('Error fetching duplicates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunityDetails = async (duplicate: DuplicateRecord) => {
    try {
      
      const [originalResult, duplicateResult] = await Promise.all([
        supabase
          .from('communities')
          .select('*')
          .eq('id', duplicate.original_community_id)
          .single(),
        supabase
          .from('communities')
          .select('*')
          .eq('id', duplicate.duplicate_community_id)
          .single()
      ]);

      
      const [originalEvents, duplicateEvents] = await Promise.all([
        supabase
          .from('events')
          .select('id')
          .eq('community_id', duplicate.original_community_id),
        supabase
          .from('events')
          .select('id')
          .eq('community_id', duplicate.duplicate_community_id)
      ]);

      setCommunityDetails({
        original: originalResult.data ? {
          ...originalResult.data,
          event_count: originalEvents.data?.length || 0
        } : null,
        duplicate: duplicateResult.data ? {
          ...duplicateResult.data,
          event_count: duplicateEvents.data?.length || 0
        } : null
      });
    } catch (error) {
      console.error('Error fetching community details:', error);
    }
  };

  const handleMergeCommunities = async (duplicateRecord: DuplicateRecord) => {
    if (!confirm('Are you sure you want to merge these communities? This action cannot be undone.')) {
      return;
    }

    setProcessing(true);
    try {
      
      const { error: eventsError } = await supabase
        .from('events')
        .update({ community_id: duplicateRecord.original_community_id })
        .eq('community_id', duplicateRecord.duplicate_community_id);

      if (eventsError) throw eventsError;

      
      const { error: deleteError } = await supabase
        .from('communities')
        .delete()
        .eq('id', duplicateRecord.duplicate_community_id);

      if (deleteError) throw deleteError;

      
      const { error: adminError } = await supabase
        .from('admin_community_duplicates')
        .update({
          admin_status: 'merge_approved',
          reviewed_by: 'admin', 
          reviewed_at: new Date().toISOString(),
          admin_notes: (duplicateRecord.admin_notes || '') + ' | MERGED: Confirmed same community. Events transferred.'
        })
        .eq('id', duplicateRecord.id);

      if (adminError) throw adminError;

      alert('Communities merged successfully!');
      fetchPendingDuplicates();
      setSelectedDuplicate(null);
    } catch (error) {
      console.error('Error merging communities:', error);
      alert('Error merging communities. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleKeepSeparate = async (duplicateRecord: DuplicateRecord) => {
    setProcessing(true);
    try {
      const { error } = await supabase
        .from('admin_community_duplicates')
        .update({
          admin_status: 'keep_separate',
          reviewed_by: 'admin', 
          reviewed_at: new Date().toISOString(),
          admin_notes: 'REVIEWED: Determined to be different communities despite similarity.'
        })
        .eq('id', duplicateRecord.id);

      if (error) throw error;

      alert('Marked as separate communities.');
      fetchPendingDuplicates();
      setSelectedDuplicate(null);
    } catch (error) {
      console.error('Error updating record:', error);
      alert('Error updating record. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleInvestigate = async (duplicateRecord: DuplicateRecord, notes: string) => {
    setProcessing(true);
    try {
      const { error } = await supabase
        .from('admin_community_duplicates')
        .update({
          admin_status: 'needs_investigation',
          reviewed_by: 'admin', 
          reviewed_at: new Date().toISOString(),
          admin_notes: notes
        })
        .eq('id', duplicateRecord.id);

      if (error) throw error;

      alert('Marked for investigation.');
      fetchPendingDuplicates();
      setSelectedDuplicate(null);
    } catch (error) {
      console.error('Error updating record:', error);
      alert('Error updating record. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const getSimilarityColor = (score: number) => {
    if (score >= 85) return 'text-red-600 bg-red-50';
    if (score >= 75) return 'text-orange-600 bg-orange-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  if (loading) {
    return <div className="p-6">Loading duplicate communities...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Community Duplicate Management</h1>
      
      {duplicates.length === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-green-800">No Pending Reviews</h2>
          <p className="text-green-700">All community duplicates have been reviewed!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Pending Reviews ({duplicates.length})</h2>
            {duplicates.map((duplicate) => (
              <div
                key={duplicate.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedDuplicate?.id === duplicate.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => {
                  setSelectedDuplicate(duplicate);
                  fetchCommunityDetails(duplicate);
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {duplicate.original_community_name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      vs. {duplicate.duplicate_community_name}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${getSimilarityColor(duplicate.similarity_score)}`}>
                    {duplicate.similarity_score}%
                  </span>
                </div>
                
                <div className="flex gap-2 text-xs">
                  {duplicate.website_match && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded">Website Match</span>
                  )}
                  {duplicate.organizer_email_match && (
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">Email Match</span>
                  )}
                  {duplicate.social_media_match && (
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">Social Match</span>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  Detected: {new Date(duplicate.detected_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>

          {selectedDuplicate && (
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Review Details</h2>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Similarity Analysis</h3>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <p><strong>Overall Score:</strong> {selectedDuplicate.similarity_score}%</p>
                  {selectedDuplicate.score_breakdown && (
                    <div className="mt-2 space-y-1">
                      <p>Name: {selectedDuplicate.score_breakdown.name_score}%</p>
                      <p>Location: {selectedDuplicate.score_breakdown.location_score}%</p>
                      <p>Website: {selectedDuplicate.score_breakdown.website_score}%</p>
                      <p>Contact: {selectedDuplicate.score_breakdown.contact_score}%</p>
                      <p>Social: {selectedDuplicate.score_breakdown.social_score}%</p>
                    </div>
                  )}
                </div>
              </div>

              {communityDetails.original && communityDetails.duplicate && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Community Comparison</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-blue-50 p-3 rounded">
                      <h4 className="font-medium text-blue-900">Original Community</h4>
                      <p><strong>Name:</strong> {communityDetails.original.name}</p>
                      <p><strong>Website:</strong> {communityDetails.original.website || 'None'}</p>
                      <p><strong>Size:</strong> {communityDetails.original.size || 'Unknown'}</p>
                      <p><strong>Founded:</strong> {communityDetails.original.year_founded || 'Unknown'}</p>
                      <p><strong>Events:</strong> {communityDetails.original.event_count}</p>
                      <p><strong>Status:</strong> {communityDetails.original.verification_status}</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded">
                      <h4 className="font-medium text-orange-900">Potential Duplicate</h4>
                      <p><strong>Name:</strong> {communityDetails.duplicate.name}</p>
                      <p><strong>Website:</strong> {communityDetails.duplicate.website || 'None'}</p>
                      <p><strong>Size:</strong> {communityDetails.duplicate.size || 'Unknown'}</p>
                      <p><strong>Founded:</strong> {communityDetails.duplicate.year_founded || 'Unknown'}</p>
                      <p><strong>Events:</strong> {communityDetails.duplicate.event_count}</p>
                      <p><strong>Status:</strong> {communityDetails.duplicate.verification_status}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => handleMergeCommunities(selectedDuplicate)}
                  disabled={processing}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50"
                >
                  ✅ Merge Communities (Same Community)
                </button>
                <button
                  onClick={() => handleKeepSeparate(selectedDuplicate)}
                  disabled={processing}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  ❌ Keep Separate (Different Communities)
                </button>
                <button
                  onClick={() => {
                    const notes = prompt('Enter investigation notes:');
                    if (notes) handleInvestigate(selectedDuplicate, notes);
                  }}
                  disabled={processing}
                  className="w-full bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 disabled:opacity-50"
                >
                  🔍 Need More Investigation
                </button>
              </div>

              {selectedDuplicate.admin_notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
                  <strong>Notes:</strong> {selectedDuplicate.admin_notes}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DuplicateCommunityManager; 
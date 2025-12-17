
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Video, Copy, ExternalLink, ChevronLeft, Clock, Calendar, AlertCircle } from 'lucide-react';
import { getVideoSessionInfo } from '../../services/videoService';

export const SessionJoinScreen: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>(); // bookingId
  const navigate = useNavigate();
  const [sessionInfo, setSessionInfo] = useState<ReturnType<typeof getVideoSessionInfo> | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (sessionId) {
      setSessionInfo(getVideoSessionInfo(sessionId));
    }
  }, [sessionId, refreshKey]);

  // Auto-refresh every 30 seconds to update join status
  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const copyLink = () => {
    if (sessionInfo?.session) {
      navigator.clipboard.writeText(sessionInfo.session.joinUrl);
      alert('Link copied!');
    }
  };

  if (!sessionInfo || !sessionInfo.booking) {
    return (
      <div className="min-h-full bg-slate-900 flex items-center justify-center p-6">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <p className="text-white text-lg">Session not found</p>
          <button 
            onClick={() => navigate('/profile')} 
            className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  const { session, booking, status, message, canJoin } = sessionInfo;

  // Format time
  const startTime = new Date(booking.startsAtIso);
  const endTime = new Date(booking.endsAtIso);
  const dateStr = startTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const timeStr = `${startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <div className="min-h-full bg-slate-900 flex flex-col items-center justify-center p-6">
       <button 
          onClick={() => navigate(-1)} 
          className="absolute top-6 left-6 p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-colors"
       >
         <ChevronLeft size={24} />
       </button>

       <div className="w-full max-w-md bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl">
          {/* Status Icon */}
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            status === 'can_join' ? 'bg-green-500/20' : 
            status === 'too_early' ? 'bg-amber-500/20' : 
            'bg-slate-500/20'
          }`}>
             {status === 'can_join' && <Video size={40} className="text-green-400" />}
             {status === 'too_early' && <Clock size={40} className="text-amber-400" />}
             {status === 'ended' && <AlertCircle size={40} className="text-slate-400" />}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-2 text-center">
            {status === 'can_join' && 'Session Ready'}
            {status === 'too_early' && 'Session Not Started'}
            {status === 'ended' && 'Session Ended'}
          </h1>

          {/* Status Message */}
          <p className="text-slate-400 mb-6 text-center">
            {message}
          </p>

          {/* Session Details */}
          <div className="bg-slate-900/50 rounded-xl p-4 mb-6 space-y-3">
            <div className="flex items-center space-x-3 text-slate-300">
              <Calendar size={18} className="text-indigo-400" />
              <span className="text-sm">{dateStr}</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-300">
              <Clock size={18} className="text-indigo-400" />
              <span className="text-sm">{timeStr}</span>
            </div>
          </div>

          {/* Action Buttons */}
          {canJoin && session && (
            <>
              <a 
                href={session.joinUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold mb-4 flex items-center justify-center space-x-2 transition-colors"
              >
                <ExternalLink size={20} />
                <span>Join Now</span>
              </a>
              
              <button 
                 onClick={copyLink}
                 className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                <Copy size={18} />
                <span>Copy Meeting Link</span>
              </button>
            </>
          )}

          {!canJoin && (
            <button 
              onClick={() => navigate(-1)}
              className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
            >
              Back
            </button>
          )}
       </div>

       {/* Auto-refresh indicator */}
       {status === 'too_early' && (
         <p className="text-slate-500 text-sm mt-4">
           This page refreshes automatically every 30 seconds
         </p>
       )}
    </div>
  );
};

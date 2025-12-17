
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import { Brand } from '../../constants';
import { Video, Copy, ExternalLink, ChevronLeft } from 'lucide-react';
import { useT } from '../../i18n/useT';
import { getVideoSession } from '../../services/videoService';
import { VideoSession } from '../../types';

export const SessionJoinScreen: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>(); // mapping bookingId to this param in routes
  const navigate = useNavigate();
  const t = useT();
  const [session, setSession] = useState<VideoSession | null>(null);

  useEffect(() => {
    if (sessionId) {
      setSession(getVideoSession(sessionId));
    }
  }, [sessionId]);

  const copyLink = () => {
    if (session) {
      navigator.clipboard.writeText(session.joinUrl);
      alert('Link copied!');
    }
  };

  if (!session) return <div className="p-8 text-center text-white">Loading session...</div>;

  return (
    <div className="min-h-full bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
       <button 
          onClick={() => navigate(-1)} 
          className="absolute top-6 left-6 p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700"
       >
         <ChevronLeft size={24} />
       </button>

       <div className="w-full max-w-md bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl">
          <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
             <Video size={40} className="text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{t('booking.videoReady')}</h1>
          <p className="text-slate-400 mb-8">
            {t('booking.videoDesc')}
          </p>
          
          <a 
            href={session.joinUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold mb-4 flex items-center justify-center space-x-2 transition-colors"
          >
            <ExternalLink size={20} />
            <span>Join via Jitsi</span>
          </a>
          
          <button 
             onClick={copyLink}
             className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium flex items-center justify-center space-x-2 transition-colors"
          >
            <Copy size={18} />
            <span>Copy Meeting Link</span>
          </button>
       </div>
    </div>
  );
};

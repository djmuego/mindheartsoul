
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { VideoOff, MessageCircle, Mail, ChevronLeft } from 'lucide-react';
import { useT } from '../../i18n/useT';
import { getBookingById } from '../../services/bookingsService';

export const SessionJoinScreen: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>(); // bookingId
  const navigate = useNavigate();
  const t = useT();
  
  const booking = sessionId ? getBookingById(sessionId) : undefined;

  // Format booking time if available
  const formatBookingTime = () => {
    if (!booking) return '';
    const startTime = new Date(booking.startsAtIso);
    const dateStr = startTime.toLocaleDateString(undefined, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    return dateStr;
  };

  return (
    <div className="min-h-full bg-slate-900 flex flex-col items-center justify-center p-6">
       <button 
          onClick={() => navigate(-1)} 
          className="absolute top-6 left-6 p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-colors"
       >
         <ChevronLeft size={24} />
       </button>

       <div className="w-full max-w-md bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl text-center">
          {/* Video Disabled Icon */}
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-slate-600/20 border-2 border-slate-600">
             <VideoOff size={40} className="text-slate-400" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-3">
            {t('video.disabledTitle')}
          </h1>

          {/* Message */}
          <p className="text-slate-400 mb-6 leading-relaxed">
            {t('video.disabledMessage')}
          </p>

          {/* Booking Info (if available) */}
          {booking && (
            <div className="bg-slate-900/50 rounded-xl p-4 mb-6">
              <p className="text-sm text-slate-300 mb-2">{t('video.scheduledTime')}</p>
              <p className="text-white font-medium">{formatBookingTime()}</p>
            </div>
          )}

          {/* Alternative Actions */}
          <div className="space-y-3 mb-6">
            <div className="bg-slate-900/50 rounded-xl p-4 text-left">
              <div className="flex items-start space-x-3">
                <MessageCircle size={20} className="text-indigo-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-medium mb-1">{t('video.optionChat')}</h3>
                  <p className="text-sm text-slate-400">{t('video.optionChatDesc')}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-4 text-left">
              <div className="flex items-start space-x-3">
                <Mail size={20} className="text-indigo-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-medium mb-1">{t('video.optionEmail')}</h3>
                  <p className="text-sm text-slate-400">{t('video.optionEmailDesc')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <button 
            onClick={() => navigate('/chat')}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium mb-3 transition-colors"
          >
            {t('video.goToChat')}
          </button>

          <button 
            onClick={() => navigate(-1)}
            className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
          >
            {t('common.back')}
          </button>
       </div>

       {/* Help Note */}
       <p className="text-slate-500 text-sm mt-6 max-w-md text-center">
         {t('video.helpNote')}
       </p>
    </div>
  );
};

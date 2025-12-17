
import React, { useState } from 'react';
import { useT } from '../../i18n/useT';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Video, Check, X, Clock } from 'lucide-react';
import { useSession } from '../../context/SessionContext';
import { getBookingsByMentor, approveBooking, declineBooking } from '../../services/bookingsService';
import { pushNotification } from '../../services/notificationsService';

export const MentorBookingsScreen: React.FC = () => {
  const t = useT();
  const navigate = useNavigate();
  const { user } = useSession();
  const [refreshKey, setRefreshKey] = useState(0);
  
  if (!user) return null;
  
  const myBookings = getBookingsByMentor(user.id);
  const pendingRequests = myBookings.filter(b => b.status === 'pending_payment');
  const confirmedBookings = myBookings.filter(b => b.status === 'confirmed');
  const otherBookings = myBookings.filter(b => b.status !== 'pending_payment' && b.status !== 'confirmed');

  const handleApprove = (bookingId: string, userId: string) => {
    const result = approveBooking(bookingId);
    if (result) {
      pushNotification(
        userId,
        'booking_approved',
        'notifications.bookingApproved',
        { bookingId }
      );
      setRefreshKey(prev => prev + 1);
    }
  };

  const handleDecline = (bookingId: string, userId: string) => {
    const result = declineBooking(bookingId, 'Mentor declined request');
    if (result) {
      pushNotification(
        userId,
        'booking_declined',
        'notifications.bookingDeclined',
        { bookingId }
      );
      setRefreshKey(prev => prev + 1);
    }
  };

  const renderBookingCard = (b: any, showActions = false) => (
    <div key={b.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">{new Date(b.startsAtIso).toLocaleDateString()}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {new Date(b.startsAtIso).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </span>
        </div>
        <span className={`text-xs px-2 py-1 rounded capitalize ${
          b.status === 'confirmed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 
          b.status === 'cancelled' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
          'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
        }`}>
          {b.status.replace('_', ' ')}
        </span>
      </div>
      
      {b.note && (
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 italic">
          "{b.note}"
        </p>
      )}

      {showActions && b.status === 'pending_payment' && (
        <div className="flex space-x-2 mt-3">
          <button 
            onClick={() => handleApprove(b.id, b.userId)}
            className="flex-1 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
          >
            <Check size={16} />
            <span>{t('mentor.approve')}</span>
          </button>
          <button 
            onClick={() => handleDecline(b.id, b.userId)}
            className="flex-1 flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
          >
            <X size={16} />
            <span>{t('mentor.decline')}</span>
          </button>
        </div>
      )}

      {b.status === 'confirmed' && (
        <button 
          onClick={() => navigate(`/sessions/${b.id}`)}
          className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-medium text-sm mt-3 hover:underline"
        >
          <Video size={16} />
          <span>{t('booking.join')}</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200" key={refreshKey}>
      <div className="bg-white dark:bg-slate-900 p-4 shadow-sm border-b border-slate-100 dark:border-slate-800 flex items-center space-x-4 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t('mentor.bookings')}</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Pending Requests Section */}
        {pendingRequests.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Clock size={18} className="text-amber-600" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('mentor.requests')}</h2>
              <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold px-2 py-1 rounded-full">
                {pendingRequests.length}
              </span>
            </div>
            <div className="space-y-3">
              {pendingRequests.map(b => renderBookingCard(b, true))}
            </div>
          </div>
        )}

        {/* Confirmed Bookings Section */}
        {confirmedBookings.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{t('mentor.confirmed')}</h2>
            <div className="space-y-3">
              {confirmedBookings.map(b => renderBookingCard(b))}
            </div>
          </div>
        )}

        {/* Other Bookings Section */}
        {otherBookings.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{t('mentor.history')}</h2>
            <div className="space-y-3">
              {otherBookings.map(b => renderBookingCard(b))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {myBookings.length === 0 && (
          <div className="text-center py-12">
            <Clock size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">{t('mentor.noBookings')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
